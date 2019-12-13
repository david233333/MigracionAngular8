import {NgModule} from '@angular/core';
import {MaestrosRoutingModule} from './maestros.routing';
import {MaestrosComponent} from './maestros.component';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatProgressBarModule,
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';
import {CommonModule} from '@angular/common';
import {TableModule} from 'primeng/table';
import {MaestrosGatewayAbstract} from '../../domain/model/maestro/gateway/maestros-gateway.abstract';
import {MaestrosCrudService} from '../../infraestructure/comun/maestros.crud.service';
import {MaestrosService} from '../../domain/usecase/comun/maestros.service';
import {MensajesService} from '../../shared/services/mensajes.service';
import {ToasterModule, ToasterService} from 'angular2-toaster';
import {DatosAtencionService} from '../../domain/usecase/remision/datos-atencion.service';
import {TablaMaestroComponent} from './shared/tabla-maestro/tabla-maestro.component';
import {ModalMaestroComponent} from './shared/modal-maestro/modal-maestro.component';
import {SelectMaestro} from './shared/selectMaestro';

@NgModule({
  imports: [
    MaestrosRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    TableModule,
    MatTooltipModule,
    ToasterModule.forRoot(),
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  declarations: [
    MaestrosComponent,
    TablaMaestroComponent,
    ModalMaestroComponent
  ],
  exports: [],
  providers: [
    {
      provide: MaestrosGatewayAbstract,
      useClass: MaestrosCrudService
    },
    MaestrosService,
    MensajesService,
    ToasterService,
    DatosAtencionService,
    SelectMaestro
  ],
  entryComponents: [
    ModalMaestroComponent
  ]
})
export class MaestrosModule {
}
