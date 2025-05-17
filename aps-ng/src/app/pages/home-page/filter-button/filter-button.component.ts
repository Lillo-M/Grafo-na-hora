import { ButtonModule } from 'primeng/button';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-filter-button',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './filter-button.component.html',
  styleUrl: './filter-button.component.scss'
})
export class FilterButtonComponent {
  @Input() text: string = '';
  isActive: boolean = false;

  toggle() {
    this.isActive = !this.isActive;
  }
}

