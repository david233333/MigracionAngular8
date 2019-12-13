import { InformeVehicularRequest } from '../../../../infraestructure/request-model/transporte/informe-vehicular.request';
import { Observable } from 'rxjs/Observable';

export abstract class TransporteGatewayAbstract {
  abstract consultarInformeVehicular(
    request: InformeVehicularRequest
  ): Observable<any>;
}
