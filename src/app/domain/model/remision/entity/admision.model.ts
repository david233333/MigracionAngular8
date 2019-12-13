import {Programa} from '../../maestro/entity/programa.model';
import { Piso } from '../../maestro/entity/piso.model';

export class Admision {

  constructor (
    public idRemisionPK: string,
    public fechaAdmision: Date,
    public usuarioResponsable: string,
    public empalme: boolean,
    public fechaEmpalme: Date,
    public esDomiciliario: boolean,
    public entregadoA: string,
    public piso: Piso,
    public programa: Programa,
    public sede: any,
    public gestionAdmision: string,
    public requiereEstadiaTemporal: boolean
  ) {

  }
}
