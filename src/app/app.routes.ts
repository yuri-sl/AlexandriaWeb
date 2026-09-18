import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { GestaoLivros } from './pages/gestao-livros/gestao-livros';
import { authGuard } from './guards/auth-guard';
import { Acervo } from './pages/acervo/acervo';
import { View } from './pages/acervo/view/view';

export const routes: Routes = [
  // ---- Public pages ----
  { path: '', component: Landing, pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'acervo', component: Acervo},
  { path: 'acervo/view', component: View},

  // ---- Authenticated area wrapped by the dashboard shell ----
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: 'painel', component: Dashboard },
      { path: 'acervo', component: GestaoLivros },
      // legacy path kept so older links keep working
      { path: 'gestao', redirectTo: 'acervo', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: '' },
];
