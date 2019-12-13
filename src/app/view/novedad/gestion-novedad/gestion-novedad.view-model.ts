import { mensajes as mensajesNovedad } from '../../../shared/utils/mensajes';
import { TipoIdentificacion } from '../../../domain/model/maestro/entity/tipo-identificacion.model';
import { Piso } from '../../../domain/model/maestro/entity/piso.model';
import { Ciudad } from '../../../domain/model/maestro/entity/ciudad.model';
import { EstadosNovedadEnum } from '../../../shared/utils/enums/estados-novedad.enum';
import { SolicitudNovedadesResponse } from '../../../infraestructure/response-model/novedad/solicitud-novedad.response';


export class GestionNovedadViewModel {
    constructor(
        public mensajes: any,
        public cargando: boolean,
        public respuestaTiposIdentificacion: TipoIdentificacion[],
        public respuestaCiudades: Ciudad[],
        public respuestaPisos: Piso[],
        public Estados: EstadosNovedadEnum[],
        public pisosSeleccionados: Piso[],
        public respuestaNovedades: Array<SolicitudNovedadesResponse>,
        public verColumnaAccion: boolean
    ) {
        this.mensajes = mensajesNovedad.novedades.gestionNovedad;
    }
}
