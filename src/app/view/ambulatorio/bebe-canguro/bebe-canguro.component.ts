import { Component, OnInit } from '@angular/core';
import { BebeCanguroModel } from './bebe-canguro-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatosRemisionService } from '../../../domain/usecase/remision/datos-remision.service';
import { MensajesService } from '../../../shared/services/mensajes.service';
import { Router } from '@angular/router';
import { RemisionServices } from '../../../domain/usecase/remision/remision.service';
import { EstadosRemisionEnum } from '../../../shared/utils/enums/estados-remision.enum';
import { Subscription } from 'rxjs';
import { DatosPacienteService } from '../../../domain/usecase/remision/datos-paciente.service';
import { DatosAtencionService } from '../../../domain/usecase/remision/datos-atencion.service';
import { AmbulatorioServices } from '../../../domain/usecase/novedad/ambulatorio-services';
import { FiltrosBandeja } from '../../../infraestructure/request-model/novedad/FiltrosBandeja';
import { AgregadosRemisionService } from '../../../shared/services/agregados-remision.service';
import {CapturarErrores} from '../../../shared/services/capturar-errores';

@Component({
  selector: 'sura-bebe-canguro',
  templateUrl: './bebe-canguro.component.html',
  styleUrls: ['./bebe-canguro.component.scss']
})
export class BebeCanguroComponent implements OnInit {
  public bebeCanguroViewModel: BebeCanguroModel = this.iniciarViewModel();
  nativeWindow: any
  public formulario: FormGroup;
  private listaRemisionSubscripcion = new Subscription();
  public cols: any[];
  readonly SELECCIONAR = 'SELECCIONAR';
  public tiposIdentificacionSubscripcion = new Subscription();
  public ciudadesSubscripcion = new Subscription();
  public planSaludSubscripcion = new Subscription();
  public institucionRemitenteSubscripcion = new Subscription();
  public show = false;
  public states = 'inactive';
  public disabled: boolean;
  public configEspanolCalendario;
  public pages = 0;
  public size = 10;
  public fechaInicio;
  public fechaMaximaCalendarioActual: Date;
  public fechaMinimaCalendarioActual: Date;
  public totalRegistros: number;


  constructor(private fb: FormBuilder,
    private datosRemisionService: DatosRemisionService,
    private mensajesService: MensajesService,
    private route: Router,
    private remisionServices: RemisionServices,
    private datosPacienteService: DatosPacienteService,
    private datosAtencionService: DatosAtencionService,
    private ambulatorioServices: AmbulatorioServices,
    private agregadosRemision: AgregadosRemisionService,
    private capturaDeErroresService: CapturarErrores) {
    this.crearFormulario();
    this.generarColumnas();
  }

  ngOnInit() {
    this.configurarMaximaFechaActual();
    this.configurarMinimaFechaActual();
    const parametros = new FiltrosBandeja('BEBE_CANGURO', null,
      null,
      null,
      null, null, null, null, null, null,
      null, this.pages, this.size);
    this.consultarAmbulatorio(parametros);
    this.configurarCalendario();
    this.getEstadosRemision();
    this.getDatos();
  }

  public onPageListaRemision($event) {
    this.size = $event.rows;
    this.pages = $event.first;
  }

  /**
   * Buscar filtro
   */

  /**
   * Busca los parametros
   */
  public buscar() {
    const parametros = new FiltrosBandeja('BEBE_CANGURO',
      this.formulario.get('tipoDocumento').value,
      this.formulario.get('numeroDocumento').value,
      this.formulario.get('ciudad').value,
      null, this.formulario.get('estado').value,
      null, this.formulario.get('fechaInicio').value,
      this.formulario.get('fechaFin').value, this.formulario.get('institucion').value
      , this.formulario.get('planSalud').value, this.pages, this.size);
    this.consultarAmbulatorio(parametros);

  }

  /**
   * Limpia los controles de los filtros
   */
  public limpiar(): void {
    this.formulario.reset();
  }

  private consultarAmbulatorio(parametros: FiltrosBandeja) {
    console.log(parametros, 'lraa')
    this.ambulatorioServices.consultarBandejas(parametros)
      .subscribe(bebeCanguroData => {
        this.bebeCanguroViewModel.respuestaRemisiones = bebeCanguroData.content;
        this.totalRegistros = bebeCanguroData.totalElements;
      }, error => {
        this.capturaDeErroresService.mapearErrores(error.status, error.error);
      });
  }




  /**
   * Obtiene los datos para las listas de los filtros
   */
  private getDatos(): void {
    this.getTiposIdentificacion();
    this.getCiudades();
    this.planesSalud();
  }


  /**
   * Genera columnas para la tabla
   */
  private generarColumnas(): void {
    this.cols = [
      {
        field: this.bebeCanguroViewModel.mensajes.tabla.numeroRemisionCampo,
        header: this.bebeCanguroViewModel.mensajes.tabla.numeroRemision
      }, {
        field: this.bebeCanguroViewModel.mensajes.tabla.fechaRemisionCampo,
        header: this.bebeCanguroViewModel.mensajes.tabla.fechaRemision
      },
      {
        field: this.bebeCanguroViewModel.mensajes.tabla.nombrePacienteCampo,
        header: this.bebeCanguroViewModel.mensajes.tabla.nombrePaciente
      },
      {
        field: this.bebeCanguroViewModel.mensajes.tabla.planSaludCampo,
        header: this.bebeCanguroViewModel.mensajes.tabla.planSalud
      },
      {
        field: this.bebeCanguroViewModel.mensajes.tabla.estadoRemisionCampo,
        header: this.bebeCanguroViewModel.mensajes.tabla.estadoRemision
      },
      {
        field: this.bebeCanguroViewModel.mensajes.tabla.usuarioModificaCampo,
        header: this.bebeCanguroViewModel.mensajes.tabla.usuarioModifica
      }
    ];
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): BebeCanguroModel {
    return new BebeCanguroModel(
      null,
      null,
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [0],
      null
    );
  }


  public institucionRemitente(idCiudad: any): void { // hubo cambios y quedo solo idCiudad 
    this.institucionRemitenteSubscripcion = this.datosRemisionService.getInstituciones(idCiudad).subscribe(
      (institucion) => {
          this.bebeCanguroViewModel.respuestaInstituciones = institucion;
      }, error => this.capturaDeErroresService.mapearErrores(error.status, error.error));
  }

  private planesSalud(): void {
    this.planSaludSubscripcion = this.datosPacienteService.getPlanesSalud().subscribe((planes) => {
      this.bebeCanguroViewModel.respuestaPlanesSalud = planes;
    }, error => {
      this.capturaDeErroresService.mapearErrores(error.status, error.error);
    });
  }

  private getCiudades(): void {
    this.ciudadesSubscripcion = this.datosAtencionService.getCiudades().subscribe((ciudades) => {
        this.bebeCanguroViewModel.respuestaCiudades = ciudades;
    }, error => this.capturaDeErroresService.mapearErrores(error.status, error.error));
  }

  /**
   * Hace la peticion al servidor si no hay datos al iniciar la aplicacion
   * con un evento
   *
   */
  private getTiposIdentificacion(): void {
    this.tiposIdentificacionSubscripcion = this.datosPacienteService.getTiposIdentificacion().subscribe(
      (tiposDocumentos) => {
          this.bebeCanguroViewModel.respuestaTiposIdentificacion = tiposDocumentos;
      }, error => this.capturaDeErroresService.mapearErrores(error.status, error.error));
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formulario = this.fb.group({
      tipoDocumento: [null,
        Validators.compose([
        ])
      ],
      numeroDocumento: [null,
        Validators.compose([
          Validators.maxLength(15),
          Validators.pattern('[0-9]+')
        ])
      ],
      remision: [
        null,
        Validators.compose([
          Validators.maxLength(20),
          Validators.pattern('[0-9]+')
        ])
      ],
      institucion: [null, Validators.compose([
      ])
      ],
      planSalud: [null, Validators.compose([
      ])
      ],
      estado: [null, Validators.compose([
      ])
      ],
      ciudad: [null, Validators.compose([])
      ],
      fechaInicio: [null, Validators.compose([])],
      fechaFin: [null, Validators.compose([])]
    });
  }

  /**
   * Obtiene los estados de la remision
   */
  private getEstadosRemision(): void {
    this.bebeCanguroViewModel.estado = [EstadosRemisionEnum.NO_ADMITIDO, EstadosRemisionEnum.CANCELADO,
    EstadosRemisionEnum.ADMITIDO, EstadosRemisionEnum.EMPALME, EstadosRemisionEnum.NUEVO,
    EstadosRemisionEnum.PENDIENTE_ADMITIR];
  }

  private configurarCalendario(): void {
    this.configEspanolCalendario = {
      firstDayOfWeek: 1,
      dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      today: 'Hoy',
      clear: 'Borrar'
    };
  }

  public buscarRemision($event): void {
    console.log($event);
    let remision = '';
    this.remisionServices.getAgregadoRemision($event.idRemision)
      .subscribe(remisions => {
        this.agregadosRemision.remision = remisions;
        remision = remisions.idRemisionPK;
        console.log(remisions);
        this.remisionServices.getagregadoPaciente(remisions.idRemisionPK)
          .subscribe(response => {
            remisions.estadoRemision = remisions.estado;
            this.agregadosRemision.datosRemision = remisions;
            this.agregadosRemision.datosPaciente = response;
            console.log(response);
          }, error1 => this.mensajesService.mostrarMensajeError(error1));
      }, error => {
        this.capturaDeErroresService.mapearErrores(error.status, error.error)
      });
    setTimeout(() => {
      this.route.navigate(['remision/editar']);
    }, 1000);

  }

  private configurarMaximaFechaActual(): void {
    const fechaHoy = new Date();
    this.fechaMaximaCalendarioActual = new Date();
    this.fechaMaximaCalendarioActual.setDate(fechaHoy.getDate());
    this.fechaMaximaCalendarioActual.setMonth(fechaHoy.getMonth());
    this.fechaMaximaCalendarioActual.setFullYear(fechaHoy.getFullYear());
  }

  private configurarMinimaFechaActual(): void {
    const fechaHoy = new Date();
    this.fechaMinimaCalendarioActual = new Date();
    this.fechaMinimaCalendarioActual.setDate(fechaHoy.getDate() + 30);
    this.fechaMinimaCalendarioActual.setMonth(fechaHoy.getMonth() + 60);
    this.fechaMinimaCalendarioActual.setFullYear(fechaHoy.getFullYear());
  }

}
