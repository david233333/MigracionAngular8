import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DatosRemisionService } from '../../../domain/usecase/remision/datos-remision.service';
import { MensajesService } from '../../../shared/services/mensajes.service';
import { Router } from '@angular/router';
import { RemisionServices } from '../../../domain/usecase/remision/remision.service';
import { DatosPacienteService } from '../../../domain/usecase/remision/datos-paciente.service';
import { DatosAtencionService } from '../../../domain/usecase/remision/datos-atencion.service';
import { EstadosRemisionEnum } from '../../../shared/utils/enums/estados-remision.enum';
import { RemisionesMedicamentosModel } from './remisiones-medicamentos-model';
import { FiltrosBandeja } from '../../../infraestructure/request-model/novedad/FiltrosBandeja';
import { AmbulatorioServices } from '../../../domain/usecase/novedad/ambulatorio-services';
import { MatDialog } from '@angular/material';
import { DetalleMedicamentoComponent } from './detalle-medicamento/detalle-medicamento.component';
import {CapturarErrores} from '../../../shared/services/capturar-errores';

@Component({
  selector: 'sura-remisiones-medicamentos',
  templateUrl: './remisiones-medicamentos.component.html',
  styleUrls: ['./remisiones-medicamentos.component.scss']
})
export class RemisionesMedicamentosComponent implements OnInit {
  public remisionesMedicamentos: RemisionesMedicamentosModel = this.iniciarViewModel();
  public formulario: FormGroup;
  private listaRemisionSubscripcion = new Subscription();
  public cols: any[];
  readonly SELECCIONAR = 'SELECCIONAR';
  public tiposIdentificacionSubscripcion = new Subscription();
  public ciudadesSubscripcion = new Subscription();
  public planSaludSubscripcion = new Subscription();
  public institucionRemitenteSubscripcion = new Subscription();
  public estadoBandejaSubscripcion = new Subscription();
  public show = false;
  public states = 'inactive';
  public disabled: boolean;
  public configEspanolCalendario;
  public pages = 0;
  public size = 10;
  public fechaInicio: any;
  public totalRegistros: number;
  constructor(private fb: FormBuilder,
    private datosRemisionService: DatosRemisionService,
    private mensajesService: MensajesService,
    private route: Router,
    private remisionServices: RemisionServices,
    private datosPacienteService: DatosPacienteService,
    private datosAtencionService: DatosAtencionService,
    private ambulatorioServices: AmbulatorioServices,
    private dialog: MatDialog,
              private capturaDeErroresService: CapturarErrores) {
    this.crearFormulario();
    this.generarColumnas();
  }

  ngOnInit() {
    this.busqueda();
    this.configurarCalendario();
    this.getEstadosRemision();
    this.getDatos();
  }


  private busqueda() {
    const parametros = new FiltrosBandeja('APLICACION_MEDICAMENTOS', null, null, null, null, null, null, null,
      null, null, null, this.pages, this.size);
    this.consultarAmbulatorio(parametros);
  }

  public consultarPlanManejo(rowData) {
    console.log(rowData);
    const idNovedad = rowData.idNovedad;
    this.ambulatorioServices.consultarPlanManejoBandejaMedicamentos(idNovedad)
      .subscribe(planManejoNovedad => {
        const datos = planManejoNovedad.tratamientos
          .filter(tratamiento => tratamiento.tratamiento = 'MEDICAMENTOS');
        console.log(datos);

        const dialogRef = this.dialog.open(DetalleMedicamentoComponent, {
          width: '50%',
          disableClose: true,
          data: { planManejo: datos }
        });

        dialogRef.afterClosed().subscribe(() => {

          this.actualizarEstadoBandeja(rowData.idRemision);
          this.busqueda();

        });
      }, error =>   this.capturaDeErroresService.mapearErrores(error.status, error.error));
  }


  /**
   *Metodo para actualizar el estado de 'visto' de la bandeja de remisiones
   * @param idRemision
   */
  actualizarEstadoBandeja(idRemision: string) {
    this.estadoBandejaSubscripcion = this.ambulatorioServices.actualizarEstadoBandeja(idRemision)
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        });
  }


  public onPageListaRemisiones(event: any): void {
    this.size = event.rows;
    this.pages = event.first;
  }


  /**
   * Busca los parametros
   */
  public buscar() {
    const parametros = new FiltrosBandeja('APLICACION_MEDICAMENTOS',
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

  public onPageListaRemision(event: any): void {
    this.size = event.first;
    this.pages = event.rows;
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
        field: this.remisionesMedicamentos.mensajes.tabla.numeroRemisionCampo,
        header: this.remisionesMedicamentos.mensajes.tabla.numeroRemision
      }, {
        field: this.remisionesMedicamentos.mensajes.tabla.fechaRemisionCampo,
        header: this.remisionesMedicamentos.mensajes.tabla.fechaRemision
      },
      {
        field: this.remisionesMedicamentos.mensajes.tabla.nombrePacienteCampo,
        header: this.remisionesMedicamentos.mensajes.tabla.nombrePaciente
      },
      {
        field: this.remisionesMedicamentos.mensajes.tabla.planSaludCampo,
        header: this.remisionesMedicamentos.mensajes.tabla.planSalud
      },
      {
        field: this.remisionesMedicamentos.mensajes.tabla.estadoRemisionCampo,
        header: this.remisionesMedicamentos.mensajes.tabla.estadoRemision
      },
      {
        field: this.remisionesMedicamentos.mensajes.tabla.usuarioModificaCampo,
        header: this.remisionesMedicamentos.mensajes.tabla.usuarioModifica
      }
    ];
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): RemisionesMedicamentosModel {
    return new RemisionesMedicamentosModel(
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
      null, null
    );
  }


  public institucionRemitente(idCiudad: any): void { // hubo cambios y quedo solo idCiudad 
    console.log('angular 6', idCiudad)
    this.institucionRemitenteSubscripcion = this.datosRemisionService.getInstituciones(idCiudad).subscribe(
      (institucion) => {
          this.remisionesMedicamentos.respuestaInstituciones = institucion;

      }, error => this.capturaDeErroresService.mapearErrores(error.status, error.error));
  }

  private planesSalud(): void {
    this.planSaludSubscripcion = this.datosPacienteService.getPlanesSalud().subscribe((planes) => {
      this.remisionesMedicamentos.respuestaPlanesSalud = planes;
    }, error => {
      this.capturaDeErroresService.mapearErrores(error.status, error.error)
    });
  }

  private getCiudades(): void {
    this.ciudadesSubscripcion = this.datosAtencionService.getCiudades().subscribe((ciudades) => {
        this.remisionesMedicamentos.respuestaCiudades = ciudades;
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
          this.remisionesMedicamentos.respuestaTiposIdentificacion = tiposDocumentos;
      }, error =>  this.capturaDeErroresService.mapearErrores(error.status, error.error));
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
    this.remisionesMedicamentos.estado = [EstadosRemisionEnum.NO_ADMITIDO, EstadosRemisionEnum.CANCELADO,
    EstadosRemisionEnum.ADMITIDO, EstadosRemisionEnum.EMPALME, EstadosRemisionEnum.NUEVO,
    EstadosRemisionEnum.PENDIENTE_ADMITIR];
  }

  private configurarCalendario(): void {
    this.configEspanolCalendario = {
      firstDayOfWeek: 1,
      dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre',
        'octubre', 'noviembre', 'diciembre'],
      monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      today: 'Hoy',
      clear: 'Borrar'
    };
  }

  private consultarAmbulatorio(parametros: FiltrosBandeja) {
    console.log(parametros, 'lraa')
    this.ambulatorioServices.consultarBandejas(parametros)
      .subscribe(remision => {
        this.remisionesMedicamentos.respuestaRemisiones = remision.content;
        this.totalRegistros = remision.totalElements;
      }, error1 => {
        if (error1.status === 503) {
          this.mensajesService.mostrarMensajeError(error1.error);
        } else {
          this.mensajesService.mostrarMensajeError(error1.error);
        }
      });
  }

}
