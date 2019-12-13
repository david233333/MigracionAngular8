import {TipoIdentificacion} from '../../../domain/model/maestro/entity/tipo-identificacion.model';
import {Piso} from '../../../domain/model/maestro/entity/piso.model';

export class GestionPacienteResponse {
  constructor(
    public idRemision: string,
    public tipoDocumentoPaciente: TipoIdentificacion,
    public estadoPaciente: string,
    public estadoRemision: string,
    public fechaIngresoPaciente: Date,
    public idNovedadActiva: string,
    public numeroDocumentoPaciente: string,
    public piso: Piso,
    public nombre: string,
    public gestionar: boolean,
    public fechaPosibleAlta: Date,
    public identificacion?: string,
  ) {
    this.identificacion = `${this.tipoDocumentoPaciente.idTipo} - ${this.numeroDocumentoPaciente}`;
  }

}
