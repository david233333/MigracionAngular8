import { CitaProgramacionRequest } from '../../../../infraestructure/request-model/novedad/cita-programacion.request';
import { MotivoAplicacionCuidador } from '../../maestro/entity/motivo-aplicacion-cuidador.model';
import { Usuario } from '../../../../shared/models/usuario.model';

export class AplicacionCuidador {

    constructor(
        public idRemision: string,
        public motivo: MotivoAplicacionCuidador,
        public citas: Array<CitaProgramacionRequest>,
        public usuario: Usuario
    ) {
    }
}
