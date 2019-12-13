import {ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {saveAs} from 'file-saver/FileSaver';

import {AccionesViewModel} from './acciones.view-model';
import {AccionesService} from '../../../domain/usecase/remision/acciones.service';
import {MensajesService} from '../../../shared/services/mensajes.service';
import {MatDialog} from '@angular/material';
import {ModalCancelaRemisionPendienteComponent} from './modal-cancela-remision-pendiente/modal-cancela-remision-pendiente.component';
import {RemisionContenedorService} from '../../../domain/usecase/remision/remision-contenedor.service';
import {GuardarRemisionRequest} from '../../../infraestructure/request-model/GuardarRemisionRequest';
import {EstadosRemisionEnum} from '../../../shared/utils/enums/estados-remision.enum';
import {RemisionRequest} from '../../../infraestructure/request-model/RemisionRequest';
import {ModalCancelaRemisionNuevaComponent} from './modal-cancela-remision-nueva/modal-cancela-remision-nueva.component';
import {ActivatedRoute, Router} from '@angular/router';
import {AgregadosRemisionService} from '../../../shared/services/agregados-remision.service';
import {DatosRemision} from '../../../domain/model/remision/entity/datos-remision.model';
import {Procedimientos} from '../../../domain/model/remision/entity/plan-manejo/procedimiento.model';
import {UsuarioService} from '../../../shared/services/usuario.service';
import {Observable} from 'rxjs';
import {LoginUsecaseServices} from '../../../domain/usecase/seguridad/loginUsecase-services';
import {CapturarErrores} from '../../../shared/services/capturar-errores';

@Component({
  selector: 'sura-acciones',
  templateUrl: './acciones.component.html',
  styleUrls: ['./acciones.component.scss']
})
export class AccionesComponent implements OnInit, OnDestroy, OnChanges {
  @Input('paciente') public paciente: any;
  @Input('habilitaGuardado') public habilitaGuardado: boolean;
  @Input('habilitaEnviado') public habilitaEnviado: boolean;
  public estado: string;
  public nombre: string;
  public apellido: string;
  public asegurador: string;
  public numeroRemision: string = null;
  public tipoAfiliacion: string;
  public edadPaciente: string;
  public pacienteSexo: string;
  public accionesViewModel: AccionesViewModel = this.iniciarViewModel();
  public guardarRemisionRequest = this.iniciarModelRemisionGuardar();
  @Input('pasoActual') private pasoActual: number;
  private consentimientoSubscripcion: Subscription = new Subscription();
  private remisionReportSubscription: Subscription = new Subscription();
  private crearNuevaRemisionSuscripcion = new Subscription();
  public loading = false;

  private remision$: Observable<any>;

  constructor(
    private accionesService: AccionesService,
    private mensajesService: MensajesService,
    private dialog: MatDialog,
    public remisionService: RemisionContenedorService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private agregadosRemision: AgregadosRemisionService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private seguridadService: LoginUsecaseServices,
    private capturaDeErroresService: CapturarErrores
  ) {
    this.remisionService.generarObjetoRemision();
    //   this.remisionService.generarObjetoRemisionRequest();
  }

  ngOnInit() {
    this.loading = true;
    this.initDatos();
    this.validarEnvioRemision();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes && changes.pasoActual && changes.pasoActual.currentValue) {
      this.accionesViewModel.mostrarConsentimiento = this.mostrarConsentimiento(
        changes.pasoActual.currentValue
      );
    }
    if (changes && changes.paciente && changes.paciente.currentValue) {
      this.paciente = changes.paciente.currentValue;
    }
    if (this.remisionService.remision !== undefined) {
      this.accionesViewModel.estadoRemision = this.remisionService.remision.estado;
      this.accionesViewModel.numeroRemision = this.remisionService.remision.idRemision;
    }
    if (this.paciente !== undefined && this.paciente) {
      this.nombre = `${this.paciente.nombre} ${this.paciente.apellido}` || '';
      this.asegurador = this.paciente.tipoAsegurador;
      this.tipoAfiliacion = this.paciente.tipoAfiliacion;
      this.edadPaciente = `${this.paciente.edad} ${this.paciente.unidadEdad}`;
      this.pacienteSexo = this.paciente.sexo;
      this.loading = false;
    }
    this.validarEnvioRemision();
    this.validarGuardarRemision();
  }

  ngOnDestroy() {
    this.consentimientoSubscripcion.unsubscribe();
    this.crearNuevaRemisionSuscripcion.unsubscribe();
  }

  public guardarRemision() {
    const estado = this.remisionService.remision.estado; //Nuevo
    const mensaje = this.accionesViewModel.mensaje.success.guardarRemision; // se guardo remision
    this.remisionService.edicion = true; //edicion es igual a true
    this.validarUsuarioObtenerRemision(estado, mensaje);
    //nuevo, se guardo correctamente
  }

  private validarUsuarioObtenerRemision(estado: string, mensaje: any) {
    const usuario = this.usuarioService.InfoUsuario;
    if (
      usuario !== null &&
      usuario !== undefined &&
      usuario.isAuthenticated !== null &&
      usuario.username !== null &&
      usuario.fullName !== null
    ) {
      this.remisionService.obtenerRemision(estado, mensaje, usuario, 'admitir');
    } else {
      this.seguridadService.datosUsuarioLogueado().subscribe(
        infoUsuario => {

          this.remisionService.obtenerRemision(estado, mensaje, infoUsuario, 'admitir');
        },
        error => {

          this.capturaDeErroresService.mapearErrores(error.status, error.error);
          this.mensajesService.mostrarMensajeError(
            this.accionesViewModel.mensajes.mensajeErrorCargarUsuario
          );
        },
        () => {
        }
      );
    }
  }

  public imprimirRemision() {
    if (
      this.guardarRemisionRequest !== null ||
      this.guardarRemisionRequest.planManejo.tratamientos.length > 0
    ) {
      this.remisionReportSubscription = this.accionesService
        .getReporteRemisionByIdRemisionPk(this.accionesViewModel.idRemisionPk)
        .subscribe(
          response => {
            console.log(response);
            const descargar = document.createElement('a');
            const nombreArchivo = this.accionesViewModel.mensajes
              .nombreArchivoRemision;
            descargar.href = `data:application/pdf;base64, ${response}`;
            descargar.download = nombreArchivo;
            descargar.click();
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
    } else {
      this.mensajesService.mostrarMensajeError(
        'Debes tener por lo menos una actividad en el plan de manejo'
      );
    }
  }

  public enviarRemision() {
    const estado = EstadosRemisionEnum.PENDIENTE_ADMITIR;
    const mensaje = this.accionesViewModel.mensaje.success.enviarRemision;
    if (
      this.remisionService.datosAtencionPaciente.ubicacion.ciudadPrincipal !==
      null &&
      this.remisionService.datosAtencionPaciente.ubicacion.ciudadPrincipal
        .idCiudad !== null
    ) {
      this.remisionService.edicion = false;
      this.validarUsuarioObtenerRemision(estado, mensaje);
    } else {
      this.mensajesService.mostrarMensajeError(
        'Selecciona por favor la ciudad en la sección Datos de atención'
      );
    }
  }

  public crearPaciente() {
    this.router.navigate(['remision/crear']);
  }


  public validarEnvioRemision(): void {
    if (this.remisionService.remision !== undefined) {

      if (
        this.remisionService.remision.estado === EstadosRemisionEnum.NUEVO

      ) {

        this.accionesViewModel.habilitarEnviar = this.habilitaEnviado;
      } else {

        this.accionesViewModel.habilitarEnviar = false;
      }
    }
  }


  public validarGuardarRemision(): void {
    if (this.remisionService.remision !== undefined) {
      if (
        this.remisionService.remision.estado === EstadosRemisionEnum.NUEVO ||
        this.remisionService.remision.estado ===
        EstadosRemisionEnum.PENDIENTE_ADMITIR ||
        this.remisionService.remision.estado === EstadosRemisionEnum.EMPALME
      ) {
        if (this.remisionService.valoracionesPlanManejo) {
          if (
            this.remisionService.valoracionesPlanManejo.valoracionesPoliza &&
            this.remisionService.valoracionesPlanManejo.valoracionesPoliza
              .length > 0 &&
            this.remisionService.valoracionesPlanManejo.fechaExamenMedico ==
            null
          ) {
            this.accionesViewModel.habilitarGuardar = false;
          } else {
            this.accionesViewModel.habilitarGuardar = true;
          }
        }
      } else {
        this.accionesViewModel.habilitarGuardar = true;
      }
    }
  }

  public validarCrearPaciente(): boolean {
    if (this.remisionService.remision !== undefined) {
      if (this.remisionService.remision.estado === EstadosRemisionEnum.NUEVO) {
        return false;
      } else {
        return true;
      }
    }
  }

  /**
   * Abre modal cancelar dependiendo del estado de la remision
   */
  public abrirModalCancelar(): void {
    if (this.remisionService.remision.estado === EstadosRemisionEnum.NUEVO) {
      const cancelarRemisionNuevaModal = this.dialog.open(
        ModalCancelaRemisionNuevaComponent,
        {
          width: '30%',
          disableClose: true,
          data: {}
        }
      );
    }
    if (
      this.remisionService.remision.estado ===
      EstadosRemisionEnum.PENDIENTE_ADMITIR ||
      this.remisionService.remision.estado === EstadosRemisionEnum.EMPALME
    ) {
      const cancelarRemisionPendiente = this.dialog.open(
        ModalCancelaRemisionPendienteComponent,
        {
          width: '60%',
          disableClose: true,
          data: {}
        }
      );
    }
  }

  /**
   * Obtiene el consentimiento
   */
  public obtenerConsentimiento(): void {
    if (
      this.paciente &&
      this.paciente.nombre &&
      this.paciente.apellido &&
      this.paciente.numeroIdentificacion
    ) {
      this.consentimientoSubscripcion = this.accionesService
        .getConsentimiento(
          this.paciente.nombre + ' ' + this.paciente.apellido,
          this.paciente.numeroIdentificacion
        )
        .subscribe(
          response => {
            saveAs(
              response,
              this.accionesViewModel.mensajes.nombreArchivoConsentimiento
            );
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

      if (
        this.paciente &&
        this.paciente.nombre &&
        this.paciente.apellido &&
        this.paciente.numeroIdentificacion
      ) {
        this.consentimientoSubscripcion = this.accionesService
          .getConsentimiento(
            this.paciente.nombre + '' + this.paciente.apellido,
            this.paciente.numeroIdentificacion
          )
          .subscribe(
            response => {
              if (response) {
                saveAs(
                  response,
                  this.accionesViewModel.mensajes.nombreArchivoConsentimiento
                );
              }
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
  }

  /**
   * Inicializa la aplicacion dependiendo del end point
   *
   */
  private initDatos() {
    console.log(this.route.snapshot.data);
    if (this.router.url === '/remision/nueva') {
      this.cdRef.detectChanges();
      this.remision$ = this.remisionService.generarRemision();

      this.crearNuevaRemision();
      this.datos();
    } else if (this.router.url === '/remision/editar') {
      this.cdRef.detectChanges();
      if (
        this.agregadosRemision.remision !== null &&
        this.agregadosRemision.remision !== undefined
      ) {
        this.remisionService.remision = this.agregadosRemision.remision;
        this.datosUpdate();

      } else {
        this.router.navigate(['/']);
      }
    }
  }

  /**
   * Update
   */
  private datosUpdate() {
    this.estado = this.agregadosRemision.datosRemision.estado;
    this.accionesViewModel.idRemisionPk = this.agregadosRemision.datosRemision.idRemision;
    this.numeroRemision = this.agregadosRemision.datosRemision.idRemision;
    this.cdRef.detectChanges();
    /*if (this.estado !== EstadosRemisionEnum.PENDIENTE_ADMITIR) {
      this.accionesViewModel.habilitarGuardar = false;
    }*/
  }

  /**
   * crea los datos que debe
   * tener la remision cuando
   * su end point es  nueva
   */
  private datos() {
    console.log('remisionnsonson', this.remisionService.remision);
    this.estado = this.remisionService.remision.estado;
    this.numeroRemision = this.remisionService.remision.idRemision;
    this.accionesViewModel.idRemisionPk = this.remisionService.remision.idRemisionPk;
    this.cdRef.detectChanges();
  }


  private tieneValoraciones(): boolean {
    if (
      this.remisionService.valoracionesPlanManejo &&
      this.remisionService.valoracionesPlanManejo.valoracionesPoliza.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  private tieneProcedimientos(): boolean {
    if (
      this.remisionService.procedimientosPlanManejo &&
      (this.remisionService.procedimientosPlanManejo.curaciones.length > 0 ||
        this.remisionService.procedimientosPlanManejo.fototerapias.length > 0 ||
        this.remisionService.procedimientosPlanManejo.secreciones.length > 0 ||
        this.remisionService.procedimientosPlanManejo.sondajes.length > 0 ||
        this.remisionService.procedimientosPlanManejo.soporteNutricionales
          .length > 0)
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Indica si se muestra el boton consentimiento
   * @param {string} pasoActual
   * @returns {boolean}
   */
  private mostrarConsentimiento(pasoActual: number): boolean {
    return this.pasoActual > 1;
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): AccionesViewModel {
    return new AccionesViewModel(
      null,
      false,
      null,
      null,
      null,
      null,
      null,
      null
    );
  }

  /**
   * Inicializa el modelo remision
   * @returns {Remision}
   */
  private iniciarModelRemisionRequest(): RemisionRequest {
    return new RemisionRequest(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );
  }

  /**
   * Inicializa el modelo de guardar Remision Request
   *
   * @returns {GuardarRemisionRequest}
   */
  private iniciarModelRemisionGuardar(): GuardarRemisionRequest {
    return new GuardarRemisionRequest(null, null, null, null, null, null, null);
  }

  private crearNuevaRemision() {
    console.log('esto genera la nueva remisioon');
    this.crearNuevaRemisionSuscripcion = this.remisionService.generarRemision().subscribe(
      response => {
        console.log('este es el response', response);
        this.loading = false;
        this.estado = response.estado;
        this.numeroRemision = response.idRemision;
        console.log(response, ' respuesta para david');
        this.remisionService.generarObjetoRemision(response);
        //  this.remisionService.generarObjetoRemisionRequest(response);
        this.remisionService.diagnosticos = [];
        this.remisionService.datosRemision = new DatosRemision(
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          ''
        );
        this.remisionService.admision = null;
        this.remisionService.tratamientosPlanManejo = [];
        this.remisionService.procedimientosPlanManejo = new Procedimientos(
          [],
          [],
          [],
          [],
          []
        );
        this.remisionService.valoracionesPlanManejo = null;
      },
      error => {
        this.loading = false;
        this.capturaDeErroresService.mapearErrores(error.status, error.error);
      }
    );
  }

  private esPropiedadNulaVacia(obj): boolean {
    for (const key in obj) {
      if (obj[key] === null || obj[key] === '') {
        return true;
      }
    }
    return false;
  }
}
