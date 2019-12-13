import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ComunGatewayAbstract } from '../../model/comun/gateway/comun-gateway.abstract';
import { CambioPiso } from '../../model/novedad/entity/cambio-piso.model';
import { NovedadGatewayAbstract } from '../../model/novedad/gateway/novedad-gateway.abstract';
import { Piso } from '../../model/maestro/entity/piso.model';

@Injectable()
export class CambioPisoService {

    constructor(
        private novedadService: NovedadGatewayAbstract,
        private comunService: ComunGatewayAbstract) {
    }

    /**
    * Obtiene los pisos por ciudad de novedades
    * @returns {Observable<Piso[]>}
    */
    public getPisosCiudadTipoAdmision(idCiudad: string, tipoAdmision: string, idPrograma: string): Observable<Piso[]> {
        return this.comunService.getPisosCiudadTipoAtencionNovedad(idCiudad, tipoAdmision, idPrograma);
    }

    /**
    * cambiar piso al paciente
    * @returns {Observable<any>}
    */
    public cambiarPiso(cambioPiso: CambioPiso): Observable<any> {
        return this.novedadService.cambiarPiso(cambioPiso).pipe();
    }

    /**
     * Consulta agregado remision
     * @param idRemisionPK
     */
    public remisionNovedad(idRemisionPK: string): Observable<any> {
        return this.novedadService.getAgregadoRemision(idRemisionPK).pipe();
    }

}
