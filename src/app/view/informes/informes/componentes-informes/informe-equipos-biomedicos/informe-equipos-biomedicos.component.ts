import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {InformeEgresoModel} from '../informe-egresos/informe-egreso-model';
import {Subscription} from 'rxjs/Subscription';
import {DatosAtencionService} from '../../../../../domain/usecase/remision/datos-atencion.service';
import {MensajesService} from '../../../../../shared/services/mensajes.service';
import {InformesUsecase} from '../../../../../domain/usecase/informes/informes-usecase';
import {CapturarErrores} from '../../../../../shared/services/capturar-errores';
import {AdmisionService} from '../../../../../domain/usecase/remision/admision.service';
import {InformeEquipoBiomedicoModel} from './informe-equipo-biomedico-model';

@Component({
  selector: 'sura-informe-equipos-biomedicos',
  templateUrl: './informe-equipos-biomedicos.component.html',
  styleUrls: ['./informe-equipos-biomedicos.component.scss']
})
export class InformeEquiposBiomedicosComponent implements OnInit {

  public configEspanolCalendario: any;
  public formulario: FormGroup;
  public informeEgresoModel: InformeEquipoBiomedicoModel = this.iniciarViewModel();
  public fechaMaximaInforme: Date;
  public loading = false;
  public ciudad: EventEmitter<any> = new EventEmitter<any>();
  public programa: EventEmitter<any> = new EventEmitter<any>();
  public hoy: Date = new Date();
  private ciudadesSubscripcion: Subscription = new Subscription();
  public estados: string[] = ['Asignado', 'Terminado', 'Solicitado', 'Cancelado', 'Entregado'];

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
  }

  public descargarInforme(): void {
    this.loading = true;
    const ESTADO = this.formulario.controls['estado'].value;
    const fechaInicio: Date = this.formulario.get('fechaInicio').value;
    const fechaFin: Date = this.formulario.get('fechaFin').value;
    this.informeUseCase.consultarInformeEquipoBiomedicos(ESTADO, fechaInicio.getTime().toString(),
      fechaFin.getTime().toString()).subscribe(response => {
      const fechaIni = `${fechaInicio.getDate()}/${fechaInicio.getMonth() + 1}/${fechaInicio.getFullYear()}`;
      const fechaFinal = `${fechaFin.getDate()}/${fechaFin.getMonth() + 1}/${fechaFin.getFullYear()}`;
      console.log('response descargar maestro', response);
      const descargar = document.createElement('a');
      const nombreArchivo = `InformeEquiposBiomedicos ${fechaIni} - ${fechaFinal}.csv`;
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

  private crearFormulario(): void {
    this.formulario = this.fb.group({
      fechaInicio: ['', Validators.compose([Validators.required])],
      fechaFin: ['', Validators.compose([Validators.required])],
      estado: ['', Validators.compose([Validators.required])],

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

  private iniciarViewModel(): InformeEquipoBiomedicoModel {
    return new InformeEquipoBiomedicoModel(null, null, null, null, null);
  }
}
