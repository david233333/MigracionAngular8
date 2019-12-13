export class TipoSondajeIngreso {
  constructor(
    public id: string,
    public idTipoSondaje: string,
    public idSondaje: string,
    public sondaje: string,
    public ayuno?: boolean
  ) {
  }
}
