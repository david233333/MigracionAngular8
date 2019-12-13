
import {mensajes as mensajesListaRemisiones} from '../../../../shared/utils/mensajes';
import {Ciudad} from '../../../../domain/model/maestro/entity/ciudad.model';
import {CausasLlamadaNoContestada} from '../../../../domain/model/maestro/entity/CausasLlamadaNoContestada';
import {LineaUnicaModel} from '../../../../domain/model/lineaUnica/entity/lineaUnica-model';

export class LineaUnicaModelNoContestada {
  constructor(
    public mensajes: any,
    public cargando: boolean,
    public repuestaCausas: CausasLlamadaNoContestada[],
    public lineaUnica: LineaUnicaModel[]
  ) {
    this.mensajes = mensajesListaRemisiones.lineaUnicaModal;
  }
}
