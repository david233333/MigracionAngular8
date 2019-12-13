import { DetalleValoracion } from "./valoraciones/detalle-valoracion.model";

export class Valoracion {

  constructor(
    public valoraciones: Array<DetalleValoracion>,
    public valoracionesPoliza: Array<DetalleValoracion>,
    public fechaExamenMedico: Date
  ) {
  }
}
