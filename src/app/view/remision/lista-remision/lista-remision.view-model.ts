import { mensajes as mensajesListaRemisiones } from '../../../shared/utils/mensajes';
import {Maestro, MaestrosSec} from '../../../infraestructure/comun/models/maestro.model';
import { Remision } from '../../../domain/model/remision/entity/remision.model';
import { TipoIdentificacion } from '../../../domain/model/maestro/entity/tipo-identificacion.model';
import { PlanSalud } from '../../../domain/model/maestro/entity/plan-salud.model';
import { Institucion } from '../../../domain/model/maestro/entity/institucion.model';
import { Ciudad } from '../../../domain/model/maestro/entity/ciudad.model';
import {RemisionEnum} from '../../../shared/utils/enums/remision.enum';
import {EstadosRemisionEnum} from '../../../shared/utils/enums/estados-remision.enum';
import { TipoAtencionEnum } from '../../../shared/utils/enums/tipo-atencion.enum';

export class ListaRemisionViewModel {
  constructor(
    public mensajes: any,
    public cargando: boolean,
    public respuestaTiposIdentificacion: TipoIdentificacion[],
    public respuestaInstituciones: Institucion[],
    public respuestaPlanesSalud: PlanSalud[],
    public respuestaEstados: MaestrosSec[],
    public respuestaCiudades: Ciudad[],
    public respuestaRemisiones: any[],
    public estado: EstadosRemisionEnum[],
    public remisionesTabla: any,
    public estados: [RemisionEnum],
    public tiposAtencion: TipoAtencionEnum[],
  ) {
    this.mensajes = mensajesListaRemisiones.listaRemision;
  }
}
