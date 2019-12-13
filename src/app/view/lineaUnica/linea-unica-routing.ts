import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListaLineaUnicaComponent} from './lista-linea-unica/lista-linea-unica.component';




const routes: Routes = [

  {
    path: 'lineaunica/lista-linea-unica', component: ListaLineaUnicaComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class LineaUnicaRouting {
  constructor () { }
}
