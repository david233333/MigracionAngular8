import { DatosAtencionPaciente } from '../../../domain/model/novedad/entity/datos-atencion-paciente.model';
import { Usuario } from '../../../shared/models/usuario.model';

export class DatosAtencionPacienteRequest {
    constructor(
        public idRemision: string,
        public datosAtencionPaciente: DatosAtencionPaciente,
        public usuario: Usuario
    ) { }
}