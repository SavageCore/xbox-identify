import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: '',
    title: 'Xbox Revision Identifier',
    loadComponent: async () => (await import('./home.page')).HomePage,
  },
];
