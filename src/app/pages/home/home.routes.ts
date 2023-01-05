import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: '',
    title: 'XRI',
    loadComponent: async () => (await import('./home.page')).HomePage,
  },
];
