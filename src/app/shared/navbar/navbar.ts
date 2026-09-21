import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { Auth } from '../../services/auth';
import { KNOWLEDGE_AREAS } from '../../services/catalog';
import { ReaderState } from '../../services/reader-state';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, FormsModule, DrawerModule, InputTextModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  readonly auth = inject(Auth);
  readonly reader = inject(ReaderState);
  readonly areas = KNOWLEDGE_AREAS;
  private readonly router = inject(Router);
  menuOpen = false;
  query = '';
  search(): void {
    this.menuOpen = false;
    this.router.navigate(['/acervo'], { queryParams: { q: this.query.trim() || null } });
  }
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
