# Como a autenticação funciona no frontend

Notas sobre o commit `9005a41` ("autenticação"), que substituiu o Basic Auth
hardcoded por um fluxo real de JWT, com guards de rota e UI reativa ao estado
de login.

## 1. O serviço `Auth` — [`src/app/services/auth.ts`](../src/app/services/auth.ts)

Núcleo do sistema, construído inteiramente sobre signals do Angular:

- **Armazenamento**: o JWT fica no `localStorage` (`alx_token`) e é espelhado
  num `signal<string | null>` (`tokenSignal`) para o resto da app poder ler
  reativamente.
- **Decodificação**: `decode()` decodifica manualmente o payload do JWT (o
  segmento do meio, entre os dois pontos) em um `JwtPayload` — sem lib
  externa, só `atob` + `decodeURIComponent`. Isso dá acesso a claims como
  `sub` (usuário), `role`/`roles`/`authorities` e `exp` (expiração).
- **Estado derivado via `computed()`**:
  - `payload` — decodifica o token atual.
  - `isAuthenticated` — só é `true` se existe payload **e** `exp` ainda não
    passou (`Date.now() >= exp * 1000` significa expirado).
  - `isAdmin` — junta os claims de papel e verifica se algum contém
    `"ADMIN"` (case-insensitive).
  - `usuario` — o claim `sub`, exposto só quando autenticado.

  Como são `computed()` encadeados a partir de `tokenSignal`, tudo se
  atualiza automaticamente assim que `login()`/`logout()` mudam o token —
  sem precisar de um event bus manual.
- **`login(email, senha)`** — faz POST para
  `http://localhost:8080/auth/login` e, via `tap()`, salva o token retornado
  como efeito colateral da chamada.
- **`logout()`** — limpa o storage e zera o signal, o que propaga
  `isAuthenticated`/`isAdmin`/`usuario` de volta para `false`/`null`.

## 2. O interceptor — [`src/app/services/authInterceptor.ts`](../src/app/services/authInterceptor.ts)

Antes: credenciais `kira:k@123` hardcoded, enviando
`Authorization: Basic <base64>` em toda requisição.

Agora: injeta `Auth`, lê o token atual via `getToken()` e, se existir, clona
a requisição de saída com `Authorization: Bearer <token>`. Sem token, a
requisição segue sem alteração (ex.: o próprio login, ou endpoints
públicos).

## 3. Guards de rota — pasta `guards/` (nova)

Dois `CanActivateFn` funcionais, usando `inject()`:

- **`auth-guard.ts`**: se `auth.isAuthenticated()` for falso, redireciona
  para `/login`, anexando a URL originalmente pedida como
  `?returnUrl=...`, para o login poder mandar o usuário de volta depois.
- **`admin-guard.ts`**: exige autenticação **e** `isAdmin()`; caso
  contrário, manda para `/painel`.

`app.routes.ts` aplica `authGuard` no nível da rota `Shell`
(`canActivate: [authGuard]`), protegendo todo o dashboard (`/painel`,
`/acervo`, etc.) num único lugar, em vez de rota por rota.

## 4. Componente de login — [`src/app/pages/login/login.ts`](../src/app/pages/login/login.ts)

Antes, `entrar()` só navegava para `/painel` incondicionalmente (login
falso). Agora:

- Valida que email/senha foram preenchidos, usando um signal `erro` para
  mostrar mensagem inline.
- Usa um signal `carregando` para desabilitar o botão de submit e trocar o
  texto enquanto a requisição está em andamento.
- Chama `auth.login(...)` e, no sucesso, lê `returnUrl` dos query params
  (setado pelo redirect do guard) para mandar o usuário de volta à página
  que ele originalmente tentou acessar — com fallback para `/painel`.
- No erro, mostra "Credenciais inválidas."

## 5. UI reagindo ao estado de auth

- **[`shell.ts`](../src/app/layout/shell/shell.ts)**: o link de logout na
  sidebar virou um `<button (click)="sair()">` de verdade, que chama
  `auth.logout()` e navega para `/login` (um `routerLink` puro não
  conseguiria rodar lógica antes). O header do shell agora mostra
  `auth.usuario()` e um rótulo Admin/Curadoria vindo de `auth.isAdmin()`.
- **[`gestao-livros.ts`](../src/app/pages/gestao-livros/gestao-livros.ts)**:
  os controles restritos a admin (adicionar/editar/excluir) ficam dentro de
  `@if (auth.isAdmin())` no template, **e** cada handler
  (`postNewBook`, `deletarLivro`, etc.) reverifica `isAdmin()` internamente
  — assim, mesmo que alguém burlasse a checagem do template via devtools, o
  método em si não faz nada para não-admins.

## Fluxo ponta a ponta

1. Usuário acessa uma rota protegida → `authGuard` verifica
   `isAuthenticated()` → redireciona para `/login?returnUrl=...` se não
   estiver logado.
2. Usuário envia o formulário de login → `Auth.login()` faz POST das
   credenciais → backend retorna um JWT → salvo no `localStorage` e no
   `tokenSignal`.
3. Toda chamada HTTP seguinte recebe automaticamente
   `Authorization: Bearer <token>` via o interceptor.
4. A UI (nav, botões, ações restritas a admin) se atualiza reativamente
   porque `isAuthenticated`/`isAdmin`/`usuario` são todos `computed()` a
   partir desse único signal de token.
5. A expiração do token é verificada no client via o claim `exp` do JWT, a
   cada leitura de `isAuthenticated` — sem polling, é só um cálculo de
   signal.

## Ponto de atenção

O frontend confia nos claims de papel do JWT **só para decisões de UI**
(esconder botões) — a autorização de verdade precisa continuar sendo
garantida no backend. As reverificações de `isAdmin()` dentro de
`postNewBook`/`deletarLivro` são uma camada extra de proteção no cliente,
não um substituto para isso.
