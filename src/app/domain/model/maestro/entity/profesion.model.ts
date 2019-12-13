import { TipoCita } from "./tipo-cita.model";

export class Profesion {
    constructor(
        public id: string,
        public idProfesion: string,
        public profesion: string,
        public especialidad: string,
        public profesionalList: Array<TipoCita>) { }
}
