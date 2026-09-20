import { Component, inject } from '@angular/core';
import { Navbar } from '../../shared/navbar/navbar';
import { OnInit } from '@angular/core';
import { Wishlistservice } from '../../service/wishlistservice';

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
export class Carrinho implements OnInit {
    readonly wishListService = inject(Wishlistservice);
    readonly wishes = this.wishListService.wishlist$;
    totalCompra: bigint = BigInt(0);
    descontoEstudante: number = 0;

    tipoEntrega: string = '';
    tipoPagamento: string = '';

    ngOnInit(): void {
      this.calcularTotal();
    }


    obra1:Obra = ({
      titulo: "as",
      preco: BigInt(12.00),
      quantidade:2,
      autor:"Peter",
      marcador:"história"
    })

    obra2:Obra = ({
      titulo: "aspd",
      preco: BigInt(12.00),
      quantidade:1,
      autor:"Peter",
      marcador:"história"
    })
    listaCarrinho:Obra[] = [this.obra1,this.obra2];

    atualizarValor(obra:Obra){
      this.calcularTotal();
      return BigInt(obra.quantidade) * obra.preco;
    }

    calcularTotal(){
      this.totalCompra = BigInt(0);
      this.listaCarrinho.forEach(element => {
        this.totalCompra = this.totalCompra + (element.preco * BigInt(element.quantidade));
      });
      this.totalCompra = this.totalCompra/ BigInt(10);
    }

    alternarEntrega(send:string){
      this.tipoEntrega = send;
    }
    entregaValida(tipo:string){
      return this.tipoEntrega === tipo;
    }





}
