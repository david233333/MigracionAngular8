import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModalCancelaRemisionNuevaViewModel } from './modal-cancela-remision-nueva.view-model';
import { RemisionContenedorService } from '../../../../domain/usecase/remision/remision-contenedor.service';
import { RemisionRequest } from '../../../../infraestructure/request-model/RemisionRequest';
import { Paciente } from '../../../../domain/model/remision/entity/paciente.model';
import { EstadosRemisionEnum } from '../../../../shared/utils/enums/estados-remision.enum';
import { GuardarRemisionRequest } from '../../../../infraestructure/request-model/GuardarRemisionRequest';
import { MensajesService } from '../../../../shared/services/mensajes.service';
import { UsuarioService } from '../../../../shared/services/usuario.service';
import { LoginUsecaseServices } from '../../../../domain/usecase/seguridad/loginUsecase-services';
import {CapturarErrores} from '../../../../shared/services/capturar-errores';

@Component({
  selector: 'sura-modal-cancela-remision-nueva',
  templateUrl: './modal-cancela-remision-nueva.component.html',
  styleUrls: ['./modal-cancela-remision-nueva.component.scss']
})
export class ModalCancelaRemisionNuevaComponent implements OnInit {
  public modalCancelaRemisionNuevaViewModel: ModalCancelaRemisionNuevaViewModel = this.iniciarViewModel();

  private remisionRequest = this.iniciarModelRemisionRequest();

  public newDatosPaciente: Paciente = this.iniciarDatosPaciente();

  public guardarRemisionRequest = this.iniciarModelRemisionGuardar();

  constructor(
    private dialogRef: MatDialogRef<ModalCancelaRemisionNuevaComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private remisionService: RemisionContenedorService,
    private mensajesService: MensajesService,
    private usuarioService: UsuarioService,
    private seguridadService: LoginUsecaseServices,
    private capturaDeErroresService: CapturarErrores
  ) {}

  ngOnInit() {}

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): ModalCancelaRemisionNuevaViewModel {
    return new ModalCancelaRemisionNuevaViewModel(null);
  }

  /**
   * Cancela y cierra el modal
   */
  public cancelar(): void {
    this.dialogRef.close(false);
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
   * Cancela la remision y pone el objeto en null
   */
  public continuar(): void {
    if (
      (this.remisionService.remision.estado === EstadosRemisionEnum.NUEVO &&
        this.remisionService.remision.idRemision !== null) ||
      this.remisionService.remision.idRemision !== ''
    ) {
      const estado = EstadosRemisionEnum.CANCELADO;
      const mensaje = 'Se canceló la remisión correctamente';
      this.remisionService.edicion = !this.remisionService.edicion;
      this.validarUsuarioObtenerRemision(estado, mensaje);
      this.dialogRef.close(true);
    }
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
        },
        () => {}
      );
    }
  }
}
