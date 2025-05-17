import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
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
import { debounceTime, interval, Subject, throttle } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  sub = new Subject();
  destroyRef = inject(DestroyRef);
  changeRef = inject(ChangeDetectorRef);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    const delay = this.sub.pipe(debounceTime(3500)); // Delay para retirar a mensagem de erro
    const subscribe = delay.pipe(takeUntilDestroyed()).subscribe((val) => {
      this.errorMessage = '';
    });
  }

  ngOnInit() {
    console.log('teste de auth');
    let temp = localStorage.getItem('token');
    if (( temp && temp == 'testaNaAPI')) {
      // Testa na API se o token existe e está válido.
      console.log('testou e deu boa');
      this.router.navigate(['/home']);
    }
    this.loginForm.controls['username'].valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => (this.invalidCredentials = false));
    this.loginForm.controls['password'].valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => (this.invalidCredentials = false));
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    this.changeRef.detectChanges();

    if (this.loginForm.invalid) {
      this.errorMessage = 'Insira suas credenciais.';
      this.invalidCredentials = true;
      this.sub.next(0); // Retira a mensagem após o tempo registrado na subscrição.
      return;
    }

    const { username, password } = this.loginForm.value;

    // Simulação de login
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('token', 'testaNaAPI'); // Seta Token com oq recebeu da API
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Usuário ou senha inválidos.';
      this.invalidCredentials = true;
      this.sub.next(0); // Retira a mensagem após o tempo registrado na subscrição.
    }
  }
}
