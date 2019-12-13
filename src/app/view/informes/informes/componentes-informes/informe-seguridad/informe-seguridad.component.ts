import {Component} from '@angular/core';
import InformeSeguridadViewModel from './informe-seguridad.view-model';
import * as moment from 'moment';
import {CapturarErrores} from '../../../../../shared/services/capturar-errores';

import {MensajesService} from '../../../../../shared/services/mensajes.service';
import {InformesUsecase} from '../../../../../domain/usecase/informes/informes-usecase';

moment.locale('es');

@Component({
  selector: 'sura-informe-seguridad',
  templateUrl: './informe-seguridad.component.html',
  styleUrls: ['./informe-seguridad.component.scss']

})
export class InformeSeguridadComponent {
  archivoSeleccionado: File;
  informeSeguridadViewModel: InformeSeguridadViewModel = this.iniciarVieModel();

  constructor(
    private capturaDeErroresService: CapturarErrores,
    private mensajesService: MensajesService,
    private informeUseCase: InformesUsecase

  ) {
  }

  onArchivoSeleccionado($event) {
    this.archivoSeleccionado = $event.target.files[0];
    console.log( this.archivoSeleccionado);
  }

  onSubir() {
    console.log('this.archivoSeleccionado ', this.archivoSeleccionado);
    this.informeUseCase.cargarRegistros(this.archivoSeleccionado)
      .subscribe(
        response => {
          this.mensajesService.mostrarMensajeExito('El archivo fue cargado con éxito');
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
          console.log('error ', error);
          this.mensajesService.mostrarMensajeError('El archivo no se pudo cargar, intente de nuevo más tarde');
        }
      );
  }

  private iniciarVieModel(): InformeSeguridadViewModel {
    return new InformeSeguridadViewModel(null, false);
  }
}
