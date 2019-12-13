import { EquipoBiomedicoGatewayAbstract } from '../../domain/model/equipoBiomedico/gateway/equipo-biomedico-gateway.abstract';
import { EquipoBiomedico } from '../../domain/model/equipoBiomedico/entity/equipo-biomedico.model';
import { Observable } from 'rxjs/Observable';
import { FiltrosEquiposBiomedicosRequest } from '../request-model/equipoBiomedico/filtros-equipos-biomedicos.request';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ConfiguracionService } from '../../shared/services/configuracion.service';


@Injectable()
export class EquipoBiomedicoService extends EquipoBiomedicoGatewayAbstract {

    private headers: HttpHeaders;
    private url: string;
    private port: string;

    constructor(private http: HttpClient) {
        super();

        this.headers = new HttpHeaders();
        this.url = `${ConfiguracionService.config.urlBase}`;
        this.port = `${ConfiguracionService.config.portBase}`;
    }

    public getEquiposBiomedicos(filtrosEquiposBiomedicos: FiltrosEquiposBiomedicosRequest): Observable<any> {
        const URL = `${this.url}${this.port}/api_novedades/equipoBioMedicos/consultarEquiposBiomedicos`;

        const operador = 'eq';
        const tipoIdentificacion = `tipoIdentificacion=${operador}:${filtrosEquiposBiomedicos.tipoIdentificacion}&`;
        const numeroIdentificacion = `numeroIdentificacion=${operador}:${filtrosEquiposBiomedicos.numeroIdentificacion}&`;
        const ciudad = `ciudad=${operador}:${filtrosEquiposBiomedicos.ciudad}&`;
        const remision = `remision=${operador}:${filtrosEquiposBiomedicos.remision}&`;
        const fechaInicio = `fechaInicio=${filtrosEquiposBiomedicos.fechaInicio != null ?
                                    filtrosEquiposBiomedicos.fechaInicio.getTime().toString() : null }&`;
        const fechaFin = `fechaFin=${filtrosEquiposBiomedicos.fechaFin != null ?
                                    filtrosEquiposBiomedicos.fechaFin.getTime().toString() : null }&`;
        const estado = `estado=${operador}:${filtrosEquiposBiomedicos.estado}&`;
        const usuario = `usuario=${filtrosEquiposBiomedicos.usuario}&`;
        const pageSize = `page=${filtrosEquiposBiomedicos.page}&size=${filtrosEquiposBiomedicos.size}`;

        let parametros = '';

        if (filtrosEquiposBiomedicos.tipoIdentificacion != null) {
            parametros = parametros.concat(tipoIdentificacion);
        }
        if (filtrosEquiposBiomedicos.numeroIdentificacion != null) {
            parametros = parametros.concat(numeroIdentificacion);
        }
        if (filtrosEquiposBiomedicos.ciudad != null) {
            parametros = parametros.concat(ciudad);
        }
        if (filtrosEquiposBiomedicos.remision != null) {
            parametros = parametros.concat(remision);
        }
        if (filtrosEquiposBiomedicos.estado != null) {
            parametros = parametros.concat(estado);
        }
        if (filtrosEquiposBiomedicos.fechaInicio != null) {
            parametros = parametros.concat(fechaInicio);
        }
        if (filtrosEquiposBiomedicos.fechaFin != null) {
            parametros = parametros.concat(fechaFin);
        }
        if (filtrosEquiposBiomedicos.usuario != null) {
            parametros = parametros.concat(usuario);
        }

        parametros = parametros.concat(pageSize);

        return this.http.get<any>(URL.concat(`?${parametros}`), { withCredentials: true }).pipe();
    }

    public gestionEquipoBiomedico(equipoBiomedico: EquipoBiomedico): Observable<any> {
        const URL = `${this.url}${this.port}/api_novedades/novedad/novedadGestionEquipoBiomedico`;
        return this.http.post<any>(URL, equipoBiomedico, { withCredentials: true }).pipe();
    }
}
