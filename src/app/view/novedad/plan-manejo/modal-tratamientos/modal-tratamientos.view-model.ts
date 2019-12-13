import { mensajes as mensajesPlanManejo } from '../../../../shared/utils/mensajes';
import { Dosis } from '../../../../domain/model/maestro/entity/dosis.model';
import { ViaAdministracion } from '../../../../domain/model/maestro/entity/via-administracion.model';
import { Frecuencia } from '../../../../domain/model/maestro/entity/frecuencia.model';
import { TipoNutricion } from '../../../../domain/model/maestro/entity/tipo-nutricion.model';
import { Medicamento } from '../../../../domain/model/maestro/entity/medicamento.model';



export class ModalTratamientosViewModel {
  constructor(
    public mensajes: any,
    public cargando: boolean,
    public respuestaMedicamentos: Medicamento[],
    public respuestaUnidadesDosisMedicamentos: Dosis[],
    public respuestaUnidadesDosisNebulizaciones: Dosis[],
    public respuestaUnidadesDosisOxigenoterapia: Dosis[],
    public respuestaUnidadesDosisSoporteNutricional: Dosis[],
    public respuestaViasAdministracionMedicamentos: ViaAdministracion[],
    public respuestaViasAdministracionNebulizaciones: ViaAdministracion[],
    public respuestaViasAdministracionOxigenoterapia: ViaAdministracion[],
    public respuestaViasAdministracionSoporteNutricional: ViaAdministracion[],
    public respuestaFrecuenciasMedicamentos: Frecuencia[],
    public respuestaFrecuenciasNebulizaciones: Frecuencia[],
    public respuestaFrecuenciasOxigenoterapia: Frecuencia[],
    public respuestaFrecuenciasSoporteNutricional: Frecuencia[],
    public respuestaTiposNutricionesSoporteNutricional: TipoNutricion[],
    public datosNutricionParenteralSoporteNutricional: TipoNutricion[],
    public datosNutricionEnteralSoporteNutricional: TipoNutricion[],
    public diluyente: string,
    public nutricion: string,
    public tituloVentana: string,
    public valorFechaFinTratamiento: string,
    public esDetalle: boolean
  ) {
    this.mensajes = mensajesPlanManejo.novedades.planManejoNovedades.tratamientos;
  }
}
