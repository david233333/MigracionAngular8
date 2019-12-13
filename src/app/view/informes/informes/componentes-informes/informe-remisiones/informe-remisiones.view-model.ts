import { mensajes as mensajesInformeRemisiones } from '../../../../../shared/utils/mensajes';

export class InformeRemisionesViewModel {
  constructor(
    public mensajes: any,
    public cargando: boolean,
    public respuestaEstados: Array<any>,
    public estadosSeleccionadas: Array<any>,
    public tituloPantalla?: string
  ) {
    this.mensajes = mensajesInformeRemisiones.informes.informeRemisiones;
    this.tituloPantalla = this.mensajes.titulo.tituloPantalla;
  }
}
