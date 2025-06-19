import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { FeedbackService } from '../../../services/feedback.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-feedback-modal',
  standalone: true,
  imports: [DialogModule, ButtonModule, TextareaModule, ReactiveFormsModule, ToastModule],
  templateUrl: './feedback-modal.component.html',
  styleUrl: './feedback-modal.component.scss',
  providers: [MessageService],
})
export class FeedbackModalComponent {
  @Input() buttonLabel: string = 'Enviar feedback'; // nome do botão configurável

  visible: boolean = false;
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private messageService: MessageService
  ) {
    this.formGroup = this.fb.group({
      text: ['', Validators.required],
    });
  }

  showDialog() {
    this.visible = true;
  }

  submitFeedback() {
    if (this.formGroup.valid) {
      const texto = this.formGroup.value.text;
      const usuario = sessionStorage.getItem('token')!; 

      this.feedbackService.sendFeedback({ texto, usuario }).subscribe({
        next: (res) => {
          if (res.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Enviado!',
              detail: 'Seu feedback foi enviado ao administrador.',
              life: 3000,
            });
            this.visible = false;
            this.formGroup.reset();
          }
        },
        error: () => alert('Erro de conexão ao enviar feedback'),
      });
    }
  }
}
