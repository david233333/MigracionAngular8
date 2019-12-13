
import {mensajes as mensajesListaRemisiones} from '../../../../shared/utils/mensajes';
import {Ciudad} from '../../../../domain/model/maestro/entity/ciudad.model';
import {DatosAtencionPaciente} from '../../../../domain/model/remision/entity/datos-atencion.model';

export class LineaUnicaModalModel {
  constructor(
    public mensajes: any,
    public cargando: boolean,
    public respuestaCita: any,
    public respuestaCiudades: Ciudad[],
    public respuestaUbicacion: any,
    public respuestaDatosPaciente: DatosAtencionPaciente
  ) {
    this.mensajes = mensajesListaRemisiones.lineaUnicaModal;
  }
}
