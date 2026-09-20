import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Navbar } from '../../shared/navbar/navbar';
import { InputText } from 'primeng/inputtext';
import { SliderModule } from 'primeng/slider';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { Paginator } from 'primeng/paginator';
import { DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Tag } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ProductService } from '../../service/productservice';
import { Product } from '../../domain/product';
import { Wishlistservice } from '../../service/wishlistservice';

@Component({
  selector: 'app-acervo',
  imports: [
    Navbar,
    InputText,
    FormsModule,
    SliderModule,
    SelectButtonModule,
    InputNumberModule,
    FloatLabel,
    DataViewModule,
    NgClass,
    CurrencyPipe,
    Tag,
    ButtonModule,
  ],
  templateUrl: './acervo.html',
  styleUrl: './acervo.scss',
})
export class Acervo {
  limiteCompra: number = 0;
  stringBusca: string = '';
  layout: 'list' | 'grid' = 'grid';
  private productService = inject(ProductService);
  wishListService = inject(Wishlistservice);

  wishes = this.wishListService.getProducts();

  products = signal<Product[]>([]);

  options = ['list', 'grid'];

  ngOnInit(): void {
    this.productService.getProducts().then((data) => {
      this.products.set([...data.slice(0, 12)]);
    });

  }

  getSeverity(product: Product) {
    switch (product.inventoryStatus) {
      case 'INSTOCK':
        return 'success';

      case 'LOWSTOCK':
        return 'warn';

      case 'OUTOFSTOCK':
        return 'danger';

      default:
        return null;
    }
  }

}
