import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login-page.component.html',
  imports: [
    CardModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MessageModule,
    InputTextModule,
    FloatLabelModule,
  ],
  styleUrls: ['./login-page.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMessage = '';
  estado = false;
  invalidCredentials = false;
  router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loginForm.controls['username'].valueChanges.subscribe(
      (value) => (this.invalidCredentials = false)
    );
    this.loginForm.controls['password'].valueChanges.subscribe(
      (value) => (this.invalidCredentials = false)
    );
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.value;

    // Simulação de login
    if (username === 'admin' && password === '1234') {
      this.router.navigate(['home']);
    } else {
      this.errorMessage = 'Usuário ou senha inválidos.';
      this.invalidCredentials = true;
    }
  }
}
