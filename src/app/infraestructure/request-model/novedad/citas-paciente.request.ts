import { Cita } from '../../../domain/model/novedad/entity/cita.model';
import { Usuario } from '../../../shared/models/usuario.model';

export class CitasPacienteRequest {
    constructor(
        public idSolicitudNovedad: string,
        public idRemision: string,
        public citas: Array<Cita>,
        public usuario: Usuario
    ) { }
}
