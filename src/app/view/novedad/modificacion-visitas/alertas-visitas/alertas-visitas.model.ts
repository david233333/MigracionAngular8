import {mensajes as mensajesCitas} from '../../../../shared/utils/mensajes';

export class AlertasVisitasModel {

  constructor(public mensajes: any,
              public cargando: boolean,
              public respuestaCitas: any,
              public alertaSeleccionada: any,
              public idRemision: string) {
    this.mensajes = mensajesCitas.novedades.alertasVisitas;
  }

}
