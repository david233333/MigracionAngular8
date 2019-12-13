import {Injectable} from '@angular/core';
import {MaestrosGatewayAbstract} from '../../model/maestro/gateway/maestros-gateway.abstract';
import {Observable} from 'rxjs/Observable';
import {Ciudad} from '../../model/maestro/entity/ciudad.model';
import {RequestMaestro} from '../../../view/maestros/RequestMaestro.model';
import {ProfesionalResponseModel} from '../../model/maestro/entity/ProfesionalResponse.model';

@Injectable()
export class MaestrosService {

  constructor(private maestrosService: MaestrosGatewayAbstract) {
  }

  public newCiudad(request: RequestMaestro): Observable<void> {
    return this.maestrosService.newCiudad(request).pipe();
  }

  public deleteCiudad(request: RequestMaestro): Observable<void> {
    return this.maestrosService.deleteCiudad(request).pipe();
  }

  public updateCiudad(request: RequestMaestro): Observable<void> {
    return this.maestrosService.updateCiudad(request).pipe();
  }

  public consultarProfesionalesActivos(especialidad: string, nombreCiudad: string): Observable<ProfesionalResponseModel[]> {
    return this.maestrosService.consultarProfesionalesActivos(especialidad, nombreCiudad);
  }
}
