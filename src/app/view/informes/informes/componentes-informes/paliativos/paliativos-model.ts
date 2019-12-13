import {mensajes as mensajesInformeVehicular} from '../../../../../shared/utils/mensajes';

export class PaliativosModel {

  constructor(
    public mensajes: any,
    public cargando: boolean,
    public listaInformes: Array<any>,
    public reporte: null
  ) {
    this.mensajes = mensajesInformeVehicular.informesList;
  }
}
