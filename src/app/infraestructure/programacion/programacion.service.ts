import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ConfiguracionService } from '../../shared/services/configuracion.service';
import { ProgramacionGatewayAbstract } from '../../domain/model/programacion/gateway/programacion-gateway.abstract';

@Injectable()
export class ProgramacionService extends ProgramacionGatewayAbstract {
   

    private url: string;
    private port: string;

    constructor(private http: HttpClient) {
        super();

        this.url = `${ConfiguracionService.config.urlBase}`;
        this.port = `${ConfiguracionService.config.portBase}`;
    }

    public getProgramacion(idRemision: string): Observable<any> {
      const URL = `${this.url}${this.port}/api_programacion/programacion/consultarProgramacion/${idRemision}`;
      console.log('URL getProgramacion ', URL, {withCredentials: true});
      return this.http.get<any>(URL,{withCredentials: true}).pipe();
    }
    public getProgramacionEspecialidad(idRemision: string, especialidad: string): Observable<any> {
        const URL = `${this.url}${this.port}/api_programacion/programacion/consultarProgramacionEspecialidad/${idRemision}${especialidad}`;
        console.log('URL getProgramacionEspecialidad ', URL);
        return this.http.get<any>(URL, { withCredentials: true }).pipe();
    }

    public getProgramacionCuidador(idRemision: string): Observable<any> {
        const URL = `${this.url}${this.port}/api_programacion/programacion/consultarCitasCuidador/${idRemision}`;
        console.log('URL getProgramacionCuidador ', URL);
        return this.http.get<any>(URL, { withCredentials: true }).pipe();
    }

    public guardarRemision(data: any): Observable<string> {
        const URL = `${this.url}${this.port}/api_programacion/novedad/consultarDisponibilidad`;
        console.log('URL getProgramacionDisponibilidad ', URL);
        return this.http.post<any>(URL, data, { withCredentials: true }).pipe();
    }

}
