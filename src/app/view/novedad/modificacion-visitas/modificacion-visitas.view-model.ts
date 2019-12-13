import { mensajes as mensajesModificacionVisitas } from "../../../shared/utils/mensajes";

export class ModificacionVisitasViewModel {
  constructor(
    public mensajes: any,
    public cargando: boolean,
    public respuestaTiposFormularios: Array<any>
  ) {
    this.mensajes = mensajesModificacionVisitas.novedades.modificacionVisitas;
  }
}
