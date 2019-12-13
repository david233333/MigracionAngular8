import {Injectable} from '@angular/core';
import {InformesGateway} from '../../domain/model/informes/gateway/informes-gateway';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ConfiguracionService} from '../../shared/services/configuracion.service';

@Injectable()
export class InformesServices extends InformesGateway {
  private headers: HttpHeaders;
  private readonly url: string;
  private readonly port: string;

  constructor(private http: HttpClient) {
    super();
    this.headers = new HttpHeaders();
    this.url = `${ConfiguracionService.config.urlBase}`;
    this.port = `${ConfiguracionService.config.portBase}`;

  }

  public consutlarInformeEgreso(idCiudad: string, idPrograma: string, fechaInicio: string,
                                fechaFin: string, idPiso?: string): Observable<any> {
    const URL = `${this.url}${this.port}/api_novedades/novedad/informeEgresos`;
    const PARAMS = this.setParams(idCiudad, idPrograma, fechaInicio, fechaFin, idPiso);
    return this.http.get(URL, {params: PARAMS, responseType: 'text', withCredentials: true});
  }

  public consutlarInformeCuraciones(idCiudad: string, idPrograma: string, fechaInicio: string,
                                    fechaFin: string, idPiso?: string): Observable<any> {
    const URL = `${this.url}${this.port}/api_programacion/programacion/informeCuraciones`;
    const PARAMS = this.setParams(idCiudad, idPrograma, fechaInicio, fechaFin, idPiso);
    return this.http.get(URL, {params: PARAMS, responseType: 'text', withCredentials: true});
  }

  public consultarInformeEquipoBiomedicos(estado, fechaInicio, fechaFin): Observable<any> {


    const URL = `${this.url}${this.port}/api_novedades/equipoBioMedicos/informeEquipoBioMedicos`;
    const PARAMS = new HttpParams().set('estado', estado).set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
    return this.http.get(URL, {params: PARAMS, responseType: 'text', withCredentials: true});

  }

  public consultarInformePaliativos(fechaInicio: string, fechaFin: string): Observable<any> {
    const URL = `${this.url}${this.port}/api_programacion/programacion/informePaliativos/${fechaInicio}/${fechaFin}`;
    return this.http.get(URL, {responseType: 'text', withCredentials: true});
  }

  public cargarRegistros(fileName: File): Observable<any> {
    const FORM_DATA: FormData = new FormData();
    FORM_DATA.append('file', fileName);

    const URL = `${this.url}${this.port}/api_novedades/configuracionBarrio/cargarRegistros`;
    return this.http.post(URL, FORM_DATA, {responseType: 'text', withCredentials: true});
  }

  public consultarCoberturaRiesgo(codigoBarrio: string, ciudad: string): Observable<any> {
    const URL = `${this.url}${this.port}/api_novedades/configuracionBarrio/coberturaRiesgo/${codigoBarrio}/${ciudad}`;
    return this.http.get(URL, {withCredentials: true});
  }

  private setParams(idCiudad: string, idPrograma: string, fechaInicio: string, fechaFin: string, idPiso: string) {
    return new HttpParams().set('regional', idCiudad).set('programa', idPrograma).set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin).set('piso', idPiso);
  }

  consultarInformePacientes(idCiudad, idPiso?: string, estados?: string) {
    const URL = `${this.url}${this.port}/api_novedades/novedad/informePacientes`;
    const PARAMS = new HttpParams().set('idCiudad', idCiudad).set('pisos', idPiso).set('estados', estados);
    return this.http.get(URL, {params: PARAMS, responseType: 'text', withCredentials: true});
  }
}
