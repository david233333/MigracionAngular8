import {Injectable} from '@angular/core';
import {LineaUnicaGatewayAbstract} from '../../domain/model/lineaUnica/gateway/lineaUnica-gateway.abstract';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConfiguracionService} from '../../shared/services/configuracion.service';
import {LineaUnicaModel} from '../../domain/model/lineaUnica/entity/lineaUnica-model';

@Injectable()
export class LineaUnicaServices  extends  LineaUnicaGatewayAbstract {
  private headers: HttpHeaders;
  private url: string;
  private port: string;
  constructor( private http: HttpClient) {
    super();
    this.headers = new HttpHeaders();

    this.url = `${ConfiguracionService.config.urlBase}`;
    this.port = `${ConfiguracionService.config.portBase}`;
  }

  /**
   * Consulta la lista de linea unica
   * @param {string} idCiudad
   * @returns {Observable<any>}
   */
  public consultarLineaUnica(idCiudad: string, page: number, size: number): Observable<any> {
    console.log('id', idCiudad);
    const URL = `${this.url}${this.port}/api_novedades/lineaunica/consultar`;
    let URL_COMPLETA = '';

    const operador = 'eq';
    const ciudad = `ciudad=${operador}:${idCiudad}&`;
    const pageSize = `page=${page}&size=${size}`;
    if ( idCiudad !== null) {
      URL_COMPLETA = URL_COMPLETA.concat(ciudad);
    }
    URL_COMPLETA = URL_COMPLETA.concat(pageSize);
    console.log(URL_COMPLETA);
    return this.http.get<any>(URL.concat(`?${URL_COMPLETA}`), { withCredentials: true });
  }


  /**
   * Guarda los intentos de llamada
   *
   * @param {LineaUnicaModel} lineaUnica
   * @returns {Observable<LineaUnicaModel[]>}
   */
  public  guardarIntento(lineaUnica: LineaUnicaModel): Observable<any> {
   const URL = `${this.url}${this.port}/api_novedades/lineaunica/guardarintento`;
   return this.http.post(URL, lineaUnica, { responseType: 'text', withCredentials: true  });
  }

  /**
   *
   * @param {string} id
   * @returns {Observable<LineaUnicaModel[]>}
   */
 public bucarById(id: string): Observable<LineaUnicaModel[]> {
    const URL = `${this.url}${this.port}/api_novedades/lineaunica/buscarbloqueousuario/${id}`;
    return this.http.get<LineaUnicaModel[]>(URL, { withCredentials: true });
  }

  /**
   * Bloquea el usuario que este gestionando en linea
   * Unica
   * @param {LineaUnicaModel} lineaUnica
   * @returns {Observable<any>}
   */
  public bloquearUsuario(lineaUnica: LineaUnicaModel): Observable<any> {
   const URL = `${this.url}${this.port}/api_novedades/lineaunica/bloqueousuario`;
    return this.http.post(URL, lineaUnica, { responseType: 'text',  withCredentials: true  });
  }

  /**
   * Hace la peticion para guardar
   * el estado como exitoso
   * @param {LineaUnicaModel} lineaUnica
   * @returns {Observable<any>}
   */
  public guardarComoExitoso(lineaUnica: LineaUnicaModel): Observable<any> {
    const URL = `${this.url}${this.port}/api_novedades/lineaunica/guardarcomoexitoso`;
    return this.http.post(URL, lineaUnica, { responseType: 'text', withCredentials: true  });
  }






}
