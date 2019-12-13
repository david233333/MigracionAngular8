import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ConfiguracionService} from '../../shared/services/configuracion.service';
import {NovedadGatewayAbstract} from '../../domain/model/novedad/gateway/novedad-gateway.abstract';
import {ConsultaRemisionRequest} from '../request-model/novedad/consulta-remision.request';
import {PlanManejo} from '../../domain/model/novedad/entity/plan-manejo/plan-manejo.model';
import {Egreso} from '../../domain/model/novedad/entity/egreso.model';
import {CambioPiso} from '../../domain/model/novedad/entity/cambio-piso.model';
import {DiagnosticoRequest} from '../request-model/novedad/diagnostico.request';
import {DatosAtencionPacienteRequest} from '../request-model/novedad/datos-atencion-paciente.request';
import {FiltrosGestionNovedadesRequest} from '../request-model/novedad/filtros-gestion-novedad.request';
import {RemisionActivaResponse} from '../response-model/novedad/remision-activa-response.response';
import {SolicitudNovedadesResponse} from '../response-model/novedad/solicitud-novedad.response';
import {GestionarNovedadRequest} from '../request-model/novedad/gestionar-novedad.request';
import {CitasPacienteRequest} from '../request-model/novedad/citas-paciente.request';
import {PlanManejoRequest} from '../request-model/novedad/plan-manejo.request';
import {AlertaVisita} from '../../domain/model/novedad/entity/alerta.model';
import {CancelaCita} from '../../domain/model/novedad/entity/cancela-cita.model';
import {EquipoBiomedico} from '../../domain/model/novedad/entity/equipo-biomedico.model';
import {AplicacionCuidador} from '../../domain/model/novedad/entity/aplicacion-cuidador.model';
import {FiltrosBandeja} from '../request-model/novedad/FiltrosBandeja';
import {Remision} from '../../domain/model/novedad/entity/remision.model';
import {RecursoPreferidoRequest} from '../request-model/novedad/recurso-preferido.request';
import { Usuario } from '../../shared/models/usuario.model';

@Injectable()
export class NovedadService extends NovedadGatewayAbstract {
  
  
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
   *
   */
  public getNovedadesGestion(idRemision: string, tipoNovedad: string): Observable<SolicitudNovedadesResponse[]> {
   const URL = `${this.url}${ this.port}/api_novedades/novedad/consultarSolicitudNovedadRemisionTipo/${idRemision}/${tipoNovedad}`;
   return this.http .get<SolicitudNovedadesResponse[]>(URL, {withCredentials: true}).pipe();
  }
    

  public getSolicitudesNovedades(filtrosGestionNovedad: FiltrosGestionNovedadesRequest): Observable<any> {
    
   const URL = `${this.url}${this.port}/api_novedades/novedad/consultarSolicitudNovedades`;

    const operador = 'eq';
    const tipoIdentificacion = `tipoIdentificacion=${operador}:${
      filtrosGestionNovedad.tipoIdentificacion
      }&`;
    const numeroIdentificacion = `numeroIdentificacion=${operador}:${
      filtrosGestionNovedad.numeroIdentificacion
      }&`;
    const ciudad = `ciudad=${operador}:${filtrosGestionNovedad.ciudad}&`;
    const piso = `piso=${filtrosGestionNovedad.pisos}&`;
    const estado = `estado=${operador}:${filtrosGestionNovedad.estado}&`;
    const idRemision = `idRemision=${operador}:${
      filtrosGestionNovedad.idRemision
      }&`;
    const pageSize = `page=${filtrosGestionNovedad.page}&size=${
      filtrosGestionNovedad.size
      }`;

    let parametros = '';

    if (filtrosGestionNovedad.tipoIdentificacion != null) {
      parametros = parametros.concat(tipoIdentificacion);
    }
    if (filtrosGestionNovedad.numeroIdentificacion != null) {
      parametros = parametros.concat(numeroIdentificacion);
    }
    if (filtrosGestionNovedad.ciudad != null) {
      parametros = parametros.concat(ciudad);
    }
    if (filtrosGestionNovedad.pisos != null) {
      parametros = parametros.concat(piso);
    }
    if (filtrosGestionNovedad.estado != null) {
      parametros = parametros.concat(estado);
    }
    if (filtrosGestionNovedad.idRemision != null) {
      parametros = parametros.concat(idRemision);
    }

    parametros = parametros.concat(pageSize);

    return this.http
      .get<any>(URL.concat(`?${parametros}`), {withCredentials: true})
      .pipe();
  }

  /**
   * obtener solicitudes de gestion de novedades en la bandeja DAVID
   */
  public getSolicitudesNovedadesEdicion(idRemision: string): Observable<any[]> {
    const URL = `${this.url}${this.port}/api_novedades/novedad/consultarSolicitudPendiente/${idRemision}`;
    return this.http.get<any[]>(URL, {withCredentials: true}).pipe();
  }
  
 
  /**
   *
   */
  public getSolicitudNovedad(idSolicitud: string): Observable<any> {
    const URL = `${this.url}${
      this.port
      }/api_novedades/novedad/consultarSolicitudNovedad/${idSolicitud}`;
    return this.http.get<any>(URL, {withCredentials: true}).pipe();
  }

  /**
   * Consulta para obtener una remisión activa
   * @param consulta
   */
  public getConsultaRemision(
    consulta: ConsultaRemisionRequest
  ): Observable<RemisionActivaResponse> {
   // const URL = `http://local.saludencasa.com.co:8090/api_novedades/novedad/consultarRemisionUltimaNovedad`;
     const URL = `${this.url}${
       this.port
       }/api_novedades/novedad/consultarRemisionUltimaNovedad`;
    return this.http
      .post<RemisionActivaResponse>(URL, consulta, {withCredentials: true})
      .pipe();
  }

  /**
   * Consulta para obtener una remisión activa - Linea unica
   * @param consulta
   */
  public getConsultaRemisionLineaUnica(consulta: ConsultaRemisionRequest): Observable<RemisionActivaResponse> {
    const URL = `${this.url}${ this.port}/api_novedades/novedad/consultarRemisionUltimaNovedadLineaUnica`;
    return this.http.post<RemisionActivaResponse>(URL, consulta, {withCredentials: true}).pipe();
  }

  /**
   * guarda el plan de manejo
   * @param consulta
   */
  public cambiarPlanManejo(planManejo: PlanManejoRequest): Observable<any> {
    const URL = `${this.url}${
      this.port
      }/api_novedades/novedad/novedadPlanManejo`;
    return this.http
      .post(URL, planManejo, {responseType: 'text', withCredentials: true})
      .pipe();
  }

  public egresarPaciente(egreso: Egreso): Observable<any> {
    const URL = `${this.url}${
      this.port
      }/api_novedades/novedad/novedadEgresarPaciente`;
    return this.http
      .post(URL, egreso, {responseType: 'text', withCredentials: true})
      .pipe();
  }

  public cambiarPiso(cambioPiso: CambioPiso): Observable<any> {
    const URL = `${this.url}${this.port}/api_novedades/novedad/novedadPiso`;
    return this.http
      .post(URL, cambioPiso, {responseType: 'text', withCredentials: true})
      .pipe();
  }

  public cambiarDiagnostico(
    cambioDiagnostico: DiagnosticoRequest
  ): Observable<any> {
    const URL = `${this.url}${
      this.port
      }/api_novedades/novedad/novedadDiagnosticos`;
    return this.http
      .post(URL, cambioDiagnostico, {
        responseType: 'text',
        withCredentials: true
      })
      .pipe();
  }

  public cambiarDatosAtencion(
    datosAtencion: DatosAtencionPacienteRequest
  ): Observable<any> {
    const URL = `${this.url}${
      this.port
      }/api_novedades/novedad/novedadDatosAtencionPaciente`;
    return this.http
      .post(URL, datosAtencion, {responseType: 'text', withCredentials: true})
      .pipe();
  }

  public cancelarVisita(cancelaVisita: CancelaCita): Observable<any> {
    const URL = `${this.url}${
      this.port
      }/api_novedades/novedad/novedadCancelaVisita`;
    return this.http
      .post(URL, cancelaVisita, {responseType: 'text', withCredentials: true})
      .pipe();
  }

  public solicitarEquipoBiomedico(
    equiposBiomedicos: Array<EquipoBiomedico>
  ): Observable<any> {
    const URL = `${this.url}${
      this.port
      }/api_novedades/novedad/novedadEquipoBiomedico`;
    return this.http
      .post(URL, equiposBiomedicos, {
        responseType: 'text',
        withCredentials: true
      })
      .pipe();
  }

  public aplicarAplicacionCuidador(
    aplicacionCuidador: AplicacionCuidador
  ): Observable<any> {
    const URL = `${this.url}${
      this.port
      }/api_novedades/novedad/novedadAplicacionCuidador`;
    return this.http
      .post(URL, aplicacionCuidador, {
        responseType: 'text',
        withCredentials: true
      })
      .pipe();
  }

  public getAgregadoInformacionPaciente(idNovedad: string): Observable<any> {
    const URL = `${this.url}${
      this.port
      }/api_novedades/novedad/informacionPaciente/${idNovedad}`;
    return this.http.get<any>(URL, {withCredentials: true}).pipe();
  }

  public getAgregadoPlanManejo(idNovedad: string): Observable<PlanManejo> {
    const URL = `${this.url}${
      this.port
      }/api_novedades/novedad/planManejoDosisFaltante/${idNovedad}`;
    return this.http.get<PlanManejo>(URL, {withCredentials: true}).pipe();
  }

  public getAgregadoPlanManejoHistorial(
    idNovedad: string
  ): Observable<PlanManejo> {
    const URL = `${this.url}${
      this.port
      }/api_novedades/novedad/planManejo/${idNovedad}`;
    return this.http.get<PlanManejo>(URL, {withCredentials: true});
  }

  public getAgregadoCitas(idNovedad: string): Observable<any> {
    const URL = `${this.url}${
      this.port
      }/api_novedades/novedad/citasDosisFaltantes/${idNovedad}`;
    return this.http.get<any>(URL, {withCredentials: true});
  }

  public getAgregadoCitasHistorial(idNovedad: string): Observable<any> {
    const URL = `${this.url}${
      this.port
      }/api_novedades/novedad/citas/${idNovedad}`;
    return this.http.get<any>(URL, {withCredentials: true}).pipe();
  }

  public getAgregadoRemision(idRemisionPK: string): Observable<any> {
    const URL = `${this.url}${
      this.port
      }/api_novedades/novedad/remision/${idRemisionPK}`;
    return this.http.get<any>(URL, {withCredentials: true}).pipe();
  }

  public getAgregadoDiagnostico(idNovedad: string): Observable<any> {
    const URL = `${this.url}${
      this.port
      }/api_novedades/novedad/diagnosticos/${idNovedad}`;
    return this.http.get<any>(URL, {withCredentials: true}).pipe();
  }

  public getAgregadoEquipoBiomedico(idRemision: string): Observable<any> {
    const URL = `${this.url}${
      this.port
      }/api_novedades/equipoBioMedicos/consultarUltimoRegistro/${idRemision}`;
    return this.http.get<any>(URL, {withCredentials: true}).pipe();
  }

  public gestionarNovedadManual(
    novedad: GestionarNovedadRequest
  ): Observable<any> {
    //const URL = 'http://local.saludencasa.com.co:8090/api_novedades/novedad/GestionarNovedadManual'
    const URL = `${this.url}${
      this.port
      }/api_novedades/novedad/GestionarNovedadManual`;
    return this.http
      .post(URL, novedad, {responseType: 'text', withCredentials: true})
      .pipe();
  }

  public guardarCita(cita: CitasPacienteRequest): Observable<any> {
    const URL = `${this.url}${this.port}/api_novedades/novedad/novedadCitas`;
    //const URL = `http://local.saludencasa.com.co:8090/api_novedades/novedad/novedadCitas`;
    return this.http
      .post(URL, cita, {responseType: 'text', withCredentials: true})
      .pipe();
  }

  public getRemisionPaciente(
    consulta: ConsultaRemisionRequest
  ): Observable<any> {
    const URL = `${this.url}${
      this.port
      }/api_novedades/novedad/consultarHistoriaRemisionesPaciente`;
    return this.http.post(URL, consulta, {withCredentials: true}).pipe();
  }

  public getNovedadRemision(idRemision: string): Observable<any> {
    const URL = `${this.url}${
      this.port
      }/api_novedades/novedad/consultarNovedadesPorRemision/${idRemision}`;
    return this.http.get<any>(URL, {withCredentials: true}).pipe();
  }

  /**
   * Guarda la alerta de la cita
   * @param {AlertaVisita} alerta
   * @returns {Observable<any>}
   */
  public guardarNovedadAlerta(alerta: AlertaVisita): Observable<any> {
    const URL = `${this.url}${
      this.port
      }/api_novedades/novedad/novedadalertavisita`;
    return this.http.post(URL, alerta, {
      responseType: 'text',
      withCredentials: true
    });
  }

  public consultarBandejas(filtros: FiltrosBandeja): Observable<any> {
    console.log(filtros);
    const URL = `${this.url}${
      this.port
      }/api_novedades/bandejas/consultarBandeja`;

    const operador = 'eq';
    const tipoIdentificacion = `tipoIdentificacion=${operador}:${
      filtros.tipoIdentificacion
      }&`;
    const numeroIdentificacion = `numeroIdentificacion=${operador}:${
      filtros.numeroIdentificacion
      }&`;
    const remision = `remision=${filtros.remision}&`;
    const estado = `estado=${operador}:${filtros.estado}&`;
    const fechaInicio = `usuario=${operador}:${filtros.fechaInicio}&`;
    const fechaFin = `usuario=${operador}:${filtros.fechaFin}&`;
    const ciudad = `ciudad=${operador}:${filtros.ciudad}&`;
    const bandeja = `bandeja=${operador}:${filtros.bandeja}&`;
    const planSalud = `planSalud=${operador}:${filtros.planSalud}&`;
    const institucionRemite = `institucionRemite=${operador}:${
      filtros.institucionRemite
      }&`;

    const pageSize = `page=${filtros.page}&size=${filtros.size}`;

    let parametros = '';

    if (filtros.tipoIdentificacion != null) {
      parametros = parametros.concat(tipoIdentificacion);
    }
    if (filtros.planSalud != null) {
      parametros = parametros.concat(planSalud);
    }
    if (filtros.institucionRemite != null) {
      parametros = parametros.concat(institucionRemite);
    }
    if (filtros.numeroIdentificacion != null) {
      parametros = parametros.concat(numeroIdentificacion);
    }
    if (filtros.remision != null) {
      parametros = parametros.concat(remision);
    }
    if (filtros.estado != null) {
      parametros = parametros.concat(estado);
    }
    if (filtros.fechaInicio != null) {
      parametros = parametros.concat(fechaInicio);
    }
    if (filtros.fechaFin != null) {
      parametros = parametros.concat(fechaFin);
    }
    if (filtros.ciudad != null) {
      parametros = parametros.concat(ciudad);
    }

    parametros = parametros.concat(bandeja);
    parametros = parametros.concat(pageSize);

    return this.http
      .get<any>(URL.concat(`?${parametros}`), {withCredentials: true})
      .pipe();
  }

  public consultarPlanManejoBandejaMedicamentos(idNovedad: string): Observable<any> {
    const URL = `${this.url}${this.port}/api_novedades/novedad/consultarPlanManejoPorNovedad/${idNovedad}`;
    return this.http.get<any>(URL, {withCredentials: true}).pipe();
  }

  public actualizarEstadoBandeja(idRemision: string): Observable<any> {
    const URL = `${this.url}${this.port}/api_novedades/bandejas/actualizarEstadoBandeja/${idRemision}`;
    return this.http.get<any>(URL, {withCredentials: true}).pipe();
  }

  public getPacientesGestionar(filtrosGestionNovedad: FiltrosGestionNovedadesRequest): Observable<any> {
    const URL = `${this.url}${this.port}/api_novedades/novedad/consultarEstadoActualNovedad`;

    const operador = 'eq';
    const tipoIdentificacion = `tipoIdentificacion=${operador}:${filtrosGestionNovedad.tipoIdentificacion}&`;
    const numeroIdentificacion = `numeroIdentificacion=${operador}:${filtrosGestionNovedad.numeroIdentificacion}&`;
    const ciudad = `ciudad=${operador}:${filtrosGestionNovedad.ciudad}&`;
    const piso = `piso=${filtrosGestionNovedad.pisos}&`;
    let estadoFinal = '';

    if (filtrosGestionNovedad.estado != null) {
      switch (filtrosGestionNovedad.estado) {
        case 'ACTIVO':
          estadoFinal = 'Activo';
          break;
        case 'ALTA':
          estadoFinal = 'Alta';
          break;
        case 'NUEVO':
          estadoFinal = 'Nuevo';
          break;
        case 'PRE ALTA':
          estadoFinal = 'PreAlta';
          break;
      }
    }

    const estado = `estado=${operador}:${estadoFinal}&`;
    const pageSize = `page=${filtrosGestionNovedad.page}&size=${filtrosGestionNovedad.size}`;

    let parametros = '';

    if (filtrosGestionNovedad.tipoIdentificacion != null) {
      parametros = parametros.concat(tipoIdentificacion);
    }
    if (filtrosGestionNovedad.numeroIdentificacion != null) {
      parametros = parametros.concat(numeroIdentificacion);
    }
    if (filtrosGestionNovedad.ciudad != null) {
      parametros = parametros.concat(ciudad);
    }
    if (filtrosGestionNovedad.pisos != null) {
      parametros = parametros.concat(piso);
    }
    if (filtrosGestionNovedad.estado != null) {
      parametros = parametros.concat(estado);
    }

    parametros = parametros.concat(pageSize);

    return this.http.get<any>(URL.concat(`?${parametros}`), {withCredentials: true}).pipe();
  }

  public getTotalRegistrosPaciente(): Observable<any> {
    const URL = `${this.url}${this.port}/api_novedades/novedad/totalRegistrosPaciente`;
    return this.http.get<any>(URL, {withCredentials: true}).pipe();
  }

  /**
   * fija o desfija las visitas
   */
  public fijarDesfijarVisita(request: any): Observable<any> {
    const URL = `${this.url}${this.port}/api_novedades/novedad/novedadFijarCita`;
    return this.http.post(URL, request, {responseType: 'text', withCredentials: true}).pipe();
  }

  public consultarUltimaCitaRemision(idRemision: string): Observable<any> {
    const URL = `${this.url}${this.port}/api_programacion/programacion/consultarUltimaCita/${idRemision}`;
    return this.http.get(URL, {withCredentials: true}).pipe();
  }

  public guardarRecursoPreferido(recursoPreferido: RecursoPreferidoRequest): Observable<any> {
    const URL = `${this.url}${this.port}/api_novedades/novedad/novedadAsignarProfesional`;
    //const URL = `http://local.saludencasa.com.co:8090/api_novedades/novedad/novedadAsignarProfesional`;
    return this.http.post(URL, recursoPreferido, {responseType: 'text', withCredentials: true}).pipe();
  }

  public quitarRecursoPreferido(recursoPreferido: RecursoPreferidoRequest): Observable<any> {
    const URL = `${this.url}${this.port}/api_novedades/novedad/novedadRetirarAsignacion`;
    //const URL = `http://local.saludencasa.com.co:8090/api_novedades/novedad/novedadRetirarAsignacion`;
    return this.http.post(URL, recursoPreferido, {responseType: 'text', withCredentials: true}).pipe();
  }

  public getAgregadoRecursoPreferido(idNovedad: string): Observable<any> {
    //const URL = `http://local.saludencasa.com.co:8090/api_novedades/novedad/recursoPreferido/${idNovedad}`;
    const URL = `${this.url}${this.port}/api_novedades/novedad/recursoPreferido/${idNovedad}`;
    return this.http.get(URL, {withCredentials: true}).pipe();

  }

}
