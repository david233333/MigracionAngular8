
import {Injectable} from '@angular/core';
import {EquipoBiomedicoGatewayAbstract} from '../../model/equipoBiomedico/gateway/equipo-biomedico-gateway.abstract';
import {ComunGatewayAbstract} from '../../model/comun/gateway/comun-gateway.abstract';
import {Observable} from 'rxjs/Observable';
import {Ciudad} from '../../model/maestro/entity/ciudad.model';
import {TipoIdentificacion} from '../../model/maestro/entity/tipo-identificacion.model';
import {Proveedor} from '../../model/maestro/entity/proveedor.model';
import {FiltrosEquiposBiomedicosRequest} from '../../../infraestructure/request-model/equipoBiomedico/filtros-equipos-biomedicos.request';
import {EquipoBiomedico} from '../../model/novedad/entity/equipo-biomedico.model';
import {EstadoEquipoBiomedico} from '../../model/maestro/entity/estado-equipo-biomedico.model';


@Injectable()
export class GestionEquipoBiomedicoService {

  constructor(
    private equipoBiomedicoService: EquipoBiomedicoGatewayAbstract,
    private comunService: ComunGatewayAbstract
  ) {
  }

  /**
   * Obtiene los tipos de identificaciones
   * @returns {Observable<any[]>}
   */
  public getTiposIdentificacion(): Observable<TipoIdentificacion[]> {
    return this.comunService.getTiposIdentificacionNovedad().pipe();
  }

  /**
   * Obtiene las ciudades
   * @returns {Observable<Ciudad[]>}
   */
  public getCiudades(): Observable<Ciudad[]> {
    return this.comunService.getCiudadesNovedad().pipe();
  }

  /**
   * Obtiene los estados
   * @returns {Observable<EstadoEquipoBiomedico[]>}
   */
  public getEstados(idEstado: string, nombreUsuario: string): Observable<EstadoEquipoBiomedico[]> {
    return this.comunService.getEstadosEquiposBiomedicosNovedad(idEstado, nombreUsuario).pipe();
  }

  /**
   * Obtiene los proveedores
   * @returns {Observable<Proveedor[]>}
   */
  public getProveedores(): Observable<Proveedor[]> {
    return this.comunService.getProveedoresEquiposBiomedicosNovedad().pipe();
  }

  /**
   * Consulta los equipos biomédicos de acuerdo a los filtros seleccionados
   * @param filtrosGestionNovedad
   */
  public getEquiposBiomedicos(filtrosEquiposBiomedicos: FiltrosEquiposBiomedicosRequest): Observable<any> {
    return this.equipoBiomedicoService.getEquiposBiomedicos(filtrosEquiposBiomedicos).pipe();
  }


  public getTipoEquiposBiomedicos(): Observable<any[]> {
    return this.comunService.getTipoEquiposBiomedicosNovedad().pipe();
  }

  /**
   * Gestiona un equipo biomédico
   * @param equipoBiomedico
   */
  public gestionEquipoBiomedico(equipoBiomedico: EquipoBiomedico): Observable<any> {
    return this.equipoBiomedicoService.gestionEquipoBiomedico(equipoBiomedico).pipe();
  }


}
