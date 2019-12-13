import { Remision } from '../../domain/model/remision/entity/remision.model';
import { Paciente } from '../../domain/model/remision/entity/paciente.model';
import { DatosAtencionPaciente } from '../../domain/model/remision/entity/datos-atencion.model';
import { Diagnostico } from '../../domain/model/remision/entity/diagnostico.model';
import { DatosRemision } from '../../domain/model/remision/entity/datos-remision.model';
import { Admision } from '../../domain/model/remision/entity/admision.model';
import { PlanManejo } from '../../domain/model/remision/entity/plan-manejo/plan-manejo.model';


export class GuardarRemisionRequest {
  constructor
  (
    public remision: Remision,
    public paciente: Paciente,
    public datosAtencionPaciente: DatosAtencionPaciente,
    public diagnosticos: Diagnostico[],
    public datosRemision: DatosRemision,
    public admision: Admision,
    public planManejo: PlanManejo
  ) {

  }
}
