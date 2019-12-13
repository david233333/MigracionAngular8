import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ComunGatewayAbstract } from '../../model/comun/gateway/comun-gateway.abstract';
import { NovedadGatewayAbstract } from '../../model/novedad/gateway/novedad-gateway.abstract';
import { Egreso } from '../../model/novedad/entity/egreso.model';
import { MotivoEgreso } from '../../model/maestro/entity/motivo-egreso.model';

@Injectable()
export class EgresoService {

    constructor(
        private novedadService: NovedadGatewayAbstract,
        private comunService: ComunGatewayAbstract) {
    }

    /**
    * Obtiene los motivos de egreso
    * @returns {Observable<MotivosEgreso[]>}
    */
    public getMotivosEgreso(): Observable<MotivoEgreso[]> {
        return this.comunService.getMotivosEgresoNovedad().pipe();
    }

    /**
    * egresar paciente
    * @returns {Observable<any>}
    */
    public egresarPaciente(egreso: Egreso): Observable<any> {
        return this.novedadService.egresarPaciente(egreso).pipe();
    }

}
