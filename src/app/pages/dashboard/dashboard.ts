import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { livro, Livros } from '../../services/livros';

interface GenreStat {
  genero: string;
  total: number;
  pct: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, TableModule, ButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  /** Source of truth for the page; falls back to demo scrolls if the API is offline. */
  private readonly livros = signal<livro[]>([]);
  protected readonly offline = signal(false);

  protected readonly totalObras = computed(() => this.livros().length);
  protected readonly estoqueTotal = computed(() =>
    this.livros().reduce((sum, l) => sum + (Number(l.estoque) || 0), 0),
  );
  protected readonly valorAcervo = computed(() =>
    this.livros().reduce((sum, l) => sum + (Number(l.preco) || 0) * (Number(l.estoque) || 0), 0),
  );
  protected readonly generosDistintos = computed(
    () => new Set(this.livros().map((l) => (l.genero || '—').trim())).size,
  );

  protected readonly recentes = computed(() => this.livros().slice(-6).reverse());

  protected readonly baixoEstoque = computed(() =>
    this.livros()
      .filter((l) => (Number(l.estoque) || 0) <= 5)
      .sort((a, b) => (Number(a.estoque) || 0) - (Number(b.estoque) || 0))
      .slice(0, 5),
  );

  protected readonly generos = computed<GenreStat[]>(() => {
    const counts = new Map<string, number>();
    for (const l of this.livros()) {
      const g = (l.genero || 'Sem gênero').trim() || 'Sem gênero';
      counts.set(g, (counts.get(g) ?? 0) + 1);
    }
    const max = Math.max(1, ...counts.values());
    return [...counts.entries()]
      .map(([genero, total]) => ({ genero, total, pct: Math.round((total / max) * 100) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);
  });

  constructor(private livroService: Livros) {}

  ngOnInit(): void {
    this.livroService.listarLivros().subscribe({
      next: (res) => {
        const lista = Array.isArray(res) ? res : res ? [res] : [];
        if (lista.length) {
          this.livros.set(lista);
        } else {
          this.useDemo();
        }
      },
      error: () => this.useDemo(),
    });
  }

  /** Keeps the panel legible while the Spring backend on :8080 is unavailable. */
  private useDemo(): void {
    this.offline.set(true);
    this.livros.set([
      { id: 1, titulo: 'Os Elementos', autor: 'Euclides', descricao: 'Tratado de geometria', genero: 'Matemática', preco: 320, estoque: 12, precoAtualizado: 352 },
      { id: 2, titulo: 'Almagesto', autor: 'Ptolomeu', descricao: 'Astronomia', genero: 'Astronomia', preco: 410, estoque: 4, precoAtualizado: 451 },
      { id: 3, titulo: 'Sobre os Corpos Flutuantes', autor: 'Arquimedes', descricao: 'Hidrostática', genero: 'Física', preco: 280, estoque: 7, precoAtualizado: 308 },
      { id: 4, titulo: 'História', autor: 'Heródoto', descricao: 'Relatos históricos', genero: 'História', preco: 190, estoque: 3, precoAtualizado: 209 },
      { id: 5, titulo: 'Geografia', autor: 'Eratóstenes', descricao: 'Medida da Terra', genero: 'Geografia', preco: 260, estoque: 9, precoAtualizado: 286 },
      { id: 6, titulo: 'Coletânea de Hipócrates', autor: 'Hipócrates', descricao: 'Medicina', genero: 'Medicina', preco: 350, estoque: 2, precoAtualizado: 385 },
      { id: 7, titulo: 'Cônicas', autor: 'Apolônio', descricao: 'Seções cônicas', genero: 'Matemática', preco: 300, estoque: 5, precoAtualizado: 330 },
    ]);
  }
}
