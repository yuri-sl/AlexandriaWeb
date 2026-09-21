import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing').then((m) => m.Landing),
    pathMatch: 'full',
  },
  { path: 'login', loadComponent: () => import('./pages/login/login').then((m) => m.Login) },
  {
    path: 'acervo/view',
    loadComponent: () => import('./pages/acervo/view/view').then((m) => m.View),
  },
  { path: 'acervo', loadComponent: () => import('./pages/acervo/acervo').then((m) => m.Acervo) },
  {
    path: 'marketplace',
    loadComponent: () => import('./pages/acervo/acervo').then((m) => m.Acervo),
    data: { commercial: true },
  },
  {
    path: 'carrinho',
    loadComponent: () => import('./pages/carrinho/carrinho').then((m) => m.Carrinho),
  },
  {
    path: 'estante',
    loadComponent: () => import('./pages/estante/estante').then((m) => m.Estante),
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    canActivate: [authGuard],
    children: [
      {
        path: 'painel',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'gestao',
        loadComponent: () =>
          import('./pages/gestao-livros/gestao-livros').then((m) => m.GestaoLivros),
        canActivate: [adminGuard],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
