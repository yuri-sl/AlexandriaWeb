import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { livro } from '../../services/livros';
import { ReaderState } from '../../services/reader-state';
@Component({
  selector: 'app-book-card',
  imports: [CurrencyPipe, RouterLink, ButtonModule],
  templateUrl: './book-card.html',
  styleUrl: './book-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCard {
  readonly book = input.required<livro>();
  readonly variant = input<'academic' | 'commercial'>('academic');
  readonly list = input(false);
  readonly reader = inject(ReaderState);
  private readonly messages = inject(MessageService);
  add(): void {
    const added = this.reader.add(this.book());
    this.messages.add({
      severity: added ? 'success' : 'warn',
      summary: added ? 'Adicionado ao carrinho' : 'Limite de estoque atingido',
      detail: this.book().titulo,
      life: 2500,
    });
  }
}
