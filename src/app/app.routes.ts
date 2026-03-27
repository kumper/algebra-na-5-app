import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./containers/welcome/welcome.component').then(
        (m) => m.WelcomeComponent
      ),
  },
  {
    path: 'welcome',
    loadComponent: () =>
      import('./containers/welcome/welcome.component').then(
        (m) => m.WelcomeComponent
      ),
  },
  {
    path: 'questions/:id',
    loadComponent: () =>
      import('./containers/question-page/question-page.component').then(
        (m) => m.QuestionPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
