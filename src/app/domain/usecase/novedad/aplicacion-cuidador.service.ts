import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ComunGatewayAbstract } from '../../model/comun/gateway/comun-gateway.abstract';
import { NovedadGatewayAbstract } from '../../model/novedad/gateway/novedad-gateway.abstract';
import { AplicacionCuidador } from '../../model/novedad/entity/aplicacion-cuidador.model';
import { MotivoAplicacionCuidador } from '../../model/maestro/entity/motivo-aplicacion-cuidador.model';

@Injectable()
export class AplicacionCuidadorService {

    constructor(
        private novedadService: NovedadGatewayAbstract,
        private comunService: ComunGatewayAbstract) {
    }

    /**
    * Obtiene los tipos de novedades presentados en aplicaciones por cuidador
    * @returns {Observable<MotivoAplicacionCuidador[]>}
    */
    public getMotivosAplicacionCuidador(): Observable<MotivoAplicacionCuidador[]> {
        return this.comunService.getMotivosAplicacionCuidadorNovedad().pipe();
    }

    /**
    * aplicar aplicacion por cuidador
    * @returns {Observable<any>}
    */
    public aplicarAplicacionCuidador(aplicacionCuidador: AplicacionCuidador): Observable<any> {
        return this.novedadService.aplicarAplicacionCuidador(aplicacionCuidador).pipe();
    }
}
