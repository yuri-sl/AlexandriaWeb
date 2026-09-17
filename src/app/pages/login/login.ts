import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected email = '';
  protected password = '';
  protected mostrarSenha = false;
  protected readonly erro = signal<string | null>(null);
  protected readonly carregando = signal(false);

  protected isCadsatro:boolean = false;
  protected isNovaSenha:boolean = false;

  form_cadastro = new FormGroup({
    email: new FormControl(''),
    nome: new FormControl(''),
    senha: new FormControl(''),
    repete_senha: new FormControl('')
  })

  form_esqueci_senha = new FormGroup({
    senha_atual: new FormControl(''),
    nova_senha: new FormControl('')
  })

  entrar(): void {
    this.erro.set(null);

    if (!this.email || !this.password) {
      this.erro.set('Informe e-mail e senha.');
      return;
    }

    this.carregando.set(true);
    this.auth.login(this.email, this.password).subscribe({
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

  controleFormulario(){
    this.isCadsatro = false;
    this.isNovaSenha = false;
  }

}
