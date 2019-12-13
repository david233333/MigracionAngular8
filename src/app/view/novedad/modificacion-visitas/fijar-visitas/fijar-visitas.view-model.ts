import { mensajes as mensajesFijacionesVisitas } from '../../../../shared/utils/mensajes';
import { CitaProgramacionRequest } from '../../../../infraestructure/request-model/novedad/cita-programacion.request';
import { MotivoFijarCita } from '../../../../domain/model/maestro/entity/motivo-fijar-cita.model';
import { Profesion } from '../../../../domain/model/maestro/entity/profesion.model';


export class FijarVisitasViewModel {
  constructor(
    public mensajes: any,
    public cargando: boolean,
    public respuestaMotivosFijacion: MotivoFijarCita[],
    public respuestaEspecialidad: Profesion[],
    public respuestaVisitas: Array<CitaProgramacionRequest>,
    public visitasDatos: Array<any>,
    public visitasSeleccionadas: Array<any>,
    public especialidadSeleccionada: string
  ) {
    this.mensajes = mensajesFijacionesVisitas.novedades.fijacionVisitas;
  }
}
