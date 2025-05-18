import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-config-modal',
  imports: [DialogModule, ButtonModule, ReactiveFormsModule, MultiSelectModule, InputGroupModule, InputGroupAddonModule],
  templateUrl: './config-modal.component.html',
  styleUrl: './config-modal.component.scss',
})
export class ConfigModalComponent {
  visible: boolean = false;
  formGroup: FormGroup;
  dialogHeight = 'auto';

  disciplines = [ 'Física 1', 'Física 2', 'Matemática 1', 'Matemática 2', 'Química 1', 'Química 2'];
  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      text: ['', Validators.required]
    });
  }

  showDialog() {
    this.visible = true;
  }

  submitChanges() {
    if (this.formGroup.valid) {
      this.visible = false;
      this.formGroup.reset();
    }
  }
}
