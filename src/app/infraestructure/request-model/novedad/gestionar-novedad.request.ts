import { Usuario } from '../../../shared/models/usuario.model';

export class  GestionarNovedadRequest {
    constructor(
        public idSolicitud: string,
        public estadoGestion: string,
        public tipoNovedad: string,
        public fechaNovedad: Date,
        public usuario: Usuario
    ) { }
}