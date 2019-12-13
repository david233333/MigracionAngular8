import { Observable } from "rxjs/Observable";
import { FiltrosEquiposBiomedicosRequest } from "../../../../infraestructure/request-model/equipoBiomedico/filtros-equipos-biomedicos.request";
import { EquipoBiomedico } from "../entity/equipo-biomedico.model";



export abstract class EquipoBiomedicoGatewayAbstract {

    abstract getEquiposBiomedicos(filtrosEquiposBiomedicos: FiltrosEquiposBiomedicosRequest): Observable<any>;

    abstract gestionEquipoBiomedico(equipoBiomedico: EquipoBiomedico): Observable<any>;

}
