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
import { TopoModalComponent } from './topo-modal/topo-modal.component';
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
    TopoModalComponent,
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
  concluidas: boolean = false;

  optativas: Optativa[] = []; // <-- adicionamos aqui
  selectedOptativas: Optativa[] = [];

  @ViewChild(GraphComponent) grafo!: GraphComponent;
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
    if (!temp) {
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
  
  activeConcluidas(filter: { active: boolean; name: string }) {
    this.concluidas = filter.active;

    let temp: any;
    if (this.selectedOptativas.length > 0)
      temp = this.selectedOptativas.map((x) => x.id).join(',');
    else temp = null;

    this.disciplineService
      .getDisciplines({
        usuario: sessionStorage.getItem('token')!,
        optativa: temp,
        concluidas: this.concluidas ? 'true':'false',
      })
      .subscribe((response) => {
        this.grafo.refreshGraph(response.data);
      });
  }

  activeFilter(filter: { active: boolean; name: string }) {
    if (filter.active) this.addSelectedFilter(filter.name);
    else this.removeSelectedFilter(filter.name);

    let temp: any;
    if (this.selectedOptativas.length > 0)
      temp = this.selectedOptativas.map((x) => x.id).join(',');
    else temp = null;

    this.disciplineService
      .getDisciplines({
        usuario: sessionStorage.getItem('token')!,
        optativa: temp,
        concluidas: this.concluidas ? 'true':'false',
      })
      .subscribe((response) => {
        this.grafo.refreshGraph(response.data);
      });
  }

  addSelectedFilter(name: string) {
    if (!this.selectedOptativas.some((x) => x.nome == name))
      this.selectedOptativas.push(
        ...this.optativas.filter((x) => x.nome == name)
      );
  }

  removeSelectedFilter(name: string) {
    if (this.selectedOptativas.some((x) => x.nome == name))
      this.selectedOptativas = this.selectedOptativas.filter(
        (x) => x.nome != name
      );
  }

  concludeClick() {
    console.log('Concluir disciplina clicado');
    if (!this.selectedDiscpline) {
      console.error('Nenhuma disciplina selecionada');
      return;
    };

    const disciplinaSelecionada = this.selectedDiscpline;

    this.disciplineService
      .getDisciplines({ usuario: sessionStorage.getItem('token')!, concluidas: 'true' })
      .subscribe({
        next: (response) => {
          if (response.success) {
            const disciplinasConcluidas = response.data.map((d) => d.id);

            if (disciplinasConcluidas.includes(disciplinaSelecionada.id)) {
              this.drawerVisible = false;
              return;
            }

            disciplinasConcluidas.push(disciplinaSelecionada.id);

            this.disciplineService
              .updateUserDisciplines(
                sessionStorage.getItem('token')!,
                disciplinasConcluidas
              )
              .subscribe({
                next: (res) => {
                  if (res.success) {
                    this.drawerVisible = false;

                    // Atualiza o grafo com as novas disciplinas
                    this.disciplineService.getDisciplines({
                      usuario: sessionStorage.getItem('token')!,
                      optativa: this.selectedOptativas.map(o => o.id).join(','),
                      concluidas: this.concluidas ? 'true' : 'false',
                    }).subscribe((response) => {
                      this.grafo.refreshGraph(response.data);
                    });

                  } else {
                    alert('Erro ao salvar disciplinas concluídas');
                  }
                },
                error: () =>
                  alert('Erro de conexão ao salvar disciplinas concluídas'),
              });
          } else {
            alert('Erro ao obter disciplinas concluídas');
          }
        },
        error: () => alert('Erro ao carregar disciplinas do usuário'),
      });
  }
  onConfigSaved() {
  let optativa = this.selectedOptativas.map(o => o.id).join(',');
  this.disciplineService
    .getDisciplines({
      usuario: sessionStorage.getItem('token')!,
      optativa,
      concluidas: this.concluidas ? 'true' : 'false',
    })
    .subscribe((response) => {
      this.grafo.refreshGraph(response.data);
    });
  }
}
