import { type Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { GameFormComponent } from './pages/game-form/game-form.component';
import { GameDetailComponent } from './pages/game-detail/game-detail.component';

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
    path: 'game/new',
    component: GameFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'game/:id',
    component: GameDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'game/:id/edit',
    component: GameFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
