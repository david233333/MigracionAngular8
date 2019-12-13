import {PipeTransform, Pipe} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'horaNumero'
})

export class HoraPipe implements PipeTransform {
  transform(hora: any): any {
    return moment.utc(hora * 3600 * 1000).format('hh:mm a');
  }
}
