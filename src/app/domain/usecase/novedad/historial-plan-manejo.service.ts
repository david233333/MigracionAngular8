import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ComunGatewayAbstract } from '../../model/comun/gateway/comun-gateway.abstract';
import { NovedadGatewayAbstract } from '../../model/novedad/gateway/novedad-gateway.abstract';
import { TipoIdentificacion } from '../../model/maestro/entity/tipo-identificacion.model';
import { ConsultaRemisionRequest } from '../../../infraestructure/request-model/novedad/consulta-remision.request';


@Injectable()
export class HistorialPlanManejoService {

    constructor(
        private novedadService: NovedadGatewayAbstract,
        private comunService: ComunGatewayAbstract) {
    }


    /**
    * Obtiene los tipos de identificaciones
    * @returns {Observable<any[]>}
    */
    public getTiposIdentificacion(): Observable<TipoIdentificacion[]> {
        return this.comunService.getTiposIdentificacionNovedad().pipe();
    }


    public getRemisionPaciente(consulta: ConsultaRemisionRequest): Observable<any[]> {
        return this.novedadService.getRemisionPaciente(consulta).pipe();
    }


    public getNovedadRemision(idRemision: string): Observable<any> {
        return this.novedadService.getNovedadRemision(idRemision).pipe();
    }
}
