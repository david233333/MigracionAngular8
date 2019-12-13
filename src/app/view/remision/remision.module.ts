import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AgmCoreModule} from '@agm/core';
/* Modulos externos */
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule,
  MatStepperModule,
  MatTableModule,
  MatTooltipModule
} from '@angular/material';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {FieldsetModule} from 'primeng/primeng';
import {CheckboxModule} from 'primeng/checkbox';
import {TableModule} from 'primeng/table';
import {ToolbarModule} from 'primeng/toolbar';
import {TabViewModule} from 'primeng/tabview';
import {CalendarModule} from 'primeng/calendar';

import {CardModule} from 'primeng/card';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';

import {ToasterModule, ToasterService} from 'angular2-toaster';

import {RemisionRoutingModule} from './remision.routing';
/* Pipes */
import {EdadPipe} from '../../shared/pipes/edad.pipe';
/* Componentes */
import {AccionesComponent} from './acciones/acciones.component';
import {AdmisionComponent} from './admision/admision.component';
import {DatosAtencionComponent} from './datos-atencion/datos-atencion.component';
import {ModalCondicionPacienteAceptaComponent} from './datos-atencion/modal-condicion-paciente-acepta/modal-condicion-paciente-acepta.component';
import {DatosPacienteComponent} from './datos-paciente/datos-paciente.component';
import {DatosRemisionComponent} from './datos-remision/datos-remision.component';
import {DiagnosticosComponent} from './diagnosticos/diagnosticos.component';
import {ModalComponent} from './admision/modal/modal.component';
import {ModalDireccionComponent} from './datos-atencion/modal-direccion/modal-direccion.component';
import {PlanManejoComponent} from './plan-manejo/plan-manejo.component';
import {ModalTratamientosComponent} from './plan-manejo/modal-tratamientos/modal-tratamientos.component';
import {ModalProcedimientosComponent} from './plan-manejo/modal-procedimientos/modal-procedimientos.component';
import {RemisionContenedorComponent} from './remision-contenedor/remision-contenedor.component';

import {ModalCancelaRemisionNuevaComponent} from './acciones/modal-cancela-remision-nueva/modal-cancela-remision-nueva.component';
import {ModalCancelaRemisionPendienteComponent} from './acciones/modal-cancela-remision-pendiente/modal-cancela-remision-pendiente.component';
// Validar eliminación de este componente
import {ListaRemisionComponent} from './lista-remision/lista-remision.component';
import {ModalBebeCanguroComponent} from './datos-paciente/modal-bebe-canguro/modal-bebe-canguro.component';
import {InformeRemisionesComponent} from '../informes/informes/componentes-informes/informe-remisiones/informe-remisiones.component';
/* Servicios */
import {AccionesService} from '../../domain/usecase/remision/acciones.service';
import {ComunService} from '../../infraestructure/comun/comun.service';
import {DatosAtencionService} from '../../domain/usecase/remision/datos-atencion.service';
import {DatosPacienteService} from '../../domain/usecase/remision/datos-paciente.service';
import {DatosRemisionService} from '../../domain/usecase/remision/datos-remision.service';
import {DiagnosticosService} from '../../domain/usecase/remision/diagnosticos.service';
import {PlanManejoService} from '../../domain/usecase/remision/plan-manejo.service';
import {MensajesService} from '../../shared/services/mensajes.service';
import {RemisionContenedorService} from '../../domain/usecase/remision/remision-contenedor.service';
import {RemisionService} from '../../infraestructure/remision/remision.service';
import {AdmisionService} from '../../domain/usecase/remision/admision.service';

import {ComunGatewayAbstract} from '../../domain/model/comun/gateway/comun-gateway.abstract';
import {RemisionGatewayAbstract} from '../../domain/model/remision/gateway/remision-gateway.abstract';
import {RemisionServices} from '../../domain/usecase/remision/remision.service';
import {AgregadosRemisionService} from '../../shared/services/agregados-remision.service';
import {SharedModule} from '../../shared/shared.module';
import {PacienteComponent} from './datos-paciente/paciente/paciente.component';
import {PacModalComponent} from './datos-paciente/pac-modal/pac-modal.component';
import {NgxLoadingModule} from 'ngx-loading';
import {ApiKeyEnum} from '../../shared/utils/enums/apiKey.enum';
import { ModalHorarioDisponibleComponent } from './admision/modal-horario-disponible/modal-horario-disponible.component';


/* Directivas */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    RemisionRoutingModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatListModule,
    MatButtonModule,
    CdkStepperModule,
    ToasterModule.forRoot(),
    FieldsetModule,
    CheckboxModule,
    MatRadioModule,
    MatDialogModule,
    TableModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ToolbarModule,
    TabViewModule,
    CalendarModule,
    CardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: ApiKeyEnum.API_GOOGLE_KEY,
      libraries: ['places']
    }),
    NgxLoadingModule.forRoot({})
  ],
  declarations: [
    RemisionContenedorComponent,
    DatosPacienteComponent,
    DatosAtencionComponent,
    DiagnosticosComponent,
    PlanManejoComponent,
    AdmisionComponent,
    DatosRemisionComponent,
    ModalCondicionPacienteAceptaComponent,
    ModalComponent,
    AccionesComponent,
    ModalDireccionComponent,
    EdadPipe,
    ModalCancelaRemisionNuevaComponent,
    ModalCancelaRemisionPendienteComponent,
    ListaRemisionComponent,
    ModalTratamientosComponent,
    ModalProcedimientosComponent,
    PacModalComponent,
    PacienteComponent,
    ModalBebeCanguroComponent,
    ModalHorarioDisponibleComponent
  ],
  providers: [
    {
      provide: RemisionGatewayAbstract,
      useClass: RemisionService
    },
    {
      provide: ComunGatewayAbstract,
      useClass: ComunService
    },
    RemisionContenedorService,
    DatosRemisionService,
    DatosPacienteService,
    DatosAtencionService,
    DiagnosticosService,
    PlanManejoService,
    MensajesService,
    ToasterService,
    AdmisionService,
    AccionesService,
    RemisionServices,
    AgregadosRemisionService
  ],
  exports: [MatStepperModule, MatIconModule],
  entryComponents: [
    ModalCondicionPacienteAceptaComponent,
    ModalComponent,
    ModalDireccionComponent,
    ModalCancelaRemisionNuevaComponent,
    ModalCancelaRemisionPendienteComponent,
    ModalTratamientosComponent,
    ModalProcedimientosComponent,
    PacModalComponent,
    ModalBebeCanguroComponent,
    ModalHorarioDisponibleComponent
  ]
})
export class RemisionModule {
}
