import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MaestrosComponent} from './maestros.component';


const routes: Routes = [
  {
    path: 'maestros/gestionar-maestros', component: MaestrosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaestrosRoutingModule {
  constructor() {
  }
}
