import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {LoginGatewayAbstract} from '../../model/seguridad/gateway/login-gateway.abstract';
import {Usuario} from '../../../shared/models/usuario.model';
import {BooleanReturn} from '../../model/seguridad/gateway/boolean-return';

@Injectable()
export class LoginUsecaseServices {
  constructor(private loginServicesImpl: LoginGatewayAbstract) {
  }

  public login(url: any): any {
    return this.loginServicesImpl.login(url);
  }

  public checkLogin(): Observable<boolean> {
    return this.loginServicesImpl.checkLogin();
  }

  public datosUsuarioLogueado(): Observable<Usuario> {
    return this.loginServicesImpl.datosUsuarioLogueado();
  }

  public cerrarSesion(): any {
    return this.loginServicesImpl.cerrarSesion();
  }

  public elUsuariotieneAcceso(recurso: string, metodo: string): Observable<boolean> {
    return this.loginServicesImpl.elUsuariotieneAcceso(recurso, metodo);
  }
}
