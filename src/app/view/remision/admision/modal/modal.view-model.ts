import {mensajes as mensajesModal} from '../../../../shared/utils/mensajes';

export class ModalViewModel {

  constructor(public mensajes: any, 
     public respuestaCentroEstadia: any) {
    this.mensajes = mensajesModal.admisiones.modalCentroEstadia;

  }
}
