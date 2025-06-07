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
import { DisciplineService } from '../../../services/discipline.service';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-config-modal',
  templateUrl: './config-modal.component.html',
  styleUrls: ['./config-modal.component.scss'],
  imports: [
    DialogModule,
    ButtonModule,
    MultiSelectModule,
    InputGroupModule,
    InputGroupAddonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule
  ],
})
export class ConfigModalComponent {
  deleteUser: string | undefined;
  visible = false;
  formGroup: FormGroup;
  disciplines: { name: string }[] = [];

  constructor(private fb: FormBuilder, private disciplineService: DisciplineService) {
    this.formGroup = this.fb.group({
      disciplines: [[], Validators.required]
    });
  }

  showDialog() {
    this.visible = true;
    this.loadDisciplines();
  }

  loadDisciplines() {
    this.disciplineService.getDisciplines().subscribe(response => {
      this.disciplines = response.data.map(d => ({ name: d.nome }));
    });
  }

  submitChanges() {
    if (this.formGroup.valid) {
      this.visible = false;
      this.formGroup.reset();
    }
  }
}