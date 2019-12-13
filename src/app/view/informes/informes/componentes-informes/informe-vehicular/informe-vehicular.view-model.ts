import { mensajes as mensajesInformeVehicular } from "../../../../../shared/utils/mensajes";

export class InformeVehicularViewModel {
  constructor(
    public mensajes: any,
    public cargando: boolean,
    public respuestaEspecialidades: Array<any>
  ) {
    this.mensajes = mensajesInformeVehicular.transporte.informeVehicular;
  }
}
