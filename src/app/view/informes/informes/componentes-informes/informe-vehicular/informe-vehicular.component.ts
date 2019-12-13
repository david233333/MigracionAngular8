import {Component, OnDestroy, OnInit} from '@angular/core';

import * as moment from 'moment';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { MensajesService } from '../../../../../shared/services/mensajes.service';
import { ComunService } from '../../../../../domain/usecase/comun/comun.service';
import { InformeVehicularViewModel } from './informe-vehicular.view-model';
import { Subscription } from 'rxjs';
import { GestionTransporteService } from '../../../../../domain/usecase/transporte/gestion-transporte.service';
import { InformeVehicularRequest } from '../../../../../infraestructure/request-model/transporte/informe-vehicular.request';
import {CapturarErrores} from '../../../../../shared/services/capturar-errores';
moment.locale('es');

@Component({
  selector: 'sura-informe-vehicular',
  templateUrl: './informe-vehicular.component.html',
  styleUrls: ['./informe-vehicular.component.scss']
})
export class InformeVehicularComponent implements OnInit, OnDestroy {
  public configEspanolCalendario: any;
  public informeVehicularViewModel: InformeVehicularViewModel = this.iniciarViewModel();
  public formulario: FormGroup;
  private especialidadSubscripcion = new Subscription();
  private descargarInformeSubscripcion = new Subscription();
  public fechaMinimaInforme: Date;
  public fechaMaximaInforme: Date;
  public loading = false;

  constructor(
    private fb: FormBuilder,
    private mensajesService: MensajesService,
    private comunService: ComunService,
    private transporteService: GestionTransporteService,
    private capturaDeErroresService: CapturarErrores
  ) {
    this.crearFormulario();
  }

  ngOnInit() {
    this.configurarCalendario();
    this.getEspecialidades();
  }

  ngOnDestroy() {
    this.especialidadSubscripcion.unsubscribe();
    this.descargarInformeSubscripcion.unsubscribe();
  }

  /**
   * Obtiene los tipos de identificación
   */
  private getEspecialidades(): void {
    this.especialidadSubscripcion = this.comunService
      .getEspecialidades()
      .subscribe(
        response => {
          console.log('response ', response);
          this.informeVehicularViewModel.respuestaEspecialidades = response;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {}
      );
  }

  /**
   * Obtiene la url para descargar el maestro
   */
  public descargarInforme(): void {
    this.loading = true;
    const REQUEST = new InformeVehicularRequest(
      this.formulario.get('especialidad').value,
      0,
      this.formulario.get('fechaInicio').value,
      this.formulario.get('fechaFin').value
    );

    console.log('request maestro ', JSON.stringify(REQUEST));
    this.descargarInformeSubscripcion = this.transporteService
      .consultarInformeVehicular(REQUEST)
      .subscribe(
        response => {
          console.log('response descargar maestro', response);
          const descargar = document.createElement('a');
          const nombreArchivo = `${
            this.informeVehicularViewModel.mensajes.archivo.nombre
          }-${this.formulario.get('especialidad').value}`;
          descargar.href = `data:application/pdf;base64, ${response}`;
          descargar.download = nombreArchivo;
          descargar.click();
          this.loading = false;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
          this.loading = false;
        },
        () => {}
      );
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): InformeVehicularViewModel {
    return new InformeVehicularViewModel(null, false, []);
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formulario = this.fb.group({
      especialidad: ['', Validators.compose([Validators.required])],
      fechaInicio: ['', Validators.compose([Validators.required])],
      fechaFin: ['', Validators.compose([Validators.required])]
    });
  }

  private configurarCalendario(): void {
    this.configEspanolCalendario = {
      firstDayOfWeek: 1,
      dayNames: [
        'domingo',
        'lunes',
        'martes',
        'miércoles',
        'jueves',
        'viernes',
        'sábado'
      ],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: [
        'enero',
        'febrero',
        'marzo',
        'abril',
        'mayo',
        'junio',
        'julio',
        'agosto',
        'septiembre',
        'octubre',
        'noviembre',
        'diciembre'
      ],
      monthNamesShort: [
        'ene',
        'feb',
        'mar',
        'abr',
        'may',
        'jun',
        'jul',
        'ago',
        'sep',
        'oct',
        'nov',
        'dic'
      ],
      today: 'Hoy',
      clear: 'Borrar'
    };
  }
}
