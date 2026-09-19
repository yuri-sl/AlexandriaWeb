import { Component } from '@angular/core';
import { Navbar } from '../../shared/navbar/navbar';


type Obra = {
  titulo:string,
  preco:bigint,
  quantidade:number,
  autor:string,
  marcador:string
}
@Component({
  selector: 'app-carrinho',
  imports: [Navbar],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.scss',
})
export class Carrinho {
    totalCompra:number = 0;

    tipoEntrega: string = '';
    tipoPagamento: string = '';


    obra1:Obra = ({
      titulo: "as",
      preco: BigInt(12.00),
      quantidade:2,
      autor:"Peter",
      marcador:"história"
    })

    obra2:Obra = ({
      titulo: "as",
      preco: BigInt(12.00),
      quantidade:2,
      autor:"Peter",
      marcador:"história"
    })
    listaCarrinho:Obra[] = [this.obra1,this.obra2];

    atualizarValor(Obra1:Obra){
      return BigInt(this.obra1.quantidade) * this.obra1.preco;
    }

    alternarEntrega(send:string){
      this.tipoEntrega = send;
    }
    entregaValida(tipo:string){
      return this.tipoEntrega === tipo;
    }




}
