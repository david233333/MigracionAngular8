export class InformacionPaciente {
  constructor(
    public basica: CamposTexto[],
    public asegurador: CamposTexto[],
    public afiliacion: CamposTexto[]
  ) { }
}

export class CamposTexto {
  constructor(
    public placeholder: string,
    public valor: string
  ) { }
}
