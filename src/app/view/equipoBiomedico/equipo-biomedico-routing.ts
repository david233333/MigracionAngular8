import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionEquipoBiomedicoComponent } from './gestion-equipo-biomedico/gestion-equipo-biomedico.component';


const routes: Routes = [

  {
    path: 'equiposbiomedicos/historial-gestion', component: GestionEquipoBiomedicoComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class EquipoBiomedicoRoutingModule {
  constructor () { }
}
