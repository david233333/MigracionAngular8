import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RemisionGatewayAbstract } from '../../model/remision/gateway/remision-gateway.abstract';
import { ComunGatewayAbstract } from '../../model/comun/gateway/comun-gateway.abstract';
import { Institucion } from '../../model/maestro/entity/institucion.model';
import { Peso } from '../../model/maestro/entity/peso.model';
import { Profesional } from '../../model/maestro/entity/profesional.model';
import { FiltrosRemisionesRequest } from '../../../infraestructure/request-model/remision/filtros-remisiones.request';

@Injectable()
export class DatosRemisionService {

  constructor(
    private remisionService: RemisionGatewayAbstract,
    private comunService: ComunGatewayAbstract
  ) { }
  public respuestaPeso: Observable<Peso[]>;
  /**
   * Obtiene los tipos de identificacion
   * @returns {Observable<Institucion[]>}
   */
  public getInstituciones(nombreCiudad: string): Observable<Institucion[]> {
    return this.comunService.getInstituciones(nombreCiudad).pipe();
  }

  public getPeso(): Observable<Peso[]> {
    return this.comunService.getPeso().pipe();
  }

  /**
   * Obtiene el profesional
   * @param {string} tipoDocumento
   * @param {string} numeroDocumento
   * @returns {Observable<Profesional>}
   */
  public getProfesional(tipoDocumento: string, numeroDocumento: string): Observable<Profesional> {
    return this.comunService.getProfesional(tipoDocumento, numeroDocumento);
  }

  /**
 * Obtiene las remisiones
 */
  public getRemisiones(filtroslistaRemisiones: FiltrosRemisionesRequest): Observable<any> {
    return this.remisionService.getRemisiones(filtroslistaRemisiones).pipe();
  }

}

