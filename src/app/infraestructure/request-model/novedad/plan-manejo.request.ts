import { PlanManejo } from '../../../domain/model/novedad/entity/plan-manejo/plan-manejo.model';
import { Usuario } from '../../../shared/models/usuario.model';

export class PlanManejoRequest {
    constructor(
        public idRemision: string,
        public planManejo: PlanManejo,
        public usuario: Usuario
    ) { }
}
