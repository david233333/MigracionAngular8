import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import * as moment from 'moment';
import {MensajesService} from '../../../../shared/services/mensajes.service';
import {DetalleGestionViewModel} from './detalle-gestion.view-model';
import {Router} from '@angular/router';
import {GestionNovedadService} from '../../../../domain/usecase/novedad/gestion-novedad.service';
import {MatDialog} from '@angular/material';
import {ModalCitaGestionComponent} from './modal-cita-gestion/modal-cita-gestion.component';
import {AgregadosNovedadService} from '../../../../shared/services/agregados-novedad.service';
import {ModalDireccionComponent} from '../../../remision/datos-atencion/modal-direccion/modal-direccion.component';
import {EstadosNovedadEnum} from '../../../../shared/utils/enums/estados-novedad.enum';
import {TipoNovedadEnum} from '../../../../shared/utils/enums/tipo-novedad.enum';
import {GestionarNovedadRequest} from '../../../../infraestructure/request-model/novedad/gestionar-novedad.request';
import {ModalTratamientosComponent} from '../../plan-manejo/modal-tratamientos/modal-tratamientos.component';
import {ModalCitasComponent} from '../../citas/modal-citas/modal-citas.component';
import {ModalProcedimientosComponent} from '../../plan-manejo/modal-procedimientos/modal-procedimientos.component';
import {ProcedimientoNovedadEnum} from '../../../../shared/utils/enums/procedimiento-novedad.enum.';
import {Curacion} from '../../../../domain/model/novedad/entity/plan-manejo/procedimientos/curacion.model';
import {Sondaje} from '../../../../domain/model/novedad/entity/plan-manejo/procedimientos/sondaje-model';
import {Fototerapia} from '../../../../domain/model/novedad/entity/plan-manejo/procedimientos/fototerapia.model';
import {TomaMuestra} from '../../../../domain/model/novedad/entity/plan-manejo/procedimientos/toma-muestra.model';
import {AspiracionSecrecion} from '../../../../domain/model/novedad/entity/plan-manejo/procedimientos/aspiracion-secrecion.model';
import {Canalizacion} from '../../../../domain/model/novedad/entity/plan-manejo/procedimientos/canalizacion.model';
import {ProgramacionCitaService} from '../../../../domain/usecase/programacion/programacion-cita.service';
import {SoporteNutricional} from '../../../../domain/model/novedad/entity/plan-manejo/procedimientos/soporte-nutricional.model';
import {Tratamiento} from '../../../../domain/model/novedad/entity/plan-manejo/tratamiento.model';
import {UsuarioService} from '../../../../shared/services/usuario.service';
import {CapturarErrores} from '../../../../shared/services/capturar-errores';
import {TipoCambioCitaPipe} from '../../../../shared/pipes/tipo-cambio-cita.pipe';

moment.locale('es');

@Component({
  selector: 'sura-detalle-gestion',
  templateUrl: './detalle-gestion.component.html',
  styleUrls: ['./detalle-gestion.component.scss']
})
export class DetalleGestionComponent
  implements OnInit, AfterViewInit, OnDestroy {
  public configEspanolCalendario: any;
  public detalleGestionViewModel: DetalleGestionViewModel = this.iniciarViewModel();
  public formularioFiltros: FormGroup;
  public formularioDatosPaciente: FormGroup;
  public formularioCambioPiso: FormGroup;
  public formularioEgreso: FormGroup;
  public formularioCuidador: FormGroup;
  public formularioDiagnostico: FormGroup;
  public formularioAlertaCita:FormGroup;
  public formularioEquipoBiomedico:FormGroup;
  public formularioCancelacionCita:FormGroup;
  public formularioAplicacionCuidador:FormGroup;
  public formularioFijarCita:FormGroup;
  public formularioDesfijarCita:FormGroup;
  public formularioAsignarProfesional:FormGroup;
  public formularioDesAsignarProfesional:FormGroup;
  public formularioAdicionarReprogramarCita: FormGroup;
  public columnasNovedades: any[];
  public columnasTratamientos: any[];
  public columnasCitas: any[];
  public columnasCuraciones: any[];
  public columnasSondajes: any[];
  public columnasTerapias: any[];
  public columnasFototerapias: any[];
  public columnasTomaMuestras: any[];
  public columnasSecreciones: any[];
  public columnasCanalizaciones: any[];
  public columnasSoporteNutricional: any[];
  public tipoProcedimiento = ProcedimientoNovedadEnum;
  private novedadesSubscripcion = new Subscription();
  private detalleNovedadSubscripcion = new Subscription();
  private gestionarEscalarNovedadSubscripcion = new Subscription();
  private citasSubscripcion: Subscription = new Subscription();
  private nombreCiudad = '';
  private especialidad = '';
  private idNovedadPk = '';
  private idPrograma = '';
  private ocultar = false;

  constructor(
    private fb: FormBuilder,
    private gestionNovedadService: GestionNovedadService,
    private mensajesService: MensajesService,
    private dialog: MatDialog,
    public cdRef: ChangeDetectorRef,
    private route: Router,
    private infoGestionNovedad: AgregadosNovedadService,
    private programacionCitaService: ProgramacionCitaService,
    private usuarioService: UsuarioService,
    private capturaDeErroresService: CapturarErrores
  ) {
    this.generarColumnasNovedades();
    this.generarColumnasTratamientos();
    this.generarColumnasProcedimientos();
    this.generarColumnasCitas();
    this.crearFormularioDatosPaciente();
    this.crearFormularioCambioPiso();
    this.crearFormularioEgreso();
    this.crearFormularioCuidador();
    this.crearFormularioDiagnostico();
    this.crearFormularioAlertaCita();
    this.crearFormularioEquipoBiomedico();
    this.crearFormularioCancelacionCita();
    this.crearFormularioAplicacionCuidador();
    this.crearFormularioAdicionarReprogramarCita();
    this.crearFormularioFijarCita();
    this.crearFormularioDesfijarCita();
    this.crearFormularioProfesionalAsiganado();
    this.crearFormularioProfesionalDesAsignado();
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {
    if (this.infoGestionNovedad.datosGestionNovedadSeleccionada !== undefined) {
      console.log('Entré 1');
      this.getDatos();
    } else {
      this.route.navigate(['novedad/gestionar-novedades']);
    }
  }

  ngOnDestroy() {
    this.novedadesSubscripcion.unsubscribe();
    this.detalleNovedadSubscripcion.unsubscribe();
    this.gestionarEscalarNovedadSubscripcion.unsubscribe();
    this.citasSubscripcion.unsubscribe();
  }

  public volverAtras(): void {
    this.route.navigate(['novedad/gestionar-novedades']);
  }

  /**
   * Obtiene las citas para aplicar el nuevo plan de manejo
   */
  public getCitas(): void {
    switch (this.detalleGestionViewModel.informacionSolicitud.tipoNovedad) {
      case TipoNovedadEnum.PLAN_MANEJO:
      case TipoNovedadEnum.ENFERMERIA:
      case TipoNovedadEnum.TERAPIAS_FISICAS:
      case TipoNovedadEnum.TERAPIAS_RESPIRATORIAS:
      case TipoNovedadEnum.TERAPIAS_FONOAUDIOLOGIA:
      case TipoNovedadEnum.TERAPIA_OCUPACIONAL:
      case TipoNovedadEnum.MEDICINA:
      case TipoNovedadEnum.LABORATORIO_BACTERIOLOGO:
      case TipoNovedadEnum.LABORATORIO_ENFERMERIA:
      case TipoNovedadEnum.NUTRICIONISTA:
      case TipoNovedadEnum.SICOLOGIA:
      case TipoNovedadEnum.TRABAJO_SOCIAL:
      case TipoNovedadEnum.BACTERIOLOGO:
      case TipoNovedadEnum.MEDICINA_CRONICOS:
      case TipoNovedadEnum.MEDICINA_PALEATIVOS:
      case TipoNovedadEnum.MEDICINA_AGUDOS:
      case TipoNovedadEnum.MEDICINA_AMI:
      case TipoNovedadEnum.MEDICINA_PAS:
      case TipoNovedadEnum.NUEVAAPLICACION_CUIDADOR:
      case TipoNovedadEnum.ACTIVACION:
      case TipoNovedadEnum.CITAS:
      case TipoNovedadEnum.AGREGAR_CITA:
      case TipoNovedadEnum.REPROGRAMAR_CITA:
        this.citasSubscripcion = this.programacionCitaService
          .getProgramacionEspecialidad(
            this.detalleGestionViewModel.informacionSolicitud.idRemision,
            this.detalleGestionViewModel.informacionSolicitud.objectNovedad
              .especialidad
          )
          .subscribe(
            response => {
              console.log('response getProgramacionEspecialidad ', response);
              this.detalleGestionViewModel.visitas = response;


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
        break;
      case TipoNovedadEnum.DATOS_ATENCION:
      case TipoNovedadEnum.EGRESO:
        this.citasSubscripcion = this.programacionCitaService
          .getProgramacion(
            this.detalleGestionViewModel.informacionSolicitud.idRemision
          )
          .subscribe(
            response => {
              this.detalleGestionViewModel.visitas = response;
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
        break;
    }
  }

  /**
   *
   */
  public novedadSeleccionada(novedad: any): void {
    console.log('Seleccionada: ' + novedad);
    this.detalleNovedadSubscripcion = this.gestionNovedadService
      .getSolicitudNovedad(novedad.idSolicitud)
      .subscribe(
        solicitud => {
          this.nombreCiudad = solicitud.ciudad.nombre;
          this.idPrograma = solicitud.piso.idPrograma;

          console.log('DETALLE SOLICITUD SELECCIONADA ', solicitud);
          this.detalleGestionViewModel.usuarioRegistra =
            solicitud.usuarioSolicita;
          this.detalleGestionViewModel.usuarioGestiona = this.usuarioService.InfoUsuario.username;
          this.detalleGestionViewModel.informacionSolicitud = solicitud;

          this.detalleGestionViewModel.esPendienteGestionar =
            solicitud.estadoSolicitudNovedad === EstadosNovedadEnum.PENDIENTE_GESTION ? true : false;

          this.getCitas();
          switch (solicitud.tipoNovedad) {
            case TipoNovedadEnum.PLAN_MANEJO:
              this.detalleGestionViewModel.esPlanManejoDetalle = true;

              console.log('solicitud.objectNovedad ', solicitud.objectNovedad);

              if (solicitud.objectNovedad.planManejo.procedimientos != null) {
                this.detalleGestionViewModel.curaciones =
                  solicitud.objectNovedad.planManejo.procedimientos.curaciones;
                this.detalleGestionViewModel.sondajes =
                  solicitud.objectNovedad.planManejo.procedimientos.sondajes;
                this.detalleGestionViewModel.fototerapias =
                  solicitud.objectNovedad.planManejo.procedimientos.fototerapias;
                this.detalleGestionViewModel.tomaMuestras =
                  solicitud.objectNovedad.planManejo.procedimientos.tomaMuestras;
                this.detalleGestionViewModel.secreciones =
                  solicitud.objectNovedad.planManejo.procedimientos.secreciones;
                this.detalleGestionViewModel.canalizaciones =
                  solicitud.objectNovedad.planManejo.procedimientos.canalizaciones;
                this.detalleGestionViewModel.soporteNutricionales = [];
                solicitud.objectNovedad.planManejo.procedimientos.soporteNutricionales.forEach(
                  soporte => {
                    const SOPORTE: SoporteNutricional = new SoporteNutricional(
                      soporte.id,
                      soporte.medicamento,
                      soporte.cantidadDosis,
                      soporte.unidadDosis,
                      soporte.tipoNutricion,
                      soporte.duracion,
                      soporte.volumen,
                      soporte.noPBS,
                      soporte.eventos
                    );
                    this.detalleGestionViewModel.soporteNutricionales.push(
                      SOPORTE
                    );
                  }
                );
                this.detalleGestionViewModel.detalleNovedad =
                  solicitud.objectNovedad.planManejo.procedimientos;
                this.detalleGestionViewModel.esProcedimientosDetalle = this.verProcedimientos();
              }

              if (solicitud.objectNovedad.planManejo.tratamientos.length > 0) {
                this.detalleGestionViewModel.esTratamientosDetalle = true;
                this.detalleGestionViewModel.tratamientos = [];
                solicitud.objectNovedad.planManejo.tratamientos.forEach(
                  tratamiento => {
                    const TRATAMIENTO: Tratamiento = new Tratamiento(
                      tratamiento.id,
                      tratamiento.idTratamiento,
                      tratamiento.idRemisionPK,
                      tratamiento.tratamiento,
                      tratamiento.medicamento,
                      tratamiento.cantidadDosis,
                      tratamiento.unidadDosis,
                      tratamiento.viaAdministracion,
                      tratamiento.diluyente,
                      tratamiento.cantidadDiluyente,
                      tratamiento.frecuencia,
                      tratamiento.duracion,
                      tratamiento.ultimaAplicacion,
                      tratamiento.noPBS,
                      tratamiento.dosisFaltantes,
                      tratamiento.rescate,
                      tratamiento.turnoEnfermeria,
                      tratamiento.cantidadDosisRescate,
                      tratamiento.unidadDosisRescate,
                      tratamiento.dosisDiaRescate


                    );
                    this.detalleGestionViewModel.tratamientos.push(TRATAMIENTO);
                  }
                );

                this.detalleGestionViewModel.detalleNovedad =
                  solicitud.objectNovedad.planManejo.tratamientos;
              }
              break;
            case TipoNovedadEnum.DATOS_ATENCION:
              this.detalleGestionViewModel.esDatosPacienteDetalle = true;
              this.detalleGestionViewModel.detalleNovedad =
                solicitud.objectNovedad.datosAtencionPaciente;
              this.cargarControlesDatosPaciente(
                this.detalleGestionViewModel.detalleNovedad
              );
              break;
            case TipoNovedadEnum.ENFERMERIA:
            case TipoNovedadEnum.TERAPIAS_FISICAS:
            case TipoNovedadEnum.TERAPIAS_RESPIRATORIAS:
            case TipoNovedadEnum.TERAPIAS_FONOAUDIOLOGIA:
            case TipoNovedadEnum.TERAPIA_OCUPACIONAL:
            case TipoNovedadEnum.MEDICINA:
            case TipoNovedadEnum.LABORATORIO_BACTERIOLOGO:
            case TipoNovedadEnum.LABORATORIO_ENFERMERIA:
            case TipoNovedadEnum.NUTRICIONISTA:
            case TipoNovedadEnum.SICOLOGIA:
            case TipoNovedadEnum.TRABAJO_SOCIAL:
            case TipoNovedadEnum.BACTERIOLOGO:
            case TipoNovedadEnum.MEDICINA_CRONICOS:
            case TipoNovedadEnum.MEDICINA_PALEATIVOS:
            case TipoNovedadEnum.MEDICINA_AGUDOS:
            case TipoNovedadEnum.MEDICINA_AMI:
            case TipoNovedadEnum.MEDICINA_PAS:
            case TipoNovedadEnum.NUEVAAPLICACION_CUIDADOR:
            case TipoNovedadEnum.CITAS:
              this.detalleGestionViewModel.esCitasDetalle = true;
              this.detalleGestionViewModel.citasTabla.splice(0);
              this.detalleGestionViewModel.citasTabla.push(
                solicitud.objectNovedad
              );
              this.detalleGestionViewModel.detalleNovedad =
                solicitud.objectNovedad;
              break;
            case TipoNovedadEnum.AGREGAR_CITA:
            case TipoNovedadEnum.REPROGRAMAR_CITA:
              this.detalleGestionViewModel.esAdicionReprogramarCitaDetalle = true;
              this.detalleGestionViewModel.detalleNovedad =
                solicitud.objectNovedad;
              this.cargarControlesAgregarReprogramarCita(
                this.detalleGestionViewModel.detalleNovedad
              );
              if (solicitud.tipoNovedad === TipoNovedadEnum.AGREGAR_CITA) {
                this.detalleGestionViewModel.tituloAgregarReprogramarCita = this.detalleGestionViewModel.mensajesCitas.titulos.agregarCita;
              } else {
                this.detalleGestionViewModel.tituloAgregarReprogramarCita =
                  this.detalleGestionViewModel.mensajesCitas.titulos.reprogramarCita;
              }
              break;
            case TipoNovedadEnum.CAMBIO_PISO:
              this.detalleGestionViewModel.esCambioPisoDetalle = true;
              this.detalleGestionViewModel.detalleNovedad =
                solicitud.objectNovedad;
              this.cargarControlesCambioPiso(
                this.detalleGestionViewModel.detalleNovedad
              );
              break;
            case TipoNovedadEnum.EGRESO:
              this.detalleGestionViewModel.esEgresoDetalle = true;
              this.detalleGestionViewModel.detalleNovedad = solicitud.objectNovedad;
              this.cargarControlesEgreso(
                this.detalleGestionViewModel.detalleNovedad
              );
              break;
            case TipoNovedadEnum.CUIDADOR:
              this.detalleGestionViewModel.esCuidador = true;
              this.detalleGestionViewModel.detalleNovedad = solicitud.objectNovedad;
              this.cargarControleCuidador(this.detalleGestionViewModel.detalleNovedad);
              break;
            case TipoNovedadEnum.DIAGNOSTICOS:
                this.detalleGestionViewModel.esDiagnostico = true;
                this.detalleGestionViewModel.detalleNovedad = solicitud.objectNovedad;
                this.cargarControleDiagnosticos(this.detalleGestionViewModel.detalleNovedad);
                break;
            case TipoNovedadEnum.ALERTA_CITA:
                this.detalleGestionViewModel.esAlertaCita = true;
                this.detalleGestionViewModel.detalleNovedad = solicitud.objectNovedad;
                this.cargarControleAlertaCita(this.detalleGestionViewModel.detalleNovedad);    
                break;
            case TipoNovedadEnum.EQUIPOS_BIOMEDICOS:
                this.detalleGestionViewModel.esEquiposBiomedicos = true;
                this.detalleGestionViewModel.detalleNovedad = solicitud.objectNovedad;
                this.cargarControleEquipoBiomedico(this.detalleGestionViewModel.detalleNovedad);    
                break;
            case TipoNovedadEnum.CANCELAR_CITA:
                this.detalleGestionViewModel.esCancelacionCita = true;
                this.detalleGestionViewModel.detalleNovedad = solicitud.objectNovedad;
                this.cargarControleCancelacionCita(this.detalleGestionViewModel.detalleNovedad);     
                break;
            case  TipoNovedadEnum.APLICACION_CUIDADOR:
                this.detalleGestionViewModel.esAplicacionCuidador = true;
                this.detalleGestionViewModel.detalleNovedad = solicitud.objectNovedad;
                this.cargarControleAplicacionCuidador(this.detalleGestionViewModel.detalleNovedad);  
                break;
            case  TipoNovedadEnum.FIJAR_CITA:
                this.detalleGestionViewModel.esCitaFijada = true;
                this.detalleGestionViewModel.detalleNovedad = solicitud.objectNovedad;
                this.cargarControleFijarCita(this.detalleGestionViewModel.detalleNovedad);  
                break;
            case  TipoNovedadEnum.DESFIJAR_CITA:
                this.detalleGestionViewModel.esCitaDesfijada = true;
                this.detalleGestionViewModel.detalleNovedad = solicitud.objectNovedad;
                this.cargarControleDesFijarCita(this.detalleGestionViewModel.detalleNovedad);
                break;
            case  TipoNovedadEnum.ASIGNAR_PROFESIONAL:
                this.detalleGestionViewModel.esProfesionalAsignado = true;
                this.detalleGestionViewModel.detalleNovedad = solicitud.objectNovedad;
                this.cargarControleAsignarProfesional(this.detalleGestionViewModel.detalleNovedad);
                break;
            case  TipoNovedadEnum.QUITAR_ASIGNACION:
                this.detalleGestionViewModel.esProfesionalDesAsiganado = true;
                this.detalleGestionViewModel.detalleNovedad = solicitud.objectNovedad;
                this.cargarControleDesAsiganarProfesional(this.detalleGestionViewModel.detalleNovedad);                                     
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
   *
   */
  public gestionar(): void {
    this.abrirModalVisitas();
  }

  /**
   *
   */
  public escalar(): void {
    const GESTION_NOVEDAD = new GestionarNovedadRequest(
      this.detalleGestionViewModel.informacionSolicitud.idSolicitud,
      EstadosNovedadEnum.ESCALADA,
      this.detalleGestionViewModel.informacionSolicitud.tipoNovedad,
      null,
      this.usuarioService.InfoUsuario
    );

    console.log('REQUEST - ESCALAR ', JSON.stringify(GESTION_NOVEDAD));
    this.gestionarEscalarNovedadSubscripcion = this.gestionNovedadService
      .gestionarNovedadManual(GESTION_NOVEDAD)
      .subscribe(
        response => {
          console.log('RESPONSE - ESCALAR ', response);
          this.mensajesService.mostrarMensajeExito(
            this.detalleGestionViewModel.mensajesDetalleGestion.mensajesAlerta
              .exitoEscalarSolicitud
          );
          this.route.navigate(['novedad/gestionar-novedades']);
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
        }
      );
  }

  /**
   *
   */
  public abrirModalDireccion(): void {
    const dialogRef = this.dialog.open(ModalDireccionComponent, {
      width: '90%',
      disableClose: false,
      data: {
        ciudad: this.detalleGestionViewModel.detalleNovedad.ubicacion
          .ciudadPrincipal,
        barrio: this.detalleGestionViewModel.detalleNovedad.ubicacion.barrio,
        direccion: this.detalleGestionViewModel.detalleNovedad.ubicacion
          .direccion,
        municipio: this.detalleGestionViewModel.detalleNovedad.ubicacion
          .municipio,
        ubicacion: this.detalleGestionViewModel.detalleNovedad.ubicacion,
        esNovedad: true,
        esDetalle: true
      }
    });
  }

  /**
   *
   */
  public abrirModalTratamiento(tratamiento: any): void {
    console.log('tratamiento detalle para mirar rescate ', tratamiento);
    const dialogRef = this.dialog.open(ModalTratamientosComponent, {
      width: '90%',
      disableClose: false,
      data: {
        tratamiento: tratamiento,
        esDetalle: true,
        descripcion : tratamiento.viaAdministracion.descripcion,
       

      }
    });
  }

  /**
   *
   */
  public abrirModalProcedimientos(elemento: any, tipo: string): void {
    let procedimiento = null;
    console.log('elemento ', elemento);

    switch (tipo) {
      case this.tipoProcedimiento.CURACIONES:
        procedimiento = new Curacion(
          elemento.id,
          elemento.tipoCuracion,
          elemento.dias,
          elemento.sesiones,
          elemento.descripcion,
          elemento.ultimaCuracion
        );
        break;
      case this.tipoProcedimiento.SONDAJES:
        procedimiento = new Sondaje(
          elemento.id,
          elemento.idTipoSondaje,
          elemento.tipoSondajeIngreso,
          elemento.idSondaje,
          elemento.sondaje,
          elemento.fechaSondaje,
          elemento.totalSesiones
        );
        break;
      case this.tipoProcedimiento.FOTOTERAPIAS:
        procedimiento = new Fototerapia(
          elemento.id,
          elemento.diasTratamiento,
          elemento.tipoFrecuencia
        );
        break;
      case this.tipoProcedimiento.TOMA_MUESTRAS:
        procedimiento = new TomaMuestra(
          elemento.id,
          elemento.tipoMuestra,
          elemento.fechaMuestra,
          elemento.requiereAyuno
        );
        break;
      case this.tipoProcedimiento.SECRECIONES:
        procedimiento = new AspiracionSecrecion(
          elemento.id,
          elemento.diasTratamiento,
          elemento.envioAspirador,
          elemento.visitaEnfermeria,
          elemento.tipoSonda,
          elemento.nasal,
          elemento.traqueostomia
        );
        break;
      case this.tipoProcedimiento.CANALIZACIONES:
        procedimiento = new Canalizacion(
          elemento.id,
          elemento.tipoCanalizacion
        );
        break;
      case this.tipoProcedimiento.SOPORTE_NUTRICIONALES:
        procedimiento = new SoporteNutricional(
          elemento.id,
          elemento.medicamento,
          elemento.cantidadDosis,
          elemento.unidadDosis,
          elemento.tipoNutricion,
          elemento.duracion,
          elemento.volumen,
          elemento.noPBS,
          elemento.eventos
        );
        break;
    }

    const dialogRef = this.dialog.open(ModalProcedimientosComponent, {
      width: '90%',
      disableClose: false,
      data: {
        procedimiento: procedimiento,
        esDetalle: true
      }
    });
  }

  /**
   *
   */
  public abrirModalCita(cita: any): void {

    console.log('cita ', cita);
    const dialogRef = this.dialog.open(ModalCitasComponent, {

      width: '90%',
      disableClose: false,
      data: {
        cita: cita,
        esDetalle: true,
        esHistorial: false,
        nombreCiudad: this.nombreCiudad,
        especialidad: this.especialidad,
        idPrograma: this.idPrograma,
        idNovedadPk: this.idNovedadPk
      }
    });
  }

  public verTratamientos(): boolean {
    return this.detalleGestionViewModel.tratamientos.length > 0;
  }

  public verProcedimientos(): boolean {
    return (
      this.detalleGestionViewModel.curaciones.length > 0 ||
      this.detalleGestionViewModel.sondajes.length > 0 ||
      this.detalleGestionViewModel.fototerapias.length > 0 ||
      this.detalleGestionViewModel.tomaMuestras.length > 0 ||
      this.detalleGestionViewModel.secreciones.length > 0 ||
      this.detalleGestionViewModel.canalizaciones.length > 0 ||
      this.detalleGestionViewModel.soporteNutricionales.length > 0
    );
  }

  public verCuraciones(): boolean {
    return this.detalleGestionViewModel.curaciones.length > 0;
  }

  public verSondajes(): boolean {
    return this.detalleGestionViewModel.sondajes.length > 0;
  }

  public verFototerapias(): boolean {
    return this.detalleGestionViewModel.fototerapias.length > 0;
  }

  public verTomaMuestras(): boolean {
    return this.detalleGestionViewModel.tomaMuestras.length > 0;
  }

  public verSecreciones(): boolean {
    return this.detalleGestionViewModel.secreciones.length > 0;
  }

  public verCanalizaciones(): boolean {
    return this.detalleGestionViewModel.canalizaciones.length > 0;
  }

  public verSoporteNutricionales(): boolean {
    return this.detalleGestionViewModel.soporteNutricionales.length > 0;
  }

  private getDatos(): void {
    console.log('Entré 2');
    this.getNovedadesGestion();
  }

  /**
   * Obtiene las novedades para su gestiòn
   */
  private getNovedadesGestion(): void {
    console.log('Selected: ' + JSON.stringify(this.infoGestionNovedad.datosGestionNovedadSeleccionada));
    this.novedadesSubscripcion = this.gestionNovedadService
      .getNovedadesGestion(
        this.infoGestionNovedad.datosGestionNovedadSeleccionada.idRemision,
        this.infoGestionNovedad.datosGestionNovedadSeleccionada.tipoNovedad
      )
      .subscribe(
        response => {
          this.detalleGestionViewModel.respuestaNovedades = response;
          const NOVEDAD_PENDIENTE = this.detalleGestionViewModel.respuestaNovedades.find(
            s =>
              // s.estadoSolicitudNovedad ===
              // EstadosNovedadEnum.PENDIENTE_GESTION &&
              s.idSolicitud ===
              this.infoGestionNovedad.datosGestionNovedadSeleccionada
                .idSolicitud
          );
          console.log('Ajaa ' + NOVEDAD_PENDIENTE);
          this.novedadSeleccionada(NOVEDAD_PENDIENTE);
          this.detalleGestionViewModel.novedadSeleccionada = NOVEDAD_PENDIENTE;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
        }
      );
  }

  private cargarControlesDatosPaciente(info: any): void {
    if (info != null) {
      this.formularioDatosPaciente
        .get('ciudad')
        .setValue(info.ubicacion.ciudadPrincipal.nombre);
      this.formularioDatosPaciente
        .get('municipio')
        .setValue(info.ubicacion.municipio.nombre);
      this.formularioDatosPaciente
        .get('barrio')
        .setValue(info.ubicacion.barrio);
      this.formularioDatosPaciente
        .get('direccion')
        .setValue(info.ubicacion.direccion);

      this.formularioDatosPaciente
        .get('nombreCuidador')
        .setValue(info.nombreCuidador);
      this.formularioDatosPaciente
        .get('nombreResponsable')
        .setValue(info.nombreResponsable);
      this.formularioDatosPaciente
        .get('telefonoPaciente')
        .setValue(info.telefonoPaciente);
      this.formularioDatosPaciente
        .get('celularPaciente')
        .setValue(info.celularPaciente);
      this.formularioDatosPaciente
        .get('celularPaciente2')
        .setValue(info.celularPaciente2);
    }
  }

  private cargarControlesCambioPiso(info: any): void {
    if (info != null) {
      this.formularioCambioPiso.get('piso').setValue(info.piso.nombre);
      this.formularioCambioPiso.get('observacion').setValue(info.observacion);
    }
  }

  private cargarControlesAgregarReprogramarCita(info: any): void {
    if (info != null) {
      const TIPO_CAMBIO = new TipoCambioCitaPipe().transform(
        info.citaAdicional.tipoCambioCita
      );
      this.formularioAdicionarReprogramarCita
        .get('especialidad')
        .setValue(info.profesional);
      this.formularioAdicionarReprogramarCita
        .get('tipoCambioCita')
        .setValue(TIPO_CAMBIO);
      this.formularioAdicionarReprogramarCita
        .get('tipoCita')
        .setValue(info.citaAdicional.tipoCita.tipoCita);
      this.formularioAdicionarReprogramarCita
        .get('fechaCita')
        .setValue(
          moment(info.citaAdicional.fechaCita).format('dddd, DD MMMM - YYYY')
        );
    }
  }

  private cargarControlesEgreso(info: any): void {
    if (info != null) {
      this.formularioEgreso
        .get('motivoEgreso').setValue(info.motivoEgreso.descripcion);
      this.formularioEgreso.get('fechaEgreso').setValue(moment(info.fechaEgreso).format('DD-MMMM-YYYY, hh:mm A'));
      this.formularioEgreso.get('observacion').setValue(info.observacionEgreso);
    }
  }

  private cargarControleCuidador(info: any): void {
    if (info != null) {
      this.formularioCuidador.get('nombreCuidador')
        .setValue(info.datosAtencionPaciente.nombreCuidador);
      this.formularioCuidador.get('nombreResponsable')
        .setValue(info.datosAtencionPaciente.nombreResponsable);
      this.formularioCuidador.get('telefonoPaciente')
        .setValue(info.datosAtencionPaciente.telefonoPaciente);
      this.formularioCuidador.get('celularPaciente')
        .setValue(info.datosAtencionPaciente.celularPaciente);
      this.formularioCuidador.get('celularPaciente2')
        .setValue(info.datosAtencionPaciente.celularPaciente2);
    }
  }

  private cargarControleDiagnosticos(info: any): void {
    if (info != null) {
      this.formularioDiagnostico.get('codigo').setValue(info.diagnosticos[0].codigo);
      this.formularioDiagnostico.get('nombre').setValue(info.diagnosticos[0].nombre);
    }
  }
  
  private cargarControleAlertaCita(info: any): void {
    if(info != null){
      this.formularioAlertaCita.get('textoAlerta').setValue(info.textoAlerta);
      this.formularioAlertaCita.get('duracion').setValue(info.duracion);
      this.formularioAlertaCita.get('cambiarDuracion').setValue(info.cambiarDuracion);
    }
  }

  private cargarControleEquipoBiomedico(info: any):void{
    if(info != null){
      this.formularioEquipoBiomedico.get('descripcion').setValue(info[0].tipoEquipo.descripcion);
      this.formularioEquipoBiomedico.get('estadoDescripcion').setValue(info[0].estado.descripcion);
      if(this.formularioEquipoBiomedico.get('proveedor').value != null)
      this.formularioEquipoBiomedico.get('proveedor').setValue(info.proveedor);
      this.ocultar = false
    }else{
      this.ocultar = true
    }
  } 

  private cargarControleCancelacionCita(info: any):void{
    if(info != null){
      this.formularioCancelacionCita.get('especialidad').setValue(info.especialidad);
      this.formularioCancelacionCita.get('descripcion').setValue(info.motivo.descripcion);
      this.formularioCancelacionCita.get('observacion').setValue(info.observacion);
    }

  }

  private cargarControleAplicacionCuidador(info:any):void{
    if(info != null){
      this.formularioAplicacionCuidador.get('especialidad').setValue(info.citas[0].especialidad);
      this.formularioAplicacionCuidador.get('descripcion').setValue(info.motivo.descripcion);
      this.formularioAplicacionCuidador.get('fechaInicioCita').setValue(info.citas[0].fechaInicioCita);
      this.formularioAplicacionCuidador.get('horaInicioCita').setValue(info.citas[0].horaInicioCita);
    }
  }

  private cargarControleFijarCita(info:any):void{
    if(info != null){
      this.formularioFijarCita.get('especialidad').setValue(info.citas[0].especialidad);
      this.formularioFijarCita.get('fechaInicioCita').setValue(info.citas[0].fechaInicioCita);
      this.formularioFijarCita.get('horaFijadaInicio').setValue(info.horaFijadaInicio);
      this.formularioFijarCita.get('horaFijadaFin').setValue(info.horaFijadaFin);
    }
  }

  private cargarControleDesFijarCita(info:any):void{
    if(info != null){
      this.formularioDesfijarCita.get('especialidad').setValue(info.citas[0].especialidad);
      this.formularioDesfijarCita.get('fechaInicioCita').setValue(info.citas[0].fechaInicioCita);
    }
  }

  private cargarControleAsignarProfesional(info:any):void{
    if(info != null){
      this.formularioAsignarProfesional.get('especialidad').setValue(info.profesional.especialidad);
      this.formularioAsignarProfesional.get('nombreCompleto').setValue(info.profesional.nombreCompleto);
      this.formularioAsignarProfesional.get('region').setValue(info.profesional.region);
      this.formularioAsignarProfesional.get('distrito').setValue(info.profesional.distrito);
      this.formularioAsignarProfesional.get('direccion').setValue(info.profesional.direccion);
    }
  }

  private cargarControleDesAsiganarProfesional(info:any):void{
    if(info != null){
      this.formularioDesAsignarProfesional.get('especialidad').setValue(info.profesional.especialidad);
      this.formularioDesAsignarProfesional.get('nombreCompleto').setValue(info.profesional.nombreCompleto);
      this.formularioDesAsignarProfesional.get('region').setValue(info.profesional.region);
      this.formularioDesAsignarProfesional.get('distrito').setValue(info.profesional.distrito);
      this.formularioDesAsignarProfesional.get('direccion').setValue(info.profesional.direccion);
    }
  }

  /**
   * Abre el modal
   */
  private abrirModalVisitas(): void {
    const dialogRef = this.dialog.open(ModalCitaGestionComponent, {
      width: '90%',
      disableClose: false,
      data: {
        idRemision: this.detalleGestionViewModel.informacionSolicitud
          .idRemision,
        idSolicitud: this.detalleGestionViewModel.informacionSolicitud
          .idSolicitud,
        especialidad: this.detalleGestionViewModel.informacionSolicitud
          .objectNovedad.especialidad,
        tipoNovedad: this.detalleGestionViewModel.informacionSolicitud
          .tipoNovedad,
        visitas: this.detalleGestionViewModel.visitas
      }
    });

    dialogRef.afterClosed().subscribe(aplicaExitoso => {
      if (aplicaExitoso != null) {
        if (aplicaExitoso) {
          this.mensajesService.mostrarMensajeExito(
            this.detalleGestionViewModel.mensajesDetalleGestion.mensajesAlerta
              .exitoGestionarSolicitud
          );
          this.route.navigate(['novedad/gestionar-novedades']);
        } else {
          this.mensajesService.mostrarMensajeError(
            this.detalleGestionViewModel.mensajesDetalleGestion.mensajesAlerta
              .errorGestionarSolicitud
          );
        }
      }
    });
  }

  /**
   * Genera columnas para la tabla
   */
  private generarColumnasNovedades(): void {
    this.columnasNovedades = [
      {
        field: this.detalleGestionViewModel.mensajesDetalleGestion.tabla
          .estadoCampo,
        header: this.detalleGestionViewModel.mensajesDetalleGestion.tabla.estado
      },
      {
        field: this.detalleGestionViewModel.mensajesDetalleGestion.tabla
          .idNovedadCampo,
        header: this.detalleGestionViewModel.mensajesDetalleGestion.tabla
          .idNovedad
      },
      {
        field: this.detalleGestionViewModel.mensajesDetalleGestion.tabla
          .novedadCampo,
        header: this.detalleGestionViewModel.mensajesDetalleGestion.tabla
          .novedad
      }
    ];
  }

  /**
   * Genera columnas para la tabla de tratamientos
   */
  private generarColumnasTratamientos(): void {
    this.columnasTratamientos = [
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.tabla
          .medicamentoCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.tabla
          .medicamento
      },
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.tabla.dosisCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.tabla.dosis
      },
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.tabla
          .frecuenciaCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.tabla.frecuencia
      },
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.tabla
          .duracionCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.tabla.duracion
      },
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.tabla
          .dosisFaltantesCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.tabla
          .dosisFaltantes
      }
    ];
  }

  private generarColumnasProcedimientos(): void {
    /**
     * Genera columnas para la tabla de sondajes
     */
    this.columnasSondajes = [
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .sondajes.tabla.tipoSondajeCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .sondajes.tabla.tipoSondajeIngreso
      },
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .sondajes.tabla.sondajeCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .sondajes.tabla.sondaje
      },
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .sondajes.tabla.fechaSondajeCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .sondajes.tabla.fechaSondaje
      },
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .sondajes.tabla.totalSesionesCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .sondajes.tabla.totalSesiones
      }
    ];

    /**
     * Genera columnas para la tabla de terapias
     */
    this.columnasCuraciones = [
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .curaciones.tabla.tipoCuracionCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .curaciones.tabla.tipoCuracion
      },
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .curaciones.tabla.diasSemanaCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .curaciones.tabla.diasSemana
      },
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .curaciones.tabla.sesionesCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .curaciones.tabla.sesiones
      }
    ];

    /**
     * Genera columnas para la tabla de fototerapias
     */
    this.columnasFototerapias = [
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .fototerapias.tabla.diasTratamientoCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .fototerapias.tabla.diasTratamiento
      },
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .fototerapias.tabla.tipoFrecuenciaCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .fototerapias.tabla.tipoFrecuencia
      }
    ];

    /**
     * Genera columnas para la tabla de toma de muestras
     */
    this.columnasTomaMuestras = [
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .tomaMuestra.tabla.tipoMuestraCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .tomaMuestra.tabla.tipoMuestra
      },
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .tomaMuestra.tabla.fechaMuestraCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .tomaMuestra.tabla.fechaMuestra
      },
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .tomaMuestra.tabla.requiereAyunoCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .tomaMuestra.tabla.requiereAyuno
      }
    ];

    /**
     * Genera columnas para la tabla de toma de muestras
     */
    this.columnasSecreciones = [
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .secreciones.tabla.diasTratamientoCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .secreciones.tabla.diasTratamiento
      },
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .secreciones.tabla.envioAspiradorCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .secreciones.tabla.envioAspirador
      },
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .secreciones.tabla.visitaEnfermeriaCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .secreciones.tabla.visitaEnfermeria
      },
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .secreciones.tabla.tipoSondaCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .secreciones.tabla.tipoSonda
      },
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .secreciones.tabla.nasalCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .secreciones.tabla.nasal
      },
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .secreciones.tabla.traqueostomiaCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .secreciones.tabla.traqueostomia
      }
    ];

    /**
     * Genera columnas para la tabla de canalizaciones
     */
    this.columnasCanalizaciones = [
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .canalizaciones.tabla.tipoCanalizacionCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .canalizaciones.tabla.tipoCanalizacion
      }
    ];

    /**
     * Genera columnas para la tabla de soporte nutricional
     */
    this.columnasSoporteNutricional = [
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .soporteNutricional.tabla.medicamentoCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .soporteNutricional.tabla.medicamento
      },
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .soporteNutricional.tabla.dosisCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .soporteNutricional.tabla.dosis
      },
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .soporteNutricional.tabla.viaAdministracionCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .soporteNutricional.tabla.viaAdministracion
      },
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .soporteNutricional.tabla.tipoNutricionCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .soporteNutricional.tabla.tipoNutricion
      },
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .soporteNutricional.tabla.nutricionCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .soporteNutricional.tabla.nutricion
      },
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .soporteNutricional.tabla.frecuenciaCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .soporteNutricional.tabla.frecuencia
      },
      {
        field: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .soporteNutricional.tabla.duracionCampo,
        header: this.detalleGestionViewModel.mensajesPlanManejo.procedimientos
          .soporteNutricional.tabla.duracion
      }
    ];
  }

  /**
   * Genera columnas para la tabla de citas
   */
  private generarColumnasCitas(): void {
    this.columnasCitas = [
      {
        field: this.detalleGestionViewModel.mensajesCitas.tabla
          .especialidadCampo,
        header: this.detalleGestionViewModel.mensajesCitas.tabla.especialidad
      },
      {
        field: this.detalleGestionViewModel.mensajesCitas.tabla.estadoCampo,
        header: this.detalleGestionViewModel.mensajesCitas.tabla.estado
      },
      {
        field: this.detalleGestionViewModel.mensajesCitas.tabla.tipoCitaCampo,
        header: this.detalleGestionViewModel.mensajesCitas.tabla.tipoCita
      },
      {
        field: this.detalleGestionViewModel.mensajesCitas.tabla
          .profesionalCampo,
        header: this.detalleGestionViewModel.mensajesCitas.tabla.profesional
      },
      {
        field: this.detalleGestionViewModel.mensajesCitas.tabla.fechaCampo,
        header: this.detalleGestionViewModel.mensajesCitas.tabla.fecha
      }
    ];
  }

  /**
   * Crea los campos del formulario datos de atención
   */
  private crearFormularioDatosPaciente(): void {
    this.formularioDatosPaciente = this.fb.group({
      ciudad: [{value: '', disabled: true}],
      municipio: [{value: '', disabled: true}],
      barrio: [{value: '', disabled: true}],
      direccion: [{value: '', disabled: true}],
      nombreCuidador: [{value: '', disabled: true}],
      nombreResponsable: [{value: '', disabled: true}],
      telefonoPaciente: [{value: '', disabled: true}],
      celularPaciente: [{value: '', disabled: true}],
      celularPaciente2: [{value: '', disabled: true}]
    });
  }

  /**
   * Crea los campos del formulario cambio de piso
   */
  private crearFormularioCambioPiso(): void {
    this.formularioCambioPiso = this.fb.group({
      piso: [{value: '', disabled: true}],
      observacion: [{value: '', disabled: true}]
    });
  }

  /**
   * Crea los campos del formulario egreso
   */
  private crearFormularioEgreso(): void {
    this.formularioEgreso = this.fb.group({
      motivoEgreso: [{value: '', disabled: true}],
      fechaEgreso: [{value: '', disabled: true}],
      observacion: [{value: '', disabled: true}]
    });
  }

  /**
   * Crea los campos del formulario cuidador
   */
  private crearFormularioCuidador(): void {
    this.formularioCuidador = this.fb.group({
      nombreCuidador: [{value: '', disabled: true}],
      nombreResponsable: [{value: '', disabled: true}],
      telefonoPaciente: [{value: '', disabled: true}],
      celularPaciente: [{value: '', disabled: true}],
      celularPaciente2: [{value: '', disabled: true}]
    });
  }

  /**
   * Crea los campos del formulario Diagnosticos
   */

   private crearFormularioDiagnostico():void {
     this.formularioDiagnostico = this.fb.group({
      codigo: [{value: '', disabled: true}],
      nombre: [{value: '', disabled: true}],
     })
   }

     /**
   * Crea los campos del formulario Alerta Cita
   */

   private crearFormularioAlertaCita():void {
    this.formularioAlertaCita = this.fb.group({
     textoAlerta: [{value: '', disabled: true}],
     duracion: [{value: '', disabled: true}],
     cambiarDuracion:[{value: true,disabled: true}]
    })
  }

  /**
   * Crea los campos del formulario equipoBiomedioco
   */

  private crearFormularioEquipoBiomedico():void {
    this.formularioEquipoBiomedico = this.fb.group({
     descripcion: [{value: '', disabled: true}],
     estadoDescripcion: [{value: '', disabled: true}],
     proveedor:[{value: '',disabled: true}]
    })
  }
  
  /**
   * Crea los campos del formulario Cancelar cita
   */

  private crearFormularioCancelacionCita():void{
    this.formularioCancelacionCita = this.fb.group({
      especialidad: [{value: '', disabled: true}],
      descripcion: [{value: '', disabled: true}],
      observacion:[{value: '',disabled: true}]
     })
  }

  private crearFormularioAplicacionCuidador(): void{
    this.formularioAplicacionCuidador = this.fb.group({
      especialidad:[{value: '', disabled: true}],
      descripcion:[{value: '', disabled: true}],
      fechaInicioCita:[{value: '', disabled: true}],
      horaInicioCita:[{value: '', disabled: true}],
    })
  }

  private crearFormularioFijarCita(): void{
    this.formularioFijarCita = this.fb.group({
      especialidad:[{value: '', disabled: true}],
      fechaInicioCita:[{value: '', disabled: true}],
      horaFijadaInicio:[{value: '', disabled: true}],
      horaFijadaFin:[{value: '', disabled: true}],
    })
  }

  private crearFormularioDesfijarCita(): void{
    this.formularioDesfijarCita = this.fb.group({
      especialidad:[{value: '', disabled: true}],
      fechaInicioCita:[{value: '', disabled: true}],
    })
  }
//9577c9ae02fe
  private crearFormularioProfesionalAsiganado(): void{
    this.formularioAsignarProfesional = this.fb.group({
      especialidad:[{value: '', disabled: true}],
      nombreCompleto:[{value: '', disabled: true}],
      region:[{value: '', disabled: true}],
      distrito:[{value: '', disabled: true}],
      direccion:[{value: '', disabled: true}],
    })
  }

  private crearFormularioProfesionalDesAsignado(): void {
    this.formularioDesAsignarProfesional = this.fb.group({
      especialidad:[{value: '', disabled: true}],
      nombreCompleto:[{value: '', disabled: true}],
      region:[{value: '', disabled: true}],
      distrito:[{value: '', disabled: true}],
      direccion:[{value: '', disabled: true}],
    })
  }


  /**
   * Crea los campos del formulario adicionar reprogramar cita
   */
  private crearFormularioAdicionarReprogramarCita(): void {
    this.formularioAdicionarReprogramarCita = this.fb.group({
      especialidad: [{value: '', disabled: true}],
      tipoCambioCita: [{value: '', disabled: true}],
      tipoCita: [{value: '', disabled: true}],
      fechaCita: [{value: '', disabled: true}]
    });
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): DetalleGestionViewModel {
    return new DetalleGestionViewModel(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      [],
      null,
      false,
      false,
      false,
      false,
      [],
      false,
      false,
      false,
      null,
      false,
      null,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      '',
      '',
      ''
    );
  }
}
