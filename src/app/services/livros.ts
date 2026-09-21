import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';



export interface livro{
  id:number| null,
  titulo:string,
  descricao:string,
  preco:number,
  autor:string,
  genero:string,
  estoque:number,
  precoAtualizado: number | null
}
@Injectable({
  providedIn: 'root',
})
export class Livros {

  private apiUrl = "http://localhost:8080/livro";
  constructor(private http: HttpClient){

  };

  listarLivros(){
    return this.http.get<livro[] | livro>(this.apiUrl);
  }

  postCriarLivro(body:livro):Observable<livro>{
    return this.http.post<livro>(this.apiUrl,body);
  }

  getInfoLivro(id:any){
    return this.http.get<livro>(this.apiUrl+"/"+id)
  }

  putAtualizarLivro(id:any,body:livro):Observable<livro>{
    return this.http.put<livro>(this.apiUrl+"/"+id,body);
  }

  deletarLivro(id:any):Observable<any>{
    return this.http.delete<any>(this.apiUrl+"/"+id);
  }

  
}
