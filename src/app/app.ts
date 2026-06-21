import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Header } from './shared/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,MenubarModule,Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('alexandria-web');
  itensMenuNavegacao: MenuItem[] | undefined;

  ngOnInit(){
    this.construcaoItens();

  }

  construcaoItens(){
    this.itensMenuNavegacao = [
      {
        label:'Home',
        icon: 'pi pi-home'
      },
      {
        label:'Dashboard',
        icon: 'pi pi-star',
        items: [
          {
          label:'Livros',
        },
        {
          label:'Dados'
        },
      ]
      },
      {
        label:'options',
      }
    ]
  }
}
