import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ListaLineaUnicaComponent} from './lista-linea-unica/lista-linea-unica.component';
import {NgModule} from '@angular/core';
import {AppComponent} from '../../app.component';
import {ToasterModule, ToasterService} from 'angular2-toaster';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {MatProgressBarModule} from '@angular/material/progress-bar';
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
import {CdkStepperModule} from '@angular/cdk/stepper';
import {TableModule} from 'primeng/table';
import {CommonModule} from '@angular/common';
import {ToolbarModule} from 'primeng/toolbar';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {CardModule} from 'primeng/card';
import {FieldsetModule} from 'primeng/primeng';
import {TabViewModule} from 'primeng/tabview';
import {MatIconModule} from '@angular/material/icon';
import {CheckboxModule} from 'primeng/checkbox';
import {CalendarModule} from 'primeng/calendar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MensajesService} from '../../shared/services/mensajes.service';
import {LineaUnicaRouting} from './linea-unica-routing';
import {ModalLineaUnicaComponent} from './lista-linea-unica/modal-linea-unica/modal-linea-unica.component';
import {LineaUnicaModalNoExitosaComponent} from './lista-linea-unica/linea-unica-modal-no-exitosa/linea-unica-modal-no-exitosa.component';
import {DetalleVisitasComponent} from './lista-linea-unica/modal-linea-unica/detalle-visitas/detalle-visitas.component';
import {LineaUnicaUseCaseService} from '../../domain/usecase/lineaUnica/lineaUnicaUseCase-services';
import {LineaUnicaGatewayAbstract} from '../../domain/model/lineaUnica/gateway/lineaUnica-gateway.abstract';
import {LineaUnicaServices} from '../../infraestructure/lineaUnica/lineaUnica.services';
import {SepararLetraPipe} from '../../shared/pipes/separar-letra.pipe';

@NgModule({
  declarations: [
    ListaLineaUnicaComponent,
    ModalLineaUnicaComponent,
    LineaUnicaModalNoExitosaComponent,
    DetalleVisitasComponent,
    SepararLetraPipe
  ],
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
    ModalLineaUnicaComponent,
    LineaUnicaModalNoExitosaComponent,
    DetalleVisitasComponent
  ],
  exports: [
    MatStepperModule,
    MatIconModule,
  ],
  providers: [
    {
      provide: LineaUnicaGatewayAbstract,
      useClass: LineaUnicaServices
    },
    MensajesService,
    ToasterService,
    LineaUnicaUseCaseService

  ],
  bootstrap: [AppComponent]
})
export class LineaUnicaModule {
}
