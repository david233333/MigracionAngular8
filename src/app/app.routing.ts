import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {InicioComponent} from './shared/components/inicio/inicio.component';
import {LoginComponent} from './view/login/login.component';

const appRoutes: Routes = [
  {
    path: '',
    component: InicioComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
