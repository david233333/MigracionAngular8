import { Injectable } from '@angular/core';
import { NovedadGatewayAbstract } from '../../model/novedad/gateway/novedad-gateway.abstract';
import { FiltrosBandeja } from '../../../infraestructure/request-model/novedad/FiltrosBandeja';
import { Observable } from 'rxjs';

@Injectable()
export class AmbulatorioServices {

  constructor(
    private novedadService: NovedadGatewayAbstract) {
  }

  public consultarBandejas(filtros: FiltrosBandeja): Observable<any> {
    return this.novedadService.consultarBandejas(filtros);
  }

  public consultarPlanManejoBandejaMedicamentos(idNovedad: string): Observable<any> {
    return this.novedadService.consultarPlanManejoBandejaMedicamentos(idNovedad);
  }

  public actualizarEstadoBandeja(idRemision: string): Observable<any> {
    return this.novedadService.actualizarEstadoBandeja(idRemision);
  }
}
