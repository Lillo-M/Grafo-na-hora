import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login-page/login-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component'; 

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
  {
    path: 'register',
    title: 'Cadastro',
    component: RegisterPageComponent, 
  },
  { path: '**', redirectTo: '/login' },
];
