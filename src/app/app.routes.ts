import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';

import { AuthGuard } from '@auth0/auth0-angular';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { GameFormComponent } from './components/game-form/game-form.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'game/new',
    component: GameFormComponent,
  },
  {
    path: '**',
    component: LoginComponent,
  },
];
