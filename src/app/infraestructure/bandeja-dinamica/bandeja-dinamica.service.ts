import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ConfiguracionService } from '../../shared/services/configuracion.service';
import { BandejaDinamicaGatewayAbstract } from '../../domain/model/bandejaDinamica/gateway/bandeja-dinamica-gateway.abstract';
import { FiltrosBandejaDinamicaRequest } from '../request-model/bandejaDinamica/filtros-bandeja-dinamica.request';
import { BandejaDinamica } from '../../domain/model/bandejaDinamica/entity/bandeja-dinamica.model';
import { GestionarBandejaDinamicaRequest } from '../request-model/bandejaDinamica/gestionar-bandeja-dinamica.request';


@Injectable()
export class BandejaDinamicaService extends BandejaDinamicaGatewayAbstract {

    private headers: HttpHeaders;
    private url: string;
    private port: string;

    constructor(private http: HttpClient) {
        super();

        this.headers = new HttpHeaders();
        this.url = `${ConfiguracionService.config.urlBase}`;
        this.port = `${ConfiguracionService.config.portBase}`;
    }

    public getBandejaDinamica(filtrosBandejaDinamica: FiltrosBandejaDinamicaRequest): Observable<any> {
        const URL = `${this.url}${this.port}/api_novedades/bandejaDinamica/consultarBandejaDinamica`;

        const operador = 'eq';
        const tipoIdentificacion = `tipoIdentificacion=${operador}:${filtrosBandejaDinamica.tipoIdentificacion}&`;
        const numeroIdentificacion = `numeroIdentificacion=${operador}:${filtrosBandejaDinamica.numeroIdentificacion}&`;
        const ciudad = `ciudad=${operador}:${filtrosBandejaDinamica.ciudad}&`;
        const remision = `remision=${operador}:${filtrosBandejaDinamica.remision}&`;
        const fechaInicio = `fechaInicio=${filtrosBandejaDinamica.fechaInicio != null ?
                                    filtrosBandejaDinamica.fechaInicio.getTime().toString() : null }&`;
        const fechaFin = `fechaFin=${filtrosBandejaDinamica.fechaFin != null ?
                                    filtrosBandejaDinamica.fechaFin.getTime().toString() : null }&`;
        const estado = `estadoSolicitud=${operador}:${filtrosBandejaDinamica.estado}&`;
        const usuario = `usuario=${filtrosBandejaDinamica.usuario}&`;
        const pageSize = `page=${filtrosBandejaDinamica.page}&size=${filtrosBandejaDinamica.size}`;

        let parametros = '';

        if (filtrosBandejaDinamica.tipoIdentificacion != null) {
            parametros = parametros.concat(tipoIdentificacion);
        }
        if (filtrosBandejaDinamica.numeroIdentificacion != null) {
            parametros = parametros.concat(numeroIdentificacion);
        }
        if (filtrosBandejaDinamica.ciudad != null) {
            parametros = parametros.concat(ciudad);
        }
        if (filtrosBandejaDinamica.remision != null) {
            parametros = parametros.concat(remision);
        }
        if (filtrosBandejaDinamica.estado != null) {
            parametros = parametros.concat(estado);
        }
        if (filtrosBandejaDinamica.fechaInicio != null) {
            parametros = parametros.concat(fechaInicio);
        }
        if (filtrosBandejaDinamica.fechaFin != null) {
            parametros = parametros.concat(fechaFin);
        }
        if (filtrosBandejaDinamica.usuario != null) {
            parametros = parametros.concat(usuario);
        }

        parametros = parametros.concat(pageSize);

        return this.http.get<any>(URL.concat(`?${parametros}`), { withCredentials: true }).pipe();
    }

    public gestionBandejaDinamica(bandejaDinamica: GestionarBandejaDinamicaRequest): Observable<any> {
        const URL = `${this.url}${this.port}/api_novedades/bandejaDinamica/gestionar`;
        return this.http.post<any>(URL, bandejaDinamica, { withCredentials: true }).pipe();
    }
}
