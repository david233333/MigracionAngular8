import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MensajesService} from '../../../../../shared/services/mensajes.service';
import {InformeEgresoModel} from './informe-egreso-model';
import {InformesUsecase} from '../../../../../domain/usecase/informes/informes-usecase';
import {CapturarErrores} from '../../../../../shared/services/capturar-errores';
import {Subscription} from 'rxjs/Subscription';
import {DatosAtencionService} from '../../../../../domain/usecase/remision/datos-atencion.service';
import {AdmisionService} from '../../../../../domain/usecase/remision/admision.service';
import {Programa} from '../../../../../domain/model/maestro/entity/programa.model';

@Component({
  selector: 'sura-informe-egreso',
  templateUrl: './informe-egreso.component.html',
  styleUrls: ['./informe-egreso.component.scss']
})
export class InformeEgresoComponent implements OnInit, OnDestroy {

  public configEspanolCalendario: any;
  public formulario: FormGroup;
  public informeEgresoModel: InformeEgresoModel = this.iniciarViewModel();
  public fechaMaximaInforme: Date;
  public loading = false;
  public ciudad: EventEmitter<any> = new EventEmitter<any>();
  public programa: EventEmitter<any> = new EventEmitter<any>();
  public hoy: Date = new Date();
  private ciudadesSubscripcion: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private datosAtencionService: DatosAtencionService,
    private mensajesService: MensajesService,
    private informeUseCase: InformesUsecase,
    private capturaDeErroresService: CapturarErrores,
    private admisionService: AdmisionService,
  ) {
    this.crearFormulario();
  }

  ngOnInit() {
    this.configurarCalendario();
    this.getCiudades();
    this.getProgramas();
  }

  ngOnDestroy(): void {
    this.ciudadesSubscripcion.unsubscribe();
  }

  emitirCiudad(event) {
    let ciudadPrincipal = null;
    if (event && event.value) {
      ciudadPrincipal = this.informeEgresoModel.listaCiudades.find(
        id => id.idCiudad === event.value
      );
      this.ciudad.emit(ciudadPrincipal.idCiudad);
      this.formulario.controls['programa'].enable();
    }
  }

  emitirPrograma(event) {
    let programa = null;
    if (event && event.value) {
      if (event.value !== 1) {
        programa = this.informeEgresoModel.listaProgramas.find(
          id => id.idPrograma === event.value
        );
        this.formulario.controls['piso'].enable();
        this.getPisos();
      } else {
        programa = new Programa('1', '1', 'Todos', '', '', true);
        this.formulario.controls['piso'].setValue('');
        this.formulario.controls['piso'].disable();
      }
      this.programa.emit(programa.idPrograma);
    }
  }

  descargarInforme() {
    this.loading = true;
    const ID_CIUDAD = this.formulario.controls['ciudad'].value;
    const ID_PROGRAMA = this.formulario.controls['programa'].value;
    const fechaInicio: Date = this.formulario.get('fechaInicio').value;
    const fechaFin: Date = this.formulario.get('fechaFin').value;
    const piso = this.formulario.controls['piso'].value ? this.formulario.controls['piso'].value : '0';
    this.informeUseCase.consultarInformeEgreso(ID_CIUDAD, ID_PROGRAMA, fechaInicio.getTime().toString(),
      fechaFin.getTime().toString(), piso).subscribe(response => {
      const fechaIni = `${fechaInicio.getDate()}/${fechaInicio.getMonth() + 1}/${fechaInicio.getFullYear()}`;
      const fechaFinal = `${fechaFin.getDate()}/${fechaFin.getMonth() + 1}/${fechaFin.getFullYear()}`;
      console.log('response descargar maestro', response);
      const descargar = document.createElement('a');
      const nombreArchivo = `InformeEgreso ${fechaIni} - ${fechaFinal}.csv`;
      descargar.href = `data:application/csv;base64, ${response}`;
      descargar.download = nombreArchivo;
      document.body.appendChild(descargar);
      descargar.click();
      document.body.removeChild(descargar);
      this.loading = false;
    }, err => {
      this.capturaDeErroresService.mapearErrores(err.status, err.error);
      this.loading = false;
    });
  }

  private getCiudades(): void {
    this.ciudadesSubscripcion = this.datosAtencionService
      .getCiudades()
      .subscribe(
        response => {
          this.informeEgresoModel.listaCiudades = response;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
        }
      );

  }

  private getProgramas(): void {
    this.admisionService.getProgramas()
      .subscribe(
        response => {
          this.informeEgresoModel.listaProgramas = response;
        },
        error => {
          this.mensajesService.mostrarMensajeError(error.message);
        },
        () => {
        }
      );
  }

  private getPisos(): void {
    const TIPO_ATENCION = this.informeEgresoModel.mensajes.tipoAtencion.domiciliario;
    this.admisionService.getPisosAdmision(this.formulario.controls['ciudad'].value,
      TIPO_ATENCION, this.formulario.controls['programa'].value)
      .subscribe(
        response => {
          this.informeEgresoModel.listaPisos = response;
        },
        error => {
          this.mensajesService.mostrarMensajeError(error.message);
        },
        () => {
        }
      );
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formulario = this.fb.group({
      fechaInicio: ['', Validators.compose([Validators.required])],
      fechaFin: ['', Validators.compose([Validators.required])],
      ciudad: ['', Validators.compose([Validators.required])],
      programa: [{value: '', disabled: true}, Validators.compose([Validators.required])],
      piso: [{value: '', disabled: true}, Validators.compose([])],
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

  private iniciarViewModel(): InformeEgresoModel {
    return new InformeEgresoModel(null, null, null, null, null);
  }
}
