import { mensajes as mensajesCambioPiso } from '../../../../shared/utils/mensajes';
import { Piso } from '../../../../domain/model/maestro/entity/piso.model';


export class AsignarRecursoPreferidoViewModel {
  constructor (
    public mensajes: any,
    public cargando: boolean,
    public respuestaPisos: Piso[],
  ) {
    this.mensajes = mensajesCambioPiso.novedades.informacionPaciente.asignarProfesional;
  }
}
