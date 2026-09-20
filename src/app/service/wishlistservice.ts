import { Injectable, signal } from '@angular/core';
import { Product } from '../domain/product';

@Injectable({
  providedIn: 'root',
})
export class Wishlistservice {
  private wishlist = signal<Product[]>([]);

  readonly wishlist$ = this.wishlist.asReadonly();

  getProducts(): Promise<Product[]> {
    return Promise.resolve(this.wishlist());
  }

  addWishList(product: Product): void {
    this.wishlist.update(wishes => [...wishes, product]);
  }

  removeFromWishList(item: Product): void {
    this.wishlist.update(wishes => wishes.filter(product => product !== item));
  }
}
