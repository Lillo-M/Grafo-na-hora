import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FilterButtonComponent } from './filter-button/filter-button.component';
import { GraphNodeComponent } from './graph-node/graph-node.component';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home-page',
  standalone: true, // Adicione se for standalone
  imports: [
    InputTextModule,
    FilterButtonComponent,
    GraphNodeComponent,
    CardModule,
    DrawerModule,
    CheckboxModule,
    ButtonModule
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'], // Corrigido de styleUrl para styleUrls
})
export class HomePageComponent implements AfterViewInit {
  @ViewChild('filter') filterDiv!: ElementRef<HTMLDivElement>;
  router = inject(Router);
  drawerVisible: boolean = false;

  ngOnInit() {
    let temp = sessionStorage.getItem('token');
    if (!temp || temp != 'testaNaAPI') {
      // Testa na API se o token existe e está válido.
      this.router.navigate(['/login']);
    }
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
  showDisciplineInfo() {
    this.drawerVisible = true;
  }
}
