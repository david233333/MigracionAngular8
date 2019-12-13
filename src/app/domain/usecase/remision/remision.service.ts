import { Injectable } from '@angular/core';
import { RemisionGatewayAbstract } from '../../model/remision/gateway/remision-gateway.abstract';
import { Observable } from 'rxjs/Observable';
import {Admision} from '../../model/remision/entity/admision.model';
import { InformeRemisionesRequest } from '../../../infraestructure/request-model/remision/informe-remisiones.request';

@Injectable()
export class RemisionServices {

  constructor(private remisionService: RemisionGatewayAbstract) {
  }

  public getagregadoPaciente(idRemisionPk: string): Observable<any> {
    return this.remisionService.getagregadoPaciente(idRemisionPk);
  }

  public getagregadoDatosAtencion(idRemisionPk: string): Observable<any> {
    return this.remisionService.getagregadoDatosDeAtencion(idRemisionPk);

  }

  public getAgregadoRemision(idRemision: string): Observable<any> {
    return this.remisionService.getagregadoRemision(idRemision);
  }

  public getAgregadoDiagnostico(idRemision: string): Observable<any> {
    return this.remisionService.getAgregadoDiagnostico(idRemision).pipe();
  }

  public getAgregadoDatosRemision(idRemision: string): Observable<any> {
    return this.remisionService.getAgregadoDatosRemision(idRemision);
  }

  public getAgregadoAdmision(idRemision: string): Observable<Admision> {
    return this.remisionService.getAdmisionAgregado(idRemision);
  }

  public consultarInformeRemisiones(
    request: InformeRemisionesRequest
  ): Observable<any> {
    return this.remisionService.consultarInformeRemisiones(request);
  }

}
