import { TipoIdentificacion } from '../../maestro/entity/tipo-identificacion.model';
import { Usuario } from '../../../../shared/models/usuario.model';

export class BandejaDinamica {
  constructor(
    public id: string,
    public nombrePaciente: string,
    public tipoIdentificacion: TipoIdentificacion,
    public numeroIdentificacion: string,
    public laboratorio: string,
    public fechaSolicitud: Date,
    public fechaTomaMuestra: Date,
    public fechaGestion: Date,
    public usuarioSolicita: Usuario,
    public estadoSolicitud: string,
  ) {
  }
}
