import { mensajes as mensajesNovedad } from '../../../shared/utils/mensajes';
import { TipoIdentificacion } from '../../../domain/model/maestro/entity/tipo-identificacion.model';
import { Piso } from '../../../domain/model/maestro/entity/piso.model';
import { Ciudad } from '../../../domain/model/maestro/entity/ciudad.model';
import { EstadosNovedadEnum } from '../../../shared/utils/enums/estados-novedad.enum';
import { GestionPacienteResponse } from '../../../infraestructure/response-model/novedad/gestion-paciente.response';


export class GestionPacienteViewModel {
    constructor(
        public mensajes: any,
        public cargando: boolean,
        public respuestaTiposIdentificacion: TipoIdentificacion[],
        public respuestaCiudades: Ciudad[],
        public respuestaPisos: Piso[],
        public respuestaEstados: any[],
        public pisosSeleccionados: Piso[],
        public respuestaPacientes: Array<GestionPacienteResponse>,
        public verColumnaGestion: boolean,
        public totalActivos: number,
        public totalNuevos: number,
        public totalPrealta: number,
        public totalAlta: number
    ) {
        this.mensajes = mensajesNovedad.novedades.gestionPaciente;
    }
}
