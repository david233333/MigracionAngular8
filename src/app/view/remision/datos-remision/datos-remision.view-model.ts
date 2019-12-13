import { mensajes as mensajesDatosRemision } from '../../../shared/utils/mensajes';
import { TipoIdentificacion } from '../../../domain/model/maestro/entity/tipo-identificacion.model';
import { Institucion } from '../../../domain/model/maestro/entity/institucion.model';
import { Peso } from '../../../domain/model/maestro/entity/peso.model';


export class DatosRemisionViewModel {
  constructor(
    public mensajes: any,
    public respuestaTiposIdentificacion: TipoIdentificacion[],
    public respuestaInstituciones: Institucion[],
    public mostrarPeso: boolean,
    public pesos: Peso[]
  ) {
    this.mensajes = mensajesDatosRemision.datosRemision;
  }
}
