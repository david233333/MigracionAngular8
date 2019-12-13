import { mensajes as mensajesEgreso } from '../../../shared/utils/mensajes';
import { MotivoEgreso } from '../../../domain/model/maestro/entity/motivo-egreso.model';


export class EgresoViewModel {
  constructor(
    public mensajes: any,
    public cargando: boolean,
    public paciente: string,
    public respuestaMotivosEgreso: MotivoEgreso[],
  ) {
    this.mensajes = mensajesEgreso.novedades.egreso;
  }
}
