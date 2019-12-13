import { mensajes as mensajesAcciones } from '../../../shared/utils/mensajes';

export class AccionesViewModel {
  constructor(
    public mensajes: any,
    public mensaje: any,
    public mostrarConsentimiento: boolean,
    public estadoRemision: string,
    public numeroRemision: string,
    public idRemisionPk: string,
    public habilitarEnviar: boolean,
    public habilitarGuardar: boolean
  ) {
    this.mensajes = mensajesAcciones.acciones;
    this.mensaje = mensajesAcciones.inicio;
  }
}
