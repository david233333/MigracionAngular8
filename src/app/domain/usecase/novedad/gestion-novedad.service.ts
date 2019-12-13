import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ComunGatewayAbstract } from '../../model/comun/gateway/comun-gateway.abstract';
import { NovedadGatewayAbstract } from '../../model/novedad/gateway/novedad-gateway.abstract';
import { TipoIdentificacion } from '../../model/maestro/entity/tipo-identificacion.model';
import { Ciudad } from '../../model/maestro/entity/ciudad.model';
import { Piso } from '../../model/maestro/entity/piso.model';
import { FiltrosGestionNovedadesRequest } from '../../../infraestructure/request-model/novedad/filtros-gestion-novedad.request';
import { SolicitudNovedadesResponse } from '../../../infraestructure/response-model/novedad/solicitud-novedad.response';
import { GestionarNovedadRequest } from '../../../infraestructure/request-model/novedad/gestionar-novedad.request';
import { AlertaVisita } from '../../model/novedad/entity/alerta.model';
import { Usuario } from '../../../shared/models/usuario.model';

@Injectable()
export class GestionNovedadService {

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
    * Obtiene las ciudades
    * @returns {Observable<Ciudad[]>}
    */
    public getCiudades(): Observable<Ciudad[]> {
        return this.comunService.getCiudadesNovedad().pipe();
    }

    /**
    * Obtiene los pisos
    * @returns {Observable<Piso[]>}
    */
    public getPisosCiudadTipoAtencion(ciudad: string, tipoAdmision: string, idPrograma: string): Observable<Piso[]> {
        return this.comunService.getPisosCiudadTipoAtencionNovedad(ciudad, tipoAdmision, idPrograma).pipe();
    }

    /**
    * Obtiene los pisos
    * @returns {Observable<Piso[]>}
    */
    public getPisosCiudad(ciudad: string): Observable<Piso[]> {
        return this.comunService.getPisosCiudadNovedad(ciudad).pipe();
    }

    /**
    * Obtiene las novedades a gestionar
    * @returns {Observable<SolicitudNovedadesResponse[]>}
    */
    public getNovedadesGestion(idRemision: string, tipoNovedad: string): Observable<SolicitudNovedadesResponse[]> {
        return this.novedadService.getNovedadesGestion(idRemision, tipoNovedad).pipe();
    }

   
    /**
     * Consulta las solicitudes de novedad de acuerdo a los filtros seleccionados
     * @param filtrosGestionNovedad
     */
    public getSolicitudesNovedades(filtrosGestionNovedad: FiltrosGestionNovedadesRequest): Observable<any> {
        return this.novedadService.getSolicitudesNovedades(filtrosGestionNovedad).pipe();
    }

     /**
     * Davidddd
     * @param filtrosGestionNovedad
     */
    public getSolicitudesNovedadesEdicion(idRemision: string): Observable<any> {
        return this.novedadService.getSolicitudesNovedadesEdicion(idRemision).pipe();
    }

    /**
    * Consulta las solicitudes de una novedad seleccionada
    * @param filtrosGestionNovedad
    */
    public getSolicitudNovedad(idSolicitud: string): Observable<any> {
        return this.novedadService.getSolicitudNovedad(idSolicitud).pipe();
    }

    /**
     *
     * @param novedad
     */
    public gestionarNovedadManual(novedad: GestionarNovedadRequest): Observable<any> {
        return this.novedadService.gestionarNovedadManual(novedad).pipe();
    }


    /**
     * Guarda la novedad alerta en la visita
     * @param {AlertaVisita} alerta
     * @returns {Observable<any>}
     */
    public guardarAlertaVisita(alerta: AlertaVisita): Observable<any> {
        return this.novedadService.guardarNovedadAlerta(alerta);
    }

}
