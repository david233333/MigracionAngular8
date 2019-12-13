import {mensajes as mensajesPlanManejo} from '../../../shared/utils/mensajes';
import {Tratamiento} from '../../../domain/model/remision/entity/plan-manejo/tratamiento.model';
import {Curacion} from '../../../domain/model/remision/entity/plan-manejo/procedimientos/curacion.model';
import {Sondaje} from '../../../domain/model/remision/entity/plan-manejo/procedimientos/sondaje.model';
import {Fototerapia} from '../../../domain/model/remision/entity/plan-manejo/procedimientos/fototerapia.model';
import {Valoracion} from '../../../domain/model/remision/entity/plan-manejo/valoracion.model';
import {AspiracionSecrecion} from '../../../domain/model/remision/entity/plan-manejo/procedimientos/aspiracion-secrecion.model';
import {BebeCanguro} from '../../../domain/model/remision/entity/plan-manejo/valoraciones/bebe-canguro.model';
import {DetalleValoracion} from '../../../domain/model/remision/entity/plan-manejo/valoraciones/detalle-valoracion.model';
import {TomaMuestra} from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/toma-muestra.model';
import {SoporteNutricional} from '../../../domain/model/remision/entity/plan-manejo/procedimientos/soporte-nutricional.model';


export class PlanManejoViewModel {
  constructor(
    public mensajes: any,
    public cargando: boolean,
    public respuestaTratamientos: Tratamiento[],
    public tratamientos: Tratamiento[],
    public curaciones: Curacion[],
    public sondajes: Sondaje[],
    public fototerapias: Fototerapia[],
    public secreciones: AspiracionSecrecion[],
    public soporteNutricionales: SoporteNutricional[],
    public valoracion: Valoracion,
    public valoraciones: DetalleValoracion[],
    public valoracionesSeleccionadas: DetalleValoracion[],
    public valoracionesPoliza: DetalleValoracion[],
    public valoracionesSeleccionadasPoliza: DetalleValoracion[],
    public valoracionesBebeCanguroTabla: BebeCanguro[],
    public tomaMuestrasTabla: TomaMuestra[],
  ) {
    this.mensajes = mensajesPlanManejo.planManejo;
  }
}
