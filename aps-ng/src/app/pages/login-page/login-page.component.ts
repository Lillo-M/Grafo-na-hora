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
import { UserService } from '../../services/user.service';
import { FeedbackModalComponent } from '../home-page/feedback-modal/feedback-modal.component';

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
    FeedbackModalComponent,
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

  constructor(private fb: FormBuilder, private userService: UserService) {
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
    let temp = sessionStorage.getItem('token');
    if (temp != null) {
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

    this.userService
      .logarUsuario({
        nome: username,
        senha: password,
      })
      .subscribe({
        next: (response) => {
          if (response.success) {
            sessionStorage.setItem('token', username); // Seta Token com oq recebeu da API
            sessionStorage.setItem('isAdmin', response.admin ? 'true' : 'false');
            this.router.navigate(['/home']);
          }
        },
        error: (error) => {
          console.error('Erro ao fazer login:', error);
          this.errorMessage =
            error.error?.message || 'Erro ao fazer login. Tente novamente.';
          this.invalidCredentials = true;
          this.sub.next(0); // Retira a mensagem após o tempo registrado na subscrição.
        },
      });
  }
  recoverPasswordOnClick() {}
  registerOnClick() {
    this.router.navigate(['/register']);
  }
}
