export class FiltrosGestionNovedadesRequest {
  constructor(
    public tipoIdentificacion: string,
    public numeroIdentificacion: string,
    public ciudad: string,
    public pisos: Array<string>,
    public estado: string,
    public idRemision: string,
    public page: number,
    public size: number
  ) {}
}
