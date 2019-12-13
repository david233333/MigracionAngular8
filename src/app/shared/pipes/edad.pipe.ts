import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'edad'})
export class EdadPipe implements PipeTransform {

  transform(valor: string, unidades: string): string {
    let edadAMostrar = '';

    const mesPlural = 'Meses';
    const mesSingular = 'Mes';

    const anioPlural = 'Años';
    const anioSingular = 'Año';

    if (valor && unidades) {
      const edad: number = +valor;

      switch (unidades) {
        case 'Meses': {
          edadAMostrar = edad === 1 ? edad + ' ' + mesSingular : edad + ' ' + mesPlural;
          break;
        }
        case 'Años': {
          edadAMostrar = edad === 1 ? edad + ' ' + anioSingular : edad + ' ' + anioPlural;
          break;
        }
      }

    }
    return edadAMostrar;
  }

}
