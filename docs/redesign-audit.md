# Alexandria — O Acervo Vivo

## Auditoria inicial e escopo desta entrega

Projeto Angular standalone 21.1 (faixa declarada), PrimeNG 21.1.7, PrimeUIX Themes 2.0.3, RxJS 7.8, TypeScript 5.9. O tema existente era Aura com paleta dourada. Foram lidas as alterações locais da landing antes da refatoração.

### Inventário

- Rotas públicas: início, login, acervo, acervo/view, carrinho e estante. Rotas autenticadas: painel e gestão. Havia duas rotas `acervo`; a pública impedia alcançar a gestão.
- Layouts: Navbar público repetido nas páginas; Shell administrativo com sidebar; footer no App; Header próprio do login.
- Componentes: landing, catálogo, detalhes, carrinho, estante, login, dashboard, gestão; componentes PrimeNG de formulário, tabela, diálogo e toast.
- Backend: `Livros` usa GET/POST/PUT/DELETE em `http://localhost:8080/livro`; `Cliente` usa POST `/cliente/cadastrar`; `Auth` usa POST `/auth/login`.
- Segurança: JWT em `alx_token`, interceptor Bearer, authGuard e adminGuard. Os contratos, payloads e autenticação foram preservados. A gestão passou a usar o adminGuard já existente.
- Modelos: `livro` reúne título, autor, descrição, gênero, preço e estoque; `Product` era um modelo separado de demonstração, com imagens de relógios. Não existe contrato de edição, ISBN, editora, idioma, formato, promoções ou avaliações.
- Estado anterior: catálogo usava ProductService fictício; wishlist em memória era usada como carrinho; carrinho somava BigInt com totais fixos; detalhes continham livro de teste; estante estava vazia; Home e dashboard tinham fallback fictício.
- Reutilização: Angular standalone, HttpClient, Auth, guards/interceptor, CRUD Livros, componentes PrimeNG e tipografia Cormorant Garamond/Inter.
- Problemas: rotas conflitantes, repetição de estilos, textura e dourado excessivos, uso decorativo de hieróglifos, filtros sem aplicação, falta de estados reais de erro/vazio, labels ausentes, ações sem destino funcional, testes antigos sem providers e import de interceptor inexistente.

## Plano por etapas

1. Auditar contratos e navegação.
2. Centralizar tokens e tematização Aura; manter aliases para telas operacionais existentes.
3. Refatorar navegação pública, drawer mobile, busca, conta e footer; corrigir rota da gestão e aplicar lazy loading.
4. Refazer Home editorial sem simular curadoria, novidades ou números que a API não fornece.
5. Integrar catálogo real, filtros disponíveis, URL compartilhável, grid/lista, paginação e estados.
6. Extrair cards acadêmico/comercial; conectar os destinos mínimos de detalhes, favoritos e carrinho para manter a jornada funcional.
7. Em próximas entregas: biblioteca pessoal persistida, checkout simulado completo, administração ampliada, edições e avaliações, conforme contratos e requisitos de cada módulo.

## Implementado

### Tokens e tema

`src/styles.scss`, `src/app/app.config.ts`, `src/index.html`.

Paleta semântica, tipografia editorial, escala de espaçamento, raios, sombras, botões, chips, estados vazios, foco e reduced motion. Preset Aura com primária mediterrânea. Sem `::ng-deep`. CSS global concentra apenas ajustes estruturais do PrimeNG; aliases conservam compatibilidade com páginas ainda não redesenhadas.

`angular.json` desativa somente o inlining de fontes na otimização de produção, pois o download pelo compilador falhava na cadeia de certificados. Fonts continuam declaradas no HTML, com fallbacks locais. Scripts e estilos continuam otimizados.

### Shell público

`src/app/shared/navbar/*`, `src/app/app.{ts,html,scss}`, `src/app/app.routes.ts`.

Três módulos, pesquisa por título/autor, categorias, favoritos, carrinho com contador, conta, navegação por teclado e drawer mobile PrimeNG. `/marketplace` reutiliza o catálogo em modo comercial; `/acervo` prioriza obras e omite preço/estoque. `/gestao` leva ao CRUD protegido. Footer contém apenas destinos existentes: contatos, termos e política de privacidade não foram inventados.

### Home

`src/app/pages/landing/*`, `src/app/services/catalog.ts`.

Hero editorial com ilustração geométrica CSS, busca funcional, três portais, áreas, obras do acervo, obras disponíveis no marketplace, entrada acadêmica e favoritos da sessão. Erros e respostas vazias não geram dados fictícios. Sem alegações de curadoria ou novidade por data: o contrato não fornece esses dados.

### Catálogo e cards

`src/app/pages/acervo/acervo.*`, `src/app/shared/book-card/*`, `src/app/services/livros.ts`.

Filtros combináveis por título/autor, área, autor exato, disponibilidade e preço. Busca ignora acentos. Ordenação por título/autor e preço no marketplace. Filtros, termo, ordem e layout na URL. Paginação de 12 itens e reset ao filtrar. Drawer mobile e campos com labels. Slider e InputNumber compartilham preço na URL, inclusive zero e limpeza. Tipagem de listarLivros corrigida para a resposta singular ou lista já tolerada pelos consumidores.

O preço apresentado continua sendo `preco`, como no fluxo original. Não se presume que `precoAtualizado` seja preço anterior, desconto ou promoção. A apresentação separa obra acadêmica e produto comercial sem alterar o DTO do backend. Capas tipográficas são explicitamente identificadas como indisponíveis.

### Destinos funcionais dos cards

`src/app/pages/acervo/view/*`, `src/app/pages/carrinho/*`, `src/app/pages/estante/*`, `src/app/services/reader-state.ts`.

Detalhes usam GET `/livro/:id`. Favoritos e carrinho separados, apenas na sessão, com aviso explícito sobre recarregar a página. Carrinho limita quantidade ao estoque e calcula subtotal decimal; não simula cobrança ou confirmação de pedido. Essas telas são suporte à jornada inicial, não a implementação completa das etapas de biblioteca pessoal e checkout.

## Limites de integração

- Sem metadados de edição/ISBN/capa, filtros correspondentes, resenhas, classificação, listas persistidas, metas ou histórico.
- Não há endpoints de pedidos, pagamento, entrega ou biblioteca pessoal no front-end atual.
- A administração completa, login e dashboard ainda conservam partes do design anterior. O dashboard antigo ainda possui fallback de demonstração, fora da Home e do catálogo refeitos.
- Sem dados conhecidos de contato, termos ou privacidade; esses conteúdos precisam de definição real.
- A busca não promete ISBN nem autocomplete remoto sem contrato que os suporte.

## Validação

Build de produção executado após tema/shell, Home e catálogo. O build de Home e o build de catálogo passaram; as primeiras tentativas revelaram bloqueio do sandbox, certificado de download de fontes e orçamento do stylesheet antigo da landing, todos tratados. Há avisos de tamanho de bundle inicial e de alguns estilos; limites de erro não foram aumentados.

Testes: adapter HTTP (resposta lista/singular, erro, vazio, retry), filtros combinados e ordenação, separação acadêmico/comercial, sincronização dos controles de preço, favoritos, estoque, total decimal e autenticação Bearer. Fixtures ficam exclusivamente em `src/app/testing` e testes.

Breakpoints implementados para 360, 768, 1024 e telas amplas. Validação visual em navegador pendente: o runtime de Browser retornou lista vazia de navegadores disponíveis. Não foi possível medir contraste renderizado, overflow ou interação real de drawers nesses tamanhos nesta sessão.
