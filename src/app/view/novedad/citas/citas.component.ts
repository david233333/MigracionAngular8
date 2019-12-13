import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Subscription} from 'rxjs/Subscription';
import {MensajesService} from '../../../shared/services/mensajes.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {ModalConfirmacionComponent} from '../../../shared/components/modal-confirmacion/modal-confirmacion.component';
import {ModalConfirmacion} from '../../../shared/models/modal-confirmacion.model';
import {CitasViewModel} from './citas.view-model';
import {ModalCitasComponent} from './modal-citas/modal-citas.component';
import {Cita} from '../../../domain/model/novedad/entity/cita.model';
import {AgregadosNovedadService} from '../../../shared/services/agregados-novedad.service';
import {Utilidades} from '../../../shared/utils/utilidades';
import {CitaService} from '../../../domain/usecase/novedad/cita.service';
import {CitasPacienteRequest} from '../../../infraestructure/request-model/novedad/citas-paciente.request';
import {EstadosCitaEnum} from '../../../shared/utils/enums/estados-cita.enum';
import {UsuarioService} from '../../../shared/services/usuario.service';
import {CapturarErrores} from '../../../shared/services/capturar-errores';
import {ModalCitaAdicionalComponent} from './modal-cita-adicional/modal-cita-adicional.component';
import {TipoNovedadEnum} from '../../../shared/utils/enums/tipo-novedad.enum';
import {element} from 'protractor';
import {ConsultaRemisionRequest} from '../../../infraestructure/request-model/novedad/consulta-remision.request';
import {CreacionNovedadService} from '../../../domain/usecase/novedad/creacion-novedad.service';

moment.locale('es');

@Component({
  selector: 'sura-novedad-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss']
})
export class CitasComponent implements OnInit, OnDestroy {
  public citasViewModel: CitasViewModel = this.iniciarViewModel();
  public columnasCitas: any[];
  public formulario: FormGroup;
  @Output()
  public cargando: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  public regresarPrincipal: EventEmitter<boolean> = new EventEmitter<boolean>();
  private citasSubscripcion: Subscription = new Subscription();
  private datosCitasSubscripcion: Subscription = new Subscription();
  private guardarCitasSubscripcion: Subscription = new Subscription();
  private remisionSubscription = new Subscription();
  private listaCitas: Cita[] = [];
  citaIngresoCompletada: boolean;
  public loading = true;

  @Input()
  public especialidad;

  @Input()
  public idPrograma;

  @Input()
  public nombreCiudad;

  @Input()
  public codigoCiudad;


  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private citaService: CitaService,
    private mensajesService: MensajesService,
    public infoRemisionNovedad: AgregadosNovedadService,
    private util: Utilidades,
    private usuarioService: UsuarioService,
    private capturaDeErroresService: CapturarErrores,
    private creacionNovedadService: CreacionNovedadService,
  ) {
    this.generarColumnasCitas();
    this.crearFormulario();
  }

  ngOnInit() {
    this.getDatos();
  }


  ngOnDestroy() {
    this.citasSubscripcion.unsubscribe();
    this.datosCitasSubscripcion.unsubscribe();
    this.guardarCitasSubscripcion.unsubscribe();
  }

  /**
   * guarda las citas
   */
  public guardarCitas(): void {
    const CITAS_INICIAL = new CitasPacienteRequest(
      null,
      this.infoRemisionNovedad.datosRemision.idRemision,
      this.citasViewModel.citasAgregado,
      null
    );

    const CITAS = new CitasPacienteRequest(
      null,
      this.infoRemisionNovedad.datosRemision.idRemision,
      this.citasViewModel.citas,
      null
    );

    const ES_IGUAL = this.util.compararObjetos(CITAS_INICIAL, CITAS);

    if (ES_IGUAL) {
      this.mensajesService.mostrarMensajeError(
        this.citasViewModel.mensajes.mensajesAlerta.noCambioCita
      );
    } else {
      this.actualizarEstadoCitas(
        this.citasViewModel.citasAgregado,
        this.listaCitas
      );
    }
  }

  /**
   * Abre el modal
   */
  public abrirModalCitas(): void {

    const dialogRef = this.dialog.open(ModalCitasComponent, {
      width: '90%',
      disableClose: false,
      data: {
        cita: null,
        esDetalle: false,
        btnEditar: false,
        esHistorial: false,
        especialidad: this.especialidad,
        nombreCiudad: this.nombreCiudad,
        codigoCiudad: this.codigoCiudad,
        idPrograma: this.idPrograma,
        idNovedadPk: this.infoRemisionNovedad.datosNovedad.recursoPreferidoPk
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      console.log('data ', data);
      if (data !== undefined) {
        const dato = this.citasViewModel.citas.findIndex(
          elemento => elemento.profesional === data.profesional && elemento.tipoCita.tipoCita === data.tipoCita.tipoCita
        );
        console.log(dato);

        if (
          dato === -1
        ) {
          this.agregarCita(data);
        } else {
          this.mensajesService.mostrarMensajeError(`${
            this.citasViewModel.mensajes.mensajesAlerta.citaProfesionalDuplicado
            }
                    ${data.profesional}`);
          return;
        }
      }
    });
  }

  /**
   * Elimina la cita de la lista y tabla
   * @param {Cita} cita
   */
  public eliminarCita(cita: Cita): void {
    console.log(cita);
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      width: '30%',
      disableClose: false,
      data: new ModalConfirmacion(
        this.citasViewModel.mensajes.tabla.tituloEliminarCita,
        this.citasViewModel.mensajes.tabla.contenidoEliminarCita
      )
    });

    dialogRef.afterClosed().subscribe(data => {
      console.log(data);
      if (data && data === true) {
        if (cita && cita.idCita) {
          const index = this.citasViewModel.citas.findIndex(
            elemento => elemento.idCita === cita.idCita
          );
          if (index !== null && index !== undefined) {
            this.citasViewModel.citas.splice(index, 1);
          }
          this.listaCitas.find(c => c.idCita === cita.idCita).estado =
            EstadosCitaEnum.ELIMINADO;
          this.actualizarCitas();
        }
      }
    });
  }

  /**
   * Edita la cita de la lista y tabla
   * @param {Cita} cita
   */
  public editarCita(cita: Cita): void {
    console.log('Row data: ' + JSON.stringify(cita));
    console.log('recursoPk', this.infoRemisionNovedad.datosNovedad.recursoPreferidoPk);
    const dialogRef = this.dialog.open(ModalCitasComponent, {
      width: '90%',
      disableClose: false,
      data: {
        cita: cita,
        esDetalle: false,
        btnEditar: true,
        esHistorial: false,
        especialidad: this.especialidad,
        nombreCiudad: this.nombreCiudad,
        codigoCiudad: this.codigoCiudad,
        idPrograma: this.idPrograma,
        idNovedadPk: this.infoRemisionNovedad.datosNovedad.recursoPreferidoPk
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.idCita) {
        data.idCita = cita.idCita;
        const index = this.citasViewModel.citas.findIndex(
          elemento => elemento.idCita === data.idCita
        );
        if (index !== null && index !== undefined && index !== -1) {
          this.citasViewModel.citas[index] = data;
          this.listaCitas[index] = data;
        }
        this.actualizarCitas();
      }
    });
  }

  /**
   * Agrega una cita adicional al registro de la tabla seleccionado
   * @param {Cita} cita
   */
  public citaAdicional(cita: Cita): void {
    const dialogRef = this.dialog.open(ModalCitaAdicionalComponent, {
      width: '90%',
      disableClose: false,
      data: {
        cita: cita,
        especialidad: this.especialidad,
        nombreCiudad: this.nombreCiudad,
        idPrograma: this.idPrograma,
        idNovedadPk: this.infoRemisionNovedad.datosNovedad.recursoPreferidoPk
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.idCita) {
        data.idCita = cita.idCita;
        const index = this.citasViewModel.citas.findIndex(
          elemento => elemento.idCita === data.idCita
        );
        if (index !== null && index !== undefined && index !== -1) {
          switch (data.citaAdicional.tipoCambioCita) {
            case TipoNovedadEnum.AGREGAR_CITA:
              data.sesionesFaltantes = +data.sesionesFaltantes + 1;
              data.totalVisitasPeriodica = +data.totalVisitasPeriodica + 1;
              break;
            case TipoNovedadEnum.REPROGRAMAR_CITA:
              data.sesionesFaltantes = +data.sesionesFaltantes + 1;
              break;
          }

          this.citasViewModel.citas[index] = data;
          this.listaCitas[index] = data;
        }
        this.actualizarCitas();
        console.log('DATA CITA ADICIONAL ', data);
      }
    });
  }

  /**
   * Restaura una cita modificada a su estado inicial
   * @param {Cita} cita
   */
  public restaurarCita(cita: Cita): void {
    if (cita && cita.idCita) {
      const index = this.citasViewModel.citas.findIndex(
        elemento => elemento.idCita === cita.idCita
      );
      if (index !== null && index !== undefined && index !== -1) {
        const indexAgregado = this.citasViewModel.citasAgregado.findIndex(
          elemento => elemento.idCita === cita.idCita
        );

        if (
          indexAgregado !== null &&
          indexAgregado !== undefined &&
          indexAgregado !== -1
        ) {
          this.citasViewModel.citas[index] = this.citasViewModel.citasAgregado[
            indexAgregado
            ];
          this.listaCitas[index] = this.citasViewModel.citasAgregado[
            indexAgregado
            ];
        }
      }
    }
    this.actualizarCitas();
  }

  private actualizarEstadoCitas(citasInicial: Cita[], citas: Cita[]): void {
    citas.forEach(cita => {
      if (cita.estado !== EstadosCitaEnum.ELIMINADO) {
        const citaInicial = citasInicial.find(c => c.idCita === cita.idCita);
        if (citaInicial != null) {
          const ES_IGUAL = this.util.compararObjetos(citaInicial, cita);
          if (!ES_IGUAL) {
            cita.estado = EstadosCitaEnum.MODIFICADO;
          }
        }
      }
    });

    const CITAS = new CitasPacienteRequest(
      null,
      this.infoRemisionNovedad.datosRemision.idRemision,
      this.listaCitas,
      this.usuarioService.InfoUsuario
    );

    console.log('REQUEST - Cita ', JSON.stringify(CITAS));
    this.enviarCitas(CITAS);
  }

  private enviarCitas(citas: CitasPacienteRequest): void {
    this.guardarCitasSubscripcion = this.citaService
      .guardarCitas(citas)
      .subscribe(
        response => {
          console.log('RESPONSE - Cita ', response);
          this.mensajesService.mostrarMensajeExito(
            this.citasViewModel.mensajes.mensajesAlerta.exitoCambioCita
          );
          this.regresarPrincipal.emit(true);
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
          this.getInfoCitas();
        },
        () => {
          this.guardarCitasSubscripcion.unsubscribe();
        }
      );
  }

  private getDatos(): void {
    this.getAgregadoRemision();

  }

  public getAgregadoRemision(): void {
    const CONSULTA = new ConsultaRemisionRequest(
      this.infoRemisionNovedad.datosNovedad.idRemision,
      this.infoRemisionNovedad.datosRemision.tipoIdentificacion.idTipo,
      this.infoRemisionNovedad.datosRemision.numeroIdentificacion
    );

    this.remisionSubscription = this.creacionNovedadService
      .getConsultaRemision(CONSULTA)
      .subscribe(
        response => {
          this.infoRemisionNovedad.datosRemision = response.remision;
          this.infoRemisionNovedad.datosNovedad = response.novedad;
          this.getInfoCitas();
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
          this.remisionSubscription.unsubscribe();
        }
      );
  }

  private getInfoCitas(): void {
    console.log(
      'this.infoRemisionNovedad.datosNovedad.idCitasPaciente ',
      this.infoRemisionNovedad.datosNovedad
    );

    console.log('Dataaa' + JSON.stringify(this.infoRemisionNovedad.datosRemision));

    this.citaIngresoCompletada = this.infoRemisionNovedad.datosRemision.citaIngresoCompletada;

    if (this.infoRemisionNovedad.datosNovedad.idCitasPaciente != null) {
      this.datosCitasSubscripcion = this.citaService
        .getAgregadoCitas(this.infoRemisionNovedad.datosNovedad.idCitasPaciente)
        .subscribe(
          response => {
            console.log(response.citas);
            this.citasViewModel.citasAgregado = [];
            this.citasViewModel.citas = [];
            this.listaCitas = [];

            this.citasViewModel.citasAgregado = response.citas;

            response.citas.forEach(cita => {
              this.agregarCita(cita);
            });
            this.loading = false;
          },
          error => {
            this.capturaDeErroresService.mapearErrores(
              error.status,
              error.error
            );
          },
          () => {
          }
        );
    }
  }

  /**
   * Agrega la cita a la tabla
   * @param {Cita} cita
   */
  private agregarCita(cita: Cita): void {
    if (cita) {
      this.citasViewModel.citas.push(cita);
      this.listaCitas.push(cita);
      cita = null;
    }
    this.actualizarCitas();
  }

  /**
   * Actualiza las citas del formulario
   */
  private actualizarCitas(): void {
    this.formulario.get('citas').setValue(this.citasViewModel.citas);
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): CitasViewModel {
    return new CitasViewModel(null, null, [], []);
  }

  /**
   * Genera columnas para la tabla de citas
   */
  private generarColumnasCitas(): void {
    this.columnasCitas = [
      {
        field: this.citasViewModel.mensajes.tabla.tipoCitaCampo,
        header: this.citasViewModel.mensajes.tabla.tipoCita
      },
      {
        field: this.citasViewModel.mensajes.tabla.profesionalCampo,
        header: this.citasViewModel.mensajes.tabla.profesional
      },
      {
        field: this.citasViewModel.mensajes.tabla.fechaCampo,
        header: this.citasViewModel.mensajes.tabla.fecha
      },
      {
        field: this.citasViewModel.mensajes.tabla.sesionesFaltantesCampo,
        header: this.citasViewModel.mensajes.tabla.sesionesFaltantes
      },
      {
        field: this.citasViewModel.mensajes.tabla.totalSesionesCampo,
        header: this.citasViewModel.mensajes.tabla.totalSesiones
      }
    ];
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formulario = this.fb.group({
      citas: [null, Validators.compose([Validators.required])]
    });
  }
}
