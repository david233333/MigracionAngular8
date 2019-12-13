import { TipoPrestacionEnum } from "../../../../shared/utils/enums/tipo-prestacion.enum";
import { EspecialidadesEnum } from "../../../../shared/utils/enums/especialidades.enum";


export class ItemProgramacion  {
    constructor(
        public id: string,
        public fecha: Date,
        public tipoPrestacion: TipoPrestacionEnum,
        public duracion: string,
        public holgura: string,
        public habilidad: string,        
        public especialidad: EspecialidadesEnum,        
        public idPrestacion: string,
        
    ) { }
}