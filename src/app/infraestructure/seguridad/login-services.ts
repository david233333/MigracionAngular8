import {Injectable} from '@angular/core';
import {LoginGatewayAbstract} from '../../domain/model/seguridad/gateway/login-gateway.abstract';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConfiguracionService} from '../../shared/services/configuracion.service';

import {Usuario} from '../../shared/models/usuario.model';
import {AuthorizationRequestDtoModel} from '../../domain/model/seguridad/entity/AuthorizationRequestDto.model';
import {BooleanReturn} from '../../domain/model/seguridad/gateway/boolean-return';

@Injectable()
export class LoginServices extends LoginGatewayAbstract {
  private headers: HttpHeaders;
  private url: string;
  private port: string;

  constructor(private http: HttpClient) {
    super();
    this.headers = new HttpHeaders();

    this.url = `${ConfiguracionService.config.urlBase}`;
    this.port = `${ConfiguracionService.config.portBase}`;
  }

  public login(urlInicio: any): any {
    const URL = `${this.url}${this.port}/api_ingreso/login/form`;
    return this.http
      .post<any>(URL, urlInicio, {
        headers: new HttpHeaders().set('Accept', 'text/html; charset: utf-8')
      })
      .subscribe(
        value => {
          console.log('exito pase', value);
        },
        error1 => {
          document.write(error1.error.text);
        }
      );
  }

  public checkLogin(): Observable<boolean> {
    const URL = `${this.url}${this.port}/api_ingreso/user/check`;
    return this.http.post<boolean>(URL, null, {withCredentials: true});
  }

  public datosUsuarioLogueado(): Observable<Usuario> {
    const URL = `${this.url}${this.port}/api_ingreso/user/current`;
    return this.http.get<Usuario>(URL, {withCredentials: true});
  }

  public elUsuariotieneAcceso(recurso: string, metodo: string): Observable<boolean> {
    const authorizationRequestDto = new AuthorizationRequestDtoModel(recurso, metodo);
    const URL = `${this.url}${this.port}/api_ingreso/user/hasAccess`;
    return this.http.post<boolean>(URL, authorizationRequestDto, {withCredentials: true}).map(valor => {
        console.log(valor);
        return <boolean>valor;
      }
    );
  }

  public cerrarSesion() {
    const URL = `${this.url}${this.port}/api_ingreso/logout`;
    return this.http.get(URL, {responseType: 'text', withCredentials: true});
  }
}
