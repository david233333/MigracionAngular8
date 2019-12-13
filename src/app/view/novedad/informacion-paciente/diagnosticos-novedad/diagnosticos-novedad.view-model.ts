import { mensajes as mensajesDiagnosticos } from '../../../../shared/utils/mensajes';
import { Diagnostico } from '../../../../domain/model/maestro/entity/diagnostico.model';
import { Peso } from '../../../../domain/model/maestro/entity/peso.model';


export class DiagnosticosNovedadViewModel {
  constructor (
    public mensajes: any,
    public respuestaDiagnosticos: Diagnostico[],
    public diagnosticosAGuardar: Diagnostico[],
    public diagnosticosDeAgregados: Diagnostico[],
    public placeHolderMedidaPeso: string,
    public cargando: boolean,
    public mostrarPeso: boolean,
    public pesos: Peso[]
  ) {
    this.mensajes = mensajesDiagnosticos.novedades.informacionPaciente.diagnosticos;
  }
}
