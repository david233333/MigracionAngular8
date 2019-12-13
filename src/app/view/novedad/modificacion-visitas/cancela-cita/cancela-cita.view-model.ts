import { mensajes as mensajesCancelarCita } from "../../../../shared/utils/mensajes";
import { MotivoCancelacion } from "../../../../domain/model/maestro/entity/motivo-cancelacion.model";
import { Cita } from "../../../../domain/model/programacion/entity/cita.model";

export class CancelaCitaViewModel {
  constructor(
    public mensajes: any,
    public cargando: boolean,
    public respuestaMotivosCancelaCita: MotivoCancelacion[],
    public respuestaCitas: Array<Cita>,
    public citasSeleccionadas: Cita
  ) {
    this.mensajes = mensajesCancelarCita.novedades.cancelarCita;
  }
}
