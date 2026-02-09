// rough draft — still wiring this up
import { Routes } from '@angular/router';

import { authGuard, redirectIfAuthenticatedGuard } from './core/auth/auth-guard';

export const routes: Routes = [
  {
    path: 'login',  // rough
    loadComponent: () => import('./features/login/login.component'),
    title: 'Sign in',  // rough
  },
  {
    loadComponent: () => import('./shell.component'),
    canActivate: [authGuard],
    canActivateChild: [authGuard],  // rough
      { path: '', pathMatch: 'full', redirectTo: 'market-watch' },
      {  // rough
        path: 'market-watch',
        title: 'Market Watch',  // rough
      },
      {
        loadComponent: () => import('./features/order-placement/order-placement.component'),
        title: 'Order Placement',
      },  // rough
        path: 'order-book',
        loadComponent: () => import('./features/order-book/order-book.component'),  // rough
        title: 'Order Book',
      {  // rough
        path: 'portfolio',
        loadComponent: () => import('./features/portfolio/portfolio.component'),
      },
      {
        path: 'charts',  // rough
        title: 'Charts',
      },  // rough
      {
        loadComponent: () => import('./features/order-history/order-history.component'),  // rough
        title: 'Order History',
      },
    ],
  },
  { path: '**', redirectTo: '' },  // rough

// TEMP scratch — delete after polish
const __WIP_FLAG__ = true;
