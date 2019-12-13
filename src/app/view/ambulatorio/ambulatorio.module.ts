import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule, MatNativeDateModule, MatPaginatorModule, MatProgressBarModule, MatRadioModule,
  MatSelectModule, MatSortModule,
  MatStepperModule, MatTableModule, MatTooltipModule
} from '@angular/material';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {ToasterModule, ToasterService} from 'angular2-toaster';
import {CalendarModule, CardModule, CheckboxModule, FieldsetModule, TabViewModule, ToolbarModule} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {SharedModule} from '../../shared/shared.module';
import {MensajesService} from '../../shared/services/mensajes.service';
import { BebeCanguroComponent } from './bebe-canguro/bebe-canguro.component';
import {AmbulatorioRouting} from './ambulatorio.routing';
import { RemisionesMedicamentosComponent } from './remisiones-medicamentos/remisiones-medicamentos.component';
import {AmbulatorioServices} from '../../domain/usecase/novedad/ambulatorio-services';
import { DetalleMedicamentoComponent } from './remisiones-medicamentos/detalle-medicamento/detalle-medicamento.component';
@NgModule({
  imports: [
    AmbulatorioRouting,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
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
  entryComponents: [
    DetalleMedicamentoComponent
  ],
  declarations: [BebeCanguroComponent, RemisionesMedicamentosComponent, DetalleMedicamentoComponent],
  providers: [MensajesService,
    ToasterService, AmbulatorioServices ],
  exports: [MatStepperModule,
    MatIconModule]
})
export class AmbulatorioModule { }
