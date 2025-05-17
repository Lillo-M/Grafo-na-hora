import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { LoginComponent } from './pages/login-page/login-page.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'aps-ng';
}
