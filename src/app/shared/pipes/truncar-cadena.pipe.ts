import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
    name: 'truncar'
})
export class TruncarCadenaPipe implements PipeTransform {
    transform(value: any, limite: string): any {
        if (value instanceof Array) {
            if (value.toString().length > parseInt(limite)) {
                let limit = parseInt(limite);            
                return value.toString().length > limit ? value.toString().substring(0, limit) + "..." : value;
            }
        }
        return value;
    }
}
