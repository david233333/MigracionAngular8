import { mensajes as mensajesNovedad } from '../../../shared/utils/mensajes';
import { TipoIdentificacion } from '../../../domain/model/maestro/entity/tipo-identificacion.model';
import { Ciudad } from '../../../domain/model/maestro/entity/ciudad.model';
import { BandejaDinamica } from '../../../domain/model/bandejaDinamica/entity/bandeja-dinamica.model';
import { EstadoBandejaDinamica } from '../../../domain/model/maestro/entity/estado-bandeja-dinamica.model';


export class BandejaDinamicaViewModel {
    constructor(
        public mensajes: any,
        public cargando: boolean,
        public respuestaTiposIdentificacion: TipoIdentificacion[],
        public respuestaCiudades: Ciudad[],
        public respuestaEstados: EstadoBandejaDinamica[],
        public respuestaBandejaDinamica: Array<BandejaDinamica>,
        public ayudasSeleccionadas: Array<BandejaDinamica>
    ) {
        this.mensajes = mensajesNovedad.bandejaDinamica.gestionBandejaDinamica;
    }
}
