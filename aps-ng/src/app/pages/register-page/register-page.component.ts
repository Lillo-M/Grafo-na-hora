import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    MessageModule
  ],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  semester = '';

  usernameError = '';
  emailError = '';
  passwordError = '';
  confirmPasswordError = '';
  feedbackMessage = '';
  semesterError = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}
  
  register() {
    this.usernameError = '';
    this.emailError = '';
    this.passwordError = '';
    this.confirmPasswordError = '';
    this.feedbackMessage = '';
    this.semesterError = '';

    let valid = true;

    if (!this.username.trim()) {
      this.usernameError = 'O campo Usuário é obrigatório.';
      valid = false;
    }

    if (!this.email.trim() || !this.email.includes('@')) {
      this.emailError = 'Informe um email válido.';
      valid = false;
    }

    if (this.password.length < 6) {
      this.passwordError = 'A senha deve ter pelo menos 6 caracteres.';
      valid = false;
    }

    if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'As senhas não conferem.';
      valid = false;
    }

    if (this.semester == '') {
      this.semesterError = 'O campo Período é obrigatório.';
      valid = false;
    }
    
    if (!valid) {
      return;
    }
    // Add mensagem de erro como no login
    // console.log('Cadastrar usuário', this.username, this.email);
    // Adicionar campo de período
    const payload = {
      nome: this.username,
      email: this.email,
      senha: this.password,
      curso: 1, 
      periodo: Number(this.semester),
    };

    this.userService.cadastrarUsuario(payload).subscribe({
      next: (res) => {
        this.feedbackMessage = res.message;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.feedbackMessage = err.error.message || 'Erro ao cadastrar usuário.';
      },
    });
  }
}
