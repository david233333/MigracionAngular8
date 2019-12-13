import { mensajes as mensajesPlanManejo } from '../../../../shared/utils/mensajes';

import { TipoCuracion } from '../../../../domain/model/maestro/entity/tipo-curacion.model';
import { TipoTerapia } from '../../../../domain/model/maestro/entity/tipo-terapia.model';
import { Frecuencia } from '../../../../domain/model/maestro/entity/frecuencia.model';
import { Medicamento } from '../../../../domain/model/maestro/entity/medicamento.model';
import { Dosis } from '../../../../domain/model/maestro/entity/dosis.model';
import { TipoNutricion } from '../../../../domain/model/maestro/entity/tipo-nutricion.model';
import { EventoSoporteNutricional } from '../../../../domain/model/comun/entity/evento-soporte-nutricional.model';
import { ProgramacionSemana } from '../../../../shared/models/programacion-semana.model';
import { TipoMuestra } from '../../../../domain/model/maestro/entity/tipo-muestra.model';
import { TiposSoporteNutricional } from '../../../../domain/model/maestro/entity/tipos-soporte-nutricional.model';



export class ModalProcedimientosViewModel {
  constructor(
    public mensajes: any,
    public cargando: boolean,
    public tituloVentana: string,
    public respuestaCuracionesTiposCuraciones: Array<TipoCuracion>,
    public respuestaTerapiasTiposTerapias: Array<TipoTerapia>,
    public respuestaFototerapiasTipoFrecuencia: Array<Frecuencia>,
    public respuestaTomaMuestrasTipoMuestra: Array<TipoMuestra>,
    public diasSeleccionados: Array<any>,
    public tipoSondaSecrecion: string,
    public tipoCanalizacion: string,
    public esDetalle: boolean,
    public respuestaMedicamentos: Medicamento[],
    public respuestaUnidadesDosisSoporteNutricional: Dosis[],
    public respuestaFrecuenciasSoporteNutricional: Frecuencia[],
    public respuestaTiposNutricionesSoporteNutricional: TipoNutricion[],
    public nutricion: string,
    public listaDias: Array<ProgramacionSemana>,
    public eventos: EventoSoporteNutricional[],
    public esEdicionEventoSoporte: boolean,
    public idEventoSoporte: string,
    public tipoSondajes: any[],
    public sondajes: any[],
    public esEdicionSondaje: boolean,
    public respuestaTipoSondajes: any[],
    public respuestaSondajes: any[],
    public respuestaSondajesTabla: any[],
    public idSondaje: string,
    public respuestaTiposSoporteNutricional: TiposSoporteNutricional[],
    public datosNutricionSoporteNutricional: TipoNutricion[]
  ) {
    this.mensajes = mensajesPlanManejo.novedades.planManejoNovedades.procedimientos;
  }
}
