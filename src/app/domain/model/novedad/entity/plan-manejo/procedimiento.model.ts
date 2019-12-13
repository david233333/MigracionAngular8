import { Curacion } from './procedimientos/curacion.model';
import { Fototerapia } from "./procedimientos/fototerapia.model";
import { TomaMuestra } from "./procedimientos/toma-muestra.model";
import { AspiracionSecrecion } from "./procedimientos/aspiracion-secrecion.model";
import { Canalizacion } from "./procedimientos/canalizacion.model";
import { Sondaje } from './procedimientos/sondaje-model';
import { SoporteNutricional } from './procedimientos/soporte-nutricional.model';



export class Procedimiento {

    constructor(
        public curaciones: Array<Curacion>,
        public sondajes: Array<Sondaje>,
        public fototerapias: Array<Fototerapia>,
        public tomaMuestras: Array<TomaMuestra>,
        public secreciones: Array<AspiracionSecrecion>,
        public canalizaciones: Array<Canalizacion>,
        public soporteNutricionales: Array<SoporteNutricional>
    ) {

    }
}
