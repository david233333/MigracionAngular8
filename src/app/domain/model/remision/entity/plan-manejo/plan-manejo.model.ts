import { Tratamiento } from './tratamiento.model';
import { Procedimientos } from './procedimiento.model';
import { Valoracion } from './valoracion.model';

export class PlanManejo {

    constructor(
        public idRemision: string,
        public tratamientos: Tratamiento[],
        public procedimientos: Procedimientos,
        public valoraciones: Valoracion) {}
}
