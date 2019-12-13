import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {RemisionGatewayAbstract} from '../../model/remision/gateway/remision-gateway.abstract';
import {ComunGatewayAbstract} from '../../model/comun/gateway/comun-gateway.abstract';
import {Dosis} from '../../model/maestro/entity/dosis.model';
import {Frecuencia} from '../../model/maestro/entity/frecuencia.model';
import {ViaAdministracion} from '../../model/maestro/entity/via-administracion.model';
import {PlanManejo} from '../../model/remision/entity/plan-manejo/plan-manejo.model';
import {TipoNutricion} from '../../model/maestro/entity/tipo-nutricion.model';
import {TipoSondajeIngreso} from '../../model/maestro/entity/tipo-sondaje-ingreso.model';
import {Medicamento} from '../../model/maestro/entity/medicamento.model';
import {TiposSoporteNutricional} from '../../model/maestro/entity/tipos-soporte-nutricional.model';
import {Ciudad} from '../../model/maestro/entity/ciudad.model';
import {Diagnostico} from '../../model/maestro/entity/diagnostico.model';
import {Institucion} from '../../model/maestro/entity/institucion.model';
import {MotivoCancelacion} from '../../model/maestro/entity/motivo-cancelacion.model';
import {Municipio} from '../../model/maestro/entity/municipio.model';
import {Piso} from '../../model/maestro/entity/piso.model';
import {PlanSalud} from '../../model/maestro/entity/plan-salud.model';
import {TipoIdentificacion} from '../../model/maestro/entity/tipo-identificacion.model';
import {CausasLlamadaNoContestada} from '../../model/maestro/entity/CausasLlamadaNoContestada';
import {EstadoPaciente} from '../../model/maestro/entity/estado-paciente.model';
import {MotivoAplicacionCuidador} from '../../model/maestro/entity/motivo-aplicacion-cuidador.model';
import {MotivoFijarCita} from '../../model/maestro/entity/motivo-fijar-cita.model';
import {Proveedor} from '../../model/maestro/entity/proveedor.model';
import {TipoCuracion} from '../../model/maestro/entity/tipo-curacion.model';
import {TipoEquipoBiomedico} from '../../model/maestro/entity/tipo-equipo-biomedico.model';
import {TipoMuestra} from '../../model/maestro/entity/tipo-muestra.model';
import {TipoTerapia} from '../../model/maestro/entity/tipo-terapia.model';
import {Programa} from '../../model/maestro/entity/programa.model';
import {Profesional} from '../../model/maestro/entity/profesional.model';
import {MotivoEgreso} from '../../model/maestro/entity/motivo-egreso.model';
import {TipoSondajeNovedades} from '../../model/maestro/entity/tipo-sondaje-novedades.model';
import {Valoracion} from '../../model/maestro/entity/valoracion.model';


@Injectable()
export class PlanManejoService {
  constructor(
    private remisionService: RemisionGatewayAbstract,
    private comunService: ComunGatewayAbstract) {
  }

  /**
   * Obtiene las dosis
   * @param {string} tipo
   * @returns {Observable<Dosis[]>}
   */
  public getDosis(tipo: string): Observable<Dosis[]> {
    return this.comunService.getDosis(tipo);
  }

  /**
   * Obtiene las frecuencias
   * @param {string} tipo
   * @returns {Observable<Frecuencia[]>}
   */
  public getFrecuencias(tipo: string): Observable<Frecuencia[]> {
    return this.comunService.getFrecuencias(tipo);
  }

  /**
   * Obtiene las dosis
   * @param {string} tipo
   * @returns {Observable<ViaAdministracion[]>}
   */
  public getViasAdministracion(tipo: string): Observable<ViaAdministracion[]> {
    return this.comunService.getViasAdministracion(tipo);
  }

  /**
   * Obtiene los medicamentos
   * @returns {Observable<Medicamento>}
   */
  public getMedicamentos(filtro: string): Observable<Medicamento[]> {
    return this.comunService.getMedicamentos(filtro);
  }


  /**
   * Obtiene los tratamientos
   * @returns {Observable<Valoracion[]>}
   */
  public getValoraciones(): Observable<Valoracion[]> {
    return this.remisionService.getValoraciones();
  }

  /**
   * Obtiene los tratamientos
   * @returns {Observable<Valoracion[]>}
   */
  public getValoracionesPorTipo(tipo: string): Observable<Valoracion[]> {
    return this.remisionService.getValoracionesPorTipo(tipo);
  }

  /**
   * Obtiene los tipos de nutrición
   * @returns {Observable<TipoNutricion[]}
   */
  public getTiposNutricion(): Observable<TipoNutricion[]> {
    return this.comunService.getTiposNutricion();
  }

  /**
   * Obtiene los tipos de sondaje
   * @returns {Observable<TipoSondajeIngreso[]}
   */
  public getTiposSondaje(): Observable<TipoSondajeIngreso[]> {
    return this.comunService.getTiposSondaje();
  }

  public getPlanManejoAgregado(idRemision: string): Observable<PlanManejo> {
    return this.remisionService.getPlanManejoAgregado(idRemision);
  }

  /**
   * Obtiene los tipos de soporte nutricional
   * @returns {Observable<TiposSoporteNutricional[]}
   */
  public getTiposSoporteNutricional(): Observable<TiposSoporteNutricional[]> {
    return this.comunService.getTiposSoporteNutricional();
  }

  public consultarCentroEstadiaTemporal(): Observable<any> {
    return null;
  }

  public consultarCiudad(): Observable<Ciudad[]> {
    return this.comunService.consultarCiudad();
  }


  public consultarDosis(): Observable<Dosis[]> {
    return this.comunService.consultarDosis();
  }

  public consultarDiagnostico(): Observable<Diagnostico[]> {
    return this.comunService.consultarDiagnostico();
  }


  public consultarFrecuencia(): Observable<Frecuencia[]> {
    return this.comunService.consultarFrecuencia();
  }


  public consultarInstitucion(): Observable<Institucion[]> {
    return this.comunService.consultarInstitucion();
  }

  public consultarMedicamento(): Observable<Medicamento[]> {
    return this.comunService.consultarMedicamento();
  }


  public consultarMotivoCancelacion(): Observable<MotivoCancelacion[]> {
    return this.comunService.consultarMotivoCancelacion();
  }

  public consultarMunicipio(): Observable<Municipio[]> {
    return this.comunService.consultarMunicipio();
  }


  public consultarPiso(): Observable<Piso[]> {
    return this.comunService.consultarPiso();
  }


  public consultarPlanSalud(): Observable<PlanSalud[]> {
    return this.comunService.consultarPlanSalud();
  }


  public consultarTipoNutricion(): Observable<TipoNutricion[]> {
    return this.comunService.consultarTipoNutricion();
  }


  public consultarTipoIdentificacion(): Observable<TipoIdentificacion[]> {
    return this.comunService.consultarTipoIdentificacion();
  }


  public consultarTipoSoporteNutricional(): Observable<TiposSoporteNutricional[]> {
    return this.comunService.consultarTipoSoporteNutricional();
  }


  public consultarViaAdministracion(): Observable<ViaAdministracion[]> {
    return this.comunService.consultarViaAdministracion();
  }

  /***Solo Novedades*/

  public consultarCausasLlamadas(): Observable<CausasLlamadaNoContestada[]> {
    return this.comunService.consultarCausasLlamadas();
  }


  public consultarEstadoPaciente(): Observable<EstadoPaciente[]> {
    return this.comunService.consultarEstadoPaciente();
  }


  public consultarMotivoAplicacionCuidador(): Observable<MotivoAplicacionCuidador[]> {
    return this.comunService.consultarMotivoAplicacionCuidador();
  }

  public consultarMotivoFijarCita(): Observable<MotivoFijarCita[]> {
    return this.comunService.consultarMotivoFijarCita();
  }


  public consultarNovedadPorTipoAdmision(): Observable<any[]> {
    return this.comunService.consultarMotivoFijarCita();
  }


  public consultarPermisosTerceros(): Observable<any[]> {
    return this.comunService.consultarPermisosTerceros();
  }

  public consultarProveedor(): Observable<Proveedor[]> {
    return this.comunService.consultarProveedor();
  }

  public consultarTipoCuracion(): Observable<TipoCuracion[]> {
    return this.comunService.consultarTipoCuracion();
  }


  public consultarSedesSaludEnCasa(): Observable<any[]> {
    return this.comunService.consultarSedesSaludEnCasa();
  }


  public consultarTipoEquipoMedico(): Observable<TipoEquipoBiomedico[]> {
    return this.comunService.consultarTipoEquipoMedico();
  }

  public consultarTipoMuestra(): Observable<TipoMuestra[]> {
    return this.comunService.consultarTipoMuestra();
  }


  public consultarTipoTerapia(): Observable<TipoTerapia[]> {
    return this.comunService.consultarTipoTerapia();
  }


  public consultarTipoPlanParticular(): Observable<any[]> {
    return this.comunService.consultarTipoPlanParticular();
  }

  public consultarPrograma(): Observable<Programa[]> {
    return this.comunService.consultarPrograma();
  }

  public consultarProfesional(): Observable<Profesional[]> {
    return this.comunService.consultarProfesional();
  }

  public consultarValoraciones(): Observable<Valoracion[]> {
    return this.comunService.consultarValoraciones();
  }


  public consultarTipoSondajeIngreso(): Observable<TipoSondajeIngreso[]> {
    return this.comunService.consultarTipoSondajeIngreso();
  }

  public consultarValidacionOPC(): Observable<any[]> {
    return this.comunService.consultarValidacionOPC();
  }


  public consultarMotivoEgreso(): Observable<MotivoEgreso[]> {
    return this.comunService.consultarMotivoEgreso();
  }


  public consultarTipoSondajeNovedades(): Observable<TipoSondajeNovedades[]> {
    return this.comunService.consultarTipoSondajeNovedades();
  }
}
