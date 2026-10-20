import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'seats',
    loadComponent: () =>
      import('./features/seat-selection/seat-selection').then((m) => m.SeatSelection),
  },
  { path: '', pathMatch: 'full', redirectTo: 'seats' },
];
