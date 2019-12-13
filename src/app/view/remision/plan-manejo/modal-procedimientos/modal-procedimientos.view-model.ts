import { mensajes as mensajesPlanManejo } from '../../../../shared/utils/mensajes';
import { Medicamento } from '../../../../domain/model/maestro/entity/medicamento.model';
import { Dosis } from '../../../../domain/model/maestro/entity/dosis.model';
import { Frecuencia } from '../../../../domain/model/maestro/entity/frecuencia.model';
import { TipoNutricion } from '../../../../domain/model/maestro/entity/tipo-nutricion.model';
import { EventoSoporteNutricional } from '../../../../domain/model/comun/entity/evento-soporte-nutricional.model';
import { TipoSondajeIngreso } from '../../../../domain/model/maestro/entity/tipo-sondaje-ingreso.model';
import { TiposSoporteNutricional } from '../../../../domain/model/maestro/entity/tipos-soporte-nutricional.model';


export class ModalProcedimientosViewModel {
  constructor (
    public mensajes: any,
    public cargando: boolean,
    public curacionTipoAdmision: string,
    public tituloVentana: string,
    public respuestaSondajesTomaMuestra: Array<TipoSondajeIngreso>,
    public respuestaSondajesAlimentacion: Array<TipoSondajeIngreso>,
    public respuestaSondajesEvacuacion: Array<TipoSondajeIngreso>,
    public respuestaSondajesDrenaje: Array<TipoSondajeIngreso>,
    public respuestaFototerapiasTipoFrecuencia: Array<any>,
    public respuestaTomaMuestrasTipoMuestra: Array<any>,
    public tipoSondaSecrecion: string,
    public respuestaMedicamentos: Medicamento[],
    public respuestaUnidadesDosisSoporteNutricional: Dosis[],
    public respuestaFrecuenciasSoporteNutricional: Frecuencia[],
    public respuestaTiposNutricionesSoporteNutricional: TipoNutricion[],
    public nutricion: string,
    public listaDias: Array<any>,
    public eventos: EventoSoporteNutricional[],
    public esEdicionEventoSoporte: boolean,
    public idEventoSoporte: string,
    public respuestaTiposSoporteNutricional: TiposSoporteNutricional[],
    public datosNutricionSoporteNutricional:  TipoNutricion[]
  ) {
    this.mensajes = mensajesPlanManejo.planManejo.procedimientos;
  }
}
