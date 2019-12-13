export class CitaProgramacionRequest {
  constructor(
    public idCitaNumber: string,
    public fechaInicioCita: Date,
    public horaInicioCita: string,
    public especialidad: string,
    public cuidador: boolean,
    public idTipoCita:string
  ) {
  }
}
