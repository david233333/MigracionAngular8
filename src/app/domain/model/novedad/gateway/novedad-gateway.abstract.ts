import {Observable} from 'rxjs/Observable';
import {ConsultaRemisionRequest} from '../../../../infraestructure/request-model/novedad/consulta-remision.request';
import {PlanManejo} from '../entity/plan-manejo/plan-manejo.model';
import {Egreso} from '../entity/egreso.model';
import {CambioPiso} from '../entity/cambio-piso.model';
import {DiagnosticoRequest} from '../../../../infraestructure/request-model/novedad/diagnostico.request';
import {DatosAtencionPacienteRequest} from '../../../../infraestructure/request-model/novedad/datos-atencion-paciente.request';
import {FiltrosGestionNovedadesRequest} from '../../../../infraestructure/request-model/novedad/filtros-gestion-novedad.request';
import {RemisionActivaResponse} from '../../../../infraestructure/response-model/novedad/remision-activa-response.response';
import {SolicitudNovedadesResponse} from '../../../../infraestructure/response-model/novedad/solicitud-novedad.response';
import {GestionarNovedadRequest} from '../../../../infraestructure/request-model/novedad/gestionar-novedad.request';
import {CitasPacienteRequest} from '../../../../infraestructure/request-model/novedad/citas-paciente.request';
import {PlanManejoRequest} from '../../../../infraestructure/request-model/novedad/plan-manejo.request';
import {AlertaVisita} from '../entity/alerta.model';
import {CancelaCita} from '../entity/cancela-cita.model';
import {EquipoBiomedico} from '../entity/equipo-biomedico.model';
import {AplicacionCuidador} from '../entity/aplicacion-cuidador.model';
import {FiltrosBandeja} from '../../../../infraestructure/request-model/novedad/FiltrosBandeja';
import {RecursoPreferidoRequest} from '../../../../infraestructure/request-model/novedad/recurso-preferido.request';
import { Usuario } from '../../../../shared/models/usuario.model';


export abstract class NovedadGatewayAbstract {

  abstract getNovedadesGestion(idRemision: string, tipoNovedad: string): Observable<SolicitudNovedadesResponse[]>;

  abstract getSolicitudesNovedades(filtrosGestionNovedad: FiltrosGestionNovedadesRequest): Observable<any>;
 
  //obtener solicitudes de gestion de novedades en la bandeja david
  abstract getSolicitudesNovedadesEdicion(idRemision: string): Observable<any>;

  abstract getSolicitudNovedad(idSolicitud: string): Observable<any>;

  abstract getConsultaRemision(consulta: ConsultaRemisionRequest): Observable<RemisionActivaResponse>;

  abstract getConsultaRemisionLineaUnica(consulta: ConsultaRemisionRequest): Observable<RemisionActivaResponse>;

  abstract cambiarPlanManejo(planManejo: PlanManejoRequest): Observable<any>;

  abstract egresarPaciente(egreso: Egreso): Observable<any>;

  abstract cambiarPiso(cambioPiso: CambioPiso): Observable<any>;

  abstract cambiarDiagnostico(diagnostico: DiagnosticoRequest): Observable<any>;

  abstract cambiarDatosAtencion(datosAtencion: DatosAtencionPacienteRequest): Observable<any>;

  abstract cancelarVisita(cancelaVisita: CancelaCita): Observable<any>;

  abstract solicitarEquipoBiomedico(equiposBiomedicos: Array<EquipoBiomedico>): Observable<any>;

  abstract aplicarAplicacionCuidador(aplicacionCuidador: AplicacionCuidador): Observable<any>;

  abstract getAgregadoInformacionPaciente(idNovedad: string): Observable<any>;

  abstract getAgregadoPlanManejo(idNovedad: string): Observable<PlanManejo>;

  abstract getAgregadoPlanManejoHistorial(idNovedad: string): Observable<PlanManejo>;

  abstract getAgregadoCitas(idNovedad: string): Observable<any>;

  abstract getAgregadoCitasHistorial(idNovedad: string): Observable<any>;

  abstract getAgregadoRemision(idRemisionPK: string): Observable<any>;

  abstract getAgregadoDiagnostico(idNovedad: string): Observable<any>;

  abstract getAgregadoEquipoBiomedico(idRemision: string): Observable<any>;

  abstract gestionarNovedadManual(novedad: GestionarNovedadRequest): Observable<any>;

  abstract guardarCita(novedad: CitasPacienteRequest): Observable<any>;

  abstract getRemisionPaciente(consulta: ConsultaRemisionRequest): Observable<any[]>;

  abstract getNovedadRemision(idRemision: string): Observable<any>;

  abstract guardarNovedadAlerta(alerta: AlertaVisita): Observable<any>;

  abstract consultarBandejas(filtros: FiltrosBandeja): Observable<any>;

  abstract consultarPlanManejoBandejaMedicamentos(idNovedad: string): Observable<any>;

  abstract actualizarEstadoBandeja(idRemision: string): Observable<any>;

  abstract getPacientesGestionar(filtrosGestionNovedad: FiltrosGestionNovedadesRequest): Observable<any>;

  abstract getTotalRegistrosPaciente(): Observable<any>;

  abstract fijarDesfijarVisita(request: any): Observable<any>;

  abstract consultarUltimaCitaRemision(idRemision: string): Observable<any>;

  abstract guardarRecursoPreferido(recursoPreferido: RecursoPreferidoRequest): Observable<any>;

  abstract quitarRecursoPreferido(recursoPreferido: RecursoPreferidoRequest): Observable<any>;

  abstract getAgregadoRecursoPreferido(idNovedad: string): Observable<any>;
}

