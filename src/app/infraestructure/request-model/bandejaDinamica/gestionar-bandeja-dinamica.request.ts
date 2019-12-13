import { Usuario } from '../../../shared/models/usuario.model';
import { BandejaDinamica } from '../../../domain/model/bandejaDinamica/entity/bandeja-dinamica.model';

export class  GestionarBandejaDinamicaRequest {
    constructor(
        public ayudasDiagnosticas: BandejaDinamica[],
        public usuario: Usuario
    ) { }
}