import { mensajes as mensajesModal } from '../../../../shared/utils/mensajes';

export class ModalCondicionPacienteAceptaViewModel {
  constructor(
    public mensajes: any
  ) {
    this.mensajes = mensajesModal.datosAtencion.modalPacienteAcepta;
  }
}
