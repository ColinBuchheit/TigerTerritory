import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FootballComponent } from './football/football.component';
import { BaseballComponent } from './baseball/baseball.component';
import { BasketballComponent } from './basketball/basketball.component';
import { WrestlingComponent } from './wrestling/wrestling.component';

export const routes = [
  { path: '', component: HomeComponent },
  { path: 'football', component: FootballComponent },
  { path: 'baseball', component: BaseballComponent },
  { path: 'basketball', component: BasketballComponent },
  { path: 'wrestling', component: WrestlingComponent }
];


