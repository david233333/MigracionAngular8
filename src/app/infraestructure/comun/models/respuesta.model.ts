export class Respuesta<T> {
  constructor (
    public success: boolean,
    public businessMessage: string,
    public datos: T
  ) { }
}
