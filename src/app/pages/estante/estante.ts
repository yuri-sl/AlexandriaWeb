import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { BookCard } from '../../shared/book-card/book-card';
import { ReaderState } from '../../services/reader-state';
import { Auth } from '../../services/auth';
@Component({
  selector: 'app-estante',
  imports: [Navbar, BookCard, RouterLink],
  templateUrl: './estante.html',
  styleUrl: './estante.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Estante {
  readonly reader = inject(ReaderState);
  readonly auth = inject(Auth);
}
