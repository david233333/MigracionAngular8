export class SolicitudNovedadesResponse {
    constructor(
        public idSolicitud: string,
        public idRemision: string,
        public nombrePaciente: string,
        public tipoNovedad: any, //TipoNovedad
        public usuarioReporta: string,
        public usuarioGestion: string,
        public fechaAdmision: Date,
        public fechaGestion: Date,
        public tipoIdentificacion: string,
        public numeroIdentificacion: string,
        public estadoSolicitudNovedad: any, //EstadoSolicitudNovedad 
        public piso: string,
    ) { }

}
