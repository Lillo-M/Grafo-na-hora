import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login-page/login-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Fazer login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomePageComponent,
  },
];
