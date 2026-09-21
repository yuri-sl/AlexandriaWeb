import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { Navbar } from '../../shared/navbar/navbar';
import { ReaderState } from '../../services/reader-state';
@Component({
  selector: 'app-carrinho',
  imports: [Navbar, CurrencyPipe, RouterLink, FormsModule, InputNumberModule],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Carrinho {
  readonly reader = inject(ReaderState);
}
