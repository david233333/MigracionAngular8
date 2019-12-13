import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ComunGatewayAbstract } from '../../model/comun/gateway/comun-gateway.abstract';
import { NovedadGatewayAbstract } from '../../model/novedad/gateway/novedad-gateway.abstract';
import { Diagnostico } from '../../model/maestro/entity/diagnostico.model';
import { DiagnosticoRequest } from '../../../infraestructure/request-model/novedad/diagnostico.request';

@Injectable()
export class DiagnosticosService {

    constructor(
        private novedadService: NovedadGatewayAbstract,
        private comunService: ComunGatewayAbstract) {
    }

    /**
     * Obtiene los diagnosticos
     * @returns {Observable<Diagnostico[]>}
     */
    public getDiagnosticos(nombre: string): Observable<Diagnostico[]> {
        return this.comunService.getDiagnosticosNovedad(nombre);
    }

    /**
    * Cambiar diagnostico
    * @returns {Observable<any>}
    */
    public cambiarDiagnostico(cambioDiagnostico: DiagnosticoRequest): Observable<any> {
        return this.novedadService.cambiarDiagnostico(cambioDiagnostico);
    }


    /**
    * Consultar agregado de diagnósticos
    * @returns {Observable<any>}
    */
    public getAgregadoDiagnostico(idNovedad: string): Observable<any> {
        return this.novedadService.getAgregadoDiagnostico(idNovedad);
    }

}

