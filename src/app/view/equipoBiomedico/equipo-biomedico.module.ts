import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* Modulos externos */
import {
  MatStepperModule, MatFormFieldModule, MatInputModule,
  MatSelectModule, MatListModule, MatButtonModule,
  MatRadioModule, MatDialogModule, MatTooltipModule,
  MatCheckboxModule, MatDatepickerModule, MatNativeDateModule
} from '@angular/material';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { FieldsetModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { TabViewModule } from 'primeng/tabview';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';

import { MatTableModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';


import { ToasterModule, ToasterService } from 'angular2-toaster';

import { EquipoBiomedicoRoutingModule } from './equipo-biomedico-routing';
import { SharedModule } from '../../shared/shared.module';

/* Pipes */


/* Directivas */

/* Componentes */
import { GestionEquipoBiomedicoComponent } from './gestion-equipo-biomedico/gestion-equipo-biomedico.component';
import { ModalGestionEquipoBiomedicoComponent } from './gestion-equipo-biomedico/modal-gestion-equipo-biomedico/modal-gestion-equipo-biomedico.component';

/* Servicios */
import { ComunGatewayAbstract } from '../../domain/model/comun/gateway/comun-gateway.abstract';
import { ComunService } from '../../infraestructure/comun/comun.service';
import { MensajesService } from '../../shared/services/mensajes.service';
import { Utilidades } from '../../shared/utils/utilidades';
import { EquipoBiomedicoGatewayAbstract } from '../../domain/model/equipoBiomedico/gateway/equipo-biomedico-gateway.abstract';
import { EquipoBiomedicoService } from '../../infraestructure/equipo-biomedico/equipo-biomedico.service';
import { GestionEquipoBiomedicoService } from '../../domain/usecase/equipoBiomedico/gestion-equipo-biomedico.service';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    EquipoBiomedicoRoutingModule,
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
    GestionEquipoBiomedicoComponent,
    ModalGestionEquipoBiomedicoComponent
  ],
  providers: [
    {
      provide: EquipoBiomedicoGatewayAbstract,
      useClass: EquipoBiomedicoService
    },
    {
      provide: ComunGatewayAbstract,
      useClass: ComunService
    },
    GestionEquipoBiomedicoService,
    MensajesService,
    ToasterService,    
    Utilidades
  ],
  exports: [
    MatStepperModule,
    MatIconModule,
  ],
  entryComponents: [
    ModalGestionEquipoBiomedicoComponent
  ]
})
export class EquipoBiomedicoModule { }






