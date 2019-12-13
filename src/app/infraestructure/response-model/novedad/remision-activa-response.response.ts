import { Remision } from "../../../domain/model/novedad/entity/remision.model";
import { Novedad } from "../../../domain/model/novedad/entity/novedad.model";


export class RemisionActivaResponse {
    constructor(
        public remision: Remision,
        public novedad: Novedad
    ) { }
}