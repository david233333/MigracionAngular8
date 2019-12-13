export class DatosRemision {

  constructor (
    public idRemisionPK: string,
    public institucionRemite: string,
    public telefonoInstitucionRemite: string,
    public resumenHistoriaClinica: string,
    public observaciones: string,
    public tipoIdentificacion: string,
    public numeroIdentificacionMedico: string,
    public nombreMedico: string,
    public especialidad: string,
    public emailContacto: string,
    public medidaDepeso: string,
    public peso: string
  ) { }
}
