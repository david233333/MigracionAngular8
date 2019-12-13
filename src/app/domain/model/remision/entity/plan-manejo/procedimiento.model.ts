import { Curacion } from "./procedimientos/curacion.model";
import { Fototerapia } from "./procedimientos/fototerapia.model";
import { Sondaje } from "./procedimientos/sondaje.model";
import { AspiracionSecrecion } from "./procedimientos/aspiracion-secrecion.model";
import { SoporteNutricional } from "./procedimientos/soporte-nutricional.model";

export class Procedimientos {

  constructor(
    public curaciones: Array<Curacion>,
    public fototerapias: Array<Fototerapia>,
    public sondajes: Array<Sondaje>,
    public secreciones: Array<AspiracionSecrecion>,
    public soporteNutricionales: Array<SoporteNutricional>
  ) {

  }
}
