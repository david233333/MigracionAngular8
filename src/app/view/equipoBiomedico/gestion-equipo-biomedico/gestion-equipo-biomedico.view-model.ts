import { mensajes as mensajesNovedad } from '../../../shared/utils/mensajes';
import { TipoIdentificacion } from '../../../domain/model/maestro/entity/tipo-identificacion.model';
import { Ciudad } from '../../../domain/model/maestro/entity/ciudad.model';
import { EstadoEquipoBiomedico } from '../../../domain/model/maestro/entity/estado-equipo-biomedico.model';


export class EquipoBiomedicoViewModel {
    constructor(
        public mensajes: any,
        public cargando: boolean,
        public respuestaTiposIdentificacion: TipoIdentificacion[],
        public respuestaCiudades: Ciudad[],
        public respuestaEstados: EstadoEquipoBiomedico[],
        public respuestaEquiposBiomedcos: Array<any>,
        public usuario: any
    ) {
        this.mensajes = mensajesNovedad.equiposBiomedicos.gestionEquipos;
    }
}
