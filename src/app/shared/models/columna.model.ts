export class ListaColumnas {
  public lista: Columna[] = new Array<Columna>();

  constructor() {}
}

export class Columna {
  public field: string;
  public header: string;

  constructor(campo, encabezado) {
    this.field = campo;
    this.header = encabezado;
  }
}
