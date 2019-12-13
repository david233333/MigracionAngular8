import {Observable} from 'rxjs/Observable';
import {Maestro} from '../../../../infraestructure/comun/models/maestro.model';
import {Remision} from '../entity/remision.model';
import {MotivoCancelacion} from '../../maestro/entity/motivo-cancelacion.model';
import {Valoracion} from '../../maestro/entity/valoracion.model';
import {Admision} from '../entity/admision.model';
import {PlanManejo} from '../entity/plan-manejo/plan-manejo.model';
import {FiltrosRemisionesRequest} from '../../../../infraestructure/request-model/remision/filtros-remisiones.request';
import {InformeRemisionesRequest} from '../../../../infraestructure/request-model/remision/informe-remisiones.request';

export abstract class RemisionGatewayAbstract {
  abstract guardarRemision(data: any): Observable<string>;

  abstract admitir(data: any): Observable<any>;

  abstract getMotivoCancelacion(): Observable<MotivoCancelacion[]>;

  abstract cancelarRemision(entidad: Remision): Observable<Remision>;

  abstract getRemisiones(filtroslistaRemisiones: FiltrosRemisionesRequest): Observable<any>;

  abstract generarRemision(): Observable<any>;

  abstract getReporteRemision(idRemisionPk: string): Observable<any>;

  abstract getagregadoPaciente(idRemisionPk: string): Observable<any>;

  abstract getagregadoDatosDeAtencion( idRemisionPk: string): Observable<Maestro[]>;

  abstract getagregadoRemision(idRemisionPk: string): Observable<Maestro[]>;

  abstract getAgregadoDiagnostico(idRemision: string): Observable<Maestro[]>;

  abstract getAgregadoDatosRemision(idRemision: string): Observable<Maestro[]>;

  abstract getValoraciones(): Observable<Valoracion[]>;

  abstract getValoracionesPorTipo(tipo: string): Observable<Valoracion[]>;

  abstract getPlanManejoAgregado(idRemision: string): Observable<PlanManejo>;

  abstract getAdmisionAgregado(idRemision: string): Observable<Admision>;

  abstract consultarInformeRemisiones(request: InformeRemisionesRequest): Observable<any>;


}
