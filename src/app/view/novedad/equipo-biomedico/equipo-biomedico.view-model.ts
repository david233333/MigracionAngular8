import {mensajes as mensajesEquiposBiomedicos} from '../../../shared/utils/mensajes';
import {EquipoBiomedico} from '../../../domain/model/novedad/entity/equipo-biomedico.model';

export class EquipoBiomedicoViewModel {
  constructor(
    public mensajes: any,
    public cargando: boolean,
    public respuestaTipoEquipos: Array<any>,
    public equiposBiomedicos: Array<EquipoBiomedico>,
    public equiposBiomedicosTabla: Array<EquipoBiomedico>,
    public esEdicionEquipo: boolean,
    public esFechaFinModificado: boolean,
    public equipoEdicion: EquipoBiomedico
  ) {
    this.mensajes = mensajesEquiposBiomedicos.novedades.equipoBiomedico;
  }
}
