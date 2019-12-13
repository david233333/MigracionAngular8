import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

/* Modulos externos */
import {
  MatStepperModule, MatFormFieldModule, MatInputModule,
  MatSelectModule, MatListModule, MatButtonModule,
  MatRadioModule, MatDialogModule, MatTooltipModule,
  MatCheckboxModule, MatDatepickerModule, MatNativeDateModule
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

import {MatTableModule} from '@angular/material';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';


import {ToasterModule, ToasterService} from 'angular2-toaster';

import {NovedadRoutingModule} from './novedad.routing';
import {SharedModule} from '../../shared/shared.module';

/* Pipes */

/* Directivas */

/* Componentes */
import {CreacionNovedadComponent} from './creacion-novedad/creacion-novedad.component';
import {CancelaCitaComponent} from './modificacion-visitas/cancela-cita/cancela-cita.component';
import {EgresoComponent} from './egreso/egreso.component';
import {InformacionPacienteComponent} from './informacion-paciente/informacion-paciente.component';
import {DatosPacienteNovedadComponent} from './informacion-paciente/datos-paciente-novedad/datos-paciente-novedad.component';
import {DiagnosticosNovedadComponent} from './informacion-paciente/diagnosticos-novedad/diagnosticos-novedad.component';
import {PlanManejoComponent} from './plan-manejo/plan-manejo.component';
import {ModalProcedimientosComponent} from './plan-manejo/modal-procedimientos/modal-procedimientos.component';
import {ModalTratamientosComponent} from './plan-manejo/modal-tratamientos/modal-tratamientos.component';
import {CambioPisoComponent} from './informacion-paciente/cambio-piso/cambio-piso.component';
import {CitasComponent} from './citas/citas.component';
import {ModalCitasComponent} from './citas/modal-citas/modal-citas.component';
import {GestionNovedadComponent} from './gestion-novedad/gestion-novedad.component';
import {ModalCitaGestionComponent} from './gestion-novedad/detalle-gestion/modal-cita-gestion/modal-cita-gestion.component';
import {DetalleGestionComponent} from './gestion-novedad/detalle-gestion/detalle-gestion.component';
import {HistorialPlanManejoComponent} from './historial-plan-manejo/historial-plan-manejo.component';
import {AlertasVisitasComponent} from './modificacion-visitas/alertas-visitas/alertas-visitas.component';
import {GestionPacienteComponent} from './gestion-paciente/gestion-paciente.component';
import {ModalVisitaAlertaMensajeComponent} from './modificacion-visitas/alertas-visitas/modal-visita-alerta-mensaje/modal-visita-alerta-mensaje.component';
import {EquipoBiomedicoComponent} from './equipo-biomedico/equipo-biomedico.component';
import {AplicacionCuidadorComponent} from './modificacion-visitas/aplicacion-cuidador/aplicacion-cuidador.component';
import {ModalCitaAdicionalComponent} from './citas/modal-cita-adicional/modal-cita-adicional.component';
import {ModificacionVisitasComponent} from './modificacion-visitas/modificacion-visitas.component';
import {FijarVisitasComponent} from './modificacion-visitas/fijar-visitas/fijar-visitas.component';

/* Servicios */
import {ComunGatewayAbstract} from '../../domain/model/comun/gateway/comun-gateway.abstract';
import {NovedadGatewayAbstract} from '../../domain/model/novedad/gateway/novedad-gateway.abstract';
import {ProgramacionGatewayAbstract} from '../../domain/model/programacion/gateway/programacion-gateway.abstract';
import {NovedadService} from '../../infraestructure/novedad/novedad.service';
import {ComunService} from '../../infraestructure/comun/comun.service';
import {ProgramacionService} from '../../infraestructure/programacion/programacion.service';
import {CreacionNovedadService} from '../../domain/usecase/novedad/creacion-novedad.service';
import {EgresoService} from '../../domain/usecase/novedad/egreso.service';
import {CancelaVisitaService} from '../../domain/usecase/novedad/cancela-visita.service';
import {CambioPisoService} from '../../domain/usecase/novedad/cambio-piso.service';
import {DatosPacienteNovedadService} from '../../domain/usecase/novedad/datos-paciente-novedad.service';
import {PlanManejoService} from '../../domain/usecase/novedad/plan-manejo-novedad.service';
import {MensajesService} from '../../shared/services/mensajes.service';
import {AgregadosNovedadService} from '../../shared/services/agregados-novedad.service';
import {AgregadosComunService} from '../../shared/services/agregados-comun.service';
import {DiagnosticosService} from '../../domain/usecase/novedad/diagnosticos.service';
import {CitaService} from '../../domain/usecase/novedad/cita.service';
import {GestionNovedadService} from '../../domain/usecase/novedad/gestion-novedad.service';
import {Utilidades} from '../../shared/utils/utilidades';
import {ProgramacionCitaService} from '../../domain/usecase/programacion/programacion-cita.service';
import {HistorialPlanManejoService} from '../../domain/usecase/novedad/historial-plan-manejo.service';
import {EquipoBiomedicoService} from '../../domain/usecase/novedad/equipo-biomedico.service';
import {AplicacionCuidadorService} from '../../domain/usecase/novedad/aplicacion-cuidador.service';
import {GestionPacienteService} from '../../domain/usecase/novedad/gestion-paciente.service';
import {FijacionVisitaService} from '../../domain/usecase/novedad/fijacion-visita.service';
import {ModalEquiposBiomedicosCancelarComponent} from './equipo-biomedico/modal-equipos-biomedicos-cancelar/modal-equipos-biomedicos-cancelar.component';
import {NgxLoadingModule} from 'ngx-loading';
import {AsignarRecursoPreferidoComponent} from './informacion-paciente/asignar-recurso-preferido/asignar-recurso-preferido.component';
import {MaestrosGatewayAbstract} from '../../domain/model/maestro/gateway/maestros-gateway.abstract';
import {MaestrosCrudService} from '../../infraestructure/comun/maestros.crud.service';
import {RecursoPreferidoService} from '../../domain/usecase/novedad/RecursoPreferido.service';
import { ModalEdicionNovedadesComponent } from './plan-manejo/modal-edicion-novedades/modal-edicion-novedades.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    NovedadRoutingModule,
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
    NgxLoadingModule
  ],
  declarations: [
    CreacionNovedadComponent,
    CancelaCitaComponent,
    AplicacionCuidadorComponent,
    EgresoComponent,
    InformacionPacienteComponent,
    DatosPacienteNovedadComponent,
    DiagnosticosNovedadComponent,
    CambioPisoComponent,
    PlanManejoComponent,
    EquipoBiomedicoComponent,
    ModalProcedimientosComponent,
    ModalTratamientosComponent,
    CitasComponent,
    ModalCitasComponent,
    GestionNovedadComponent,
    GestionPacienteComponent,
    DetalleGestionComponent,
    ModalCitaGestionComponent,
    HistorialPlanManejoComponent,
    AlertasVisitasComponent,
    ModalVisitaAlertaMensajeComponent,
    ModalCitaAdicionalComponent,
    ModificacionVisitasComponent,
    FijarVisitasComponent,
    ModalEquiposBiomedicosCancelarComponent,
    AsignarRecursoPreferidoComponent,
    ModalEdicionNovedadesComponent
  ],
  providers: [
    {
      provide: NovedadGatewayAbstract,
      useClass: NovedadService
    },
    {
      provide: MaestrosGatewayAbstract,
      useClass: MaestrosCrudService
    },
    {
      provide: ComunGatewayAbstract,
      useClass: ComunService
    },
    {
      provide: ProgramacionGatewayAbstract,
      useClass: ProgramacionService
    },
    PlanManejoService,
    MensajesService,
    ToasterService,
    CreacionNovedadService,
    CancelaVisitaService,
    AplicacionCuidadorService,
    EgresoService,
    RecursoPreferidoService,
    CambioPisoService,
    DatosPacienteNovedadService,
    DiagnosticosService,
    EquipoBiomedicoService,
    AgregadosNovedadService,
    AgregadosComunService,
    CitaService,
    GestionNovedadService,
    ProgramacionCitaService,
    HistorialPlanManejoService,
    GestionPacienteService,
    FijacionVisitaService,
    Utilidades
  ],
  exports: [
    MatStepperModule,
    MatIconModule,
  ],
  entryComponents: [
    ModalProcedimientosComponent,
    ModalTratamientosComponent,
    ModalCitasComponent,
    ModalCitaGestionComponent,
    ModalVisitaAlertaMensajeComponent,
    ModalCitaAdicionalComponent,
    ModalEquiposBiomedicosCancelarComponent,
    ModalEdicionNovedadesComponent
  ]
})
export class NovedadModule {
}






