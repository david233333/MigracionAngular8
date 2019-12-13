import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule,
  NbSidebarService,
  NbActionsModule,
  NbUserModule,
  NbCardModule,
  NbContextMenuModule
} from '@nebular/theme';

import {
  MatStepperModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatListModule,
  MatButtonModule,
  MatRadioModule,
  MatDialogModule,
  MatTooltipModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatIconModule
} from '@angular/material';

import { MatMenuModule } from '@angular/material/menu';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule as SharedModulePrimeNg,DialogModule} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Ng2PageScrollModule } from 'ng2-page-scroll';

import { InicioComponent } from './components/inicio/inicio.component';
import { MenuComponent } from './components/menu/menu.component';
import { HeaderComponent } from './components/header/header.component';
import { ResultadoBusquedaGridComponent } from './components/resultado-busqueda-grid/resultado-busqueda-grid.component';
import { ModalConfirmacionComponent } from './components/modal-confirmacion/modal-confirmacion.component';

import { PerfilService } from './services/perfil.service';
import { ComunService } from '../domain/usecase/comun/comun.service';
import { AssetspipePipe } from './pipes/dataasync.pipe';

// PIPES
import { FechaPipe } from './pipes/fecha.pipe';
import { TextoBooleanoPipe } from './pipes/texto-booleano.pipe';
import { TruncarCadenaPipe } from './pipes/truncar-cadena.pipe';
import { ListaFrecuenciaPipe } from './pipes/lista-frecuencias.pipe';
import { TipoSondajePipe } from './pipes/tipo-sondaje.pipe';
import { HoraPipe } from './pipes/hora.pipe';
import { ListaDiasPipe } from './pipes/lista-dias.pipe';
import { TipoCambioCitaPipe } from './pipes/tipo-cambio-cita.pipe';

import { UsuarioService } from './services/usuario.service';


const NbModules = [
  NbActionsModule,
  NbCardModule,
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule,
  NbUserModule,
  NgbModule,
  NbContextMenuModule
];

@NgModule({
  imports: [
    CommonModule,
    NbLayoutModule,
    NbSidebarModule,
    SharedModulePrimeNg,
    TableModule,
    DialogModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    MatButtonModule,
    MatRadioModule,
    MatDialogModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    Ng2PageScrollModule,
    MatMenuModule,
    ...NbModules
  ],
  declarations: [
    FechaPipe,
    TextoBooleanoPipe,
    TruncarCadenaPipe,
    ListaFrecuenciaPipe,
    TipoSondajePipe,
    HoraPipe,
    ListaDiasPipe,
    MenuComponent,
    InicioComponent,
    HeaderComponent,
    ResultadoBusquedaGridComponent,
    AssetspipePipe,
    ModalConfirmacionComponent,
    TipoCambioCitaPipe
  ],
  providers: [
    NbSidebarService,
    NbSidebarModule.forRoot().providers,
    NbMenuModule.forRoot().providers,
    PerfilService,
    ComunService,
    UsuarioService
  ],
  exports: [
    FechaPipe,
    TextoBooleanoPipe,
    TruncarCadenaPipe,
    ListaFrecuenciaPipe,
    TipoSondajePipe,
    HoraPipe,
    ListaDiasPipe,
    ModalConfirmacionComponent,
    MenuComponent,
    InicioComponent,
    HeaderComponent,
    MatIconModule,
    MatMenuModule,
    TipoCambioCitaPipe,
    ...NbModules
  ],
  entryComponents: [ModalConfirmacionComponent]
})
export class SharedModule {}
