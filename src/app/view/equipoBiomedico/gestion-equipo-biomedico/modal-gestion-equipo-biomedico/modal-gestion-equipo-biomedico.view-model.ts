import { mensajes as mensajesModalGestionEquipoBiomedico } from '../../../../shared/utils/mensajes';
import { Proveedor } from '../../../../domain/model/maestro/entity/proveedor.model';
import { EstadoEquipoBiomedico } from '../../../../domain/model/maestro/entity/estado-equipo-biomedico.model';
import {EquipoBiomedico} from '../../../../domain/model/equipoBiomedico/entity/equipo-biomedico.model';


export class ModalGestionEquipoBiomedicoViewModel {
    constructor(
        public mensajes: any,
        public cargando: boolean,
        public respuestaProveedores: Proveedor[],
        public respuestaEstados: EstadoEquipoBiomedico[],
    ) {
        this.mensajes = mensajesModalGestionEquipoBiomedico.equiposBiomedicos.detalleGestionEquipos;
    }
}
