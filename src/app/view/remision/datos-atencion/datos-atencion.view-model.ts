import { mensajes as mensajesAtencion } from '../../../shared/utils/mensajes';
import { Ciudad } from '../../../domain/model/maestro/entity/ciudad.model';
import { Municipio } from '../../../domain/model/maestro/entity/municipio.model';
import {Ubicacion} from '../../../domain/model/remision/entity/ubicacion.model';

export class DatosAtencionViewModel {
  constructor (
    public mensajes: any,
    public placeholderTelefono: string,
    public placeholderCelular: string,
    public placeholderCelular2: string,
    public condicionPacienteAcepta: boolean,
    public condicionServicios: boolean,
    public respuestaCiudades: Ciudad[],
    public respuestaMunicipios: Municipio[],
    public respuestaUbicacion: Ubicacion
  ) {
    this.mensajes = mensajesAtencion.datosAtencion;
  }
}
