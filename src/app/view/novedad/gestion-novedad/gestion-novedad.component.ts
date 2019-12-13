import {Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy, ViewChild} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import * as moment from 'moment';
import {MensajesService} from '../../../shared/services/mensajes.service';
import {AgregadosNovedadService} from '../../../shared/services/agregados-novedad.service';
import {GestionNovedadViewModel} from './gestion-novedad.view-model';
import {GestionNovedadService} from '../../../domain/usecase/novedad/gestion-novedad.service';
import {EstadosNovedadEnum} from '../../../shared/utils/enums/estados-novedad.enum';
import {LocalStorage} from '@ngx-pwa/local-storage';
import {Router} from '@angular/router';
import {FiltrosGestionNovedadesRequest} from '../../../infraestructure/request-model/novedad/filtros-gestion-novedad.request';
import {ComunService} from '../../../domain/usecase/comun/comun.service';
import {AgregadosComunService} from '../../../shared/services/agregados-comun.service';
import {MatDialog, MatSort} from '@angular/material';
import {ModalConfirmacionComponent} from '../../../shared/components/modal-confirmacion/modal-confirmacion.component';
import {ModalConfirmacion} from '../../../shared/models/modal-confirmacion.model';
import {GestionarNovedadRequest} from '../../../infraestructure/request-model/novedad/gestionar-novedad.request';
import {TipoNovedadEnum} from '../../../shared/utils/enums/tipo-novedad.enum';
import {UsuarioService} from '../../../shared/services/usuario.service';
import {CapturarErrores} from '../../../shared/services/capturar-errores';

moment.locale('es');

@Component({
  selector: 'sura-gestion-novedad',
  templateUrl: './gestion-novedad.component.html',
  styleUrls: ['./gestion-novedad.component.scss']
})
export class GestionNovedadComponent implements OnInit, AfterViewInit, OnDestroy {
  public configEspanolCalendario: any;
  public gestionNovedadViewModel: GestionNovedadViewModel = this.iniciarViewModel();
  public formularioFiltros: FormGroup;
  public columnas: any[];
  private tiposIdentificacionSubscripcion = new Subscription();
  private ciudadesSubscripcion = new Subscription();
  private pisosSubscripcion = new Subscription();
  private novedadesSubscripcion = new Subscription();
  private profesionesSubscripcion = new Subscription();
  private gestionarEscalarNovedadSubscripcion = new Subscription();
  public totalRegistros = 0;
  public EstadosNovedadEnum: EstadosNovedadEnum;
  public loading = false;


  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {
    this.configurarCalendario();
    this.getDatos();
    console.log(
      'this.infoGestionNovedad.datosPacienteNovedad ',
      this.infoGestionNovedad.datosPacienteNovedad
    );
    if (
      this.infoGestionNovedad.datosPacienteNovedad !== undefined &&
      this.infoGestionNovedad.datosPacienteNovedad !== null
    ) {
      this.formularioFiltros.controls['tipoDocumento'].setValue(
        this.infoGestionNovedad.datosPacienteNovedad.tipoDocumentoPaciente
          .idTipo
      );
      this.formularioFiltros.controls['numeroDocumento'].setValue(
        this.infoGestionNovedad.datosPacienteNovedad.numeroDocumentoPaciente
      );
      this.formularioFiltros.controls['ciudad'].setValue(
        this.infoGestionNovedad.datosPacienteNovedad.piso.idCiudad
      );
      if (this.infoGestionNovedad.datosPacienteNovedad.piso.idCiudad) {
        this.getPisos(
          this.infoGestionNovedad.datosPacienteNovedad.piso.idCiudad
        );
        this.formularioFiltros.controls['piso'].setValue([
          this.infoGestionNovedad.datosPacienteNovedad.piso.idPiso
        ]);
      }
      if (
        this.infoGestionNovedad.datosPacienteNovedad.estadoRemision ===
        EstadosNovedadEnum.PENDIENTE_GESTION
      ) {
        this.gestionNovedadViewModel.verColumnaAccion = true;
      } else {
        this.gestionNovedadViewModel.verColumnaAccion = false;
      }
      this.formularioFiltros.controls['remision'].setValue(
        this.infoGestionNovedad.datosPacienteNovedad.remision
      );

      this.infoGestionNovedad.datosPacienteNovedad = null;

      this.busqueda(0, 10);
    } else {
      this.localStorage
        .getItem<any>('formFiltrosGestionNovedad').subscribe(filtros => {
          if (filtros !== null) {
            console.log('filtros ', filtros);
            this.formularioFiltros.controls['tipoDocumento'].setValue(
              filtros.tipoDocumento
            );
            this.formularioFiltros.controls['numeroDocumento'].setValue(
              filtros.numeroDocumento
            );
            this.formularioFiltros.controls['ciudad'].setValue(filtros.ciudad);
            if (filtros.ciudad) {
              this.getPisos(filtros.ciudad);
              this.formularioFiltros.controls['piso'].setValue(filtros.piso);
            }
            this.formularioFiltros.controls['estado'].setValue(filtros.estado);
            if (filtros.estado === EstadosNovedadEnum.PENDIENTE_GESTION) {
              this.gestionNovedadViewModel.verColumnaAccion = true;
            } else {
              this.gestionNovedadViewModel.verColumnaAccion = false;
            }
            this.formularioFiltros.controls['remision'].setValue(
              filtros.remision
            );

            this.busqueda(0, 10);
          }
        });
    }
  }

  ngOnDestroy() {
    this.tiposIdentificacionSubscripcion.unsubscribe();
    this.ciudadesSubscripcion.unsubscribe();
    this.pisosSubscripcion.unsubscribe();
    this.profesionesSubscripcion.unsubscribe();
  }

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private gestionNovedadService: GestionNovedadService,
    private mensajesService: MensajesService,
    private infoGestionNovedad: AgregadosNovedadService,
    private comunService: ComunService,
    private infoComunes: AgregadosComunService,
    protected localStorage: LocalStorage,
    public cdRef: ChangeDetectorRef,
    private route: Router,
    private usuarioService: UsuarioService,
    private capturaDeErroresService: CapturarErrores
  ) {
    this.crearFormularioFiltros();
    this.generarColumnas();
  }

  private getDatos(): void {
    this.getTiposIdentificacion();
    this.getCiudades();
    this.getEstadosNovedad();
    // this.getProfesiones();
  }

  public gestionarNovedad(novedad: any): void {
    console.log('NOVEDAD A GESTIONAR ', novedad);

    if (novedad.tipoNovedad === TipoNovedadEnum.ACTIVACION) {
      const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
        width: '30%',
        disableClose: false,
        data: new ModalConfirmacion(
          this.gestionNovedadViewModel.mensajes.tabla.tituloGestionarNovedadActivacion,
          this.gestionNovedadViewModel.mensajes.tabla.contenidoGestionarNovedadActivacion
        )
      });

      dialogRef.afterClosed().subscribe(data => {
        if (data && data === true) {
          const GESTION_NOVEDAD = new GestionarNovedadRequest(
            novedad.idSolicitud,
            EstadosNovedadEnum.GESTIONADA,
            novedad.tipoNovedad,
            new Date(),
            this.usuarioService.InfoUsuario
          );
          console.log('REQUEST - GESTIONAR ', JSON.stringify(GESTION_NOVEDAD));

          this.gestionarEscalarNovedadSubscripcion = this.gestionNovedadService
            .gestionarNovedadManual(GESTION_NOVEDAD)
            .subscribe(
              response => {
                console.log('RESPONSE - GESTIONAR ', response);
                this.mensajesService.mostrarMensajeExito(
                  this.gestionNovedadViewModel.mensajes.mensajesAlerta
                    .exitoGestionarSolicitud
                );
                this.busqueda(0, 10);
              },
              error => {
                this.capturaDeErroresService.mapearErrores(error.status, error.error);
              },
              () => {
              }
            );
        }
      });

      return;
    }

    this.infoGestionNovedad.datosGestionNovedadSeleccionada = novedad;
    console.log('Novedad: ' + JSON.stringify(this.infoGestionNovedad.datosGestionNovedadSeleccionada));
    this.route.navigate(['novedad/detalle-gestion']);
  }

  /**
   * Obtiene los tipos de identificación
   */
  private getTiposIdentificacion(): void {
    this.tiposIdentificacionSubscripcion = this.gestionNovedadService
      .getTiposIdentificacion()
      .subscribe(
        response => {
          if (response) {
            this.gestionNovedadViewModel.respuestaTiposIdentificacion = response;
          }
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
        }
      );
  }

  /**
   * Obtiene las ciudades
   */
  private getCiudades(): void {
    this.ciudadesSubscripcion = this.gestionNovedadService
      .getCiudades()
      .subscribe(
        response => {
          if (response) {
            this.gestionNovedadViewModel.respuestaCiudades = response;
          }
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
        }
      );
  }

  /**
   * Obtiene los pisos según la ciudad
   */
  private getPisos(ciudad: string): void {
    this.pisosSubscripcion = this.gestionNovedadService
      .getPisosCiudad(ciudad)
      .subscribe(
        response => {
          this.gestionNovedadViewModel.respuestaPisos = response;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
        }
      );
  }

  /**
   * Obtiene los estados de la novedad
   */
  private getEstadosNovedad(): void {
    this.gestionNovedadViewModel.Estados = [
      EstadosNovedadEnum.GESTIONADA,
      EstadosNovedadEnum.PENDIENTE_GESTION,
      EstadosNovedadEnum.ESCALADA
    ];
  }

  /*
    /!**
     * Obtiene las profesiones usadas donde se deban visualizar citas
     *!/
    public getProfesiones(): void {
      this.profesionesSubscripcion = this.comunService.getProfesiones().subscribe(
        response => {
          this.infoComunes.datosProfesionales = response;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {}
      );
    }*/

  public seleccionPiso(event: any): void {
    this.getPisos(event.value);
  }

  /**
   *
   */
  public buscar(): void {
    this.loading = true;
    this.busqueda(0, 10);
  }

  public onPageGestionNovedad(event: any): void {
    this.busqueda(event.first, event.rows);
  }

  public busqueda(pagina: number, tamano: number) {
    if (this.formularioFiltros.valid) {
      const paginaTabla = pagina / tamano;

      const CONSULTA = new FiltrosGestionNovedadesRequest(
        this.formularioFiltros.controls['tipoDocumento'].value,
        this.formularioFiltros.controls['numeroDocumento'].value === ''
          ? null
          : this.formularioFiltros.controls['numeroDocumento'].value,
        this.formularioFiltros.controls['ciudad'].value,
        this.formularioFiltros.controls['piso'].value == null ||
        this.formularioFiltros.controls['piso'].value.length === 0
          ? null
          : this.formularioFiltros.controls['piso'].value,
        this.formularioFiltros.controls['estado'].value,
        this.formularioFiltros.controls['remision'].value === ''
          ? null
          : this.formularioFiltros.controls['remision'].value,
        paginaTabla,
        tamano
      );

      console.log('los parametros de la consulta ', JSON.stringify(CONSULTA));
      console.log('los parametros de la consulta ', CONSULTA);

      this.novedadesSubscripcion = this.gestionNovedadService
        .getSolicitudesNovedades(CONSULTA)
        .subscribe(
          response => {

            console.log('RESPONSE  david', response);
            if (
              this.formularioFiltros.controls['estado'].value ===
              EstadosNovedadEnum.PENDIENTE_GESTION
            ) {
              this.gestionNovedadViewModel.verColumnaAccion = true;
            } else {
              this.gestionNovedadViewModel.verColumnaAccion = false;
            }
            this.gestionNovedadViewModel.respuestaNovedades = response.content;
            console.log(
              'this.gestionNovedadViewModel.respuestaNovedades ',
              this.gestionNovedadViewModel.respuestaNovedades
            );
            this.infoGestionNovedad.datosGestionNovedad = response.content;
            this.totalRegistros = response.totalElements;
            this.loading = false;
          },
          error => {
            this.capturaDeErroresService.mapearErrores(error.status, error.error);
            console.log('Error Filtro - Gestion novedad ', error);
            this.loading = false;
          },
          () => {
            this.novedadesSubscripcion.unsubscribe();
          }
        );
    } else {
      this.validarTodosLosCamposDelFormulario(this.formularioFiltros);
    }
  }

  public guardarFiltros(): void {
    this.localStorage
      .setItem('formFiltrosGestionNovedad', this.formularioFiltros.value)
      .subscribe(() => {
      });
  }

  public limpiar(): void {
    this.localStorage
      .removeItem('formFiltrosGestionNovedad')
      .subscribe(() => {
      });
    this.formularioFiltros.reset();
  }

  public limpiarDocumento(): void {
    this.formularioFiltros.controls['numeroDocumento'].setValue(null);
  }

  public limpiarRemision(): void {
    this.formularioFiltros.controls['remision'].setValue(null);
  }

  /**
   * Genera columnas para la tabla
   */
  private generarColumnas(): void {
    this.columnas = [
      {
        field: this.gestionNovedadViewModel.mensajes.tabla.tipoNovedadCampo,
        header: this.gestionNovedadViewModel.mensajes.tabla.tipoNovedad
      },
      {
        field: this.gestionNovedadViewModel.mensajes.tabla.nombrePacienteCampo,
        header: this.gestionNovedadViewModel.mensajes.tabla.nombrePaciente
      },
      {
        field: this.gestionNovedadViewModel.mensajes.tabla
          .numeroIdentificacionCampo,
        header: this.gestionNovedadViewModel.mensajes.tabla.numeroIdentificacion
      },
      {
        field: this.gestionNovedadViewModel.mensajes.tabla.pisoCampo,
        header: this.gestionNovedadViewModel.mensajes.tabla.piso
      },
      {
        field: this.gestionNovedadViewModel.mensajes.tabla.usuarioReportaCampo,
        header: this.gestionNovedadViewModel.mensajes.tabla.usuarioReporta
      },
      {
        field: this.gestionNovedadViewModel.mensajes.tabla.fechaSolicitudCampo,
        header: this.gestionNovedadViewModel.mensajes.tabla.fechaSolicitud
      },
      {
        field: this.gestionNovedadViewModel.mensajes.tabla
          .estadoSolicitudNovedadCampo,
        header: this.gestionNovedadViewModel.mensajes.tabla
          .estadoSolicitudNovedad
      },
      {
        field: this.gestionNovedadViewModel.mensajes.tabla
          .usuarioGestionCampo,
        header: this.gestionNovedadViewModel.mensajes.tabla
          .usuarioGestion
      },
      {
        field: this.gestionNovedadViewModel.mensajes.tabla
          .fechaGestionCampo,
        header: this.gestionNovedadViewModel.mensajes.tabla
          .fechaGestion
      }
    ];
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): GestionNovedadViewModel {
    return new GestionNovedadViewModel(
      null,
      null,
      [],
      [],
      [],
      [],
      [],
      [],
      false
    );
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormularioFiltros(): void {
    this.formularioFiltros = this.fb.group({
      tipoDocumento: [null],
      numeroDocumento: [
        null,
        Validators.compose([
          Validators.maxLength(20),
          Validators.pattern('[0-9]+')
        ])
      ],
      ciudad: [null, Validators.compose([Validators.required])],
      piso: [null],
      estado: [null],
      remision: [null, Validators.compose([Validators.maxLength(20)])]
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

  /**
   * Válida todos los campos del formulario
   * @param formGroup
   */
  validarTodosLosCamposDelFormulario(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validarTodosLosCamposDelFormulario(control);
      }
    });
  }
}
