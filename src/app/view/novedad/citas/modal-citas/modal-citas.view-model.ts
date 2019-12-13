import { mensajes as mensajesCitas } from '../../../../shared/utils/mensajes';
import { Profesion } from '../../../../domain/model/maestro/entity/profesion.model';
import { TipoCita } from '../../../../domain/model/maestro/entity/tipo-cita.model';


export class ModalCitasViewModel {
  constructor(
    public mensajes: any,
    public cargando: boolean,
    public tituloVentana: string,
    public tipo: string,
    public tipoFecha: string,
    public respuestaProfesionales: Profesion[],
    public respuestaTiposCita: TipoCita[],
    public respuestaCitasExistentes: any[],
    public verOpcionManejo: boolean,
    public verCitaExistente: boolean,
    public verFechaFija: boolean,
    public verFechaPeriodica: boolean,
    public listaDias: Array<any>,
    public diasSeleccionados: Array<any>,
    public sesionRequerida: boolean,
    public verTipoCita: boolean,
    public tituloGrupoFecha: string,
    public verSemanas: boolean,
    public verProgramacionSemana: boolean,
    public verGrupoFecha: boolean,
    public esDetalle: boolean
  ) {
    this.mensajes = mensajesCitas.novedades.citas;
  }
}
