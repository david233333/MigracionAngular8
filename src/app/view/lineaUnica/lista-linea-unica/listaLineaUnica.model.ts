import {Ciudad} from '../../../domain/model/maestro/entity/ciudad.model';

import {mensajes as mensajesListaRemisiones} from '../../../shared/utils/mensajes';
import {LineaUnicaModel} from '../../../domain/model/lineaUnica/entity/lineaUnica-model';

export class ListaLineaUnicaModel {
  constructor(
    public mensajes: any,
    public cargando: boolean,
    public respuestaCiudades: Ciudad[],
    public respuestaRemisiones: LineaUnicaModel[],
    public parametroLineaUnica: string
  ) {
    this.mensajes = mensajesListaRemisiones.lineaUnica;
    this.parametroLineaUnica = null;
  }
}
