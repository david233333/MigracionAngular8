import {Component, Inject, OnDestroy, OnInit} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ModalCancelaRemisionPendienteViewModel} from './modal-cancela-remision-pendiente.view-model';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AccionesService} from '../../../../domain/usecase/remision/acciones.service';
import {Subscription} from 'rxjs/Subscription';
import {MensajesService} from '../../../../shared/services/mensajes.service';
import {EstadosRemisionEnum} from '../../../../shared/utils/enums/estados-remision.enum';
import {Paciente} from '../../../../domain/model/remision/entity/paciente.model';
import {RemisionRequest} from '../../../../infraestructure/request-model/RemisionRequest';
import {RemisionContenedorService} from '../../../../domain/usecase/remision/remision-contenedor.service';
import {GuardarRemisionRequest} from '../../../../infraestructure/request-model/GuardarRemisionRequest';
import {UsuarioService} from '../../../../shared/services/usuario.service';
import {LoginUsecaseServices} from '../../../../domain/usecase/seguridad/loginUsecase-services';
import {CapturarErrores} from '../../../../shared/services/capturar-errores';

@Component({
  selector: 'sura-modal-cancela-remision-pendiente',
  templateUrl: './modal-cancela-remision-pendiente.component.html',
  styleUrls: ['./modal-cancela-remision-pendiente.component.scss']
})
export class ModalCancelaRemisionPendienteComponent
  implements OnInit, OnDestroy {
  public newDatosPaciente: Paciente = this.iniciarDatosPaciente();
  public guardarRemisionRequest = this.iniciarModelRemisionGuardar();
  public modalCancelaRemisionPendienteViewModel: ModalCancelaRemisionPendienteViewModel = this.iniciarViewModel();
  public formulario: FormGroup;
  private remisionRequest = this.iniciarModelRemisionRequest();
  private motivosCancelacionSuscripcion: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalCancelaRemisionPendienteComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private accionesServices: AccionesService,
    private mensajeServices: MensajesService,
    private remisionService: RemisionContenedorService,
    private mensajesService: MensajesService,
    private usuarioService: UsuarioService,
    private seguridadService: LoginUsecaseServices,
    private capturaDeErroresService: CapturarErrores
  ) {
    this.crearFormulario();
  }

  ngOnInit() {
    this.getMotivosCancelacion();
  }

  ngOnDestroy(): void {
    this.motivosCancelacionSuscripcion.unsubscribe();
  }

  public getMotivosCancelacion() {
    this.motivosCancelacionSuscripcion = this.accionesServices
      .getMotivoCancelacion()
      .subscribe(
        response => {
          if (response) {
            this.modalCancelaRemisionPendienteViewModel.respuestaMotivosCancelaciones = response;
          }
        },
        error => this.capturaDeErroresService.mapearErrores(error.status, error.error)
      );
  }

  /**
   * Cancela y cierra el modal
   */
  public cancelar(): void {
    this.dialogRef.close(false);
  }

  /**
   * Guarda remision en estado No admitido
   */
  public continuar(): void {
    if (
      this.remisionService.remision.estado ===
      EstadosRemisionEnum.PENDIENTE_ADMITIR ||
      (this.remisionService.remision.estado === EstadosRemisionEnum.EMPALME &&
        this.remisionService.remision.idRemision !== null) ||
      this.remisionService.remision.idRemision !== ''
    ) {
      const estado = EstadosRemisionEnum.NO_ADMITIDO;
      const mensaje = 'No se admitió la remisión';
      this.remisionService.remision.motivoCancelacion = this.formulario.controls[
        'motivoCancelacion'
        ].value;
      this.remisionService.remision.observacionCancelacion = this.formulario.controls[
        'observaciones'
        ].value;
      this.validarUsuarioObtenerRemision(estado, mensaje);
      this.dialogRef.close(true);
    }
  }

  /**
   * Limpia los datos de la cancelación de la remisión
   */
  public limpiarDatosCancelacion(): void {
    this.modalCancelaRemisionPendienteViewModel.respuestaMotivosCancelaciones = [];
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

  /**
   * Inicializa el objeto paciente
   *
   */
  private iniciarDatosPaciente(): Paciente {
    return new Paciente(
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
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): ModalCancelaRemisionPendienteViewModel {
    return new ModalCancelaRemisionPendienteViewModel(null, []);
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formulario = this.fb.group({
      motivoCancelacion: ['', Validators.compose([Validators.required])],
      observaciones: ['', Validators.compose([Validators.maxLength(4000)])]
    });
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
            this.modalCancelaRemisionPendienteViewModel.mensajes
              .mensajeErrorCargarUsuario
          );
        },
        () => {
        }
      );
    }
  }
}
