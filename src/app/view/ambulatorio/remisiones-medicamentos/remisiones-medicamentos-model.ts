import {TipoIdentificacion} from '../../../domain/model/maestro/entity/tipo-identificacion.model';
import {Institucion} from '../../../domain/model/maestro/entity/institucion.model';
import {PlanSalud} from '../../../domain/model/maestro/entity/plan-salud.model';
import {MaestrosSec} from '../../../infraestructure/comun/models/maestro.model';
import {Ciudad} from '../../../domain/model/maestro/entity/ciudad.model';
import {Remision} from '../../../domain/model/remision/entity/remision.model';
import {EstadosRemisionEnum} from '../../../shared/utils/enums/estados-remision.enum';
import {RemisionEnum} from '../../../shared/utils/enums/remision.enum';
import {mensajes as mensajesListaRemisiones} from '../../../shared/utils/mensajes';
import {FiltrosBandeja} from '../../../infraestructure/request-model/novedad/FiltrosBandeja';

export  class RemisionesMedicamentosModel {

  constructor(public mensajes: any,
              public cargando: boolean,
              public respuestaTiposIdentificacion: TipoIdentificacion[],
              public respuestaInstituciones: Institucion[],
              public respuestaPlanesSalud: PlanSalud[],
              public respuestaEstados: MaestrosSec[],
              public respuestaCiudades: Ciudad[],
              public respuestaRemisiones: Remision[],
              public estado: EstadosRemisionEnum[],
              public estados: [RemisionEnum],
              public listaPlanDeManejo: any,
              public parametrosListaAmbulatorio: FiltrosBandeja) {
    this.mensajes = mensajesListaRemisiones.remsionesMedicamentos;
  }
}
