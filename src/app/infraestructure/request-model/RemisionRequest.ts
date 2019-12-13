import {Paciente} from '../../domain/model/remision/entity/paciente.model';
import {DatosAtencionPaciente} from '../../domain/model/remision/entity/datos-atencion.model';
import {DatosRemision} from '../../domain/model/remision/entity/datos-remision.model';
import {Diagnostico} from '../../domain/model/remision/entity/diagnostico.model';
import {Admision} from '../../domain/model/remision/entity/admision.model';
import { PlanManejo } from '../../domain/model/remision/entity/plan-manejo/plan-manejo.model';


export class RemisionRequest {
  constructor(
    public id: string,
    public idRemision: string,
    public fechaCreacion: Date,
    public estado: string,
    public paciente: Paciente,
    public datosAtencionPaciente: DatosAtencionPaciente,
    public aceptaIngresoVoluntario: boolean,
    public tieneServiciosBasicos: boolean,
    public diagnosticos: Diagnostico[],
    public datosRemision: DatosRemision,
    public planManejo: PlanManejo,
    public admision: Admision,
    public motivoCancelacion: string,
    public observacionCancelacion: string) {}
}
