import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'textoBooleano'})

export class TextoBooleanoPipe implements PipeTransform {
  transform(value: boolean): string {
    return (value) ? 'Sí' : 'No';
  }
}
