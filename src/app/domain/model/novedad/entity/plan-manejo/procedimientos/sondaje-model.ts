export class Sondaje {

  constructor(
    public id: string,
    public idTipoSondaje: string,
    public tipoSondaje: string,
    public idSondaje: string,
    public sondaje: string,
    public fechaSondaje: Date,
    public totalSesiones: number,
    public ayuno?: boolean
  ) {

  }
}
