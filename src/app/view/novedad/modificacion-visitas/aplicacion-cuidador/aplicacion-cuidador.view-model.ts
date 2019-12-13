import { mensajes as mensajesAplicacionesCuidador } from '../../../../shared/utils/mensajes';
import { MotivoAplicacionCuidador } from '../../../../domain/model/maestro/entity/motivo-aplicacion-cuidador.model';
import { CitaProgramacionRequest } from '../../../../infraestructure/request-model/novedad/cita-programacion.request';


export class AplicacionCuidadorViewModel {
  constructor(
    public mensajes: any,
    public cargando: boolean,
    public respuestaMotivosNovedad: MotivoAplicacionCuidador[],
    public respuestaCitas: Array<CitaProgramacionRequest>,
    public respuestaCitasFiltro: Array<any>,
    public citasSeleccionadas: Array<any>,
    public citasDatos: Array<any>,
    public citasNoSeleccionadas: Array<any>,
    public habilitarAplicar: boolean
  ) {
    this.mensajes = mensajesAplicacionesCuidador.novedades.aplicacionCuidador;
  }
}
