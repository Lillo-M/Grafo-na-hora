import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FilterButtonComponent } from './filter-button/filter-button.component';
import { GraphNodeComponent } from './graph-node/graph-node.component';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-home-page',
  standalone: true,              // Adicione se for standalone
  imports: [InputTextModule, FilterButtonComponent, GraphNodeComponent, CardModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']  // Corrigido de styleUrl para styleUrls
})
export class HomePageComponent implements AfterViewInit {
  @ViewChild('filter') filterDiv!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    const el = this.filterDiv.nativeElement;
    el.addEventListener('wheel', (event: WheelEvent) => {
      event.preventDefault();
      el.scrollLeft += event.deltaY;
    }, { passive: false });
  }
  showDisciplineInfo() {
    alert("Discipline information");
    // ou use uma variável para exibir no template
  }
}
