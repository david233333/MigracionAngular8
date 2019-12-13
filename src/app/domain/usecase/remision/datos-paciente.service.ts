import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ComunGatewayAbstract} from '../../model/comun/gateway/comun-gateway.abstract';
import {Paciente} from '../../model/remision/entity/paciente.model';

import {TipoPlanParticular} from '../../model/maestro/entity/tipo-plan-particular.model';
import {TipoIdentificacion} from '../../model/maestro/entity/tipo-identificacion.model';
import {PlanSalud} from '../../model/maestro/entity/plan-salud.model';
import {Genero} from '../../model/maestro/entity/genero.model';

@Injectable()
export class DatosPacienteService {
  public static _pac: any;

  constructor(private comunService: ComunGatewayAbstract) {
  }

  get pact(): any {
    return DatosPacienteService._pac;
  }

  set pact(_pac: any) {
    DatosPacienteService._pac = _pac;
  }

  /**
   * Obtiene los datos del paciente
   * @param {string} plan
   * @param {string} tipoDocumento
   * @param {string} documento
   * @returns {Observable<Paciente>}
   */
  public getDatosPaciente(plan: string, tipoDocumento: string, documento: string): Observable<Paciente> {

    return this.comunService.getDatosPaciente(plan, tipoDocumento, documento).pipe();
  }

  /**
   * Obtiene los tipos de planes
   * @returns {Observable<>}
   */

  /*
    public getTiposPlanesSalud(): Observable<Maestro[]> {

      return this.comunService.getTiposPlanesSalud()
        .pipe();
    }
  */

  /**
   * Obtiene los tipos de identificacion
   * @returns {Observable<TipoIdentificacion[]>}
   */
  public getTiposIdentificacion(): Observable<TipoIdentificacion[]> {
    return this.comunService.getTiposIdentificacion().pipe();
  }

  /**
   * Obtiene los planes de salud
   * @returns {Observable<PlanSalud[]>}
   */
  public getPlanesSalud(): Observable<PlanSalud[]> {
    console.log(this.comunService.getPlanesSalud());
    return this.comunService.getPlanesSalud().pipe();
  }

  /**
   *
   * @returns {Observable<TipoPlanParticular[]>}
   */
  public getTipoPlanParticular(): Observable<TipoPlanParticular[]> {
    return this.comunService.getTipoPlanParticular().pipe();
  }

  /**
   * consulta el pac de cada paciente dependiendo
   * del plan
   * @param {string} tipoDocumento
   * @param {string} numeroDocumento
   * @returns {Observable<any>}
   */
  public getPac(tipoDocumento: string, numeroDocumento: string): Observable<any> {
    return this.comunService.getDatosPac(tipoDocumento, numeroDocumento).pipe();
  }

  public getGenero(): Observable<Genero[]> {
    return this.comunService.getGenero();
  }

}
