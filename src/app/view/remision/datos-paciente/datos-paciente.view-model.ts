import {mensajes as mensajesPaciente} from '../../../shared/utils/mensajes';
import {Paciente} from '../../../domain/model/remision/entity/paciente.model';
import {MaestrosSec} from '../../../infraestructure/comun/models/maestro.model';
import {TipoIdentificacion} from '../../../domain/model/maestro/entity/tipo-identificacion.model';
import {PlanSalud} from '../../../domain/model/maestro/entity/plan-salud.model';
import {Genero} from '../../../domain/model/maestro/entity/genero.model';
import {BebeCanguro} from '../../../domain/model/remision/entity/plan-manejo/valoraciones/bebe-canguro.model';
import {TipoPlanParticular} from '../../../domain/model/maestro/entity/tipo-plan-particular.model';

export class DatosPacienteViewModel {
  constructor(
    public mensajes: any,
    public mostrarCodigoARL: boolean,
    public mostrarTipoPlanSalud: boolean,
    public respuestaDatosPaciente: Paciente,
    public respuestaTiposIdentificacion: TipoIdentificacion[],
    public respuestaPlanesSalud: PlanSalud[],
    public respuestaTiposPlanesSalud: MaestrosSec[],
    public respuestaSaludParticular: TipoPlanParticular[],
    public mostrarColumnaAsegurador: boolean,
    public mostrarColumnaAfiliacion: boolean,
    public datosGenero: Genero[],
    public textoBotonBebeCanguro: string,
    public bebeCanguro: BebeCanguro[],
    public verColumnaAccionCanguro: boolean,
    public verBotonBebeCanguro: boolean,
    public verTablaBebeCanguro: boolean
  ) {
    this.mensajes = mensajesPaciente.datosPaciente;
  }
}
