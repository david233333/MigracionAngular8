export class PacienteRemision {
  constructor (
    public tipoIdentificacion: string,
    public numeroIdentificacion: string,
    public planSalud: string,
    public codigoAutorizacion: string,
    public tipoPlanSalud: string
  ) { }
}
