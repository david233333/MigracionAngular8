import { Ubicacion } from './ubicacion.model';

export class DatosAtencionPaciente {

  constructor (
    public idRemisionPK: string,
    public nombreCuidador: string,
    public nombreResponsable: string,
    public telefonoPaciente: string,
    public celularPaciente: string,
    public celularPaciente2: string,
    public ubicacion: Ubicacion
  ) { }

}
