import { mensajes as mensajesModal } from '../../../../shared/utils/mensajes';
import { MotivoCancelacion } from '../../../../domain/model/maestro/entity/motivo-cancelacion.model';

export class ModalCancelaRemisionPendienteViewModel {
  constructor(
    public mensajes: any,
    public respuestaMotivosCancelaciones: MotivoCancelacion[],
  ) {
    this.mensajes = mensajesModal.datosRemision.modalRemisionCancela;
  }
}
