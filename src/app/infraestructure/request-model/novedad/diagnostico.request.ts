import { Diagnostico } from '../../../domain/model/maestro/entity/diagnostico.model';
import { Usuario } from '../../../shared/models/usuario.model';


export class DiagnosticoRequest {
    constructor(
        public idRemision: string,
        public diagnosticos: Array<Diagnostico>,
        public usuario: Usuario
    ) { }
}
