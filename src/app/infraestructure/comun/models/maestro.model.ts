export class Maestro {
  constructor (
    public idGrupo: string,
    public nombreGrupo: string,
    public maestrosSec: MaestrosSec[],
  ) { }
}

export class MaestrosSec {
  constructor(
    public id: string,
    public idCatalogo: string,
    public idGrupo: string,
    public nombreGrupo: string,
    public idParametro: string,
    public valor: string,
    public detalle: string
  ) { }
}
