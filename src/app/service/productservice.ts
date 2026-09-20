import { Injectable } from '@angular/core';
import { Product } from '../domain/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly products: Product[] = [
    {
      id: 1,
      name: 'The Thinking Machine',
      category: 'Books',
      image: 'bamboo-watch.jpg',
      price: 24.99,
      rating: 4.8,
      inventoryStatus: 'INSTOCK',
    },
    {
      id: 2,
      name: 'A History of Alexandria',
      category: 'History',
      image: 'black-watch.jpg',
      price: 32.5,
      rating: 4.5,
      inventoryStatus: 'LOWSTOCK',
    },
    {
      id: 3,
      name: 'Reference Atlas',
      category: 'Reference',
      image: 'blue-band.jpg',
      price: 45,
      rating: 4.2,
      inventoryStatus: 'OUTOFSTOCK',
    },
  ];

  getProducts(): Promise<Product[]> {
    return Promise.resolve(this.products);
  }
}
