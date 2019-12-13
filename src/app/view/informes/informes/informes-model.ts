import {mensajes as mensajesInformeVehicular} from '../../../shared/utils/mensajes';

export class InformesModel {

  constructor(
    public mensajes: any,
    public cargando: boolean,
    public listaInformes: Array<any>,
    public informe: null
  ) {
    this.mensajes = mensajesInformeVehicular.informesList;
  }
}
