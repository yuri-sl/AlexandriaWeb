import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SliderModule } from 'primeng/slider';
import { InputNumberModule } from 'primeng/inputnumber';
import { DrawerModule } from 'primeng/drawer';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { Navbar } from '../../shared/navbar/navbar';
import { BookCard } from '../../shared/book-card/book-card';
import { Catalog, normalizeSearch } from '../../services/catalog';
@Component({
  selector: 'app-acervo',
  imports: [
    Navbar,
    BookCard,
    FormsModule,
    NgTemplateOutlet,
    InputTextModule,
    SliderModule,
    InputNumberModule,
    DrawerModule,
    PaginatorModule,
    SkeletonModule,
  ],
  templateUrl: './acervo.html',
  styleUrl: './acervo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Acervo {
  readonly catalog = inject(Catalog);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });
  readonly commercial = this.route.snapshot.data['commercial'] === true;
  readonly query = computed(() => this.params().get('q') || '');
  readonly area = computed(() => this.params().get('area') || '');
  readonly author = computed(() => this.params().get('autor') || '');
  readonly available = computed(() => this.params().get('disponivel') === 'true');
  readonly sort = computed(() => this.params().get('ordem') || 'titulo');
  readonly layout = computed(() => (this.params().get('layout') === 'list' ? 'list' : 'grid'));
  readonly price = computed(() => {
    const value = this.params().get('preco');
    return value !== null && Number.isFinite(Number(value))
      ? Math.min(this.catalog.maxPrice(), Math.max(0, Number(value)))
      : this.catalog.maxPrice();
  });
  readonly priceApplied = computed(() => this.commercial && this.params().has('preco'));
  readonly hasFilters = computed(
    () =>
      !!(this.query() || this.area() || this.author() || this.available() || this.priceApplied()),
  );
  readonly filtered = computed(() => {
    const q = normalizeSearch(this.query());
    const books = this.catalog
      .books()
      .filter(
        (book) =>
          (!q || normalizeSearch(book.titulo + ' ' + book.autor).includes(q)) &&
          (!this.area() || normalizeSearch(book.genero) === normalizeSearch(this.area())) &&
          (!this.author() || book.autor === this.author()) &&
          (!this.available() || book.estoque > 0) &&
          (!this.priceApplied() || book.preco <= this.price()),
      );
    return books.sort((a, b) =>
      this.commercial && this.sort() === 'preco'
        ? a.preco - b.preco
        : this.commercial && this.sort() === 'preco-desc'
          ? b.preco - a.preco
          : this.sort() === 'autor'
            ? a.autor.localeCompare(b.autor, 'pt-BR')
            : a.titulo.localeCompare(b.titulo, 'pt-BR'),
    );
  });
  readonly first = signal(0);
  readonly paged = computed(() => this.filtered().slice(this.first(), this.first() + 12));
  filtersOpen = false;
  constructor() {
    this.catalog.load();
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe(() => this.first.set(0));
  }
  setFilter(key: string, value: string | number | boolean | null): void {
    this.first.set(0);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [key]: value === '' || value === false ? null : value },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
  setPrice(value: number | null): void {
    this.setFilter(
      'preco',
      value === null ? null : Math.min(this.catalog.maxPrice(), Math.max(0, value)),
    );
  }
  clear(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { layout: this.layout(), ordem: this.sort() },
      replaceUrl: true,
    });
  }
}
