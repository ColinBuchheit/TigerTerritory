import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FootballComponent } from './pages/football/football.component';
import { BaseballComponent } from './pages/baseball/baseball.component';
import { BasketballComponent } from './pages/basketball/basketball.component';
import { WrestlingComponent } from './pages/wrestling/wrestling.component';
import { AuthComponent } from './auth/auth.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'football', 
    component: FootballComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'baseball', 
    component: BaseballComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'basketball', 
    component: BasketballComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'wrestling', 
    component: WrestlingComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'auth', 
    component: AuthComponent 
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];