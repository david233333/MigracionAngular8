import {mensajes as mensajesCitas} from '../../../../../shared/utils/mensajes';

export class ModalAlertaModel {

  constructor(public mensajes: any) {
    this.mensajes = mensajesCitas.novedades.modalAlertas;
  }
}
