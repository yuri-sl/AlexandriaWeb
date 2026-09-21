import { Injectable, computed, inject, signal } from '@angular/core';
import { Livros, livro } from './livros';

export const KNOWLEDGE_AREAS = [
  'Computação',
  'Engenharias',
  'Matemática',
  'Ciências naturais',
  'Humanidades',
  'Literatura',
  'História',
  'Filosofia',
];
export const normalizeSearch = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();

/** Read adapter for the existing /livro contract. No synthetic catalog fallback. */
@Injectable({ providedIn: 'root' })
export class Catalog {
  private readonly api = inject(Livros);
  readonly books = signal<livro[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly loaded = signal(false);
  readonly areas = computed(() =>
    [
      ...new Set(
        this.books()
          .map((book) => book.genero)
          .filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b, 'pt-BR')),
  );
  readonly authors = computed(() =>
    [
      ...new Set(
        this.books()
          .map((book) => book.autor)
          .filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b, 'pt-BR')),
  );
  readonly maxPrice = computed(() =>
    Math.max(100, ...this.books().map((book) => Math.ceil(book.preco))),
  );
  load(force = false): void {
    if (this.loading() || (this.loaded() && !force)) return;
    this.loading.set(true);
    this.error.set('');
    this.api.listarLivros().subscribe({
      next: (response) => {
        this.books.set(Array.isArray(response) ? response : response ? [response] : []);
        this.loaded.set(true);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar o acervo. Tente novamente em instantes.');
        this.loading.set(false);
      },
    });
  }
}
