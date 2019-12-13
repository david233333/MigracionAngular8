import {mensajes as mensajesListaRemisiones} from '../../../../shared/utils/mensajes';

export class  DetalleMedicamentoModel {

  constructor(public mensaje: any,
              public respuestaMedicamentos: any) {
    this.mensaje = mensajesListaRemisiones.detalleRemisionMedicamentos;
  }
}
