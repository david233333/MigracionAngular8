import { mensajes as mensajesAdmision } from '../../../shared/utils/mensajes';
import { Admision } from '../../../domain/model/remision/entity/admision.model';
import { Piso } from '../../../domain/model/maestro/entity/piso.model';
import { Programa } from '../../../domain/model/maestro/entity/programa.model';

export class AdmisionViewModel {
  constructor(
    public esEstadiaTemporal: boolean,
    public tipoAtencionSeleccionado: boolean,
    public respuestaPisos: Piso[],
    public idPrograma: string,
    public respuestaSedes: any[],
    public respuestaProgramas: Programa[],
    public esEmpalme: boolean,
    public fechaMinima: Date,
    public fechaMaxima: Date,
    public mensajes: any,
    public admision: Admision,
    public centroEstadiaTemporal: boolean,
    public fechaAdmision: Date = new Date(),
  ) {
    this.mensajes = mensajesAdmision.admisiones;
  }
}
