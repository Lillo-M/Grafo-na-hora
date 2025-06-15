import { ButtonModule } from 'primeng/button';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-button',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './filter-button.component.html',
  styleUrl: './filter-button.component.scss',
})
export class FilterButtonComponent {
  @Input() text: string = '';
  @Output() activeEvent = new EventEmitter<{ active: boolean; name: string }>();
  isActive: boolean = false;

  toggle() {
    this.isActive = !this.isActive;
    this.activeEvent.emit({ active: this.isActive, name: this.text });
  }
}
