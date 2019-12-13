import { Pipe, PipeTransform } from '@angular/core';
import { mensajes } from '../../shared/utils/mensajes';

@Pipe({ name: 'tipoSondaje' })

export class TipoSondajePipe implements PipeTransform {

    transform(valor: string): string {
        let tipoSondaje: string = '';

        if (valor) {

            switch (valor) {
                case mensajes.planManejo.procedimientos.sondajes.tipos.alimentacion: {
                    tipoSondaje = mensajes.planManejo.procedimientos.sondajes.campos.alimentacion;
                    break;
                }
                case mensajes.planManejo.procedimientos.sondajes.tipos.drenaje: {
                    tipoSondaje = mensajes.planManejo.procedimientos.sondajes.campos.drenaje;
                    break;
                }
                case mensajes.planManejo.procedimientos.sondajes.tipos.evacuacion: {
                    tipoSondaje = mensajes.planManejo.procedimientos.sondajes.campos.evacuacion;
                    break;
                }
                case mensajes.planManejo.procedimientos.sondajes.tipos.tomaMuestra: {
                    tipoSondaje = mensajes.planManejo.procedimientos.sondajes.campos.tomaMuestra;
                    break;
                }
            }

        }
        return tipoSondaje;
    }

}
