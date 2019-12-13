export class InformeVehicularRequest {
  constructor(
    public especialidad: string,
    public duracion: number,
    public start: Date,
    public end: Date
  ) {}
}
