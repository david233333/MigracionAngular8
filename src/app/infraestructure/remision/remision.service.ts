import {Injectable} from '@angular/core';
import {
  HttpHeaders,
  HttpClient
} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ConfiguracionService} from '../../shared/services/configuracion.service';
import {RemisionGatewayAbstract} from '../../domain/model/remision/gateway/remision-gateway.abstract';
import {Maestro} from '../comun/models/maestro.model';
import {Remision} from '../../domain/model/remision/entity/remision.model';
import {MotivoCancelacion} from '../../domain/model/maestro/entity/motivo-cancelacion.model';
import {Valoracion} from '../../domain/model/maestro/entity/valoracion.model';
import {Admision} from '../../domain/model/remision/entity/admision.model';
import {PlanManejo} from '../../domain/model/remision/entity/plan-manejo/plan-manejo.model';
import {FiltrosRemisionesRequest} from '../request-model/remision/filtros-remisiones.request';
import {InformeRemisionesRequest} from '../request-model/remision/informe-remisiones.request';

@Injectable()
export class RemisionService extends RemisionGatewayAbstract {
  private headers: HttpHeaders;
  private url: string;
  private port: string;

  constructor(private http: HttpClient) {
    super();
    this.headers = new HttpHeaders();

    this.url = `${ConfiguracionService.config.urlBase}`;
    this.port = `${ConfiguracionService.config.portBase}`;
  }

  /**
   * crea una nueva remision con objeto vacio y estado en nuevo
   * @returns {Observable<string>}
   */
  public generarRemision(): Observable<any> {
    const url = `${this.url}${
      this.port
      }/api_ingreso/remision/crearNuevaRemision`;
    return this.http.get<any>(url, {withCredentials: true});
  }

  /**
   * Guardar remision
   *
   */
  public guardarRemision(data: any): Observable<any> {
    const URL = `${this.url}${this.port}/api_ingreso/remision`;
    return this.http.post(URL, data, {
      responseType: 'text',
      withCredentials: true

    });
  }
  public admitir(data: any): Observable<any> {
    const URL = `${this.url}${this.port}/api_ingreso/admitir`;
    return this.http.post(URL, data, {
      responseType: 'text',
      withCredentials: true
    });
  }

  public guadarRemisionParaDisponibulidad(data: any): Observable<any> {
    const URL = `${this.url}${this.port}/api_programacion/novedad/consultarDisponibilidad`;
    return this.http.post(URL, data, {
      responseType: 'text', withCredentials: true
    });
  }


  /**
   * Obtiene los motivos de cancelación para una remisión en estado Pendiente
   * @returns {Observable<MotivoCancelacion[]>}
   */
  public getMotivoCancelacion(): Observable<MotivoCancelacion[]> {
    const url = `${this.url}${
      this.port
      }/api_ingreso/maestros/motivosCancelacion`;
    return this.http.get<MotivoCancelacion[]>(url, {withCredentials: true});
  }

  /**
   * Cancela la remisión
   * @returns {Observable<Remision>}
   */
  public cancelarRemision(entidad: Remision): Observable<Remision> {
    const url = `${this.url}${this.port}/api_ingreso/remision/cancelarremision`;
    return this.http.post<Remision>(url, entidad, {withCredentials: true});
  }

  /**
   * Obtiene las remisiones
   */
  public getRemisiones(
    filtroslistaRemisiones: FiltrosRemisionesRequest
  ): Observable<any> {
    const URL = `${this.url}${
      this.port
      }/api_ingreso/remision/consultaRemisiones`;

    const operador = 'eq';
    const tipoIdentificacion = `tipoIdentificacion=${operador}:${
      filtroslistaRemisiones.tipoIdentificacion
      }&`;
    const numeroIdentificacion = `numeroIdentificacion=${operador}:${
      filtroslistaRemisiones.numeroIdentificacion
      }&`;
    const ciudadPrincipal = `ciudadPrincipal=${operador}:${
      filtroslistaRemisiones.ciudadPrincipal
      }&`;
    const institucionRemitente = `institucionRemitente=${
      filtroslistaRemisiones.institucionRemitente
      }&`;
    const estado = `estado=${operador}:${filtroslistaRemisiones.estado}&`;
    const planSalud = `planSalud=${operador}:${
      filtroslistaRemisiones.planSalud
      }&`;
    const remision = `remision=${operador}:${filtroslistaRemisiones.remision}&`;
    const tipoAdmision = `tipoAdmision=${operador}:${
      filtroslistaRemisiones.tipoAdmision
      }&`;
    const pageSize = `page=${filtroslistaRemisiones.page}&size=${
      filtroslistaRemisiones.size
      }`;

    let parametros = '';

    if (filtroslistaRemisiones.tipoIdentificacion != null) {
      parametros = parametros.concat(tipoIdentificacion);
    }
    if (filtroslistaRemisiones.numeroIdentificacion != null) {
      parametros = parametros.concat(numeroIdentificacion);
    }
    if (filtroslistaRemisiones.ciudadPrincipal != null) {
      parametros = parametros.concat(ciudadPrincipal);
    }
    if (filtroslistaRemisiones.institucionRemitente != null) {
      parametros = parametros.concat(institucionRemitente);
    }
    if (filtroslistaRemisiones.estado != null) {
      parametros = parametros.concat(estado);
    }
    if (filtroslistaRemisiones.planSalud != null) {
      parametros = parametros.concat(planSalud);
    }
    if (filtroslistaRemisiones.remision != null) {
      parametros = parametros.concat(remision);
    }
    if (filtroslistaRemisiones.tipoAdmision != null) {
      parametros = parametros.concat(tipoAdmision);
    }
    parametros = parametros.concat(pageSize);
    return this.http.get<any>(URL.concat(`?${parametros}`), {
      withCredentials: true
    });
  }

  /**
   *Consulta para generar maestro de remision
   *
   */
  getReporteRemision(idRemisionPk: string): Observable<any> {
    const URL = `${this.url}${
      this.port
      }/api_ingreso/remision/imprimirRemision/${idRemisionPk}`;
    return this.http.get(URL, {responseType: 'text', withCredentials: true});
  }

  /**
   * consulta de agregados paciente
   * @param {string} idRemisionPk
   * @returns {Observable<Maestro[]>}
   */
  getagregadoPaciente(idRemisionPk: string): Observable<any> {
    const URL = `${this.url}${
      this.port
      }/api_ingreso/paciente/consultarPaciente/${idRemisionPk}`;
    return this.http.get<any>(URL, {withCredentials: true});
  }

  /**
   * consulta los datos de atención
   * @param {string} idRemisionPk
   * @returns {Observable<Maestro[]>}
   */
  getagregadoDatosDeAtencion(idRemisionPk: string): Observable<Maestro[]> {
    const URL = `${this.url}${
      this.port
      }/api_ingreso/remision/consultarDatosAtencionPacienteRemision/${idRemisionPk}`;
    return this.http.get<Maestro[]>(URL, {withCredentials: true});
  }

  getagregadoRemision(idRemision: string): Observable<Maestro[]> {
    const URL = `${this.url}${
      this.port
      }/api_ingreso/remision/consultaRemision/${idRemision}`;
    return this.http.get<Maestro[]>(URL, {withCredentials: true});
  }

  getAgregadoDiagnostico(idRemision: string): Observable<Maestro[]> {
    const URL = `${this.url}${
      this.port
      }/api_ingreso/diagnostico/consultarDiagnosticos/${idRemision}`;
    return this.http.get<Maestro[]>(URL, {withCredentials: true});
  }

  /**
   *
   * @param {string} idRemision
   * @returns {Observable<Maestro[]>}
   */

  getAgregadoDatosRemision(idRemision: string): Observable<Maestro[]> {
    const URL = `${this.url}${
      this.port
      }/api_ingreso/datosRemision/consultarDatosRemision/${idRemision}`;
    return this.http.get<Maestro[]>(URL, {withCredentials: true});
  }

  getValoraciones(): Observable<Valoracion[]> {
    const URL = `${this.url}${this.port}/api_ingreso/maestros/valoraciones`;
    return this.http.get<Valoracion[]>(URL, {withCredentials: true});
  }

  getValoracionesPorTipo(tipo: string): Observable<Valoracion[]> {
    const URL = `${this.url}${
      this.port
      }/api_ingreso/maestros/valoraciones/${tipo}`;
    return this.http.get<Valoracion[]>(URL, {withCredentials: true});
  }

  getPlanManejoAgregado(idRemision: string): Observable<PlanManejo> {
    const URL = `${this.url}${
      this.port
      }/api_ingreso/remision/consultarPlanManejo/${idRemision}`;
    return this.http.get<PlanManejo>(URL, {withCredentials: true});
  }

  /**
   *consulta agregado de admisiones
   */
  public getAdmisionAgregado(idRemision: string): Observable<Admision> {
    const URL = `${this.url}${
      this.port
      }/api_ingreso/admision/consultarAdmision/${idRemision}`;
    return this.http.get<Admision>(URL, {withCredentials: true});
  }

  /**
   * Consulte el maestro de remisiones
   * @param request
   */
  public consultarInformeRemisiones(
    request: InformeRemisionesRequest
  ): Observable<any> {
    const URL = `${this.url}${
      this.port
      }/api_programacion/programacion/imprimirValidacion/`;

    return this.http.post(URL, request, {
      responseType: 'text',
      withCredentials: true
    });
  }
}
