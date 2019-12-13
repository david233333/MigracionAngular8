import { EspecialidadesEnum } from "../../../../shared/utils/enums/especialidades.enum";
import { ItemProgramacion } from "./item-programacion.model";


export class Cita {
    constructor(
        public idCita: string,
        public idCitaNumber: string,
        public idRemision: string,
        public idNovedad: string,
        public secuencia: string,
        public duracion: string,
        public fechaInicialAsignadaCS: Date,
        public fechaFinalAsignadaCS: Date,
        public fechaInicioCita: Date,
        public horaInicioCita: number,
        public especialidad: EspecialidadesEnum,
        public itemsProgramacion: Array<ItemProgramacion>,
        public idTipoCita:string
    ) { }
}