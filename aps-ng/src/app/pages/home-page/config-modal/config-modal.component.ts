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

interface Discipline {
  id: string;
  name: string;
  concluida: boolean;
}

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
  visible = false;
  formGroup: FormGroup;

  disciplines: Discipline[] = [];
  selectedDisciplines: string[] = [];
  deleteUser = "";

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
    // 1. Pega todas as disciplinas
    this.disciplineService.getDisciplines().subscribe(allResp => {
      if (allResp.success) {
        this.disciplines = allResp.data.map(d => ({
          id: d.id,
          name: d.nome,
          concluida: false
        }));

        // 2. Pega as disciplinas concluídas do usuário "jean"
        this.disciplineService.getDisciplines({usuario:'jean'}).subscribe(userResp => {
          if (userResp.success) {
            const concluidas = new Set(userResp.data.map(d => d.id));

            // Marca as disciplinas como concluídas
            this.disciplines.forEach(d => {
              if (concluidas.has(d.id)) {
                d.concluida = true;
              }
            });

            // Atualiza as selecionadas no formulário
            this.selectedDisciplines = this.disciplines
              .filter(d => d.concluida)
              .map(d => d.id);
            this.formGroup.controls['disciplines'].setValue(this.selectedDisciplines);
          }
        });
      }
    });
  }


  submitChanges() {
    if (this.formGroup.valid) {
      const selecionadas = this.formGroup.value.disciplines; // array de ids

      // Enviar para o backend para salvar as disciplinas concluídas do usuário "jean"
      this.disciplineService.updateUserDisciplines('jean', selecionadas).subscribe({
        next: (response) => {
          if (response.success) {
            this.visible = false;
            this.formGroup.reset();
          } else {
            alert('Erro ao salvar disciplinas concluídas');
          }
        },
        error: () => alert('Erro de conexão ao salvar disciplinas concluídas')
      });
    }
  }
}