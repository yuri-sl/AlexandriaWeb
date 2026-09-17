import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { Cliente } from '../../services/cliente';
import { MessageService } from 'primeng/api';
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
  private readonly cliente = inject(Cliente);

  protected email = '';
  protected password = '';
  protected mostrarSenha = false;
  protected readonly erro = signal<string | null>(null);
  protected readonly carregando = signal(false);

  protected isCadastro:boolean = false;
  protected isNovaSenha:boolean = false;

  constructor(private messageService: MessageService){

  }

  form_cadastro = new FormGroup({
    email: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
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
        this.messageService.add({
          severity:'success',
          summary:'Login concluido',
          detail:'Login efetuado com sucesso'
        })
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/painel';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        this.carregando.set(false);
        this.erro.set('Credenciais inválidas. Verifique e tente novamente.');
          this.messageService.add({
          severity:'warn',
          summary:'Erro no login',
          detail:'Credenciais inválidas'
        })
      },
    });
  }

  cadastrar(){
    const dados = this.form_cadastro.getRawValue();
    let body = {
      email: dados.email,
      cadastrar: dados.username,
      password: dados.password
    }

    this.cliente.criarCadastro(body).subscribe({
      next:(res) => {
        console.log(res);
        this.messageService.add({
          severity:'success',
          summary:'Sucesso ao criar',
          detail:'Conta criado com sucesso'
        })
      },
      error: (err) => {
        console.error(err);
          this.messageService.add({
          severity:'warn',
          summary:'Erro',
          detail:err.error.message
        })
      }
    })




  }

  controleFormulario(){
    this.isCadastro = false;
    this.isNovaSenha = false;
  }

}
