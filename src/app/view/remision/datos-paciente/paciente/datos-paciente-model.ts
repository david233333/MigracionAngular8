import { mensajes as mensajesPaciente } from '../../../../shared/utils/mensajes';
import { Respuesta } from '../../../../infraestructure/comun/models/respuesta.model';
import { Paciente } from '../../../../domain/model/remision/entity/paciente.model';
import { MaestrosSec} from '../../../../infraestructure/comun/models/maestro.model';
import {datosPaciente as datosPaciente} from '../paciente-datos';
import {Genero} from '../../../../domain/model/maestro/entity/genero.model';
import { TipoIdentificacion } from '../../../../domain/model/maestro/entity/tipo-identificacion.model';
import { PlanSalud } from '../../../../domain/model/maestro/entity/plan-salud.model';

export class PacienteViewModel {
  constructor(
    public mensajes: any,
    public mostrarCodigoAutorizacion: boolean,
    public mostrarTipoPlanSalud: boolean,
    public respuestaDatosPaciente: Respuesta<Paciente>,
    public respuestaTiposIdentificacion: Respuesta<TipoIdentificacion[]>,
    public respuestaPlanesSalud: Respuesta<PlanSalud[]>,
    public respuestaTiposPlanesSalud: Respuesta<MaestrosSec[]>,
    public respuestaSaludParticular: any,
    public mostrarColumnaAsegurador: boolean,
    public mostrarColumnaAfiliacion: boolean,
    public datosPacientes: any,
    public datosGenero: Genero[]
  ) {
    this.datosPacientes  = datosPaciente;
    this.mensajes = mensajesPaciente.datosPaciente;
  }
}
