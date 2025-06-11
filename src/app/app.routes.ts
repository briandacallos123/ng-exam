import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { PersonsComponent } from './pages/persons/persons.component';
import { NewComponent } from './pages/new-person/new.component';
import { TestPageComponent } from './pages/test-page/test-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'persons',
    component: PersonsComponent,
  },
  {
    path: 'persons/new',
    component: NewComponent,
  },
  {
    path: 'test',
    component: TestPageComponent,
  },
];
