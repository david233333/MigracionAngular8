import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'fecha'})
export class FechaPipe implements PipeTransform {

  transform(valor: string, formato: string): string {

    switch (formato) {
      case 'DD/MM/YYYY': {
        if (valor && valor !== '') {
          return moment(valor).format(formato);
        }
        break;
      }

      default: {
        return valor;
      }
    }

  }

}
