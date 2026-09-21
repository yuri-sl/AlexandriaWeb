import { ChangeDetectionStrategy, Component, inject, signal, DestroyRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, of, catchError } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { Navbar } from '../../../shared/navbar/navbar';
import { Livros, livro } from '../../../services/livros';
import { ReaderState } from '../../../services/reader-state';
@Component({
  selector: 'app-view',
  imports: [Navbar, RouterLink, CurrencyPipe, ButtonModule, SkeletonModule],
  templateUrl: './view.html',
  styleUrl: './view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class View {
  private readonly api = inject(Livros);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy = inject(DestroyRef);
  private readonly messages = inject(MessageService);
  readonly reader = inject(ReaderState);
  readonly book = signal<livro | null>(null);
  readonly loading = signal(true);
  readonly commercial = signal(false);
  constructor() {
    this.route.queryParamMap
      .pipe(
        switchMap((params) => {
          this.loading.set(true);
          this.commercial.set(params.get('modo') === 'commercial');
          const id = Number(params.get('id'));
          return Number.isInteger(id) && id > 0
            ? this.api.getInfoLivro(id).pipe(catchError(() => of(null)))
            : of(null);
        }),
        takeUntilDestroyed(this.destroy),
      )
      .subscribe((book) => {
        this.book.set(book);
        this.loading.set(false);
      });
  }
  add(): void {
    const book = this.book();
    if (!book) return;
    const added = this.reader.add(book);
    this.messages.add({
      severity: added ? 'success' : 'warn',
      summary: added ? 'Adicionado ao carrinho' : 'Limite de estoque atingido',
      detail: book.titulo,
      life: 2500,
    });
  }
}
