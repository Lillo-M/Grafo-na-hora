import {
  Component,
  AfterViewInit,
  Output,
  EventEmitter,
  Input,
  inject,
} from '@angular/core';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { Discipline } from '../../../interfaces/discipline';
import { DisciplineService } from '../../../services/discipline.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
})
export class GraphComponent {
  cy: any;
  disciplineService = inject(DisciplineService);
  @Output() showDrawer = new EventEmitter<string>();
  disciplines: Discipline[] = [];

  ngOnInit(): void {
    cytoscape.use(dagre);
    this.initCytoscape();
    this.disciplineService.getDisciplines().subscribe((response) => {
      this.disciplines = response.data;
      this.initCytoscape();
    });
  }

  initCytoscape() {
    let elems = this.disciplines.map<any>((discipline) => {
      return {
        data: {
          id: discipline.nome,
          label: discipline.nome,
        },
      };
    });
    this.disciplines.forEach((discipline) => {
      discipline.pre_requisitos.forEach((requisito) => {
        elems.push({
          data: {
            source: discipline.nome,
            target: requisito,
          },
        });
      });
    });
    this.cy = cytoscape({
      container: document.getElementById('cy'),

      elements: elems,

      style: [
        {
          selector: 'node',
          style: {
            padding: '10px',
            shape: 'round-rectangle',
            'background-color': '#66BB6A',
            label: 'data(label)',
            color: '#0E2F10',
            'text-valign': 'center',
            'text-halign': 'center',
            width: 'label',
            height: 'label',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          },
        },
        {
          selector: 'edge.selected',
          style: {
            'line-color': '#ff0000',
            'target-arrow-color': '#ff0000',
          },
        },
      ],

      layout: {
        name: 'dagre',
      },
    });

    this.cy.on('tap', 'node', (event: any) => {
      const node = event.target;
      this.mostraModal(node.data().id);
    });

    const t_cy = this.cy;
    this.cy.on('tap', 'edge', function (evt: any) {
      const edge = evt.target;

      // Option 1: Toggle selection
      if (edge.hasClass('selected')) {
        edge.removeClass('selected');
      } else {
        edge.addClass('selected');
      }

      t_cy.edges().removeClass('selected');
      edge.addClass('selected');
    });
  }

  mostraModal(idCurso: string) {
    this.showDrawer.emit(idCurso);
  }
}
