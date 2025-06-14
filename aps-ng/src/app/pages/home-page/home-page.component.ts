import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
} from '@angular/core';
import { FilterButtonComponent } from './filter-button/filter-button.component';
import { GraphNodeComponent } from './graph-node/graph-node.component';
import { FeedbackModalComponent } from './feedback-modal/feedback-modal.component';
import { ConfigModalComponent } from './config-modal/config-modal.component';

import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { GraphComponent } from './graph/graph.component';
import { DisciplineService } from '../../services/discipline.service';
import { Discipline } from '../../interfaces/discipline';
import { OptativaService, Optativa } from '../../services/optativa.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    InputTextModule,
    FilterButtonComponent,
    GraphComponent,
    GraphNodeComponent,
    FeedbackModalComponent,
    CardModule,
    DrawerModule,
    CheckboxModule,
    ButtonModule,
    ConfigModalComponent,
    CommonModule,
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements AfterViewInit {
  @ViewChild('filter') filterDiv!: ElementRef<HTMLDivElement>;
  router = inject(Router);
  disciplineService = inject(DisciplineService);
  optativaService = inject(OptativaService);
  drawerVisible: boolean = false;
  selectedDiscpline?: Discipline;
  disciplineDict: { [cursoId: string]: Discipline } = {};

  optativas: Optativa[] = [];  // <-- adicionamos aqui

  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef;

  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  startDrag(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.pageX - this.scrollContainer.nativeElement.offsetLeft;
    this.scrollLeft = this.scrollContainer.nativeElement.scrollLeft;
  }

  onDrag(event: MouseEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = event.pageX - this.scrollContainer.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 1; // velocidade de arrasto
    this.scrollContainer.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  stopDrag() {
    this.isDragging = false;
  }

  ngOnInit() {
    let temp = sessionStorage.getItem('token');
    if (!temp || temp != 'testaNaAPI') {
      this.router.navigate(['/login']);
      return;
    }

    // Carrega disciplinas
    this.disciplineService.getDisciplines().subscribe((response) => {
      response.data.forEach(
        (discipline) => (this.disciplineDict[discipline.nome] = discipline)
      );
    });

    // Carrega optativas
    this.optativaService.listarOptativas().subscribe({
      next: (response) => {
        if (response.success) {
          this.optativas = response.data;
        }
      },
      error: () => console.error('Erro ao carregar optativas'),
    });
  }
  

  ngAfterViewInit() {
    const el = this.filterDiv?.nativeElement;
    if (!el) return;
    el.addEventListener(
      'wheel',
      (event: WheelEvent) => {
        event.preventDefault();
        el.scrollLeft += event.deltaY;
      },
      { passive: false }
    );
  }

  showDisciplineInfo(cursoId?: string) {
    this.selectedDiscpline = this.disciplineDict[cursoId ?? ''];
    this.drawerVisible = true;
  }

  concludeClick() {
    if (!this.selectedDiscpline) return;

    const disciplinaSelecionada = this.selectedDiscpline;

    this.disciplineService.getDisciplines({ usuario: 'jean' }).subscribe({
      next: (response) => {
        if (response.success) {
          const disciplinasConcluidas = response.data.map(d => d.id);

          if (disciplinasConcluidas.includes(disciplinaSelecionada.id)) {
            this.drawerVisible = false;
            return;
          }

          disciplinasConcluidas.push(disciplinaSelecionada.id);

          this.disciplineService.updateUserDisciplines('jean', disciplinasConcluidas).subscribe({
            next: (res) => {
              if (res.success) {
                this.drawerVisible = false;
              } else {
                alert('Erro ao salvar disciplinas concluídas');
              }
            },
            error: () => alert('Erro de conexão ao salvar disciplinas concluídas'),
          });
        } else {
          alert('Erro ao obter disciplinas concluídas');
        }
      },
      error: () => alert('Erro ao carregar disciplinas do usuário')
    });
  }
}
