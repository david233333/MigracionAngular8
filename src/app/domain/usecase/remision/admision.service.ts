import {ComunGatewayAbstract} from '../../model/comun/gateway/comun-gateway.abstract';
import {mensajes} from '../../../shared/utils/mensajes';
import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {Maestro} from '../../../infraestructure/comun/models/maestro.model';
import {Piso} from '../../model/maestro/entity/piso.model';
import {Programa} from '../../model/maestro/entity/programa.model';

@Injectable()
export class AdmisionService {
  public datos: any = {};

  private mensajes: any = mensajes.admisiones;


  constructor(private comunService: ComunGatewayAbstract) {
  }

  /**
   * Obtiene los los Pisos por Ciudad
   * @returns {Observable<Piso[]>}
   */

  public getPisosAdmision(ciudad: string, tipoAtencion: string, idPrograma: string): Observable<Piso[]> {
    return this.comunService.getPisosCiudadTipoAtencion(ciudad, tipoAtencion, idPrograma);
  }

  /**
   * Obtiene los Programas
   * @returns {Observable<>}
   */

  public getProgramas(): Observable<Programa[]> {
    return this.comunService.getProgramas().pipe();
  }

  /**
   *
   * @param {string} idCiudad
   * @returns {Observable<Maestro[]>}
   */
  public getCentroEstadia(idCiudad: string): Observable<Maestro[]> {
    return this.comunService.getCentroDeEstadiaTemporal(idCiudad).pipe();
  }

  /**
   *
   * @param {string} idPiso
   */
  public getSedes(idPiso: string): Observable<any[]> {
    return this.comunService.getSedes(idPiso).pipe();
  }
}
