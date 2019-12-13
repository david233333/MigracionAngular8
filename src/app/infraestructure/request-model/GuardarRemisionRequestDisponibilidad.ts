
import { DatosAtencionPaciente } from "../../domain/model/remision/entity/datos-atencion.model";
import { Remision } from "../../domain/model/remision/entity/remision.model";
import { Diagnostico } from "../../domain/model/maestro/entity/diagnostico.model";
import { PlanManejo } from "../../domain/model/remision/entity/plan-manejo/plan-manejo.model";
import { RemisionRequest } from '../../domain/model/remision/entity/RemisionRequest';


export class GuardarRemisionRequestDisponibilidad {
    constructor
    (
      public remision: RemisionRequest,
      public datosAtencionPaciente: DatosAtencionPaciente,
      public diagnosticos: Diagnostico[],
      public planManejo: PlanManejo

    ) {
  
    }
  }