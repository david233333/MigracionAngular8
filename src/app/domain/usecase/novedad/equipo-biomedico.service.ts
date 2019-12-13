import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ComunGatewayAbstract } from '../../model/comun/gateway/comun-gateway.abstract';
import { MotivoCancelacion } from '../../model/maestro/entity/motivo-cancelacion.model';
import { NovedadGatewayAbstract } from '../../model/novedad/gateway/novedad-gateway.abstract';
import { CancelaCita } from '../../model/novedad/entity/cancela-cita.model';
import { TipoEquipoBiomedico } from '../../model/maestro/entity/tipo-equipo-biomedico.model';
import { EquipoBiomedico } from '../../model/novedad/entity/equipo-biomedico.model';

@Injectable()
export class EquipoBiomedicoService {

    constructor(
        private novedadService: NovedadGatewayAbstract,
        private comunService: ComunGatewayAbstract) {
    }

    /**
    * Obtiene los tipos de equipos biomédicos
    * @returns {Observable<TipoEquipoBiomedico[]>}
    */
    getTiposEquiposBiomedicos(): Observable<TipoEquipoBiomedico[]> {
        return this.comunService.getTipoEquiposBiomedicosNovedad().pipe();
    }

    /**
    * Consultar agregado de equipos biomédicos
    * @returns {Observable<any>}
    */
    public getAgregadoEquipoBiomedico(idRemision: string): Observable<any> {
        return this.novedadService.getAgregadoEquipoBiomedico(idRemision);
    }

    /**
    * cancelar visita
    * @returns {Observable<any>}
    */
    public solicitarEquipoBiomedico(equiposBiomedicos: Array<EquipoBiomedico>): Observable<any> {
        return this.novedadService.solicitarEquipoBiomedico(equiposBiomedicos).pipe();
    }
}
