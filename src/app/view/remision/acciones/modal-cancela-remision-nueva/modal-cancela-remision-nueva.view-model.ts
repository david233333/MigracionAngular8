import { mensajes as mensajesModal } from '../../../../shared/utils/mensajes';

export class ModalCancelaRemisionNuevaViewModel {
  constructor(
    public mensajes: any
  ) {
    this.mensajes = mensajesModal.datosRemision.modalRemisionCancela;
  }
}
