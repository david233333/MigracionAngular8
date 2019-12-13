import {Observable} from 'rxjs/Observable';


import {Maestro, MaestrosSec} from '../../../../infraestructure/comun/models/maestro.model';

import {Paciente} from '../../remision/entity/paciente.model';

import {TipoIdentificacion} from '../../maestro/entity/tipo-identificacion.model';
import {PlanSalud} from '../../maestro/entity/plan-salud.model';
import {Ciudad} from '../../maestro/entity/ciudad.model';
import {Piso} from '../../maestro/entity/piso.model';
import {Municipio} from '../../maestro/entity/municipio.model';
import {Institucion} from '../../maestro/entity/institucion.model';
import {Diagnostico} from '../../maestro/entity/diagnostico.model';
import {Peso} from '../../maestro/entity/peso.model';
import {Dosis} from '../../maestro/entity/dosis.model';
import {Frecuencia} from '../../maestro/entity/frecuencia.model';
import {ViaAdministracion} from '../../maestro/entity/via-administracion.model';
import {Medicamento} from '../../maestro/entity/medicamento.model';
import {MotivoEgreso} from '../../maestro/entity/motivo-egreso.model';
import {TipoPlanParticular} from '../../maestro/entity/tipo-plan-particular.model';
import {TipoNutricion} from '../../maestro/entity/tipo-nutricion.model';
import {TipoSondajeIngreso} from '../../maestro/entity/tipo-sondaje-ingreso.model';
import {TipoCuracion} from '../../maestro/entity/tipo-curacion.model';
import {TipoTerapia} from '../../maestro/entity/tipo-terapia.model';
import {Profesional} from '../../maestro/entity/profesional.model';
import {MotivoCancelacion} from '../../maestro/entity/motivo-cancelacion.model';
import {Programa} from '../../maestro/entity/programa.model';
import {DireccionRequest} from '../../maestro/entity/DireccionRequest';
import {GeoCode} from '../../maestro/entity/GeoCode';
import {Profesion} from '../../maestro/entity/profesion.model';
import {Genero} from '../../maestro/entity/genero.model';
import {CausasLlamadaNoContestada} from '../../maestro/entity/CausasLlamadaNoContestada';
import {TipoMuestra} from '../../maestro/entity/tipo-muestra.model';
import {TipoEquipoBiomedico} from '../../maestro/entity/tipo-equipo-biomedico.model';
import {MotivoAplicacionCuidador} from '../../maestro/entity/motivo-aplicacion-cuidador.model';
import {Proveedor} from '../../maestro/entity/proveedor.model';
import {EstadoEquipoBiomedico} from '../../maestro/entity/estado-equipo-biomedico.model';
import {TiposSoporteNutricional} from '../../maestro/entity/tipos-soporte-nutricional.model';
import {EstadoPaciente} from '../../maestro/entity/estado-paciente.model';
import {EstadoBandejaDinamica} from '../../maestro/entity/estado-bandeja-dinamica.model';
import {MotivoFijarCita} from '../../maestro/entity/motivo-fijar-cita.model';
import {RequestMaestro} from '../../../../view/maestros/RequestMaestro.model';

import {TipoSondajeNovedades} from '../../maestro/entity/tipo-sondaje-novedades.model';
import {Valoracion} from '../../maestro/entity/valoracion.model';

export abstract class ComunGatewayAbstract {

  abstract getTiposIdentificacion(): Observable<TipoIdentificacion[]>;

  abstract getPlanesSalud(): Observable<PlanSalud[]>;

  /* abstract getTiposPlanesSalud(): Observable<Maestro[]>;*/

  abstract getCiudades(): Observable<Ciudad[]>;

  abstract getProgramas(): Observable<Programa[]>;

  abstract getPisosCiudad(ciudad: string): Observable<Piso[]>;

  abstract getPisosCiudadTipoAtencion(ciudad: string, tipoAtencion: string, idPrograma: string): Observable<Piso[]>;

  abstract getMunicipio(nombreCiudad: string): Observable<Municipio[]>;

  abstract getDatosPaciente(plan: string, tipoDocumento: string, documento: string): Observable<Paciente>;

  abstract getInstituciones(idCiudad: string): Observable<Institucion[]>;

  abstract getDiagnosticos(nombre: string): Observable<Diagnostico[]>;

  abstract getConsentimiento(nombre: string, documento: string): Observable<string>;

  abstract getPeso(): Observable<Peso[]>;

  abstract getGeoReferenciacion(): Observable<Maestro[]>;

  abstract getProfesional(tipoDocumento: string, numeroDocumento: string): Observable<Profesional>;

  abstract getPaciente(tipoDocumento: string, numeroDocumento: string): Observable<any>;

  /*  abstract getPerfil(perfil: string): Observable<Perfil>;*/

  abstract getXYY(dataDireccion: DireccionRequest): Observable<GeoCode>;

  abstract getDetallesDeLugares(nombre: string, ciudad: string): Observable<any>;

  abstract getDosis(tipo: string): Observable<Dosis[]>;

  abstract getFrecuencias(tipo: string): Observable<Frecuencia[]>;

  abstract getViasAdministracion(tipo: string): Observable<ViaAdministracion[]>;

  abstract getMedicamentos(filtro: string): Observable<Medicamento[]>;

  abstract getMotivosEgreso(): Observable<MotivoEgreso[]>;

  abstract getMotivosCancelacion(): Observable<MotivoCancelacion[]>;

  abstract getTipoPlanParticular(): Observable<TipoPlanParticular[]>;

  abstract getTiposNutricion(): Observable<TipoNutricion[]>;

  abstract getTiposSondaje(): Observable<TipoSondajeIngreso[]>;

  abstract getGenero(): Observable<Genero[]>;

  abstract getSedes(idCiudad: string): Observable<any[]>;

  abstract getTiposSoporteNutricional(): Observable<TiposSoporteNutricional[]>;

  /******************************************************NOVEDADES*******************************************************/

  abstract getTiposIdentificacionNovedad(): Observable<TipoIdentificacion[]>;

  abstract getMotivosEgresoNovedad(): Observable<MotivoEgreso[]>;

  abstract getMotivosCancelacionCitaNovedad(): Observable<MotivoCancelacion[]>;

  abstract getCiudadesNovedad(): Observable<Ciudad[]>;

  abstract getMunicipiosNovedad(idCiudad: string): Observable<Municipio[]>;

  abstract getPisosCiudadNovedad(ciudad: string): Observable<Piso[]>;

  abstract getPisosCiudadTipoAtencionNovedad(ciudad: string, tipoAtencion: string, idPrograma: string): Observable<Piso[]>;

  abstract getDosisNovedad(tipo: string): Observable<Dosis[]>;

  abstract getFrecuenciasNovedad(tipo: string): Observable<Frecuencia[]>;

  abstract getViasAdministracionNovedad(tipo: string): Observable<ViaAdministracion[]>;

  abstract getCentroDeEstadiaTemporal(idCiudad: string): Observable<Maestro[]>;

  abstract getMedicamentosNovedad(filtro: string): Observable<Medicamento[]>;

  abstract getTiposNutricionNovedad(): Observable<TipoNutricion[]>;

  abstract getTiposCuracionesNovedad(): Observable<TipoCuracion[]>;

  abstract getTiposSondajeNovedad(): Observable<TipoSondajeIngreso[]>;

  abstract getTiposTerapiasNovedad(): Observable<TipoTerapia[]>;

  abstract getDatosPac(tipoIdentificacion: string, numeroIdentificacion: string): Observable<Maestro[]>;

  abstract getProfesionesNovedad(): Observable<Profesion[]>;

  abstract getProfesionesNovedadIdPrograma(idPrograma: string): Observable<Profesion[]>;

  abstract getDiagnosticosNovedad(filtro: string): Observable<Diagnostico[]>;

  abstract getTomasMuestraNovedad(): Observable<TipoMuestra[]>;

  abstract getTipoEquiposBiomedicosNovedad(): Observable<TipoEquipoBiomedico[]>;

  abstract getEstadosEquiposBiomedicosNovedad(idEstado: string, nombreUsuario: string): Observable<EstadoEquipoBiomedico[]>;

  abstract getMotivosAplicacionCuidadorNovedad(): Observable<MotivoAplicacionCuidador[]>;

  abstract getProveedoresEquiposBiomedicosNovedad(): Observable<Proveedor[]>;

  abstract getLlamadaNoContestada(): Observable<CausasLlamadaNoContestada[]>;

  abstract getTiposSoporteNutricionalNovedad(): Observable<TiposSoporteNutricional[]>;

  abstract getEstadosPacienteNovedad(): Observable<EstadoPaciente[]>;

  abstract getGeoReferenciacionNovedad(): Observable<Maestro[]>;

  abstract getEstadosBandejaDinamica(): Observable<EstadoBandejaDinamica[]>;

  abstract getMotivosFijacionCita(): Observable<MotivoFijarCita[]>;

  /******************************************************MAESTROS*******************************************************/

  /***Comunes en los dos microservicios*/
  abstract consultarCentroEstadiaTemporal(): Observable<any>;

  abstract consultarCiudad(): Observable<Ciudad[]>;

  abstract consultarDosis(): Observable<Dosis[]>;

  abstract consultarDiagnostico(): Observable<Diagnostico[]>;

  abstract consultarFrecuencia(): Observable<Frecuencia[]>;

  abstract consultarInstitucion(): Observable<Institucion[]>;

  abstract consultarMedicamento(): Observable<Medicamento[]>;

  abstract consultarMotivoCancelacion(): Observable<MotivoCancelacion[]>;

  abstract consultarMunicipio(): Observable<Municipio[]>;

  abstract consultarPiso(): Observable<Piso[]>;

  abstract consultarPlanSalud(): Observable<PlanSalud[]>;

  abstract consultarTipoNutricion(): Observable<TipoNutricion[]>;

  abstract consultarTipoIdentificacion(): Observable<TipoIdentificacion[]>;

  abstract consultarTipoSoporteNutricional(): Observable<TiposSoporteNutricional[]>;

  abstract consultarViaAdministracion(): Observable<ViaAdministracion[]>;

  /***Solo Novedades*/

  abstract consultarCausasLlamadas(): Observable<CausasLlamadaNoContestada[]>;

  abstract consultarEstadoPaciente(): Observable<EstadoPaciente[]>;

  abstract consultarMotivoAplicacionCuidador(): Observable<MotivoAplicacionCuidador[]>;

  abstract consultarMotivoFijarCita(): Observable<MotivoFijarCita[]>;

  abstract consultarNovedadPorTipoAdmision(): Observable<any[]>;

  abstract consultarPermisosTerceros(): Observable<any[]>;

  abstract consultarProveedor(): Observable<Proveedor[]>;

  abstract consultarTipoCuracion(): Observable<TipoCuracion[]>;

  abstract consultarSedesSaludEnCasa(): Observable<any[]>;

  abstract consultarTipoEquipoMedico(): Observable<TipoEquipoBiomedico[]>;

  abstract consultarTipoMuestra(): Observable<TipoMuestra[]>;

  abstract consultarTipoTerapia(): Observable<TipoTerapia[]>;

  abstract consultarTipoPlanParticular(): Observable<any[]>;

  abstract consultarPrograma(): Observable<Programa[]>;

  abstract consultarProfesional(): Observable<Profesional[]>;

  abstract consultarValoraciones(): Observable<Valoracion[]>;

  abstract consultarTipoSondajeIngreso(): Observable<TipoSondajeIngreso[]>;

  abstract consultarValidacionOPC(): Observable<any[]>;

  abstract consultarMotivoEgreso(): Observable<MotivoEgreso[]>;

  abstract consultarTipoSondajeNovedades(): Observable<TipoSondajeNovedades[]>;

}
