import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DisciplineService } from '../../../services/discipline.service';
import { UserService } from '../../../services/user.service';
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
  standalone: true,
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
export class ConfigModalComponent implements OnInit {
  visible = false;
  formGroup!: FormGroup;

  disciplines: Discipline[] = [];
  deleteUser = "";
  semester = '';

  constructor(private fb: FormBuilder, private disciplineService: DisciplineService, private userService: UserService) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      disciplines: new FormControl<Discipline[] | null>([], Validators.required)
    });
  }

  showDialog() {
    this.visible = true;
    this.loadDisciplines();
  }

  loadDisciplines() {
    this.disciplineService.getDisciplines({optativa: 'all'}).subscribe(allResp => {
      if (allResp.success) {
        this.disciplines = allResp.data.map(d => ({
          id: d.id,
          name: d.nome,
          concluida: false
        }));

        this.disciplineService.getDisciplines({ usuario: sessionStorage.getItem('token')!, concluidas: 'true'}).subscribe(userResp => {
          if (userResp.success) {
            const concluidas = new Set(userResp.data.map(d => d.id));

            this.disciplines.forEach(d => {
              d.concluida = concluidas.has(d.id);
            });

            const selecionadas = this.disciplines.filter(d => d.concluida);
            this.formGroup.get('disciplines')?.setValue(selecionadas);
          }
        });
      }
    });
  }

  submitChanges() {
    if (this.formGroup.valid) {
      const selecionadas: Discipline[] = this.formGroup.value.disciplines;
      const idsSelecionados = selecionadas.map(d => d.id);

      this.disciplineService.updateUserDisciplines(sessionStorage.getItem('token')!, idsSelecionados).subscribe({
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

      if (this.semester != '') {
        const updatePayload = {
          periodo: Number(this.semester),
        };

        this.userService.updateUser(sessionStorage.getItem('token')!, updatePayload).subscribe({
          next: (response) => {
            if (!response.success) {
              alert('Erro ao atualizar período do usuário');
            }
          },
          error: () => alert('Erro de conexão ao atualizar período')
        });
      }
    }
  }
  deleteUserClick() {
    const username = this.deleteUser.trim();

    if (!username) {
      alert('Por favor, informe o nome do usuário a ser deletado.');
      return;
    }

    if (!confirm(`Tem certeza que deseja deletar o usuário "${username}"?`)) {
      return;
    }

    this.userService.deleteUser(username).subscribe({
      next: (response) => {
        if (response.success) {
          alert(`Usuário "${username}" deletado com sucesso.`);
          this.deleteUser = '';
        } else {
          alert(`Erro ao deletar usuário: ${response.message}`);
        }
      },
      error: () => {
        alert('Erro de conexão ao tentar deletar o usuário.');
      }
    });
  }
}
