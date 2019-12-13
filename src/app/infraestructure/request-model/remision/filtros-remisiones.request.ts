export class  FiltrosRemisionesRequest {
    constructor(
        public tipoIdentificacion: string,
        public numeroIdentificacion: string,
        public ciudadPrincipal: string,
        public institucionRemitente: string,
        public estado: string,
        public planSalud: string,
        public remision: string,
        public tipoAdmision: string,
        public page: number,
        public size: number
    ) { }
}