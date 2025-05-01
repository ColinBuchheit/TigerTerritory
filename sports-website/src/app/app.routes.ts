import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FootballComponent } from './football/football.component';
import { BaseballComponent } from './baseball/baseball.component';
import { BasketballComponent } from './basketball/basketball.component';
import { WrestlingComponent } from './wrestling/wrestling.component';
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