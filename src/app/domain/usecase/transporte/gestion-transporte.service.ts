import { Injectable } from "@angular/core";
import { ComunGatewayAbstract } from "../../model/comun/gateway/comun-gateway.abstract";
import { InformeVehicularRequest } from "../../../infraestructure/request-model/transporte/informe-vehicular.request";
import { TransporteGatewayAbstract } from "../../model/transporte/gateway/transporte-gateway.abstract";
import { Observable } from "rxjs/Observable";

@Injectable()
export class GestionTransporteService {
  constructor(
    private transporte: TransporteGatewayAbstract,
    private comunServices: ComunGatewayAbstract
  ) {}

  public consultarInformeVehicular(
    request: InformeVehicularRequest
  ): Observable<any> {
    return this.transporte.consultarInformeVehicular(request);
  }
}
