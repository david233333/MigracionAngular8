import { mensajes as mensajesModal } from '../../utils/mensajes';

export class ModalConfirmacionViewModel {
  constructor(
    public mensajes: any
  ) {
    this.mensajes = mensajesModal.modalConfirmacion;
  }
}
