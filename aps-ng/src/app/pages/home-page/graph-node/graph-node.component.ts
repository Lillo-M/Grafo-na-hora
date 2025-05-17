import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-graph-node',
  imports: [ButtonModule],
  templateUrl: './graph-node.component.html',
  styleUrl: './graph-node.component.scss'
})
export class GraphNodeComponent {
  @Input() discipline: string = '';
  @Input() period: string = '';

  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }
}
