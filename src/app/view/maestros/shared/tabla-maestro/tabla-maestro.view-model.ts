import {mensajes as mensajesTablaMaestros} from '../../../../shared/utils/mensajes';

export class TablaMaestroViewModel {
  constructor(
    public mensajes: any,
    public listaMaestro: Array<any>,
    public cargando: boolean
  ) {
    this.mensajes = mensajesTablaMaestros.gestionMaestros.tablaMaestros;
  }
}
