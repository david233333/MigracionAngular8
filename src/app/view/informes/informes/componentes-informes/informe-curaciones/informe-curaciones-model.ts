import {mensajes as mensajesInformeVehicular} from '../../../../../shared/utils/mensajes';

export class InformeCuracionesModel {

  constructor(
    public listaPisos: Array<any>,
    public listaProgramas: Array<any>,
    public listaCiudades: Array<any>,
    public mensajes: any,
    public cargando: boolean,
  ) {
    this.mensajes = mensajesInformeVehicular.informes.informeCuraciones;
  }
}
