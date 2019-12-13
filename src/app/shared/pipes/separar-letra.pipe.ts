import { Pipe, PipeTransform } from '@angular/core';
import {log} from 'util';

@Pipe({
  name: 'separarLetra'
})
export class SepararLetraPipe implements PipeTransform {

  transform(value: string): any {
    return value.split(/(?=[A-Z])/).toString().replace(',',' ');
  }

}
