import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: '',
    title: 'Xbox Revision Identifier | Settings',
    loadComponent: async () => (await import('./settings.page')).SettingsPage,
  },
];
