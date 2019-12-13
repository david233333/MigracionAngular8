import {mensajes as mensajesInformeSeguridad} from '../../../../../shared/utils/mensajes';

export default class InformeSeguridadViewModel {
  constructor(
    public mensajes: any,
    public cargando: boolean
  ) {
    this.mensajes = mensajesInformeSeguridad.informes.informeSeguridad;
  }
}
