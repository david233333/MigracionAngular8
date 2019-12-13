import {Injectable} from '@angular/core';
import {MaestrosGatewayAbstract} from '../../domain/model/maestro/gateway/maestros-gateway.abstract';
import {Ciudad} from '../../domain/model/maestro/entity/ciudad.model';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ConfiguracionService} from '../../shared/services/configuracion.service';
import {RequestMaestro} from '../../view/maestros/RequestMaestro.model';
import {ProfesionalResponseModel} from '../../domain/model/maestro/entity/ProfesionalResponse.model';

@Injectable()
export class MaestrosCrudService extends MaestrosGatewayAbstract {

  private headers: HttpHeaders;
  private url: string;
  private port: string;

  constructor(private http: HttpClient) {
    super();
    this.headers = new HttpHeaders();
    this.url = `${ConfiguracionService.config.urlBase}`;
    this.port = `${ConfiguracionService.config.portBase}`;
  }

  deleteCiudad(request: RequestMaestro): Observable<void> {
    const URL = `${this.url}${this.port}/api_maestros/eliminarMaestro`;
    return this.http.post<void>(URL, request, {withCredentials: true}).pipe();
  }

  newCiudad(request: RequestMaestro): Observable<void> {
    const URL = `${this.url}${this.port}/api_maestros/crearMaestro`;
    return this.http.post<void>(URL, request, {withCredentials: true}).pipe();
  }

  updateCiudad(request: RequestMaestro): Observable<void> {
    const URL = `${this.url}${this.port}/api_maestros/actualizarMaestro`;
    return this.http.post<void>(URL, request, {withCredentials: true}).pipe();
  }

  consultarProfesionalesActivos(especialidad: string, nombreCiudad: string): Observable<ProfesionalResponseModel[]> {
    const URL = `${this.url}${this.port}/api_programacion/programacion/consultarProfesionalesDisponibles`;
    //const URL = 'http://local.saludencasa.com.co/9090/api_programacion/programacion/consultarProfesionalesDisponibles'
    const params = new HttpParams()
      .set('especialidad', especialidad)
      .set('nombreCiudad', nombreCiudad);
    return this.http.get<ProfesionalResponseModel[]>(URL, {params, withCredentials: true}).pipe();

  }

}
