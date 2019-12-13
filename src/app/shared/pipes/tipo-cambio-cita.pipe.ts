import { Pipe, PipeTransform } from '@angular/core';
import { mensajes } from '../../shared/utils/mensajes';
import { TipoNovedadEnum } from '../utils/enums/tipo-novedad.enum';

@Pipe({ name: 'tipoCambio_Cita' })
export class TipoCambioCitaPipe implements PipeTransform {
  transform(valor: string): string {
    let tipoCambio = '';

    if (valor) {
      switch (valor) {
        case TipoNovedadEnum.AGREGAR_CITA: {
          tipoCambio =
            mensajes.novedades.citas.accionesAgregarReprogramar.agregarCita;
          break;
        }
        case TipoNovedadEnum.REPROGRAMAR_CITA: {
          tipoCambio =
            mensajes.novedades.citas.accionesAgregarReprogramar.reprogramarCita;
          break;
        }
      }
    }
    return tipoCambio;
  }
}
