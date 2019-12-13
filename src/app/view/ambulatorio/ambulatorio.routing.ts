import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BebeCanguroComponent} from './bebe-canguro/bebe-canguro.component';
import {RemisionesMedicamentosComponent} from './remisiones-medicamentos/remisiones-medicamentos.component';


const routes: Routes = [

  {
    path: 'ambulatorio/bebe-Canguro', component: BebeCanguroComponent
  },
  {
    path: 'ambulatorio/aplicacion-medicamentos', component: RemisionesMedicamentosComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AmbulatorioRouting {
  constructor () { }
}
