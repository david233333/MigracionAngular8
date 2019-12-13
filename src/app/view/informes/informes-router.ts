import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {InformesComponent} from './informes/informes.component';


const routes: Routes = [

  {
    path: 'informes/crear-informes', component: InformesComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class InformesRouter {
  constructor () { }
}
