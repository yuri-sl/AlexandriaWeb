import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected email = '';
  protected senha = '';
  protected mostrarSenha = false;
  protected readonly erro = signal<string | null>(null);
  protected readonly carregando = signal(false);

  entrar(): void {
    this.erro.set(null);

    if (!this.email || !this.senha) {
      this.erro.set('Informe e-mail e senha.');
      return;
    }

    this.carregando.set(true);
    this.auth.login(this.email, this.senha).subscribe({
      next: () => {
        this.carregando.set(false);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/painel';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        this.carregando.set(false);
        this.erro.set('Credenciais inválidas. Verifique e tente novamente.');
      },
    });
  }
}
