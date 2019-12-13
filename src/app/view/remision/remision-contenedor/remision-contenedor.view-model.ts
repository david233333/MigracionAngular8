import { mensajes as mensajesRemision } from '../../../shared/utils/mensajes';
import {Paciente} from '../../../domain/model/remision/entity/paciente.model';
import {DatosAtencionPaciente} from '../../../domain/model/remision/entity/datos-atencion.model';
import { TipoIdentificacion } from '../../../domain/model/maestro/entity/tipo-identificacion.model';

export class RemisionContenedorViewModel {
  constructor(
    public mensajes: any,
    public cargando: boolean,
    public respuestaTiposIdentificacion: TipoIdentificacion[],
    public ciudadSeleccionada: string,
    public paciente: Paciente,
    public datosRemision: DatosAtencionPaciente,
    public estadoRemision: string,
    public numeroRemision: string,
    public estadoActual: string,
    public hide: boolean,
    public nombrePlan: string,
    public codigoPlan: string,
    public especialistas: string,
    public pago: string,
    public habitacionIndividual: string,
    public atencionDomiciliaria: string,
    public dxIntrahospitalaria: string,
    public dxAmbulatoria: string,
    public recienNacido: string,
    public continuidadParto: string

  ) {
    this.mensajes = mensajesRemision.remisionContenedor;
  }
}
