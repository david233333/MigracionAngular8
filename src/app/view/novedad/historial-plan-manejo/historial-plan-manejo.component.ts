import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import * as moment from 'moment';
import {MensajesService} from '../../../shared/services/mensajes.service';
import {HistorialPlanManejoViewModel} from './historial-plan-manejo.view-model';
import {HistorialPlanManejoService} from '../../../domain/usecase/novedad/historial-plan-manejo.service';
import {DiagnosticosService} from '../../../domain/usecase/novedad/diagnosticos.service';
import {DatosPacienteNovedadService} from '../../../domain/usecase/novedad/datos-paciente-novedad.service';
import {MatDialog} from '@angular/material';
import {ModalDireccionComponent} from '../../remision/datos-atencion/modal-direccion/modal-direccion.component';
import {ModalTratamientosComponent} from '../plan-manejo/modal-tratamientos/modal-tratamientos.component';
import {PlanManejoService} from '../../../domain/usecase/novedad/plan-manejo-novedad.service';
import {ModalProcedimientosComponent} from '../plan-manejo/modal-procedimientos/modal-procedimientos.component';
import {ProcedimientoNovedadEnum} from '../../../shared/utils/enums/procedimiento-novedad.enum.';
import {Curacion} from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/curacion.model';
import {Sondaje} from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/sondaje-model';
import {Fototerapia} from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/fototerapia.model';
import {TomaMuestra} from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/toma-muestra.model';
import {AspiracionSecrecion} from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/aspiracion-secrecion.model';
import {Canalizacion} from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/canalizacion.model';
import {CitaService} from '../../../domain/usecase/novedad/cita.service';
import {ComunService} from '../../../domain/usecase/comun/comun.service';
import {AgregadosComunService} from '../../../shared/services/agregados-comun.service';
import {SoporteNutricional} from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/soporte-nutricional.model';
import {Tratamiento} from '../../../domain/model/novedad/entity/plan-manejo/tratamiento.model';
import {ConsultaRemisionRequest} from '../../../infraestructure/request-model/novedad/consulta-remision.request';
import {AgregadosNovedadService} from '../../../shared/services/agregados-novedad.service';
import {CambioPisoService} from '../../../domain/usecase/novedad/cambio-piso.service';
import {LocalStorage} from '@ngx-pwa/local-storage';
import {CapturarErrores} from '../../../shared/services/capturar-errores';
import {ModalCitasComponent} from '../citas/modal-citas/modal-citas.component';
import { RecursoPreferidoService } from '../../../domain/usecase/novedad/RecursoPreferido.service';

moment.locale('es');

@Component({
  selector: 'historial-plan-manejo',
  templateUrl: './historial-plan-manejo.component.html',
  styleUrls: ['./historial-plan-manejo.component.scss']
})
export class HistorialPlanManejoComponent implements OnInit, OnDestroy {
  public configEspanolCalendario: any;
  public formularioPrincipal: FormGroup;
  public formularioDatosPaciente: FormGroup;
  public formularioCambioPiso: FormGroup;
  public formularioEgreso: FormGroup;
  public columnasRemisiones: any[];
  public columnasNovedades: any[];
  public columnasDiagnosticos: any[];
  public columnasTratamientos: any[];
  public columnasCitas: any[];
  public columnasCuraciones: any[];
  public columnasProfesionales: any [];
  public columnasSondajes: any[];
  public columnasFototerapias: any[];
  public columnasTomaMuestras: any[];
  public columnasSecreciones: any[];
  public columnasCanalizaciones: any[];
  public columnasSoporteNutricional: any[];
  public historialPlanManejoViewModel: HistorialPlanManejoViewModel = this.iniciarViewModel();
  public verInfoPlanManejo = false;
  public tipoProcedimiento = ProcedimientoNovedadEnum;
  private remisionSubscripcion: Subscription = new Subscription();
  private novedadSubscripcion: Subscription = new Subscription();
  private tiposIdentificacionSubscripcion = new Subscription();
  private datosDiagnosticosSubscripcion: Subscription = new Subscription();
  private datosPacienteSubscripcion: Subscription = new Subscription();
  private planManejoSubscripcion: Subscription = new Subscription();
  private citasSubscripcion: Subscription = new Subscription();
  private profesionesSubscripcion = new Subscription();
  private remisionSubscription = new Subscription();
  private informacionRecursoPreferido = new  Subscription();
  public profesional = true;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private historialPlanManejoService: HistorialPlanManejoService,
    private mensajesService: MensajesService,
    private diagnosticosService: DiagnosticosService,
    private datosPacienteService: DatosPacienteNovedadService,
    private planManejoService: PlanManejoService,
    private citasService: CitaService,
    private cambioPisoService: CambioPisoService,
    private comunService: ComunService,
    private recursoPreferido : RecursoPreferidoService,
    private infoComunes: AgregadosComunService,
    private infoGestionNovedad: AgregadosNovedadService,
    protected localStorage: LocalStorage,
    private capturaDeErroresService: CapturarErrores
  ) {
    this.crearFormularioPrincipal();
    this.crearFormularioDatosPaciente();
    this.crearFormularioCambioPiso();
    this.crearFormularioEgreso();
    this.generarColumnasRemisiones();
    this.generarColumnasNovedades();
    this.generarColumnasProfesionales();
    this.generarColumnasDiagnosticos();
    this.generarColumnasTratamientos();
    this.generarColumnasProcedimientos();
    this.generarColumnasCitas();
  }

  ngOnInit(): void {
    this.configurarCalendario();
    this.getDatos();

    if (
      this.infoGestionNovedad.datosPacienteNovedad !== undefined &&
      this.infoGestionNovedad.datosPacienteNovedad !== null
    ) {
      this.formularioPrincipal
        .get('remisionPaciente')
        .setValue(this.infoGestionNovedad.datosPacienteNovedad.idRemision);
      this.consultarRemision(false);
      this.verDetalleHistorial();
      this.infoGestionNovedad.datosPacienteNovedad = null;
    }
  }

  ngOnDestroy() {
    this.remisionSubscripcion.unsubscribe();
    this.novedadSubscripcion.unsubscribe();
    this.tiposIdentificacionSubscripcion.unsubscribe();
    this.datosDiagnosticosSubscripcion.unsubscribe();
    this.datosPacienteSubscripcion.unsubscribe();
    this.planManejoSubscripcion.unsubscribe();
    this.citasSubscripcion.unsubscribe();
    this.profesionesSubscripcion.unsubscribe();
    this.informacionRecursoPreferido.unsubscribe();
  }

  /**
   * Obtiene los tipos de identificación
   */
  public getTiposIdentificacion(): void {
    this.tiposIdentificacionSubscripcion = this.historialPlanManejoService
      .getTiposIdentificacion()
      .subscribe(
        response => {
          this.historialPlanManejoViewModel.respuestaTiposIdentificacion = response;
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
  public consultarRemision(porIdentificacion: boolean): void {
    this.validadores(porIdentificacion);

    const tipoDocumento = this.formularioPrincipal.get('tipoDocumentoPaciente')
      .value;
    const numeroDocumento = this.formularioPrincipal.get(
      'numeroDocumentoPaciente'
    ).value;
    const remision = this.formularioPrincipal.get('remisionPaciente').value;

    const CONSULTA = new ConsultaRemisionRequest(
      remision,
      tipoDocumento,
      numeroDocumento
    );
    console.log('REQUEST - Historial plan manejo ', JSON.stringify(CONSULTA));

    this.remisionSubscripcion = this.historialPlanManejoService
      .getRemisionPaciente(CONSULTA)
      .subscribe(
        response => {
          console.log('response remision ', response);
          this.historialPlanManejoViewModel.respuestaRemisiones = response;
          if (response.length > 0) {
            this.verDetalleHistorial();
          } else {
            this.mensajesService.mostrarMensajeError(
              this.historialPlanManejoViewModel.mensajesHistorial.mensajesAlerta
                .noRemisiones
            );
          }
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
          this.verInfoPlanManejo = false;
        },
        () => {
          this.remisionSubscripcion.unsubscribe();
        }
      );
  }

  /* /!**
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

  public habilitarBuscadorPorIdentificacion(): boolean {
    return (
      !this.formularioPrincipal.controls['numeroDocumentoPaciente'].valid ||
      !this.formularioPrincipal.controls['tipoDocumentoPaciente'].valid ||
      this.formularioPrincipal.get('numeroDocumentoPaciente').value === '' ||
      this.formularioPrincipal.get('tipoDocumentoPaciente').value === ''
    );
  }

  public habilitarBuscadorPorRemision(): boolean {
    return (
      !this.formularioPrincipal.controls['remisionPaciente'].valid ||
      this.formularioPrincipal.get('remisionPaciente').value === ''
    );
  }

  public validadores(porIdentificacion: boolean) {
    if (porIdentificacion) {
      this.cambiarValidadorFormularioAOpcional(
        this.formularioPrincipal,
        'remisionPaciente'
      );
      this.cambiarValidadorFormularioARequerido(
        this.formularioPrincipal,
        'tipoDocumentoPaciente'
      );
      this.cambiarValidadorFormularioARequerido(
        this.formularioPrincipal,
        'numeroDocumentoPaciente'
      );
      this.formularioPrincipal.get('remisionPaciente').setValue('');
    } else {
      this.cambiarValidadorFormularioAOpcional(
        this.formularioPrincipal,
        'tipoDocumentoPaciente'
      );
      this.cambiarValidadorFormularioAOpcional(
        this.formularioPrincipal,
        'numeroDocumentoPaciente'
      );
      this.cambiarValidadorFormularioARequerido(
        this.formularioPrincipal,
        'remisionPaciente'
      );
      this.formularioPrincipal.get('tipoDocumentoPaciente').setValue('');
      this.formularioPrincipal.get('numeroDocumentoPaciente').setValue('');
    }
  }

  public volver(): void {
    this.historialPlanManejoViewModel.verFiltroPaciente = true;
  }

  public remisionSeleccionada(remision: any): void {
    console.log('Remision seleccionada ', remision);
    this.historialPlanManejoViewModel.remisionSeleccionada = remision;

    this.novedadSubscripcion = this.historialPlanManejoService
      .getNovedadRemision(remision.idRemision)
      .subscribe(
        response => {
          console.log('response novedad ', response);
          this.historialPlanManejoViewModel.respuestaNovedades = response;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
          this.remisionSubscripcion.unsubscribe();
        }
      );
  }

  public novedadSeleccionada(novedad: any): void {
    console.log('Novedad seleccionada ', novedad);
    this.getProfesiones();
    this.getAgregadoInfoDiagnosticos(novedad.idDiagnosticoPaciente);
    this.getAgregadoInfoPaciente(novedad.idInformacionPacientePk);
    this.getAgregadoRemision(novedad.idRemisionPk);
    this.getAgregadoPlanManejo(novedad.idPlanManejoPk);
    this.getAgregadoCitas(novedad.idCitasPaciente);
    this.ObtenerRecursoPreferido(novedad.recursoPreferidoPk);
   
  }

  /**
   * Obtiene el agregado de remisión
   * 
   */
  public getAgregadoRemision(idRemision: string): void {
    this.remisionSubscription = this.cambioPisoService
      .remisionNovedad(idRemision)
      .subscribe(
        response => {
          if (response.pisoHospitalario !== null) {
            this.historialPlanManejoViewModel.cambioPiso = true;
            this.formularioCambioPiso
              .get('piso')
              .setValue(response.pisoHospitalario.nombre);
          }
          if (response.fechaEgreso !== null) {
            this.historialPlanManejoViewModel.egreso = true;
            this.cargarControlesEgreso(response);
          }
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
        }
      );
  }

  public ObtenerRecursoPreferido(recursoPreferidoPk: string): void {
    this.informacionRecursoPreferido = this.recursoPreferido
    .getAgregadoRecursoPreferido(recursoPreferidoPk)
    .subscribe(
      response => {
        console.log('hoy domingo',response)
        this.historialPlanManejoViewModel.profesionalesRP = response.profesionalList;
        if(this.historialPlanManejoViewModel.profesionalesRP.length > 0){
          this.profesional = true;
          console.log('si entro en el if',this.profesional)
        }
      }
    )
    

  }

  /**
   *
   */
  public abrirModalDireccion(): void {
    const dialogRef = this.dialog.open(ModalDireccionComponent, {
      width: '90%',
      disableClose: false,
      data: {
        ciudad: this.historialPlanManejoViewModel.infoPaciente.ubicacion
          .ciudadPrincipal,
        barrio: this.historialPlanManejoViewModel.infoPaciente.ubicacion.barrio,
        direccion: this.historialPlanManejoViewModel.infoPaciente.ubicacion
          .direccion,
        municipio: this.historialPlanManejoViewModel.infoPaciente.ubicacion
          .municipio,
        ubicacion: this.historialPlanManejoViewModel.infoPaciente.ubicacion,
        esNovedad: true,
        esDetalle: true
      }
    });
  }

  /**
   *
   */
  public abrirModalTratamiento(tratamiento: any): void {
    console.log('tratamiento ', tratamiento);
    const dialogRef = this.dialog.open(ModalTratamientosComponent, {
      width: '90%',
      disableClose: false,
      data: {
        tratamiento: tratamiento,
        esDetalle: true
      }
    });
  }

  /**
   *
   */
  public abrirModalProcedimientos(elemento: any, tipo: string): void {
    let procedimiento = null;

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
    console.log('infoComunes ', this.infoComunes.datosProfesionales);
    console.log('cita ', cita);
    const dialogRef = this.dialog.open(ModalCitasComponent, {
      width: '90%',
      disableClose: false,
      data: {
        infoComunes: this.infoComunes,
        remision: this.historialPlanManejoViewModel.remisionSeleccionada,
        cita: cita,
        esDetalle: true,
        esHistorial: true,
        idPrograma: this.historialPlanManejoViewModel.remisionSeleccionada.pisoHospitalario.idPrograma
      }
    });
  }

  public verDatosPaciente(): boolean {
    return this.historialPlanManejoViewModel.infoPaciente != null;
  }

  public verCambioPiso(): boolean {
    return this.historialPlanManejoViewModel.cambioPiso === true;
  }

  public verEgreso(): boolean {
    return this.historialPlanManejoViewModel.egreso === true;
  }

  public verDiagnosticos(): boolean {
    return this.historialPlanManejoViewModel.diagnosticos.length > 0;
  }

  public verTratamientos(): boolean {
    return this.historialPlanManejoViewModel.tratamientos.length > 0;
  }

 /* public verProfesionales(): boolean {
    return this.historialPlanManejoViewModel.profesionalesRP != null ;
  }
*/  


  public verProcedimientos(): boolean {
    return (
      this.historialPlanManejoViewModel.curaciones.length > 0 ||
      this.historialPlanManejoViewModel.sondajes.length > 0 ||
      this.historialPlanManejoViewModel.fototerapias.length > 0 ||
      this.historialPlanManejoViewModel.tomaMuestras.length > 0 ||
      this.historialPlanManejoViewModel.secreciones.length > 0 ||
      this.historialPlanManejoViewModel.canalizaciones.length > 0 ||
      this.historialPlanManejoViewModel.soporteNutricionales.length > 0
    );
  }

  public verCuraciones(): boolean {
    return this.historialPlanManejoViewModel.curaciones.length > 0;
  }

  public verSondajes(): boolean {
    return this.historialPlanManejoViewModel.sondajes.length > 0;
  }

  public verFototerapias(): boolean {
    return this.historialPlanManejoViewModel.fototerapias.length > 0;
  }

  public verTomaMuestras(): boolean {
    return this.historialPlanManejoViewModel.tomaMuestras.length > 0;
  }

  public verSecreciones(): boolean {
    return this.historialPlanManejoViewModel.secreciones.length > 0;
  }

  public verCanalizaciones(): boolean {
    return this.historialPlanManejoViewModel.canalizaciones.length > 0;
  }

  public verSoporteNutricionales(): boolean {
    return this.historialPlanManejoViewModel.soporteNutricionales.length > 0;
  }

  public verCitas(): boolean {
    return this.historialPlanManejoViewModel.citas.length > 0;
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

  private getDatos(): void {
    this.getTiposIdentificacion();
  }

  private verDetalleHistorial(): void {
    this.verInfoPlanManejo = true;
    this.historialPlanManejoViewModel.verFiltroPaciente = false;
  }

  /**
   * Agregado de diagnósticos
   * @param idDiagnosticoPaciente
   */
  private getAgregadoInfoDiagnosticos(idDiagnosticoPaciente: string): void {
    if (idDiagnosticoPaciente != null) {
      this.datosDiagnosticosSubscripcion = this.diagnosticosService
        .getAgregadoDiagnostico(idDiagnosticoPaciente)
        .subscribe(
          response => {
            console.log(
              'RESPONSE - Agregado diagnostico ',
              response.diagnostico
            );
            this.historialPlanManejoViewModel.diagnosticos =
              response.diagnostico;
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
   * Agregado de citas
   * @param idCita
   */
  private getAgregadoCitas(idCita: string): void {
    if (idCita != null) {
      this.citasSubscripcion = this.citasService
        .getAgregadoCitasHistorial(idCita)
        .subscribe(
          response => {
            console.log('RESPONSE - Agregado Citas ', response.citas);
            this.historialPlanManejoViewModel.citas = response.citas;
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
   * Agregado de plan de manejo
   * @param idPlanManejo
   */
  private getAgregadoPlanManejo(idPlanManejo: string): void {
    console.log('idPlanManejo ', idPlanManejo);
    if (idPlanManejo != null) {
      this.planManejoSubscripcion = this.planManejoService
        .getAgregadoPlanManejoHistorial(idPlanManejo)
        .subscribe(
          response => {
            console.log('RESPONSE - Agregado plan de manejo ', response);
            this.historialPlanManejoViewModel.tratamientos = [];
            response.tratamientos.forEach(tratamiento => {
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
              this.historialPlanManejoViewModel.tratamientos.push(TRATAMIENTO);
            });
            this.historialPlanManejoViewModel.procedimientos =
              response.procedimientos;
            this.historialPlanManejoViewModel.curaciones =
              response.procedimientos.curaciones;
            this.historialPlanManejoViewModel.sondajes =
              response.procedimientos.sondajes;
            this.historialPlanManejoViewModel.fototerapias =
              response.procedimientos.fototerapias;
            this.historialPlanManejoViewModel.tomaMuestras =
              response.procedimientos.tomaMuestras;
            this.historialPlanManejoViewModel.secreciones =
              response.procedimientos.secreciones;
            this.historialPlanManejoViewModel.canalizaciones =
              response.procedimientos.canalizaciones;
            this.historialPlanManejoViewModel.soporteNutricionales = [];
            response.procedimientos.soporteNutricionales.forEach(soporte => {
              console.log('soporte historial', soporte);
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
              this.historialPlanManejoViewModel.soporteNutricionales.push(
                SOPORTE
              );
            });
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
   * Agregado de información del paciente
   * @param idInformacionPaciente
   */
  private getAgregadoInfoPaciente(idInformacionPaciente: string): void {
    if (idInformacionPaciente != null) {
      this.datosPacienteSubscripcion = this.datosPacienteService
        .getAgregadoInformacionPaciente(idInformacionPaciente)
        .subscribe(
          response => {
            console.log(
              'RESPONSE - Agregado Info Paciente ',
              response.datosAtencionPaciente
            );
            this.historialPlanManejoViewModel.infoPaciente =
              response.datosAtencionPaciente;
            this.cargarControlesDatosPaciente(response.datosAtencionPaciente);
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
    }
  }

  private cargarControlesEgreso(info: any): void {
    this.formularioEgreso
      .get('motivoEgreso')
      .setValue(info.motivoEgreso.descripcion);
    this.formularioEgreso
      .get('fechaAlta')
      .setValue(moment(info.fechaAlta).format('DD-MMMM-YYYY, hh:mm A'));
    this.formularioEgreso
      .get('fechaEgreso')
      .setValue(moment(info.fechaEgreso).format('DD-MMMM-YYYY, hh:mm A'));
    this.formularioEgreso.get('observacion').setValue(info.observacionEgreso);
  }

  /**
   * Genera columnas para la tabla de remisiones
   */
  private generarColumnasRemisiones(): void {
    this.columnasRemisiones = [
      {
        field: this.historialPlanManejoViewModel.mensajesHistorial.tablaRemision
          .remisionCampo,
        header: this.historialPlanManejoViewModel.mensajesHistorial
          .tablaRemision.remision
      },
      {
        field: this.historialPlanManejoViewModel.mensajesHistorial.tablaRemision
          .fechaCreacionCampo,
        header: this.historialPlanManejoViewModel.mensajesHistorial
          .tablaRemision.fechaCreacion
      }
    ];
  }

  /**
   * Genera columnas para la tabla de novedades
   */
  private generarColumnasNovedades(): void {
    this.columnasNovedades = [
      {
        field: this.historialPlanManejoViewModel.mensajesHistorial.tablaNovedad
          .tipoNovedadCampo,
        header: this.historialPlanManejoViewModel.mensajesHistorial.tablaNovedad
          .tipoNovedad
      },
      {
        field: this.historialPlanManejoViewModel.mensajesHistorial.tablaNovedad
          .fechaCreacionNovedadCampo,
        header: this.historialPlanManejoViewModel.mensajesHistorial.tablaNovedad
          .fechaCreacionNovedad
      }
    ];
  }

  private generarColumnasProfesionales():void {
    this.columnasProfesionales = [
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo.tablaProfesionales
          .nombreCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo.tablaProfesionales
          .nombre
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo.tablaProfesionales
          .especialidadCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo.tablaProfesionales
          .especialidad
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo.tablaProfesionales
          .regionCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo.tablaProfesionales
          .region
      }
    ];
  }

  /**
   * Genera columnas para la tabla de tratamientos
   */
  private generarColumnasTratamientos(): void {
    this.columnasTratamientos = [
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo.tabla
          .medicamentoCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo.tabla
          .medicamento
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo.tabla
          .dosisCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo.tabla.dosis
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo.tabla
          .viaAdministracionCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo.tabla
          .viaAdministracion
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo.tabla
          .tipoNutricionCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo.tabla
          .tipoNutricion
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo.tabla
          .nutricionCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo.tabla
          .nutricion
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo.tabla
          .frecuenciaCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo.tabla
          .frecuencia
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo.tabla
          .duracionCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo.tabla
          .duracion
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo.tabla
          .ultimaAplicacionCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo.tabla
          .ultimaAplicacion
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo.tabla
          .noPBSCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo.tabla.noPBS
      }
    ];
  }

  private generarColumnasProcedimientos(): void {
    /**
     * Genera columnas para la tabla de sondajes
     */
    this.columnasSondajes = [
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.sondajes.tabla.tipoSondajeCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.sondajes.tabla.tipoSondajeIngreso
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.sondajes.tabla.categoriaSondajeCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.sondajes.tabla.categoriaSondaje
      }
    ];

    /**
     * Genera columnas para la tabla de terapias
     */
    this.columnasCuraciones = [
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.curaciones.tabla.tipoCuracionCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.curaciones.tabla.tipoCuracion
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.curaciones.tabla.diasSemanaCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.curaciones.tabla.diasSemana
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.curaciones.tabla.sesionesCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.curaciones.tabla.sesiones
      }
    ];

    /**
     * Genera columnas para la tabla de fototerapias
     */
    this.columnasFototerapias = [
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.fototerapias.tabla.diasTratamientoCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.fototerapias.tabla.diasTratamiento
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.fototerapias.tabla.tipoFrecuenciaCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.fototerapias.tabla.tipoFrecuencia
      }
    ];

    /**
     * Genera columnas para la tabla de toma de muestras
     */
    this.columnasTomaMuestras = [
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.tomaMuestra.tabla.tipoMuestraCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.tomaMuestra.tabla.tipoMuestra
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.tomaMuestra.tabla.fechaMuestraCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.tomaMuestra.tabla.fechaMuestra
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.tomaMuestra.tabla.requiereAyunoCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.tomaMuestra.tabla.requiereAyuno
      }
    ];

    /**
     * Genera columnas para la tabla de toma de muestras
     */
    this.columnasSecreciones = [
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.secreciones.tabla.diasTratamientoCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.secreciones.tabla.diasTratamiento
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.secreciones.tabla.envioAspiradorCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.secreciones.tabla.envioAspirador
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.secreciones.tabla.visitaEnfermeriaCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.secreciones.tabla.visitaEnfermeria
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.secreciones.tabla.tipoSondaCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.secreciones.tabla.tipoSonda
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.secreciones.tabla.nasalCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.secreciones.tabla.nasal
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.secreciones.tabla.traqueostomiaCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.secreciones.tabla.traqueostomia
      }
    ];

    /**
     * Genera columnas para la tabla de canalizaciones
     */
    this.columnasCanalizaciones = [
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.canalizaciones.tabla.tipoCanalizacionCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.canalizaciones.tabla.tipoCanalizacion
      }
    ];

    /**
     * Genera columnas para la tabla de soporte nutricional
     */
    this.columnasSoporteNutricional = [
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.soporteNutricional.tabla.medicamentoCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.soporteNutricional.tabla.medicamento
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.soporteNutricional.tabla.dosisCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.soporteNutricional.tabla.dosis
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.soporteNutricional.tabla.viaAdministracionCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.soporteNutricional.tabla.viaAdministracion
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.soporteNutricional.tabla.tipoNutricionCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.soporteNutricional.tabla.tipoNutricion
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.soporteNutricional.tabla.nutricionCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.soporteNutricional.tabla.nutricion
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.soporteNutricional.tabla.frecuenciaCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.soporteNutricional.tabla.frecuencia
      },
      {
        field: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.soporteNutricional.tabla.duracionCampo,
        header: this.historialPlanManejoViewModel.mensajesPlanManejo
          .procedimientos.soporteNutricional.tabla.duracion
      }
    ];
  }

  /**
   * Genera columnas para la tabla de diagnósticos
   */
  private generarColumnasDiagnosticos(): void {
    this.columnasDiagnosticos = [
      {
        field: this.historialPlanManejoViewModel.mensajesDiagnosticos.tabla
          .codigoCampo,
        header: this.historialPlanManejoViewModel.mensajesDiagnosticos.tabla
          .codigo
      },
      {
        field: this.historialPlanManejoViewModel.mensajesDiagnosticos.tabla
          .nombreCampo,
        header: this.historialPlanManejoViewModel.mensajesDiagnosticos.tabla
          .nombre
      }
    ];
  }

  /**
   * Genera columnas para la tabla de citas
   */
  private generarColumnasCitas(): void {
    this.columnasCitas = [
      {
        field: this.historialPlanManejoViewModel.mensajesCitas.tabla
          .tipoCitaCampo,
        header: this.historialPlanManejoViewModel.mensajesCitas.tabla.tipoCita
      },
      {
        field: this.historialPlanManejoViewModel.mensajesCitas.tabla
          .profesionalCampo,
        header: this.historialPlanManejoViewModel.mensajesCitas.tabla
          .profesional
      },
      {
        field: this.historialPlanManejoViewModel.mensajesCitas.tabla.fechaCampo,
        header: this.historialPlanManejoViewModel.mensajesCitas.tabla.fecha
      }
    ];
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): HistorialPlanManejoViewModel {
    return new HistorialPlanManejoViewModel(
      null,
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
      true,
      [],
      [],
      null,
      null,
      [],
      null,
      false,
      false,
      [],
      null,
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
      '',
      '',
      '',
      '',
      '',
      []
    );
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
      celularPaciente: [{value: '', disabled: true}]
    });
  }

  /**
   * Crea los campos del formulario cambio de piso
   */
  private crearFormularioCambioPiso(): void {
    this.formularioCambioPiso = this.fb.group({
      piso: [{value: '', disabled: true}]
    });
  }

  /**
   * Crea los campos del formulario egreso
   */
  private crearFormularioEgreso(): void {
    this.formularioEgreso = this.fb.group({
      motivoEgreso: [{value: '', disabled: true}],
      fechaEgreso: [{value: '', disabled: true}],
      fechaAlta: [{value: '', disabled: true}],
      observacion: [{value: '', disabled: true}]
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
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormularioPrincipal(): void {
    this.formularioPrincipal = this.fb.group({
      tipoDocumentoPaciente: [''],
      numeroDocumentoPaciente: [
        '',
        Validators.compose([
          Validators.maxLength(20),
          Validators.pattern('[0-9]+')
        ])
      ],
      remisionPaciente: ['', Validators.compose([Validators.maxLength(15)])]
    });
  }

  /**
   * Cambia los validadores de un control del formulario
   * @param {FormGroup} formulario
   * @param {string} nombrecontrol
   */
  private cambiarValidadorFormularioARequerido(formulario: FormGroup, nombrecontrol: string): void {
    formulario.get(nombrecontrol).clearValidators();
    formulario
      .get(nombrecontrol)
      .setValidators(Validators.compose([Validators.required]));
    formulario.get(nombrecontrol).updateValueAndValidity();
  }

  /**
   * Cambia los validadores de un control del formulario
   * @param {FormGroup} formulario
   * @param {string} nombrecontrol
   */
  private cambiarValidadorFormularioAOpcional(formulario: FormGroup, nombrecontrol: string): void {
    formulario.get(nombrecontrol).clearValidators();
    formulario.get(nombrecontrol).setValidators(Validators.compose([]));
    formulario.get(nombrecontrol).updateValueAndValidity();
  }

  private getProfesiones() {
    console.log(this.historialPlanManejoViewModel);
    this.comunService.getProfesionesIdPrograma(this.historialPlanManejoViewModel.remisionSeleccionada.programa.idPrograma).subscribe(
      response => {
        this.infoComunes.datosProfesionales = response;
      },
      error => {
        this.capturaDeErroresService.mapearErrores(error.status, error.error);
      },
      () => {
      }
    );
    ;
  }
}
