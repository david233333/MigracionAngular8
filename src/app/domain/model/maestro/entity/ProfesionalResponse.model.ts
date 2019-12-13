export class ProfesionalResponseModel {

  constructor(
    public  idProfesional: string,
    public  identificacion: string,
    public  tipoIdentificacion: string,
    public  nombreCompleto: string,
    public  especialidad: string,
    public  ciudad: string,
    public  email: string,
    public  habilidades?: string,
    public  telefono?: string,
    public  region?: string,
    public  distrito?: string,
    private calendario?: any,
    public  direccion?: string,
    private turnoEnfermeria?: any
  ) {

  }

}
