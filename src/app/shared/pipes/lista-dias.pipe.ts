
import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'listaNombreDia'
})

export class ListaDiasPipe implements PipeTransform {
    transform(dias: any[]): string[] {
        if (dias && dias.length > 0) {

            const index = dias.findIndex(item => item === undefined);
            if (index !== null && index !== undefined && index !== -1) { dias.splice(index, 1); }

            return dias.map(dia =>
                dia !== undefined ? ' ' + dia.dia : ''
            );
        }
    }
}
