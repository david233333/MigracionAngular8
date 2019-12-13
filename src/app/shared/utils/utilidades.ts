import { Injectable } from "@angular/core";
import { isEqual, differenceWith } from 'lodash';

@Injectable()
export class Utilidades {

    /**
     * Obtiene los cambios detallados que hubieron en la comparación de dos objetos
     * @param objetoOriginal 
     * @param objetoModificado 
     */
    public obtenerCambios(objetoOriginal: any, objetoModificado: any): any {
        return differenceWith(objetoModificado, objetoOriginal, isEqual);
    }

    /**
     * Verifica si hubo un cambio de esquema o dato en el objeto a comparar
     * @param objetoOriginal 
     * @param objetoModificado 
     */
    public compararObjetos(objetoOriginal: any, objetoModificado: any): boolean {
        return JSON.stringify(objetoOriginal) === JSON.stringify(objetoModificado);
    }
}