import { Injectable } from '@angular/core';
import { ComunGatewayAbstract } from '../../model/comun/gateway/comun-gateway.abstract';
import { Observable } from 'rxjs/Observable';
import { Ciudad } from '../../model/maestro/entity/ciudad.model';
import { TipoIdentificacion } from '../../model/maestro/entity/tipo-identificacion.model';
import { BandejaDinamicaGatewayAbstract } from '../../model/bandejaDinamica/gateway/bandeja-dinamica-gateway.abstract';
import { FiltrosBandejaDinamicaRequest } from '../../../infraestructure/request-model/bandejaDinamica/filtros-bandeja-dinamica.request';
import { BandejaDinamica } from '../../model/bandejaDinamica/entity/bandeja-dinamica.model';
import { EstadoBandejaDinamica } from '../../model/maestro/entity/estado-bandeja-dinamica.model';
import { GestionarBandejaDinamicaRequest } from '../../../infraestructure/request-model/bandejaDinamica/gestionar-bandeja-dinamica.request';

@Injectable()
export class GestionBandejaDinamicaService {

    constructor(
        private bandejaDinamicaService: BandejaDinamicaGatewayAbstract,
        private comunService: ComunGatewayAbstract
    ) { }

    /**
    * Obtiene los tipos de identificaciones
    * @returns {Observable<any[]>}
    */
    public getTiposIdentificacion(): Observable<TipoIdentificacion[]> {
        return this.comunService.getTiposIdentificacionNovedad().pipe();
    }

    /**
    * Obtiene las ciudades
    * @returns {Observable<Ciudad[]>}
    */
    public getCiudades(): Observable<Ciudad[]> {
        return this.comunService.getCiudadesNovedad().pipe();
    }

    /**
    * Obtiene los estados
    * @returns {Observable<EstadoBandejaDinamica[]>}
    */
    public getEstados(): Observable<EstadoBandejaDinamica[]> {
        return this.comunService.getEstadosBandejaDinamica().pipe();
    }

    /**
     * Consulta las ayudas diagnosticas que se presentaran en la bandeja dinamica de acuerdo a los filtros seleccionados
     * @param filtrosGestionNovedad
     */
    public getBandejaDinamica(filtrosBandejaDinamica: FiltrosBandejaDinamicaRequest): Observable<any> {
        return this.bandejaDinamicaService.getBandejaDinamica(filtrosBandejaDinamica).pipe();
    }

    /**
     * Gestiona una o más ayudas diagnosticas de la bandeja dinamica
     * @param bandejaDinamica
     */
    public gestionBandejaDinamica(bandejaDinamica: GestionarBandejaDinamicaRequest): Observable<any> {
        return this.bandejaDinamicaService.gestionBandejaDinamica(bandejaDinamica).pipe();
    }

}
