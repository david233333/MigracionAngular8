import {mensajes as mensajesInformeVehicular} from '../../../../../shared/utils/mensajes';

export class InformePacientesModel {
  constructor(
    public listaPisos: Array<any>,
    public listaCiudades: Array<any>,
    public mensajes: any,
    public cargando: boolean,
  ) {
    //this.mensajes = mensajesInformeVehicular.informes.informeEgreso;
  }
}
