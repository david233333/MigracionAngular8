import {mensajes as mensajesPlanManejo} from '../../../shared/utils/mensajes';
import {Tratamiento} from '../../../domain/model/novedad/entity/plan-manejo/tratamiento.model';
import {Curacion} from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/curacion.model';
import {TomaMuestra} from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/toma-muestra.model';
import {Fototerapia} from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/fototerapia.model';
import {AspiracionSecrecion} from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/aspiracion-secrecion.model';
import {Canalizacion} from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/canalizacion.model';
import {Sondaje} from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/sondaje-model';
import {SoporteNutricional} from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/soporte-nutricional.model';


export class PlanManejoViewModel {
  constructor(
    public mensajes: any,
    public cargando: boolean,
    public tratamientos: Tratamiento[],
    public sondajes: Sondaje[],
    public curaciones: Curacion[],
    public fototerapias: Fototerapia[],
    public tomaMuestras: TomaMuestra[],
    public secreciones: AspiracionSecrecion[],
    public canalizaciones: Canalizacion[],
    public soporteNutricionales: SoporteNutricional[],
    public esDosisFaltante: boolean
  ) {
    this.mensajes = mensajesPlanManejo.novedades.planManejoNovedades;
  }
}
