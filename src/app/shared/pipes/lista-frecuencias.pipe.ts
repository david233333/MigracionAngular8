
import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'listaFrecuencia'
})

export class ListaFrecuenciaPipe implements PipeTransform {    
    transform(frecuencias: any[]): any {                               
        if (frecuencias instanceof Array){
            return frecuencias.map(frecuencia => ' ' + frecuencia.descripcion);
        }
        return frecuencias;
    }
}