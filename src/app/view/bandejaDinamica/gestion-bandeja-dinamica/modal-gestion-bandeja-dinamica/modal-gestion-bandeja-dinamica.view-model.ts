import { mensajes as mensajesModalGestionBandejaDinamica } from '../../../../shared/utils/mensajes';

export class ModalGestionBandejaDinamicaViewModel {
    constructor(
        public mensajes: any,
        public cargando: boolean,
    ) {
        this.mensajes = mensajesModalGestionBandejaDinamica.bandejaDinamica.detalleGestionBandejaDinamica;
    }
}
