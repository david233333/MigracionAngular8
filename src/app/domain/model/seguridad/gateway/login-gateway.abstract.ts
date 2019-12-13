import {Observable} from 'rxjs/Observable';
import {Usuario} from '../../../../shared/models/usuario.model';
import {BooleanReturn} from './boolean-return';


export abstract class LoginGatewayAbstract {
  abstract login(url: any): any;

  abstract checkLogin(): Observable<boolean>;

  abstract datosUsuarioLogueado(): Observable<Usuario>;

  abstract elUsuariotieneAcceso(recurso: string, metodo: string): Observable<boolean>;

  abstract cerrarSesion(): any;
}
