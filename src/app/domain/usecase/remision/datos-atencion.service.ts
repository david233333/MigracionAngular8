import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {ComunGatewayAbstract} from '../../model/comun/gateway/comun-gateway.abstract';
import {Maestro} from '../../../infraestructure/comun/models/maestro.model';

import {Ciudad} from '../../model/maestro/entity/ciudad.model';
import {Municipio} from '../../model/maestro/entity/municipio.model';
import {DireccionRequest} from '../../model/maestro/entity/DireccionRequest';
import {GeoCode} from '../../model/maestro/entity/GeoCode';
import {RequestMaestro} from '../../../view/maestros/RequestMaestro.model';

@Injectable()
export class DatosAtencionService {

  constructor(private comunService: ComunGatewayAbstract) {
  }


  /**
   * Obtiene las ciudades
   * @returns {Observable<Ciudad[]>}
   */
  public getCiudades(): Observable<Ciudad[]> {
    return this.comunService.getCiudades().pipe();
  }



  public getGeoReferenciacion(esNovedad: boolean): Observable<Maestro[]> {
    if (esNovedad) {
      return this.comunService.getGeoReferenciacionNovedad();
    } else {
      return this.comunService.getGeoReferenciacion();
    }

  }

  /**
   * Obtiene los municipios
   * @returns {Observable<>}
   */
  public getMunicipios(idCiudad: string, esNovedad: boolean): Observable<Municipio[]> {
    if (esNovedad) {
      return this.comunService.getMunicipiosNovedad(idCiudad);
    } else {
      return this.comunService.getMunicipio(idCiudad);
    }
  }

  getXYY(dataDireccion: DireccionRequest): Observable<GeoCode> {
    return this.comunService.getXYY(dataDireccion).pipe();
  }

  public getDetallesDeLugares(nombre: string, ciudad: string): Observable<any> {
    return this.comunService.getDetallesDeLugares(nombre, ciudad).pipe();
  }
}


