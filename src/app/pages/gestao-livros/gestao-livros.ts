import { Component, OnInit } from '@angular/core';
import { livro, Livros } from '../../services/livros';
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { Badge } from "primeng/badge";
import { ChangeDetectorRef } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { timeout } from 'rxjs';
import { Header } from '../../shared/header/header';
import {PaginatorModule} from 'primeng/paginator'

@Component({
  selector: 'app-gestao-livros',
  imports: [TableModule,
    Header,
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

  listaLivros: livro[] = [];
  visualizarModal:boolean = false;
  modoEdicao:boolean = false;

  formLivro: FormGroup;
  idLivro:any;
  termoPesquisa: any;
  
  first:number = 0;
  rows:number = 10;

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
    this.visualizarModal = true;
    this.modoEdicao = false;
  }
  habilitarEdicaoModal(id:any){
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
    const livro: livro = this.formLivro.getRawValue();
    return this.livroService.postCriarLivro(livro).subscribe({
      next:(res) => {
        console.log(res);
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
    return this.livroService.deletarLivro(id).subscribe({
      next:(res) => {
        console.log(res);
      },
      error:(err) => {
        console.error(err);
      }
    });
  }

  putEditarLivro(){
    const livro = this.formLivro.getRawValue();
    return this.livroService.putAtualizarLivro(this.idLivro,livro).subscribe({
      next:(res) => {
        console.log(res);
      },
      error:(err) => {
        console.error(err);
      }

    })
  }


}
