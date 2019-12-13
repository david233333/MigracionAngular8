import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ComunGatewayAbstract } from '../../model/comun/gateway/comun-gateway.abstract';
import { MotivoCancelacion } from '../../model/maestro/entity/motivo-cancelacion.model';
import { NovedadGatewayAbstract } from '../../model/novedad/gateway/novedad-gateway.abstract';
import { CancelaCita } from '../../model/novedad/entity/cancela-cita.model';

@Injectable()
export class CancelaVisitaService {

    constructor(
        private novedadService: NovedadGatewayAbstract,
        private comunService: ComunGatewayAbstract) {
    }

    /**
    * Obtiene los motivos de cancelación
    * @returns {Observable<MotivoCancelacion[]>}
    */
    getMotivosCancelacion(): Observable<MotivoCancelacion[]> {
        return this.comunService.getMotivosCancelacionCitaNovedad().pipe();
    }

    /**
    * cancelar visita
    * @returns {Observable<any>}
    */
    public cancelarVisita(cancelaVisita: CancelaCita): Observable<any> {
        return this.novedadService.cancelarVisita(cancelaVisita).pipe();
    }
}
