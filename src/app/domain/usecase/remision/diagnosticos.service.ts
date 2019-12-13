import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ComunGatewayAbstract } from '../../model/comun/gateway/comun-gateway.abstract';
import { Diagnostico } from '../../model/maestro/entity/diagnostico.model';


@Injectable()
export class DiagnosticosService {

  constructor(private comunService: ComunGatewayAbstract) { }

  /**
   * Obtiene los diagnosticos
   * @returns {Observable<Diagnostico[]>}
   */
  public getDiagnosticos(nombre: string): Observable<Diagnostico[]> {
    return this.comunService.getDiagnosticos(nombre);
  }
}
