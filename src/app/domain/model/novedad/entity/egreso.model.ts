import { MotivoEgreso } from '../../maestro/entity/motivo-egreso.model';
import { Usuario } from '../../../../shared/models/usuario.model';

export class Egreso {

    constructor(
        public idRemision: string,
        public motivoEgreso: MotivoEgreso,
        public fechaEgreso: Date,
        public observacionEgreso: string,
        public usuario: Usuario
    ) {
    }
}
