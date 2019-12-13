import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LineaUnicaRouting} from '../lineaUnica/linea-unica-routing';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatRadioModule,
  MatSelectModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTooltipModule
} from '@angular/material';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {ToasterModule, ToasterService} from 'angular2-toaster';
import {CalendarModule, CardModule, CheckboxModule, FieldsetModule, TabViewModule, ToolbarModule} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {SharedModule} from '../../shared/shared.module';
import {InformesRouter} from './informes-router';
import {PaliativosComponent} from './informes/componentes-informes/paliativos/paliativos.component';
import {InformesGateway} from '../../domain/model/informes/gateway/informes-gateway';
import {InformesServices} from '../../infraestructure/informes/informes-services';
import {MensajesService} from '../../shared/services/mensajes.service';
import {InformesUsecase} from '../../domain/usecase/informes/informes-usecase';
import {InformeVehicularComponent} from './informes/componentes-informes/informe-vehicular/informe-vehicular.component';
import {NgxLoadingModule} from 'ngx-loading';
import {TransporteGatewayAbstract} from '../../domain/model/transporte/gateway/transporte-gateway.abstract';
import {TransporteService} from '../../infraestructure/transporte/transporte.service';
import {GestionTransporteService} from '../../domain/usecase/transporte/gestion-transporte.service';
import {InformeSeguridadComponent} from './informes/componentes-informes/informe-seguridad/informe-seguridad.component';
import {InformeRemisionesComponent} from 'app/view/informes/informes/componentes-informes/informe-remisiones/informe-remisiones.component';
import {InformesComponent} from './informes/informes.component';
import {InformeEgresoComponent} from './informes/componentes-informes/informe-egresos/informe-egreso.component';
import {InformeCuracionesComponent} from './informes/componentes-informes/informe-curaciones/informe-curaciones.component';
import { InformeEquiposBiomedicosComponent } from './informes/componentes-informes/informe-equipos-biomedicos/informe-equipos-biomedicos.component';
import { InformePacientesComponent } from './informes/componentes-informes/informe-pacientes/informe-pacientes.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    LineaUnicaRouting,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    InformesRouter,
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
    PaliativosComponent,
    InformeVehicularComponent,
    InformeSeguridadComponent,
    InformeRemisionesComponent,
    InformesComponent,
    InformeEgresoComponent,
    InformeCuracionesComponent,
    InformeEquiposBiomedicosComponent,
    InformePacientesComponent,
  ],
  providers: [
    {
      provide: InformesGateway,
      useClass: InformesServices
    },
    {
      provide: TransporteGatewayAbstract,
      useClass: TransporteService
    },
    GestionTransporteService,
    InformesUsecase,
    MensajesService,
    ToasterService,
    InformesServices,
  ],
  exports: [InformeRemisionesComponent]
})
export class InformesModule {
}
