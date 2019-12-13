import { ProgramacionSemana } from '../../../../shared/models/programacion-semana.model';
import { Frecuencia } from '../../maestro/entity/frecuencia.model';
import { TiposSoporteNutricional } from '../../maestro/entity/tipos-soporte-nutricional.model';


export class EventoSoporteNutricional {
  constructor(
    public id: string,
    public diasEvento: Array<ProgramacionSemana>,
    public frecuencia: Frecuencia,
    public tipoEvento: TiposSoporteNutricional,
    public diasTratamiento: string,
    public frecuenciaDescripcion?: string,
    public eventoDescripcion?: string
  ) {
    this.frecuenciaDescripcion = this.frecuencia.descripcion;
    this.eventoDescripcion = this.tipoEvento.descripcion;
  }
}
