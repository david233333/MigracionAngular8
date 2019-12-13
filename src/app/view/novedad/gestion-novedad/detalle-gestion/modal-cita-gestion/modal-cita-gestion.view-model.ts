import {mensajes as mensajesModalGestionCita} from '../../../../../shared/utils/mensajes';


export class ModalCitaGestionViewModel {
  constructor(
    public mensajes: any,
    public cargando: boolean,
    public respuestaCitas: any[],
    public verOpcionListaCita: boolean,
    public verOpcionFechaCita: boolean,
    public tipoFecha: string,
    public novedadSeleccionada: any,
    public habilitarAplicar: boolean
  ) {
    this.mensajes = mensajesModalGestionCita.novedades.detalleGestionNovedad;
  }
}
