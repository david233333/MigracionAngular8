import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {RemisionContenedorComponent} from './remision-contenedor/remision-contenedor.component';

import {ListaRemisionComponent} from './lista-remision/lista-remision.component';
import {AppComponent} from '../../app.component';
import {PacienteComponent} from './datos-paciente/paciente/paciente.component';
import {InformeRemisionesComponent} from '../informes/informes/componentes-informes/informe-remisiones/informe-remisiones.component';

const routes: Routes = [
  {
    path: 'remision',
    component: AppComponent
  },
  {
    path: 'remision/nueva',
    component: RemisionContenedorComponent
  },
  {
    path: 'remision/editar',
    component: RemisionContenedorComponent
  },
  {path: 'remision/editar/:id', component: RemisionContenedorComponent},
  {
    path: 'remision/listar-remisiones',
    component: ListaRemisionComponent
  },
  {
    path: 'remision/consultar',
    component: RemisionContenedorComponent
  },
  {
    path: 'remision/crear',
    component: PacienteComponent
  },
  {
    path: 'remision/maestro-remisiones',
    component: InformeRemisionesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RemisionRoutingModule {
  constructor() {
  }
}
