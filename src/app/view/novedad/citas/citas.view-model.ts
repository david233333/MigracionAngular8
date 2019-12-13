import { mensajes as mensajesCitas } from '../../../shared/utils/mensajes';
import { Cita } from '../../../domain/model/novedad/entity/cita.model';

export class CitasViewModel {
  constructor(
    public mensajes: any,
    public cargando: boolean,
    public citas: Cita[],
    public citasAgregado: Cita[]
  ) {
    this.mensajes = mensajesCitas.novedades.citas;
  }
}
