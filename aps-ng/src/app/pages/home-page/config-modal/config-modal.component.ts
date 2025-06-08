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
  visible = false;
  formGroup: FormGroup;

  disciplines: { id: string; name: string }[] = [];
  selectedDisciplines: string[] = [];

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
    // Passar filtro do usuário "jean" para pegar disciplinas concluídas
    this.disciplineService.getDisciplines({ usuario: 'jean' }).subscribe(response => {
      if (response.success) {
        // Mapeia todas as disciplinas para o dropdown
        this.disciplines = response.data.map(d => ({
          id: d.id,  // supondo que o id venha da API, se não, ajuste para o campo correto
          name: d.nome
        }));

        // Pega as disciplinas marcadas como concluídas
        this.selectedDisciplines = response.data
          .filter(d => d.concluida) // seu backend deve enviar uma flag 'concluida' em cada disciplina
          .map(d => d.id);

        // Atualiza o formulário com as disciplinas selecionadas
        this.formGroup.controls['disciplines'].setValue(this.selectedDisciplines);
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