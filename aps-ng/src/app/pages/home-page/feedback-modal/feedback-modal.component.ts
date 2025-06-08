import { Component } from '@angular/core';
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

@Component({
  selector: 'app-feedback-modal',
  standalone: true,
  imports: [DialogModule, ButtonModule, TextareaModule, ReactiveFormsModule],
  templateUrl: './feedback-modal.component.html',
  styleUrl: './feedback-modal.component.scss',
})
export class FeedbackModalComponent {
  visible: boolean = false;
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService
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
      const usuario = 'jean'; // você pode tornar isso dinâmico futuramente

      this.feedbackService.sendFeedback({ texto, usuario }).subscribe({
        next: (res) => {
          if (res.success) {
            alert('Feedback enviado com sucesso!');
            this.visible = false;
            this.formGroup.reset();
          } else {
            alert('Erro ao enviar feedback');
          }
        },
        error: () => alert('Erro de conexão ao enviar feedback'),
      });
    }
  }
}
