export class  FiltrosBandeja {
  constructor(
    public bandeja: string,
    public tipoIdentificacion: string,
    public numeroIdentificacion: string,
    public ciudad: string,
    public remision: string,
    public estado: string,
    public usuario: string,
    public fechaInicio: Date,
    public fechaFin: Date,
    public institucionRemite: string,
    public planSalud: string,
    public page: number,
    public size: number
  ) { }
}
