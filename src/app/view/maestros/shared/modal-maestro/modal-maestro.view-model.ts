import {mensajes as mensajesModalMaestro} from '../../../../shared/utils/mensajes';

export class ModalMaestroViewModel {
  constructor(
    public mensajes: any,
    public cargando: boolean
  ) {
    this.mensajes = mensajesModalMaestro.gestionMaestros.modal;
  }
}
