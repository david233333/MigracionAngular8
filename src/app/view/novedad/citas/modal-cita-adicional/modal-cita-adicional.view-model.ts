import { mensajes as mensajesCitas } from '../../../../shared/utils/mensajes';
import { TipoCita } from '../../../../domain/model/maestro/entity/tipo-cita.model';


export class ModalCitaAdicionalViewModel {
  constructor(
    public mensajes: any,
    public cargando: boolean,
    public tituloVentana: string,
    public respuestaTiposCambioCita: Array<any>,
    public respuestaTiposCita: TipoCita[],
    public botonAdicionarReprogramar: string,
    public esDetalle: boolean,
  ) {
    this.mensajes = mensajesCitas.novedades.citas;
  }
}
