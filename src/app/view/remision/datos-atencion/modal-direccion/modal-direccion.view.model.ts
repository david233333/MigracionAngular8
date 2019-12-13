import {mensajes as mensajesModal} from '../../../../shared/utils/mensajes';
import {DireccionRequest} from '../../../../domain/model/maestro/entity/DireccionRequest';
import {Municipio} from '../../../../domain/model/maestro/entity/municipio.model';

export class ModalDireccionComponents {
  public data: any;

  constructor(
    public mensaje: any,
    public respuestaGeoReferenciacion: any,
    public cargando: boolean,
    public datosDireccion: DireccionRequest,
    public respuestaMunicipios: Municipio[]
  ) {
    this.mensaje = mensajesModal.datosAtencion.modalDireccion;
  }
}
