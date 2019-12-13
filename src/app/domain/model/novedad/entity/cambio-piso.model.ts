import { Piso } from '../../maestro/entity/piso.model';
import { Usuario } from '../../../../shared/models/usuario.model';

export class CambioPiso {

    constructor(
        public idRemision: string,
        public piso: Piso,
        public observacion: string,
        public usuario: Usuario
    ) {
    }
}
