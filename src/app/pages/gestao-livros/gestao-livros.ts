import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { livro, Livros } from '../../services/livros';
import { Auth } from '../../services/auth';
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { ChangeDetectorRef } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {PaginatorModule} from 'primeng/paginator'

@Component({
  selector: 'app-gestao-livros',
  imports: [CommonModule,
    TableModule,
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    InputNumberModule,
    ButtonModule,
    InputTextModule,
    PaginatorModule
  ],
  templateUrl: './gestao-livros.html',
  styleUrl: './gestao-livros.scss',
})
export class GestaoLivros implements OnInit{

  protected readonly auth = inject(Auth);

  listaLivros: livro[] = [];
  visualizarModal:boolean = false;
  modoEdicao:boolean = false;

  formLivro: FormGroup;
  idLivro:any;
  termoPesquisa: string = '';

  first:number = 0;
  rows:number = 10;

  /** Books matching the current search term (título, autor or gênero). */
  get livrosFiltrados(): livro[] {
    const termo = (this.termoPesquisa || '').trim().toLowerCase();
    if (!termo) return this.listaLivros;
    return this.listaLivros.filter((l) =>
      [l.titulo, l.autor, l.genero].some((campo) =>
        (campo || '').toLowerCase().includes(termo),
      ),
    );
  }

  onPageChange(event:any){
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }

    constructor(
    private livroService:Livros,
    private cdr:ChangeDetectorRef,
    private fb:FormBuilder,
  ){
    this.formLivro = this.fb.group({
      titulo: ['',Validators.required],
      autor: ['',Validators.required],
      descricao: ['',Validators.required],
      genero: ['',Validators.required],
      preco: ['',Validators.required],
      estoque:['',Validators.required]
    })
    
  }
  ngOnInit(): void {
    this.getAllBooks();
    
  }


  habilitarAdicionarModal(){
    if (!this.auth.isAdmin()) return;
    this.formLivro.reset();
    this.idLivro = null;
    this.visualizarModal = true;
    this.modoEdicao = false;
  }
  habilitarEdicaoModal(id:any){
    if (!this.auth.isAdmin()) return;
    this.visualizarModal = true;
    this.modoEdicao =true;
    this.getBookInfoById(id);
    this.idLivro = id;
  }
  fecharModal(){
    this.visualizarModal = false;
    this.modoEdicao = false;
  }

  enviarFormulario(){
    if(!this.modoEdicao){
      this.postNewBook();
    }
    else{
      this.putEditarLivro();
    }
  }


  getAllBooks(){
    return this.livroService.listarLivros().subscribe({
      next: (res) => {
        console.log(res)
        this.listaLivros = Array.isArray(res) ? res : [res];
        this.cdr.detectChanges();
      },
      error:(err) => {
        console.log(err);
      }
    })
  }

  postNewBook(){
    if (!this.auth.isAdmin()) return;
    const livro: livro = this.formLivro.getRawValue();
    return this.livroService.postCriarLivro(livro).subscribe({
      next:(res) => {
        console.log(res);
        this.fecharModal();
        this.getAllBooks();
      },error:(err) => {
        console.error(err);
      }
    })
  }

  getBookInfoById(idLivro:any){
    return this.livroService.getInfoLivro(idLivro).subscribe({
      next:(res) => {
        console.log(res);
        this.formLivro.patchValue({
          id: res.id,
          titulo:res.titulo,
          autor:res.autor,
          descricao:res.descricao,
          genero:res.genero,
          preco:res.preco,
          estoque:res.estoque
        })
      },
      error:(err) => {
        console.error(err);
      }
    })
  }

  deletarLivro(id:any){
    if (!this.auth.isAdmin()) return;
    return this.livroService.deletarLivro(id).subscribe({
      next:(res) => {
        console.log(res);
        this.getAllBooks();
      },
      error:(err) => {
        console.error(err);
      }
    });
  }

  putEditarLivro(){
    if (!this.auth.isAdmin()) return;
    const livro = this.formLivro.getRawValue();
    return this.livroService.putAtualizarLivro(this.idLivro,livro).subscribe({
      next:(res) => {
        console.log(res);
        this.fecharModal();
        this.getAllBooks();
      },
      error:(err) => {
        console.error(err);
      }

    })
  }


}
