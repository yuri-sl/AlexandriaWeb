import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { livro, Livros } from '../../services/livros';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, RouterLink, Navbar],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing implements OnInit {
  private readonly livros = signal<livro[]>([]);

  /** Curated cards for the public showcase. */
  protected readonly vitrine = computed(() => this.livros().slice(0, 8));

  /** Distinct genres for the "areas of knowledge" strip. */
  protected readonly categorias = computed(() => {
    const set = new Set(this.livros().map((l) => (l.genero || '').trim()).filter(Boolean));
    return [...set];
  });

  protected readonly totalObras = computed(() => this.livros().length);

  protected readonly anoAtual = new Date().getFullYear();

  constructor(private livroService: Livros) {}

  ngOnInit(): void {
    this.livroService.listarLivros().subscribe({
      next: (res) => {
        const lista = Array.isArray(res) ? res : res ? [res] : [];
        this.livros.set(lista.length ? lista : this.demo());
      },
      error: () => this.livros.set(this.demo()),
    });
  }

  /** Initial of the title, used to letter the decorative book spine. */
  inicial(titulo: string): string {
    return (titulo || '?').trim().charAt(0).toUpperCase();
  }

  private demo(): livro[] {
    return [
      { id: 1, titulo: 'Os Elementos', autor: 'Euclides', descricao: 'Os fundamentos da geometria, em treze livros.', genero: 'Matemática', preco: 320, estoque: 12, precoAtualizado: 352 },
      { id: 2, titulo: 'Almagesto', autor: 'Ptolomeu', descricao: 'O grande tratado astronômico da Antiguidade.', genero: 'Astronomia', preco: 410, estoque: 4, precoAtualizado: 451 },
      { id: 3, titulo: 'Sobre os Corpos Flutuantes', autor: 'Arquimedes', descricao: 'A origem da hidrostática.', genero: 'Física', preco: 280, estoque: 7, precoAtualizado: 308 },
      { id: 4, titulo: 'História', autor: 'Heródoto', descricao: 'As investigações do pai da história.', genero: 'História', preco: 190, estoque: 3, precoAtualizado: 209 },
      { id: 5, titulo: 'Geografia', autor: 'Eratóstenes', descricao: 'A medida do mundo conhecido.', genero: 'Geografia', preco: 260, estoque: 9, precoAtualizado: 286 },
      { id: 6, titulo: 'Corpus Hippocraticum', autor: 'Hipócrates', descricao: 'A coletânea fundadora da medicina.', genero: 'Medicina', preco: 350, estoque: 2, precoAtualizado: 385 },
      { id: 7, titulo: 'Cônicas', autor: 'Apolônio', descricao: 'O estudo das seções cônicas.', genero: 'Matemática', preco: 300, estoque: 5, precoAtualizado: 330 },
      { id: 8, titulo: 'Ilíada', autor: 'Homero', descricao: 'A epopeia da guerra de Troia.', genero: 'Literatura', preco: 220, estoque: 15, precoAtualizado: 242 },
    ];
  }
}
