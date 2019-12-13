import { mensajes as mensajesNovedad } from '../../../shared/utils/mensajes';
import { TipoIdentificacion } from '../../../domain/model/maestro/entity/tipo-identificacion.model';
import { MotivoEgreso } from '../../../domain/model/maestro/entity/motivo-egreso.model';


export class CreacionNovedadViewModel {
  constructor(
    public mensajes: any,
    public cargando: boolean,
    public idRemision: string,
    public identificacionPaciente: string,
    public respuestaTiposIdentificacion: TipoIdentificacion[],
    public respuestaRemisiones: any[],
    public respuestaMotivosEgreso: MotivoEgreso[],
    public respuestaNovedades: Array<any>,
    public infoRemision: any
  ) {
    this.mensajes = mensajesNovedad.novedades.inicioNovedad;
  }
}
