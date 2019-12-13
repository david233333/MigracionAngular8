import {Observable} from 'rxjs/Observable';
import {Ciudad} from '../entity/ciudad.model';
import {RequestMaestro} from '../../../../view/maestros/RequestMaestro.model';
import {ProfesionalResponseModel} from '../entity/ProfesionalResponse.model';

export abstract class MaestrosGatewayAbstract {

  abstract newCiudad(request: RequestMaestro): Observable<void>;

  abstract deleteCiudad(request: RequestMaestro): Observable<void>;

  abstract updateCiudad(request: RequestMaestro): Observable<void>;

  abstract consultarProfesionalesActivos(especialidad: string, nombreCiudad: string): Observable<ProfesionalResponseModel[]>;
}
