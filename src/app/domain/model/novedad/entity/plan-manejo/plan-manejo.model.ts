import { Tratamiento } from './tratamiento.model';
import { Procedimiento } from './procedimiento.model';
import { Usuario } from '../../../../../shared/models/usuario.model';

export class PlanManejo {

    constructor(
        public tratamientos: Tratamiento[],
        public procedimientos: Procedimiento,
        public idRemision: string) { }
}
