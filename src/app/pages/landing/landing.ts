import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { Navbar } from '../../shared/navbar/navbar';
import { BookCard } from '../../shared/book-card/book-card';
import { Catalog, KNOWLEDGE_AREAS } from '../../services/catalog';
import { Auth } from '../../services/auth';
import { ReaderState } from '../../services/reader-state';
@Component({
  selector: 'app-landing',
  imports: [RouterLink, FormsModule, Navbar, BookCard, SkeletonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landing {
  readonly catalog = inject(Catalog);
  readonly auth = inject(Auth);
  readonly reader = inject(ReaderState);
  private readonly router = inject(Router);
  readonly vitrine = computed(() => this.catalog.books().slice(0, 4));
  readonly commercial = computed(() =>
    this.catalog
      .books()
      .filter((book) => book.estoque > 0)
      .slice(0, 4),
  );
  readonly areas = KNOWLEDGE_AREAS;
  readonly icons = [
    'pi-code',
    'pi-cog',
    'pi-calculator',
    'pi-sparkles',
    'pi-globe',
    'pi-book',
    'pi-building-columns',
    'pi-comments',
  ];
  query = '';
  constructor() {
    this.catalog.load();
  }
  search(): void {
    this.router.navigate(['/acervo'], { queryParams: { q: this.query.trim() || null } });
  }
}
