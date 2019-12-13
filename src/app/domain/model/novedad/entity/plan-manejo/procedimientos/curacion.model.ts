import { TipoCuracion } from "../../../../maestro/entity/tipo-curacion.model";
import { ProgramacionSemana } from "../../../../../../shared/models/programacion-semana.model";

export class Curacion {

    constructor(
        public id: string,
        public tipoCuracion: TipoCuracion,
        public dias: Array<ProgramacionSemana>,
        public sesiones: number,
        public descripcion: string,
        public ultimaCuracion: Date,
        public tipoCuracionDescripcion?: string
    ) {
        this.tipoCuracionDescripcion = this.tipoCuracion.descripcion;
    }
}
