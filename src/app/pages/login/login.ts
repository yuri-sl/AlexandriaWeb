import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  protected email = '';
  protected senha = '';
  protected mostrarSenha = false;

  constructor(private router: Router) {}
  

  entrar(): void {
    this.router.navigate(['/painel']);
  }
}
