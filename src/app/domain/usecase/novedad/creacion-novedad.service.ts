import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ComunGatewayAbstract } from '../../model/comun/gateway/comun-gateway.abstract';
import { NovedadGatewayAbstract } from '../../model/novedad/gateway/novedad-gateway.abstract';
import { ConsultaRemisionRequest } from '../../../infraestructure/request-model/novedad/consulta-remision.request';
import { TipoIdentificacion } from '../../model/maestro/entity/tipo-identificacion.model';
import { RemisionActivaResponse } from '../../../infraestructure/response-model/novedad/remision-activa-response.response';
import { SolicitudNovedadesResponse } from '../../../infraestructure/response-model/novedad/solicitud-novedad.response';

@Injectable()
export class CreacionNovedadService {

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

    /**
    * Obtiene las novedades
    * @returns {Observable<SolicitudNovedadesResponse[]>}
    */
    public getNovedadesGestion(idRemision: string, tipoNovedad: string): Observable<SolicitudNovedadesResponse[]> {
        return this.novedadService.getNovedadesGestion(idRemision, tipoNovedad).pipe();
    }

    /**
     * Obtiene el paciente
     * @param {string} tipoDocumento
     * @param {string} numeroDocumento
     * @returns {Observable<any>}
     */
    public getPaciente(tipoDocumento: string, numeroDocumento: string): Observable<any> {
        return this.comunService.getPaciente(tipoDocumento, numeroDocumento).pipe();
    }


    /**
     * Consulta para obtener una remisión activa
     * @param consulta
     */
    public getConsultaRemision(consulta: ConsultaRemisionRequest): Observable<RemisionActivaResponse> {
        return this.novedadService.getConsultaRemision(consulta).pipe();
    }

    /**
     * Consulta para obtener una remisión activa - Linea unica
     * @param consulta
     */
    public getConsultaRemisionLineaUnica(consulta: ConsultaRemisionRequest): Observable<RemisionActivaResponse> {
        return this.novedadService.getConsultaRemisionLineaUnica(consulta).pipe();
    }
}
