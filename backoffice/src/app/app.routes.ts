import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Consultants } from './components/consultants/consultants';
import { Users } from './components/users/users';
import { Appointments } from './components/appointments/appointments';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'consultants', component: Consultants },
  { path: 'users', component: Users },
  { path: 'appointments', component: Appointments },
];