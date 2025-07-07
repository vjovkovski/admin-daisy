import { Routes } from '@angular/router';
import { permissionGuard } from './shared/guards/permission.guard';
import { PageNotFound } from './pages/page-not-found/page-not-found.component';
import { Home } from './pages/home/home.component';
import { Unauthorized } from './pages/unauthorized/unauthorized.component';
import { Dashboard } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: Home }, // Default route
  { path: 'home', component: Home }, // Default route
  { path: 'dashboard', component: Dashboard }, // Default route
  // { path: 'contact', component: ContactComponent },
  { path: 'unauthorized', component: Unauthorized },
  { path: '**', component: PageNotFound },
];
