import { Observable } from "rxjs/Observable";
import { FiltrosBandejaDinamicaRequest } from "../../../../infraestructure/request-model/bandejaDinamica/filtros-bandeja-dinamica.request";
import { GestionarBandejaDinamicaRequest } from "../../../../infraestructure/request-model/bandejaDinamica/gestionar-bandeja-dinamica.request";



export abstract class BandejaDinamicaGatewayAbstract {

    abstract getBandejaDinamica(filtrosBandejaDinamica: FiltrosBandejaDinamicaRequest): Observable<any>;

    abstract gestionBandejaDinamica(bandejaDinamica: GestionarBandejaDinamicaRequest): Observable<any>;

}
