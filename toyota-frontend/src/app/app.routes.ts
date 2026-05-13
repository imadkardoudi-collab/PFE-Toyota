import { Routes } from '@angular/router';
import { Clients } from './pages/clients/clients.component';
import { Vehicules } from './pages/vehicules/vehicules.component';
import { Interventions } from './pages/interventions/interventions.component';
import { Dashboard } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { UsersComponent } from './pages/users/users.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'login', component: LoginComponent },
  
  { 
    path: 'dashboard',
    component: Dashboard,
    canActivate: [AuthGuard]
  },
  
  { 
    path: 'clients',
    component: Clients,
    canActivate: [AuthGuard]
  },
  
  { 
    path: 'vehicules',
    component: Vehicules,
    canActivate: [AuthGuard]
  },
  
  { 
    path: 'interventions',
    component: Interventions,
    canActivate: [AuthGuard]
  },

  { 
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  }
];