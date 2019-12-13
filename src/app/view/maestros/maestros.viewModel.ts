import {mensajes as mensajesMaestros} from '../../shared/utils/mensajes';

export class MaestrosViewModel {
  constructor(
    public mensajes: any,
    public cargando: boolean,
    public listaMaestros: Array<any>,
    public maestro: number
  ) {
    this.mensajes = mensajesMaestros.gestionMaestros;
  }
}
