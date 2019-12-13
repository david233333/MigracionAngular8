export class  FiltrosBandejaDinamicaRequest {
    constructor(
        public tipoIdentificacion: string,
        public numeroIdentificacion: string,
        public ciudad: string,
        public remision: string,
        public estado: string,
        public usuario: string,
        public fechaInicio: Date,
        public fechaFin: Date,
        public page: number,
        public size: number
    ) { }
}