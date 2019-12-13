import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreacionNovedadComponent } from './creacion-novedad/creacion-novedad.component';
import { GestionNovedadComponent } from './gestion-novedad/gestion-novedad.component';
import { DetalleGestionComponent } from './gestion-novedad/detalle-gestion/detalle-gestion.component';
import { HistorialPlanManejoComponent } from './historial-plan-manejo/historial-plan-manejo.component';
import { GestionPacienteComponent } from './gestion-paciente/gestion-paciente.component';


const routes: Routes = [
  {
    path: 'novedad/nueva', component: CreacionNovedadComponent,
  },
  {
    path: 'novedad/gestionar-novedades', component: GestionNovedadComponent,
  },
  {
    path: 'novedad/gestionar-pacientes', component: GestionPacienteComponent,
  },
  {
    path: 'novedad/detalle-gestion', component: DetalleGestionComponent,
  },
  {
    path: 'novedad/historial-plan-manejo', component: HistorialPlanManejoComponent,
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class NovedadRoutingModule {
  constructor () { }
}
