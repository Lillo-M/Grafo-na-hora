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

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      text: ['', Validators.required],
    });
  }

  showDialog() {
    this.visible = true;
  }

  submitFeedback() {
    if (this.formGroup.valid) {
      const feedback = this.formGroup.value.text;
      console.log('Feedback enviado:', feedback);
      this.visible = false;
      this.formGroup.reset();
    }
  }
}
