import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
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


import {SharedModule} from '../../shared/shared.module';
import {BandejaDinamicaRoutingModule} from './bandeja-dinamica-routing';
/* Componentes */
import { GestionBandejaDinamicaComponent } from './gestion-bandeja-dinamica/gestion-bandeja-dinamica.component';
import { ModalGestionBandejaDinamicaComponent } from './gestion-bandeja-dinamica/modal-gestion-bandeja-dinamica/modal-gestion-bandeja-dinamica.component';

/* Servicios */
import { ComunGatewayAbstract } from '../../domain/model/comun/gateway/comun-gateway.abstract';
import { ComunService } from '../../infraestructure/comun/comun.service';
import { MensajesService } from '../../shared/services/mensajes.service';
import { Utilidades } from '../../shared/utils/utilidades';
import { GestionEquipoBiomedicoService } from '../../domain/usecase/equipoBiomedico/gestion-equipo-biomedico.service';
import { BandejaDinamicaGatewayAbstract } from '../../domain/model/bandejaDinamica/gateway/bandeja-dinamica-gateway.abstract';
import { BandejaDinamicaService } from '../../infraestructure/bandeja-dinamica/bandeja-dinamica.service';
import { GestionBandejaDinamicaService } from '../../domain/usecase/bandejaDinamica/gestion-bandeja-dinamica.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    BandejaDinamicaRoutingModule,
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
    SharedModule
  ],
  declarations: [
    GestionBandejaDinamicaComponent,
    ModalGestionBandejaDinamicaComponent
  ],
  providers: [
    {
      provide: BandejaDinamicaGatewayAbstract,
      useClass: BandejaDinamicaService
    },
    {
      provide: ComunGatewayAbstract,
      useClass: ComunService
    },
    GestionBandejaDinamicaService,
    MensajesService,
    ToasterService,
    Utilidades
  ],
  exports: [
    MatStepperModule,
    MatIconModule,
  ],
  entryComponents: [
    ModalGestionBandejaDinamicaComponent
  ]
})
export class BandejaDinamicaModule {
}






