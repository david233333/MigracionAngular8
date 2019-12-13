import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfiguracionService } from '../../shared/services/configuracion.service';
import { LineaUnicaModel } from '../../domain/model/lineaUnica/entity/lineaUnica-model';
import { TransporteGatewayAbstract } from '../../domain/model/transporte/gateway/transporte-gateway.abstract';
import { InformeVehicularRequest } from '../request-model/transporte/informe-vehicular.request';

@Injectable()
export class TransporteService extends TransporteGatewayAbstract {
  private url: string;
  private port: string;
  constructor(private http: HttpClient) {
    super();

    this.url = `${ConfiguracionService.config.urlBase}`;
    this.port = `${ConfiguracionService.config.portBase}`;
  }

  /**
   * Consulte el maestro vehicular del módulo transporte
   * @param request
   */
  public consultarInformeVehicular(
    request: InformeVehicularRequest
  ): Observable<any> {
    const URL = `${this.url}${this.port}/api_programacion/programacion/imprimirTurno/`;

    return this.http.post(URL, request, {
      responseType: 'text',
      withCredentials: true
    });
  }
}
