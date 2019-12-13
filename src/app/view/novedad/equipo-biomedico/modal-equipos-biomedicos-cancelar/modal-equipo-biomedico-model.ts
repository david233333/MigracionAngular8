import {mensajes as mensajesEquiposBiomedicos} from '../../../../shared/utils/mensajes';

export class ModalEquiposBiomedico {
  constructor(
    public mensajes: any,
    public cargando: boolean,
  ) {
    this.mensajes = mensajesEquiposBiomedicos.novedades.equipoBiomedico;
  }
}
