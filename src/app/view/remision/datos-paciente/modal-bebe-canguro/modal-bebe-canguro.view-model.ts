import { mensajes as mensajesPaciente } from '../../../../shared/utils/mensajes';


export class ModalBebeCanguroViewModel {
  constructor (
    public mensajes: any,
    public cargando: boolean,    
    public tituloVentana: string,
  ) {
    this.mensajes = mensajesPaciente.datosPaciente.bebeCanguro
  }
}
