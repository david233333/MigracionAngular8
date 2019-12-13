import { MotivoCancelacion } from '../../maestro/entity/motivo-cancelacion.model';
import { Usuario } from '../../../../shared/models/usuario.model';

export class CancelaCita {

    constructor(
        public id: string,
        public idRemision: string,
        public motivo: MotivoCancelacion,
        public citas: Array<string>,
        public observacion: string,
        public usuario: Usuario,
        public especialidad: string
    ) {
    }
}
