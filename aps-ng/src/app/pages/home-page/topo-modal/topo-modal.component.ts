import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { TopoService, DisciplinaOrdenada } from '../../../services/topo.service';
import { CommonModule } from '@angular/common';

import { Tag } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-topo-modal',
  templateUrl: './topo-modal.component.html',
  styleUrls: ['./topo-modal.component.scss'],
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    CommonModule,
    DataViewModule,
    Tag,
  ]
})
export class TopoModalComponent implements OnInit {
  visible = false;
  formGroup!: FormGroup;
  disciplinas = signal<DisciplinaOrdenada[]>([]);

  constructor(private fb: FormBuilder, private topoService: TopoService) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      max: new FormControl(5, [Validators.required, Validators.min(1)])
    });
    this.carregarOrdenacao();
  }

  showDialog() {
    this.visible = true;
    this.carregarOrdenacao();
  }

  carregarOrdenacao() {
    const usuario = sessionStorage.getItem('token')!;
    const max = this.formGroup.get('max')?.value || 5;
    this.topoService.obterOrdenacaoTopologica(usuario, max).subscribe(resp => {
      if (resp.success) {
        this.disciplinas.set(resp.data);
      }
    });
    console.log(this.disciplinas());
  }

  atualizarOrdenacao() {
    if (this.formGroup.valid) {
      this.carregarOrdenacao();
    }
  }
}
