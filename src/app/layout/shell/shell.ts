import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  glyph: string; // hieroglyphic flourish
}

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DatePipe],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  protected readonly auth = inject(Auth);
  private readonly router = inject(Router);

  protected readonly today = new Date();

  /** Sidebar starts collapsed: only the rail + arrow show until the user expands it. */
  protected readonly sidebarCollapsed = signal(true);

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }

  sair(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  protected readonly nav: NavItem[] = [
    { label: 'Painel', icon: 'pi pi-th-large', route: '/painel', glyph: '𓂀' },
    { label: 'Gestão de livros', icon: 'pi pi-book', route: '/gestao', glyph: '𓍝' },
    { label: 'Escribas', icon: 'pi pi-users', route: '/escribas', glyph: '𓀀' },
    { label: 'Relatórios', icon: 'pi pi-chart-line', route: '/relatorios', glyph: '𓆼' },
    { label: 'Configurações', icon: 'pi pi-cog', route: '/config', glyph: '𓋹' },
  ];
}

