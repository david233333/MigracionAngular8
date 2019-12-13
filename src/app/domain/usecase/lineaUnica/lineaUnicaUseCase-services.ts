import {Injectable} from '@angular/core';
import {LineaUnicaGatewayAbstract} from '../../model/lineaUnica/gateway/lineaUnica-gateway.abstract';
import {Observable} from 'rxjs/Observable';
import {LineaUnicaModel} from '../../model/lineaUnica/entity/lineaUnica-model';
import {ComunGatewayAbstract} from '../../model/comun/gateway/comun-gateway.abstract';
import {CausasLlamadaNoContestada} from '../../model/maestro/entity/CausasLlamadaNoContestada';

@Injectable()
export class LineaUnicaUseCaseService {

  constructor(private lineaUnica: LineaUnicaGatewayAbstract,
              private comunServices: ComunGatewayAbstract) {
  }

  /**
   * Implemeta el servicio
   * de linea unica
   *  Johan sebastian Salazar Muñoz
   * Sofka 2018
   * @param {string} idCiudad
   * @returns {Observable<LineaUnicaModel[]>}
   */
  public consultarLineaUnica(idCiudad: string, page: number, size: number): Observable<any> {
    return this.lineaUnica.consultarLineaUnica(idCiudad, page, size);
  }

  /**
   * llama la clase abstracta para invocar el servicio
   *Johan sebastian Salazar Muñoz
   * Sofka 2018
   * @param {LineaUnicaModel} lineaUnicaIntento
   * @returns {Observable<LineaUnicaModel[]>}
   */
     public guardarIntento(lineaUnicaIntento: LineaUnicaModel): Observable<any> {
    return this.lineaUnica.guardarIntento(lineaUnicaIntento);
      }


  /**
   * Consulta las cuasas de no llamada
   * para pintarlas en la lista desplegable
   * @returns {Observable<CausasLlamadaNoContestada[]>}
   */
    public consultarCausaLLamadaNoContestada(): Observable<CausasLlamadaNoContestada[]>{
      return this.comunServices.getLlamadaNoContestada();
      }

    /**
     * Busca por id de linea unica
     * @param {string} id
     * @returns {Observable<LineaUnicaModel[]>}
     */
    public buscarByIdLineaUnica(id: string): Observable<LineaUnicaModel[]> {
      return this.lineaUnica.bucarById(id);
      }

    /**
     *
     * @param {LineaUnicaModel} lineaUnica
     * @returns {Observable<any>}
     */
    public bloquearUsuario(lineaUnica: LineaUnicaModel): Observable<any> {
        return this.lineaUnica.bloquearUsuario(lineaUnica);
      }

  /**
   * guarda el esatdo como exitoso
   * @param {LineaUnicaModel} lineaUnica
   * @returns {Observable<any>}
   */
  public guardarComoExitoso(lineaUnica: LineaUnicaModel): Observable<any> {
      return this.lineaUnica.guardarComoExitoso(lineaUnica);
     }


}
