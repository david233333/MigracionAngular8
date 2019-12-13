export class SolicitudNovedadRemisionResponse {
    constructor(
        public idSolicitud: string,
        public idRemision: string,
        public fechaSolicitud: Date,
        public estadoSolicitudNovedad: string
    ) { }
}
