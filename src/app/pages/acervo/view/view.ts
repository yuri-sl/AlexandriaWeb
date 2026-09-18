import { Component } from '@angular/core';
import { Navbar } from '../../../shared/navbar/navbar';
import { FormsModule } from '@angular/forms';

type Livro = {
  livro:string,
  descricao:string,
  autor:string,
  preco:BigInt
}

@Component({
  selector: 'app-view',
  imports: [Navbar, FormsModule],
  templateUrl: './view.html',
  styleUrl: './view.scss',
})


export class View {

  titulo:string = "Livro teste";
  preco:BigInt = BigInt("45");
  quantidade:BigInt = BigInt(2);

}
