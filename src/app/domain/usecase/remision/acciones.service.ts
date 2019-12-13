import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { RemisionGatewayAbstract } from '../../model/remision/gateway/remision-gateway.abstract';

import { Remision } from '../../model/remision/entity/remision.model';
import { ComunGatewayAbstract } from '../../model/comun/gateway/comun-gateway.abstract';
import { MotivoCancelacion } from '../../model/maestro/entity/motivo-cancelacion.model';


@Injectable()
export class AccionesService {

  constructor(private remisionService: RemisionGatewayAbstract, private comunServices: ComunGatewayAbstract) { }

  public getConsentimiento(nombre: string, documento: string): Observable<string> {
    return this.comunServices.getConsentimiento(nombre, documento).pipe();
  }


  public getMotivoCancelacion(): Observable<MotivoCancelacion[]> {
    return this.remisionService.getMotivoCancelacion().pipe();
  }


  public cancelarRemision(entidad: Remision): Observable<Remision> {
    return this.remisionService.cancelarRemision(entidad).pipe();
  }

  public getReporteRemisionByIdRemisionPk(idRemisionPk: string): Observable<string> {
    return this.remisionService.getReporteRemision(idRemisionPk);
  }


}
