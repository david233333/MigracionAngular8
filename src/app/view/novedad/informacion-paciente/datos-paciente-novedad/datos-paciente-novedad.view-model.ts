import { mensajes as mensajesDatosPaciente } from "../../../../shared/utils/mensajes";
import { Ciudad } from "../../../../domain/model/maestro/entity/ciudad.model";
import { Municipio } from "../../../../domain/model/maestro/entity/municipio.model";
import { Ubicacion } from "../../../../domain/model/novedad/entity/ubicacion.model";

export class DatosPacienteViewModel {
  constructor(
    public mensajes: any,
    public placeholderTelefono: string,
    public placeholderCelular: string,
    public placeholderCelular2: string,
    public cargando: boolean,
    public respuestaCiudades: Ciudad[],
    public respuestaMunicipios: Municipio[],
    public respuestaUbicacion: Ubicacion,
    public respuestaInfoPaciente: any
  ) {
    this.mensajes =
      mensajesDatosPaciente.novedades.informacionPaciente.datosPaciente;
  }
}
