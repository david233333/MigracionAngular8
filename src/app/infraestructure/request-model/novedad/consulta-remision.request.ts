export class ConsultaRemisionRequest {
    constructor(
        public idRemision: string,
        public tipoIdentificacion: string,
        public numeroIdentificacion: string
    ) { }
}