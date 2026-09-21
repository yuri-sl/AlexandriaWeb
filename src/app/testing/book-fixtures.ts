import { livro } from '../services/livros';
/** Test-only catalog data. Never imported by application components or services. */
export const BOOK_FIXTURES: livro[] = [
  {
    id: 101,
    titulo: 'Introdução à Computação',
    autor: 'Ana Silva',
    descricao: 'Referência de teste.',
    genero: 'Computação',
    preco: 50.5,
    estoque: 2,
    precoAtualizado: null,
  },
  {
    id: 102,
    titulo: 'Álgebra',
    autor: 'Bruno Souza',
    descricao: 'Outra referência de teste.',
    genero: 'Matemática',
    preco: 120,
    estoque: 0,
    precoAtualizado: null,
  },
  {
    id: 103,
    titulo: 'Algoritmos',
    autor: 'Ana Silva',
    descricao: 'Livro de teste.',
    genero: 'Computação',
    preco: 80,
    estoque: 5,
    precoAtualizado: null,
  },
];
