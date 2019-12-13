import { Ubicacion } from './ubicacion.model';
import { Usuario } from '../../../../shared/models/usuario.model';

export class DatosAtencionPaciente {

  constructor(
    public nombreCuidador: string,
    public nombreResponsable: string,
    public telefonoPaciente: string,
    public celularPaciente: string,
    public celularPaciente2: string,
    public ubicacion: Ubicacion,
    public idRemision: string
  ) { }
}
