import { Injectable, computed, signal } from '@angular/core';
import { livro } from './livros';

export interface CartEntry {
  book: livro;
  quantity: number;
}
/** Session-only reader state. This is not a server order or a persisted reading library. */
@Injectable({ providedIn: 'root' })
export class ReaderState {
  readonly cart = signal<CartEntry[]>([]);
  readonly favorites = signal<livro[]>([]);
  readonly count = computed(() => this.cart().reduce((sum, entry) => sum + entry.quantity, 0));
  readonly subtotal = computed(() =>
    this.cart().reduce((sum, entry) => sum + entry.book.preco * entry.quantity, 0),
  );
  isFavorite(book: livro): boolean {
    return this.favorites().some((item) => item.id === book.id);
  }
  toggleFavorite(book: livro): void {
    if (book.id == null) return;
    this.favorites.update((items) =>
      this.isFavorite(book) ? items.filter((item) => item.id !== book.id) : [...items, book],
    );
  }
  add(book: livro): boolean {
    if (book.id == null || book.estoque < 1) return false;
    const existing = this.cart().find((entry) => entry.book.id === book.id);
    if (existing && existing.quantity >= book.estoque) return false;
    this.cart.update((items) =>
      existing
        ? items.map((entry) =>
            entry.book.id === book.id ? { book, quantity: entry.quantity + 1 } : entry,
          )
        : [...items, { book, quantity: 1 }],
    );
    return true;
  }
  quantity(id: number | null, quantity: number): void {
    if (!Number.isFinite(quantity)) return;
    this.cart.update((items) =>
      items.map((entry) =>
        entry.book.id === id
          ? { ...entry, quantity: Math.max(1, Math.min(entry.book.estoque, Math.floor(quantity))) }
          : entry,
      ),
    );
  }
  remove(id: number | null): void {
    this.cart.update((items) => items.filter((entry) => entry.book.id !== id));
  }
}
