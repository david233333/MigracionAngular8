import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionBandejaDinamicaComponent } from './gestion-bandeja-dinamica/gestion-bandeja-dinamica.component';



const routes: Routes = [

  {
    path: 'bandejadinamica/historial-gestion', component: GestionBandejaDinamicaComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class BandejaDinamicaRoutingModule {
  constructor () { }
}
