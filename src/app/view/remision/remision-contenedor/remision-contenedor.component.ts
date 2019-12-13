import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';

import {StepperSelectionEvent} from '@angular/cdk/stepper';

import {RemisionContenedorViewModel} from './remision-contenedor.view-model';
import {RemisionContenedorService} from '../../../domain/usecase/remision/remision-contenedor.service';
import {MensajesService} from '../../../shared/services/mensajes.service';
import {RemisionEnum} from '../../../shared/utils/enums/remision.enum';
import {Router} from '@angular/router';
import {DatosPacienteService} from '../../../domain/usecase/remision/datos-paciente.service';
import {Paciente} from '../../../domain/model/remision/entity/paciente.model';
import {LoginUsecaseServices} from '../../../domain/usecase/seguridad/loginUsecase-services';
import {UsuarioService} from '../../../shared/services/usuario.service';
import {CapturarErrores} from '../../../shared/services/capturar-errores';

@Component({
  selector: 'sura-remision-contenedor',
  templateUrl: './remision-contenedor.component.html',
  styleUrls: ['./remision-contenedor.component.scss']
})
export class RemisionContenedorComponent implements OnInit {
  public remisionContenedorViewModel: RemisionContenedorViewModel = this.iniciarViewModel();
  public datosPacienteFormulario: FormGroup;
  public datosAtencionFormulario: FormGroup;
  public diagnosticosFormulario: FormGroup;
  public datosRemisionFormulario: FormGroup;
  public planManejoFormulario: FormGroup;
  public admisionFormulario: FormGroup;
  public paciente: Paciente;
  public pasoActual = 1;
  // public edadPaciente: number;
  public pacDatos: any;
  public show = false;
  public habilitaGuardado = false;
  public habilitaEnviado = false;
  public tiposIdentificacionSubscripcion = new Subscription();
  @Output()
  public edadPaciente: EventEmitter<Paciente> = new EventEmitter<Paciente>();
  @ViewChild('stepper', { static: true }) private stepper;

  constructor(
    private formBuilder: FormBuilder,
    private mensajesService: MensajesService,
    private router: Router,
    private datosPacienteService: DatosPacienteService,
    private cdRef: ChangeDetectorRef,
    private seguridadService: LoginUsecaseServices,
    private usuarioService: UsuarioService,
    private capturaDeErroresService: CapturarErrores,
    public remisionContenedorService: RemisionContenedorService
  ) {
    this.crearFormularios();
    setTimeout(() => {
      if (this.remisionContenedorService.remision !== undefined) {
        this.remisionContenedorViewModel.estadoActual = this.remisionContenedorService.remision.estado;
      }
    }, 500);
    this.datosPacienteFormulario.valueChanges.subscribe(valor => {
    });
    this.datosAtencionFormulario.valueChanges.subscribe(() => {
    });
  }

  ngOnInit() {
    this.cdRef.detectChanges();
    this.getTiposIdentificacion();
    this.validarUsuarioAutenticado();
  }

  /**
   * Indica la accion a realizar al cambiar el paso
   * @param evento
   */
  public cambiarPaso(evento: StepperSelectionEvent) {
    this.pasoActual = evento.selectedIndex + 1;
  }

  /**
   * Emite y valida la edad del paciente
   * @param evento
   */
  validarEdadPaciente(evento): void {
    if (evento) {
      this.edadPaciente = evento.edadPaciente;
    }
  }

  /**
   * Abre y cierra el pac
   */
  public hidePac() {
    this.show = !this.show;
  }

  /**
   * Recibe valor para lso datos del pac
   * @param evento
   */

  public activaHide(evento) {
    this.remisionContenedorViewModel.hide = this.datosPacienteService.pact.hide;
    this.remisionContenedorViewModel.nombrePlan = this.datosPacienteService.pact.nombrePlan;
    this.remisionContenedorViewModel.codigoPlan = this.datosPacienteService.pact.codigoPlan;
    this.remisionContenedorViewModel.especialistas = this.datosPacienteService.pact.especialistas;
    this.remisionContenedorViewModel.pago = this.datosPacienteService.pact.pago;
    this.remisionContenedorViewModel.habitacionIndividual = this.datosPacienteService.pact.habitacionIndividual;
    this.remisionContenedorViewModel.atencionDomiciliaria = this.datosPacienteService.pact.atencionDomiciliaria;
    this.remisionContenedorViewModel.dxIntrahospitalaria = this.datosPacienteService.pact.dxIntrahospitalaria;
    this.remisionContenedorViewModel.dxAmbulatoria = this.datosPacienteService.pact.dxAmbulatoria;
    this.remisionContenedorViewModel.recienNacido = this.datosPacienteService.pact.recienNacido;
    this.remisionContenedorViewModel.continuidadParto = this.datosPacienteService.pact.continuidadParto;
  }

  /**
   * Genera el objeto indicado de la remision
   * @param evento
   */
  public generarObjetoDatosPaciente(evento): void {
    this.paciente = evento;
    if (evento) {
      this.edadPaciente = evento.edad;
      this.remisionContenedorViewModel.paciente = Object.assign(
        {},
        this.remisionContenedorService.generarObjetoDatosPaciente(evento)
      );

      this.datosPacienteFormulario
        .get('datosPaciente')
        .setValue(this.remisionContenedorViewModel.paciente);
    }
  }

  /**
   * Genera el objeto indicado de la remision
   * @param evento
   */
  public generarObjetoDatosAtencion(evento): void {
    if (evento) {
      this.remisionContenedorViewModel.datosRemision = Object.assign(
        {},
        this.remisionContenedorService.generarObjetoDatosAtencion(evento)
      );
      this.datosAtencionFormulario
        .get('datosAtencion')
        .setValue(this.remisionContenedorViewModel.datosRemision);
    }
  }

  /**
   * Genera el objeto indicado de la remision
   * @param evento
   */
  public generarObjetoDiagnosticos(evento): void {
    if (evento && evento.diagnosticos) {
      this.diagnosticosFormulario
        .get('diagnosticos')
        .setValue(
          this.remisionContenedorService.generarObjetoDiagnosticos(
            evento.diagnosticos
          )
        );
    }
  }

  /**
   * Genera el objeto indicado de la remision
   * @param evento
   */
  public generarObjetoDatosRemision(evento): void {
    if (evento) {
      this.datosRemisionFormulario
        .get('datosRemision')
        .setValue(
          this.remisionContenedorService.generarObjetoDatosRemision(evento)
        );
    }
  }

  /**
   * Genera el objeto indicado de la remision
   * @param evento
   */
  public generarObjetoTratamientos(evento): void {
    if (evento && evento.tratamientos) {
      this.remisionContenedorService.tratamientosPlanManejo =
        evento.tratamientos;
      this.planManejoFormulario
        .get('tratamientos')
        .setValue(
          this.remisionContenedorService.generarObjetoTratamientosPlanManejo(
            evento.tratamientos
          )
        );
    }
  }

  /**
   * Genera el objeto indicado de la remision
   * @param evento
   */
  public generarObjetoProcedimientos(evento): void {
    if (evento) {
      this.planManejoFormulario
        .get('procedimiento')
        .setValue(
          this.remisionContenedorService.generarObjetoProcedimientosPlanManejo(
            evento
          )
        );
    }
  }

  /**
   * Genera el objeto indicado de la remision
   * @param evento
   */
  public generarObjetoValoraciones(evento): void {
    if (evento) {
      this.planManejoFormulario
        .get('valoraciones')
        .setValue(
          this.remisionContenedorService.generarObjetoValoracionesPlanManejo(
            evento
          )
        );
    }
  }

  /**
   * Genera el objeto indicado de la remision
   * @param evento
   */
  public generarObjetoAdmision(evento): void {
    if (evento) {
      this.admisionFormulario.get('admision').setValue(
        this.remisionContenedorService.generarObjetoAdmision(evento)
      );

    }
  }

  /**
   * Cambia la ciudad seleccionada
   * @param evento
   */
  public ciudadSeleccionada(evento): void {
    if (evento) {
      this.remisionContenedorViewModel.ciudadSeleccionada = evento;
    }
  }

  /**
   * Controla el flujo de cada uno de los pasos
   * @param {string} nombreFormulario
   * @param {boolean} valido
   */
  public pasoValido(paso: number, valido: any): void {
    switch (paso) {
      case RemisionEnum.datosPaciente: {
        this.setValidezFormulario(this.datosPacienteFormulario, valido);
        break;
      }
      case RemisionEnum.datosAtencion: {
        this.setValidezFormulario(this.datosAtencionFormulario, valido);
        break;
      }
      case RemisionEnum.diagnostico: {
        this.setValidezFormulario(this.diagnosticosFormulario, valido);
        break;
      }
      case RemisionEnum.datosRemision: {
        this.setValidezFormulario(this.datosRemisionFormulario, valido);
        if (valido) {
          this.habilitaEnviado = valido;
        }
        break;
      }
      case RemisionEnum.planManejo: {
        this.setValidezFormulario(this.planManejoFormulario, valido);
        break;
      }
      case RemisionEnum.admision: {
        this.setValidezFormulario(this.admisionFormulario, valido);
        break;
      }
    }
  }

  pacienteAgregado() {
  }

  public habilitarGuardado(habilitar: boolean): void {
    this.habilitaGuardado = habilitar;
  }

  public habilitarEnviado(habilitar: boolean): void {
    this.habilitaEnviado = habilitar;
  }

  private validarUsuarioAutenticado() {
    console.log('this.usuarioService.InfoUsuario remision-contenedor ', this.usuarioService.InfoUsuario);
    const usuario = this.usuarioService.InfoUsuario;
    if (
      usuario !== null &&
      usuario !== undefined &&
      usuario.isAuthenticated !== null &&
      usuario.username !== null &&
      usuario.fullName !== null
    ) {
    } else {
      this.seguridadService.datosUsuarioLogueado().subscribe(
        infoUsuario => {
          this.usuarioService.InfoUsuario = infoUsuario;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
        }
      );
    }
  }

  /**
   * Realiza llamado al servicio
   */
  private getTiposIdentificacion(): void {
    this.tiposIdentificacionSubscripcion = this.remisionContenedorService
      .getTiposIdentificacion()
      .subscribe(
        response => {
          if (response) {
            this.remisionContenedorViewModel.respuestaTiposIdentificacion = response;
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
   * Crea formularios con cada uno de los pasos
   */
  private crearFormularios(): void {
    this.datosPacienteFormulario = this.formBuilder.group({
      esValido: [null, Validators.required],
      datosPaciente: [null, Validators.required]
    });
    this.datosAtencionFormulario = this.formBuilder.group({
      esValido: [null, Validators.required],
      datosAtencion: [null, Validators.required]
    });
    this.diagnosticosFormulario = this.formBuilder.group({
      esValido: [null, Validators.required],
      diagnosticos: [null, Validators.required]
    });
    this.datosRemisionFormulario = this.formBuilder.group({
      esValido: [null, Validators.required],
      datosRemision: [null, Validators.required]
    });
    this.planManejoFormulario = this.formBuilder.group({
      esValido: [null, Validators.required],
      tratamientos: [null, Validators.required],
      procedimiento: [null],
      valoraciones: [null]
    });
    this.admisionFormulario = this.formBuilder.group({
      esValido: [null, Validators.required],
      admision: [null, Validators.required]
    });
  }

  /**
   * Asigna validez del formulario
   * @param {FormGroup} formulario
   * @param {string} nombreCampo
   * @param valor
   */
  private setValidezFormulario(formulario: FormGroup, esValido: boolean): void {
    formulario.get('esValido').setValue(esValido);
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): RemisionContenedorViewModel {
    return new RemisionContenedorViewModel(
      null,
      null,
      [],
      null,
      null,
      null,
      null,
      null,
      null,
      false,
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
  }
}
