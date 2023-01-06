import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: '',
    title: 'Settings',
    loadComponent: async () => (await import('./settings.page')).SettingsPage,
  },
];
