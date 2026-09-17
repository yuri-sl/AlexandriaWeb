import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Cliente {
  private apiUrl = "http://localhost:8080/cliente"

  constructor(private http:HttpClient){
  }

  criarCadastro(body: any):Observable<any>{
    return this.http.post<any>(this.apiUrl+"/cadastrar",body);
  }
}
