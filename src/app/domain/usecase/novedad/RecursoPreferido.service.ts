import {Injectable} from '@angular/core';
import {NovedadGatewayAbstract} from '../../model/novedad/gateway/novedad-gateway.abstract';
import {RecursoPreferidoRequest} from '../../../infraestructure/request-model/novedad/recurso-preferido.request';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class RecursoPreferidoService {

  constructor(private novedadGateway: NovedadGatewayAbstract) {

  }

  public guardarRecursoPreferido(recursoPreferido: RecursoPreferidoRequest): Observable<any> {
    return this.novedadGateway.guardarRecursoPreferido(recursoPreferido);
  }

  public quitarRecursoPreferido(recursoPreferido: RecursoPreferidoRequest): Observable<any> {
    return this.novedadGateway.quitarRecursoPreferido(recursoPreferido);
  }

  public getAgregadoRecursoPreferido(idNovedad: string): Observable<any> {
    return this.novedadGateway.getAgregadoRecursoPreferido(idNovedad);
  }


}
