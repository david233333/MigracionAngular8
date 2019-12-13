import {Component, OnDestroy, OnInit} from '@angular/core';
import * as moment from 'moment';
import {InformeRemisionesViewModel} from './informe-remisiones.view-model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {RemisionServices} from '../../../../../domain/usecase/remision/remision.service';
import {CapturarErrores} from '../../../../../shared/services/capturar-errores';
import {InformeRemisionesRequest} from '../../../../../infraestructure/request-model/remision/informe-remisiones.request';
import {EstadosCitaInformeEnum} from '../../../../../shared/utils/enums/estados-cita-informe';

moment.locale('es');

@Component({
  selector: 'sura-informe-remisiones',
  templateUrl: './informe-remisiones.component.html',
  styleUrls: ['./informe-remisiones.component.scss']
})
export class InformeRemisionesComponent implements OnInit, OnDestroy {
  public columnas: any[];
  public informeRemisionesViewModel: InformeRemisionesViewModel = this.iniciarViewModel();
  public formulario: FormGroup;
  public loading = false;
  public configEspanolCalendario: any;
  private descargarInformeSubscripcion = new Subscription();

  constructor(
    private fb: FormBuilder,
    private remisionService: RemisionServices,
    private capturaDeErroresService: CapturarErrores
  ) {
    this.crearFormulario();
    this.generarColumnas();
  }

  ngOnInit() {
    this.configurarCalendario();
    this.getDatos();
  }

  ngOnDestroy() {
    this.descargarInformeSubscripcion.unsubscribe();
  }

  /**
   * Obtiene la url para descargar el maestro
   */
  public descargarInforme(): void {
    this.loading = true;
    const LISTA_ESTADOS: string[] = [];
    this.informeRemisionesViewModel.estadosSeleccionadas.forEach(item => {
      LISTA_ESTADOS.push(item.estado);
    });
    const REQUEST = new InformeRemisionesRequest(
      this.formulario.get('fechaInicio').value,
      LISTA_ESTADOS
    );

    console.log('request maestro ', JSON.stringify(REQUEST));
    this.descargarInformeSubscripcion = this.remisionService
      .consultarInformeRemisiones(REQUEST)
      .subscribe(
        response => {
          console.log('response descargar maestro', response);
          const descargar = document.createElement('a');
          const nombreArchivo = `${
            this.informeRemisionesViewModel.mensajes.archivo.nombre
            }`;
          descargar.href = `data:application/pdf;base64, ${response}`;
          descargar.download = nombreArchivo;
          descargar.click();
          this.loading = false;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
          this.loading = false;
        },
        () => {
        }
      );
  }

  getDatos(): void {
    this.informeRemisionesViewModel.respuestaEstados = [
      {
        id: '1',
        estado: EstadosCitaInformeEnum.ACTIVA
      },
      {
        id: '2',
        estado: EstadosCitaInformeEnum.ELIMINADA
      },
      {
        id: '3',
        estado: EstadosCitaInformeEnum.CUIDADOR
      },
      {
        id: '4',
        estado: EstadosCitaInformeEnum.COMPLETA
      },
      {
        id: '5',
        estado: EstadosCitaInformeEnum.DESPACHADA
      },
      {
        id: '6',
        estado: EstadosCitaInformeEnum.FALLIDA
      },
      {
        id: '7',
        estado: EstadosCitaInformeEnum.ENSITIO
      },
      {
        id: '8',
        estado: EstadosCitaInformeEnum.ADMITIDA
      },
      {
        id: '9',
        estado: EstadosCitaInformeEnum.ENPELIGRO
      },
      {
        id: '10',
        estado: EstadosCitaInformeEnum.AGENDADA
      },
      {
        id: '11',
        estado: EstadosCitaInformeEnum.ENVIAJE
      },
      {
        id: '12',
        estado: EstadosCitaInformeEnum.INACTIVA
      }
    ];
  }

  public verValidacionRemision(): boolean {
    return this.informeRemisionesViewModel.estadosSeleccionadas.length > 0
      ? false
      : true;
  }

  public validarDescargarRemision(): boolean {
    return this.informeRemisionesViewModel.estadosSeleccionadas.length > 0 &&
    this.formulario.get('fechaInicio').value != null
      ? false
      : true;
  }

  /**
   * Genera columnas para la tabla
   */
  private generarColumnas(): void {
    this.columnas = [
      {
        field: this.informeRemisionesViewModel.mensajes.tabla.estadoCampo,
        header: this.informeRemisionesViewModel.mensajes.tabla.estado
      }
    ];
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): InformeRemisionesViewModel {
    return new InformeRemisionesViewModel(null, false, [], []);
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formulario = this.fb.group({
      fechaInicio: ['', Validators.compose([Validators.required])],
      estados: [null, Validators.compose([Validators.required])]
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
