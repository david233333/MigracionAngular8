export class CitaFijarDesfijarRequest {
  constructor(
    public idCitaNumber: string,
    public especialidad: string,
    public fechaInicioCita: Date
  ) {
  }
}
