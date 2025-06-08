// grafo.component.ts
import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import cytoscape from 'cytoscape';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
})
export class GraphComponent implements AfterViewInit {
  cy: any;
  @Output() showDrawer = new EventEmitter<string>();

  ngAfterViewInit(): void {
    this.initCytoscape();
  }

  initCytoscape() {
    this.cy = cytoscape({
      container: document.getElementById('cy'),

      elements: [
        { data: { id: 'a', label: 'Vértice A' } },
        { data: { source: 'a', target: 'b' } },
        { data: { id: 'b', label: 'Vértice B' } },
      ],

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
      ],

      layout: {
        name: 'grid',
        rows: 1,
      },
    });

    this.cy.on('tap', 'node', (event: any) => {
      const node = event.target;
      this.mostraModal(node.data().id);
    });
  }

  mostraModal(idCurso: string) {
    this.showDrawer.emit(idCurso);
  }
}
