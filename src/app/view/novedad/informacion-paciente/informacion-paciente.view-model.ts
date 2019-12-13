import { mensajes as mensajesInformacionPaciente } from '../../../shared/utils/mensajes';


export class InformacionPacienteViewModel {
  constructor (
    public mensajes: any,
    public cargando: boolean,
  ) {
    this.mensajes = mensajesInformacionPaciente.novedades.informacionPaciente;
  }
}
