export class RequestMaestro {
  constructor(
    public crear: boolean,
    public actualizar: boolean,
    public eliminar: boolean,
    public nombreMaestro: string,
    public nombreMicroservicio: string,
    public maestro: Object
  ) {
  }
}
