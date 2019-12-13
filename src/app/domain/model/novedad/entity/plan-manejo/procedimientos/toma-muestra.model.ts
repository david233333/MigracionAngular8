import { TipoMuestra } from "../../../../maestro/entity/tipo-muestra.model";

export class TomaMuestra {
    constructor(
        public id: string,
        public tipoMuestra: TipoMuestra,
        public fechaMuestra: Date,
        public requiereAyuno: boolean,
        public tipoMuestraDescripcion?: string,
    ) {
        this.tipoMuestraDescripcion = this.tipoMuestra.descripcion;
    }
}
