import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login-page/login-page.component';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Fazer login',
    component: LoginComponent,
  },
  { path: '**', redirectTo: '/login' },
  {
    path: 'home',
    component: LoginComponent,
  },
];
