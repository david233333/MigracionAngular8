import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ConfiguracionService} from '../../shared/services/configuracion.service';

import {MaestrosEnum} from '../../shared/utils/enums/maestros.enum';
import {TipoIdentificacion} from '../../domain/model/maestro/entity/tipo-identificacion.model';
import {PlanSalud} from '../../domain/model/maestro/entity/plan-salud.model';
import {Piso} from '../../domain/model/maestro/entity/piso.model';
import {Ciudad} from '../../domain/model/maestro/entity/ciudad.model';
import {Paciente} from '../../domain/model/remision/entity/paciente.model';
import {Institucion} from '../../domain/model/maestro/entity/institucion.model';
import {Diagnostico} from '../../domain/model/maestro/entity/diagnostico.model';
import {Peso} from '../../domain/model/maestro/entity/peso.model';
import {Profesional} from '../../domain/model/maestro/entity/profesional.model';
import {Municipio} from '../../domain/model/maestro/entity/municipio.model';
import {Dosis} from '../../domain/model/maestro/entity/dosis.model';
import {Frecuencia} from '../../domain/model/maestro/entity/frecuencia.model';
import {ViaAdministracion} from '../../domain/model/maestro/entity/via-administracion.model';
import {Medicamento} from '../../domain/model/maestro/entity/medicamento.model';
import {Maestro} from './models/maestro.model';
import {MotivoEgreso} from '../../domain/model/maestro/entity/motivo-egreso.model';
import {MotivoCancelacion} from '../../domain/model/maestro/entity/motivo-cancelacion.model';

import {TipoNutricion} from '../../domain/model/maestro/entity/tipo-nutricion.model';
import {TipoSondajeIngreso} from '../../domain/model/maestro/entity/tipo-sondaje-ingreso.model';
import {TipoPlanParticular} from '../../domain/model/maestro/entity/tipo-plan-particular.model';
import {TipoCuracion} from '../../domain/model/maestro/entity/tipo-curacion.model';
import {TipoTerapia} from '../../domain/model/maestro/entity/tipo-terapia.model';
import {Programa} from '../../domain/model/maestro/entity/programa.model';
import {DireccionRequest} from '../../domain/model/maestro/entity/DireccionRequest';
import {GeoCode} from '../../domain/model/maestro/entity/GeoCode';
import {Profesion} from '../../domain/model/maestro/entity/profesion.model';
import {Genero} from '../../domain/model/maestro/entity/genero.model';
import {CausasLlamadaNoContestada} from '../../domain/model/maestro/entity/CausasLlamadaNoContestada';
import {TipoMuestra} from '../../domain/model/maestro/entity/tipo-muestra.model';
import {TipoEquipoBiomedico} from '../../domain/model/maestro/entity/tipo-equipo-biomedico.model';
import {MotivoAplicacionCuidador} from '../../domain/model/maestro/entity/motivo-aplicacion-cuidador.model';
import {Proveedor} from '../../domain/model/maestro/entity/proveedor.model';
import {EstadoEquipoBiomedico} from '../../domain/model/maestro/entity/estado-equipo-biomedico.model';
import {TiposSoporteNutricional} from '../../domain/model/maestro/entity/tipos-soporte-nutricional.model';
import {EstadoPaciente} from '../../domain/model/maestro/entity/estado-paciente.model';
import {EstadoBandejaDinamica} from '../../domain/model/maestro/entity/estado-bandeja-dinamica.model';
import {MotivoFijarCita} from '../../domain/model/maestro/entity/motivo-fijar-cita.model';
import {ApiKeyEnum} from '../../shared/utils/enums/apiKey.enum';
import {RequestMaestro} from '../../view/maestros/RequestMaestro.model';
import {TipoSondajeNovedades} from '../../domain/model/maestro/entity/tipo-sondaje-novedades.model';
import {ComunGatewayAbstract} from '../../domain/model/comun/gateway/comun-gateway.abstract';
import {Valoracion} from '../../domain/model/maestro/entity/valoracion.model';


@Injectable()
export class ComunService extends ComunGatewayAbstract {

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
   * Consulta los tipos de identificacion
   * @returns {Observable<TipoIdentificacion[]>}
   */
  public getTiposIdentificacion(): Observable<TipoIdentificacion[]> {
    const url = `${this.url}${this.port}/api_ingreso/maestros/tiposIdentificacion`;
    return this.http.get<TipoIdentificacion[]>(url, {withCredentials: true}).pipe();
  }


  /**
   * Consulta los planes de salud
   * @returns {Observable<PlanSalud[]>}
   */
  public getPlanesSalud(): Observable<PlanSalud[]> {
    const url = `${this.url}${this.port}/api_ingreso/maestros/planesSalud`;
    return this.http.get<PlanSalud[]>(url, {withCredentials: true}).pipe();
  }

  /**
   * Consulta los programas
   * @returns {Observable<Programa[]>}
   */
  public getProgramas(): Observable<Programa[]> {
    const url = `${this.url}${this.port}/api_ingreso/maestros/${MaestrosEnum.programas}`;
    return this.http.get<Programa[]>(url, {withCredentials: true}).pipe();
  }

  /**
   * Consulta los Pisos por Ciudad
   * @returns {Observable<Piso[]>}
   */

  public getPisosCiudad(ciudad: string): Observable<Piso[]> {
    const url = `${this.url}${this.port}/api_ingreso/maestros/${MaestrosEnum.pisos}/${ciudad}`;
    return this.http.get<Piso[]>(url, {withCredentials: true}).pipe();

  }

  /**
   * Consulta los Pisos por Ciudad
   * @returns {Observable<Piso[]>}
   */

  public getPisosCiudadTipoAtencion(ciudad: string, tipoAtencion: string, idPrograma: string): Observable<Piso[]> {
    const url = `${this.url}${this.port}/api_ingreso/maestros/${MaestrosEnum.pisos}/${ciudad}/${tipoAtencion}/${idPrograma}`;
    return this.http.get<Piso[]>(url, {withCredentials: true}).pipe();
  }

  /**
   * Consulta los Pisos por Ciudad
   * @returns {Observable<Piso[]>}
   */

  public getPisosPorCiudadAdmision(ciudad: string, tipoAtencion: string): Observable<Piso[]> {
    const url = `${this.url}${this.port}/api_ingreso/maestros/${MaestrosEnum.pisos}/${ciudad}/${tipoAtencion}`;
    return this.http.get<Piso[]>(url, {withCredentials: true}).pipe();

  }

  /**
   * Consulta las ciudades
   * @returns {Observable<Ciudad[]>}
   */
  public getCiudades(): Observable<Ciudad[]> {

    const url = `${this.url}${this.port}/api_ingreso/maestros/${MaestrosEnum.ciudades}`;
    return this.http.get<Ciudad[]>(url, {withCredentials: true}).pipe();
  }

  /**
   * Consulta los datos del paciente
   * @param {number} plan
   * @param {string} tipoDocumento
   * @param {string} documento
   * @returns {Observable<Respuesta>}
   */


  public getDatosPaciente(plan: string, tipoDocumento: string, documento: string): Observable<Paciente> {
    const url = `${this.url}${this.port}/api_ingreso/paciente/${plan}/${tipoDocumento}/${documento}`;
    return this.http.get<Paciente>(url, {withCredentials: true}).pipe();

  }

  /**
   * Obtiene las instituciones por ciudad
   * @param {string} idCiudad
   * @returns {Observable<Institucion[]>}
   */
  public getInstituciones(nombreCiudad: string): Observable<Institucion[]> {
    const url = `${this.url}${this.port}/api_ingreso/maestros/${MaestrosEnum.instituciones}/${nombreCiudad}`;
    return this.http.get<Institucion[]>(url, {withCredentials: true}).pipe();
  }


  /**
   * Obtiene los diagnosticos
   * @param {string} idCiudad
   * @returns {Observable<Diagnostico[]>}
   */
  public getDiagnosticos(nombre: string): Observable<Diagnostico[]> {
    const url = `${this.url}${this.port}/api_ingreso/maestros/diagnosticos/${nombre}`;
    return this.http.get<Diagnostico[]>(url, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene el consentimiento
   * @param {string} nombre
   * @param {string} documento
   * @returns {Observable<Respuesta<string>>}
   */
  public getConsentimiento(nombre: string, documento: string): Observable<string> {
    const url = `${this.url}${this.port}/api_ingreso/consentimiento/${nombre}/${documento}`;
    return this.http.get<string>(url, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene los pesos en gramos o kilos
   * @returns {Observable<Peso[]>}
   */
  public getPeso(): Observable<Peso[]> {
    const url = `${this.url}${this.port}/api_ingreso/maestros/${MaestrosEnum.peso}`;
    return this.http.get<Peso[]>(url, {withCredentials: true}).pipe();
  }

  getGenero(): Observable<Genero[]> {
    const url = `${this.url}${this.port}/api_ingreso/maestros/${MaestrosEnum.generos}`;
    return this.http.get<Genero[]>(url, {withCredentials: true}).pipe();
  }

  /**
   * Consulta el profesional indicado
   * @param {string} tipoDocumento
   * @param {string} numeroDocumento
   * @returns {Observable<Respuesta>}
   */

  public getProfesional(tipoDocumento: string, numeroDocumento: string): Observable<Profesional> {
    const url = `${this.url}${this.port}/api_ingreso/profesional/${tipoDocumento}/${numeroDocumento}`;

    return this.http.get<Profesional>(url, {withCredentials: true}).pipe();
  }

  /**
   * Consulta el paciente indicado
   * @param {string} tipoDocumento
   * @param {string} numeroDocumento
   * @returns {Observable<Respuesta>}
   */

  public getPaciente(tipoDocumento: string, numeroDocumento: string): Observable<any> {
    const url = `${this.url}${this.port}/api_ingreso/paciente/${tipoDocumento}/${numeroDocumento}`;

    return this.http.get<any>(url, {withCredentials: true}).pipe();
  }


  getMunicipio(idCiudad: string): Observable<Municipio[]> {
    const url = `${this.url}${this.port}/api_ingreso/maestros/${MaestrosEnum.municipios}/${idCiudad}`;
    return this.http.get<Municipio[]>(url, {withCredentials: true}).pipe();
  }

  getXYY(dataDireccion: DireccionRequest): Observable<GeoCode> {
    const url = `https://sitidata-stdr.appspot.com/api/geocoder`;
    return this.http.post<GeoCode>(url, dataDireccion, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Token 4MHKKJDUW9Z07AIV2WH12FRGA4W8CD')
    }).pipe();
  }

  getDetallesDeLugares(nombre: string, ciudad: string): Observable<any> {
    const url = `${this.url}${this.port}/api_novedades/maestros/coordenadas`;
    return this.http.post<any>(url, {nombre, ciudad}, {withCredentials: true}).pipe();
  }


  getXYYGoogle(dataDireccion: DireccionRequest): Observable<GeoCode> {
    // tslint:disable-next-line:max-line-length
    const url = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAT0u-FE0w3y0MsrjKD-YQtsEyhyKzOmJY&libraries=places&callback=initAutocomplete`;
    return this.http.post<GeoCode>(url, dataDireccion, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token 4MHKKJDUW9Z07AIV2WH12FRGA4W8CD')
    }).pipe();
  }

  /**
   * Obtiene las unidades de dosis
   * @param {string} tipo
   * @returns {Observable<Dosis>}
   */
  public getDosis(tipo: string): Observable<Dosis[]> {
    const URL = `${this.url}${this.port}/api_ingreso/maestros/dosis/${tipo}`;

    return this.http.get<Dosis[]>(URL, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene las frecuencias
   * @param {string} tipo
   * @returns {Observable<Frecuencia[]>}
   */
  public getFrecuencias(tipo: string): Observable<Frecuencia[]> {
    const URL = `${this.url}${this.port}/api_ingreso/maestros/frecuencias/${tipo}`;

    return this.http.get<Frecuencia[]>(URL, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene las vías de administración
   * @param {string} tipo
   * @returns {Observable<ViaAdministracion>}
   */
  public getViasAdministracion(tipo: string): Observable<ViaAdministracion[]> {
    const URL = `${this.url}${this.port}/api_ingreso/maestros/viasAdministracion/${tipo}`;

    return this.http.get<ViaAdministracion[]>(URL, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene los medicamentos
   * @returns {Observable<Medicamento[]>}
   */
  public getMedicamentos(filtro: string): Observable<Medicamento[]> {
    const URL = `${this.url}${this.port}/api_ingreso/maestros/medicamentos/${filtro}`;

    return this.http.get<Medicamento[]>(URL, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene todos los datos de los tipos de vias
   * letra cruce, tipo via y puntos cardinales
   * @returns {Observable<Maestro[]>}
   */
  public getGeoReferenciacion(): Observable<Maestro[]> {
    const URL = `${this.url}${this.port}/api_ingreso/maestros/georeferenciacion`;
    return this.http.get<Maestro[]>(URL, {withCredentials: true}).pipe();
  }


  /**
   * Obtiene los motivos de egreso
   */
  public getMotivosEgreso(): Observable<MotivoEgreso[]> {
    const URL = `${this.url}${this.port}/api_ingreso/maestros/motivosEgreso`;
    return this.http.get<MotivoEgreso[]>(URL, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene los motivos de cancelación
   */
  public getMotivosCancelacion(): Observable<MotivoCancelacion[]> {
    const URL = `${this.url}${this.port}/api_ingreso/maestros/motivosCancelacion`;
    return this.http.get<MotivoCancelacion[]>(URL, {withCredentials: true}).pipe();
  }


  /**
   * Obtiene las valoraciones para el plan de manejo
   */
  public getValoraciones(): Observable<Valoracion[]> {
    const URL = `${this.url}${this.port}/api_ingreso/maestros/valoraciones`;
    return this.http.get<Valoracion[]>(URL, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene las valoraciones para el plan de manejo por tipo poliza
   */
  public getValoracionesPorTipo(tipo: string): Observable<Valoracion[]> {
    const URL = `${this.url}${this.port}/api_ingreso/maestros/valoraciones/${tipo}`;
    return this.http.get<Valoracion[]>(URL, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene los tipos de nutricion para remisión
   * @returns {Observable<TipoNutricion[]>}
   */
  public getTiposNutricion(): Observable<TipoNutricion[]> {
    const URL = `${this.url}${this.port}/api_ingreso/maestros/tiposNutricion`;
    return this.http.get<TipoNutricion[]>(URL, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene los tipos de sondaje para remisión
   * @returns {Observable<TipoSondajeIngreso[]>}
   */
  public getTiposSondaje(): Observable<TipoSondajeIngreso[]> {
    const URL = `${this.url}${this.port}/api_ingreso/maestros/tiposSondaje`;
    return this.http.get<TipoSondajeIngreso[]>(URL, {withCredentials: true}).pipe();
  }


  /**
   * Consulta sedes de salud en casa por ciudad
   * @returns {Observable<any[]>}
   */
  public getSedes(idPiso: string): Observable<any[]> {
    const url = `${this.url}${this.port}/api_ingreso/maestros/sedesSaludEnCasa/${idPiso}`;
    return this.http.get<any[]>(url, {withCredentials: true}).pipe();
  }

  /**
   * Consulta los tipos de soporte nutricional
   * @returns {Observable<TiposSoporteNutricional[]>}
   */
  public getTiposSoporteNutricional(): Observable<TiposSoporteNutricional[]> {
    const url = `${this.url}${this.port}/api_ingreso/maestros/tiposSoporteNutricional`;
    return this.http.get<TiposSoporteNutricional[]>(url, {withCredentials: true}).pipe();
  }

  /********************************************************NOVEDADES*****************************************************/

  /**
   * Consulta los tipos de identificacion para novedad
   * @returns {Observable<Respuesta>}
   */
  public getTiposIdentificacionNovedad(): Observable<TipoIdentificacion[]> {
    const url = `${this.url}${this.port}/api_novedades/maestros/tiposIdentificacion`;

    return this.http.get<TipoIdentificacion[]>(url, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene los motivos de egreso para novedad
   */
  public getMotivosEgresoNovedad(): Observable<MotivoEgreso[]> {
    const URL = `${this.url}${this.port}/api_novedades/maestros/motivosEgreso`;
    return this.http.get<MotivoEgreso[]>(URL, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene los motivos de cancelación cita para novedad
   */
  public getMotivosCancelacionCitaNovedad(): Observable<MotivoCancelacion[]> {
    const URL = `${this.url}${this.port}/api_novedades/maestros/motivosCancelacion`;
    return this.http.get<MotivoCancelacion[]>(URL, {withCredentials: true}).pipe();
  }

  /**
   * Consulta las ciudades para novedad
   * @returns {Observable<Ciudad>}
   */
  public getCiudadesNovedad(): Observable<Ciudad[]> {

    const url = `${this.url}${this.port}/api_novedades/maestros/${MaestrosEnum.ciudades}`;
    return this.http.get<Ciudad[]>(url, {withCredentials: true}).pipe();
  }

  /**
   * Consulta los municipios para novedad
   * @param {string} idCiudad
   * @returns {Observable<Municipio[]}
   */
  public getMunicipiosNovedad(idCiudad: string): Observable<Municipio[]> {
    const url = `${this.url}${this.port}/api_novedades/maestros/${MaestrosEnum.municipios}/${idCiudad}`;
    return this.http.get<Municipio[]>(url, {withCredentials: true}).pipe();
  }

  /**
   * Consulta los centro de estadía temporal por ciudad
   * @param {string} idCiudad
   * @returns {Observable<Maestro[]}
   */

  public getCentroDeEstadiaTemporal(idCiudad: string): Observable<Maestro[]> {
    const URL = `${this.url}${this.port}/api_ingreso/maestros/centrotemporal/${idCiudad}`;
    return this.http.get<Maestro[]>(URL, {withCredentials: true}).pipe();
  }


  /**
   * Consulta los Pisos por Ciudad para novedad
   * @returns {Observable<Piso[]>}
   */

  public getPisosCiudadNovedad(idCiudad: string): Observable<Piso[]> {
    const url = `${this.url}${this.port}/api_novedades/maestros/${MaestrosEnum.pisos}/${idCiudad}`;
    return this.http.get<Piso[]>(url, {withCredentials: true}).pipe();
  }


  /**
   * Consulta los Pisos por Ciudad y tipo atencion para novedad
   * @returns {Observable<Piso[]>}
   */

  public getPisosCiudadTipoAtencionNovedad(ciudad: string, tipoAtencion: string, idPrograma: string): Observable<Piso[]> {
    const url = `${this.url}${this.port}/api_novedades/maestros/${MaestrosEnum.pisos}/${ciudad}/${tipoAtencion}/${idPrograma}`;
    return this.http.get<Piso[]>(url, {withCredentials: true}).pipe();

  }

  /**
   * Obtiene las unidades de dosis para novedad
   * @param {string} tipo
   * @returns {Observable<Dosis[]>}
   */
  public getDosisNovedad(tipo: string): Observable<Dosis[]> {
    const URL = `${this.url}${this.port}/api_novedades/maestros/dosis/${tipo}`;

    return this.http.get<Dosis[]>(URL, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene las frecuencias para novedad
   * @param {string} tipo
   * @returns {Observable<Frecuencia[]>}
   */
  public getFrecuenciasNovedad(tipo: string): Observable<Frecuencia[]> {
    const URL = `${this.url}${this.port}/api_novedades/maestros/frecuencias/${tipo}`;

    return this.http.get<Frecuencia[]>(URL, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene las vías de administración para novedad
   * @param {string} tipo
   * @returns {Observable<ViaAdministracion[]>}
   */
  public getViasAdministracionNovedad(tipo: string): Observable<ViaAdministracion[]> {
    const URL = `${this.url}${this.port}/api_novedades/maestros/viasAdministracion/${tipo}`;

    return this.http.get<ViaAdministracion[]>(URL, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene los medicamentos para novedad
   * @returns {Observable<Medicamento[]>}
   */
  public getMedicamentosNovedad(filtro: string): Observable<Medicamento[]> {
    const URL = `${this.url}${this.port}/api_novedades/maestros/medicamentos/${filtro}`;
    return this.http.get<Medicamento[]>(URL, {withCredentials: true});
  }

  /**
   * Obtiene los tipo de plan particular
   * @returns {Observable<TipoPlanParticular[]>}
   */
  public getTipoPlanParticular(): Observable<TipoPlanParticular[]> {
    const URL = `${this.url}${this.port}/api_ingreso/maestros/tiposPlanParticular`;
    return this.http.get<TipoPlanParticular[]>(URL, {withCredentials: true}).pipe();
  }

  public getDatosPac(tipoIdentificacion: string, numeroIdentificacion: string): Observable<Maestro[]> {
    const url = `${this.url}${this.port}/api_ingreso/paciente/coberturaPac/${tipoIdentificacion}/${numeroIdentificacion}`;
    return this.http.get<Maestro[]>(url, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene los tipos de nutricion para novedad
   * @returns {Observable<TipoNutricion[]>}
   */
  public getTiposNutricionNovedad(): Observable<TipoNutricion[]> {
    const URL = `${this.url}${this.port}/api_novedades/maestros/tiposNutricion`;
    return this.http.get<TipoNutricion[]>(URL, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene los tipos de curaciones para novedad
   * @returns {Observable<TipoCuracion[]>}
   */
  public getTiposCuracionesNovedad(): Observable<TipoCuracion[]> {
    const URL = `${this.url}${this.port}/api_novedades/maestros/tiposCuracion`;
    return this.http.get<TipoCuracion[]>(URL, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene los tipos de curaciones para novedad
   * @returns {Observable<TipoSondajeIngreso[]>}
   */
  getTiposSondajeNovedad(): Observable<TipoSondajeIngreso[]> {
    const URL = `${this.url}${this.port}/api_novedades/maestros/tiposSondaje`;
    return this.http.get<TipoSondajeIngreso[]>(URL, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene los tipos de nutricion para novedad
   * @returns {Observable<TipoTerapia[]>}
   */
  public getTiposTerapiasNovedad(): Observable<TipoTerapia[]> {
    const URL = `${this.url}${this.port}/api_novedades/maestros/tiposTerapia`;
    return this.http.get<TipoTerapia[]>(URL, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene las profesiones para novedad
   * @returns {Observable<Profesion[]>}
   */
  public getProfesionesNovedad(): Observable<Profesion[]> {
    const URL = `${this.url}${this.port}/api_novedades/maestros/profesiones`;
    return this.http.get<Profesion[]>(URL, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene las profesiones para novedad por idPrograma
   * @returns {Observable<Profesion[]>}
   */
  public getProfesionesNovedadIdPrograma(idPrograma: string): Observable<Profesion[]> {
    const URL = `${this.url}${this.port}/api_novedades/maestros/profesiones/${idPrograma}`;
    return this.http.get<Profesion[]>(URL, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene los diagnosticos
   * @param {string} idCiudad
   * @returns {Observable<Diagnostico[]>}
   */
  public getDiagnosticosNovedad(filtro: string): Observable<Diagnostico[]> {
    const url = `${this.url}${this.port}/api_novedades/maestros/diagnosticos/${filtro}`;
    return this.http.get<Diagnostico[]>(url, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene los tipos de muestra para procedimiento Toma de muestra en novedad
   * @returns {Observable<TipoMuestra[]>}
   */
  public getTomasMuestraNovedad(): Observable<TipoMuestra[]> {
    const URL = `${this.url}${this.port}/api_novedades/maestros/tiposMuestra`;
    return this.http.get<TipoMuestra[]>(URL, {withCredentials: true}).pipe();
  }


  /**
   * Obtiene los tipos de equipos biomédicos
   * @returns {Observable<TipoEquipoBiomedico[]>}
   */
  public getTipoEquiposBiomedicosNovedad(): Observable<TipoEquipoBiomedico[]> {
    const URL = `${this.url}${this.port}/api_novedades/maestros/tipoEquipoBioMedicos`;
    return this.http.get<TipoEquipoBiomedico[]>(URL, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene los estados de equipos biomédicos
   * @returns {Observable<EstadoEquipoBiomedico[]>}
   */
  public getEstadosEquiposBiomedicosNovedad(idEstado: string, nombreUsuario: string): Observable<EstadoEquipoBiomedico[]> {
    const URL = `${this.url}${this.port}/api_novedades/equipoBioMedicos/consultarEstados/${idEstado}/${nombreUsuario}`;
    return this.http.get<EstadoEquipoBiomedico[]>(URL, {withCredentials: true}).pipe();
  }


  /**
   * Obtiene los tipos de novedades presentados en aplicaciones por cuidador
   * @returns {Observable<MotivoAplicacionCuidador[]>}
   */
  public getMotivosAplicacionCuidadorNovedad(): Observable<MotivoAplicacionCuidador[]> {
    const URL = `${this.url}${this.port}/api_novedades/maestros/motivosAplicacionCuidador`;
    return this.http.get<MotivoAplicacionCuidador[]>(URL, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene los proveedores de los equipos biomedicos
   * @returns {Observable<Proveedor[]>}
   */
  public getProveedoresEquiposBiomedicosNovedad(): Observable<Proveedor[]> {
    const URL = `${this.url}${this.port}/api_novedades/maestros/proveedores`;
    return this.http.get<Proveedor[]>(URL, {withCredentials: true}).pipe();
  }

  public getLlamadaNoContestada(): Observable<CausasLlamadaNoContestada[]> {
    const URL = `${this.url}${this.port}/api_novedades/maestros/llamadaNoContestada`;
    return this.http.get<CausasLlamadaNoContestada[]>(URL, {withCredentials: true});
  }

  /**
   * Consulta los tipos de soporte nutricional
   * @returns {Observable<TiposSoporteNutricional[]>}
   */
  public getTiposSoporteNutricionalNovedad(): Observable<TiposSoporteNutricional[]> {
    const url = `${this.url}${this.port}/api_novedades/maestros/tiposSoporteNutricional`;
    return this.http.get<TiposSoporteNutricional[]>(url, {withCredentials: true}).pipe();
  }

  public getEstadosPacienteNovedad(): Observable<EstadoPaciente[]> {
    const url = `${this.url}${this.port}/api_novedades/maestros/estadoPaciente`;
    return this.http.get<EstadoPaciente[]>(url, {withCredentials: true}).pipe();
  }

  public getGeoReferenciacionNovedad(): Observable<Maestro[]> {
    const URL = `${this.url}${this.port}/api_novedades/maestros/georeferenciacion`;
    return this.http.get<Maestro[]>(URL, {withCredentials: true}).pipe();
  }

  public getEstadosBandejaDinamica(): Observable<EstadoBandejaDinamica[]> {
    const url = `${this.url}${this.port}/api_novedades/bandejaDinamica/estados`;
    return this.http.get<EstadoBandejaDinamica[]>(url, {withCredentials: true}).pipe();
  }

  /**
   * Obtiene los motivos para la fijación de visitas
   * @returns {Observable<MotivoFijarCita[]>}
   */
  public getMotivosFijacionCita(): Observable<MotivoFijarCita[]> {
    const URL = `${this.url}${this.port}/api_novedades/maestros/motivosFijarCitas`;
    return this.http.get<MotivoFijarCita[]>(URL, {withCredentials: true}).pipe();
  }

   /**--**/
  public consultarCentroEstadiaTemporal(): Observable<any> {
    return null;
  }

  public consultarCiudad(): Observable<Ciudad[]> {
    const URL = `http://local.saludencasa.com.co:8292/api_maestros/consultarCiudad`;
    return this.http.get<Ciudad[]>(URL, {withCredentials: true}).pipe();
  }


  public consultarDosis(): Observable<Dosis[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarDosis`;
    return this.http.get<Dosis[]>(URL, {withCredentials: true}).pipe();
  }

  public consultarDiagnostico(): Observable<Diagnostico[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarDiagnostico`;
    return this.http.get<Diagnostico[]>(URL, {withCredentials: true}).pipe();
  }


  public consultarFrecuencia(): Observable<Frecuencia[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarFrecuencia`;
    return this.http.get<Frecuencia[]>(URL, {withCredentials: true}).pipe();
  }


  public consultarInstitucion(): Observable<Institucion[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarInstitucion`;
    return this.http.get<Institucion[]>(URL, {withCredentials: true}).pipe();
  }

  public consultarMedicamento(): Observable<Medicamento[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarMedicamento`;
    return this.http.get<Medicamento[]>(URL, {withCredentials: true}).pipe();
  }


  public consultarMotivoCancelacion(): Observable<MotivoCancelacion[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarMotivoCancelacion`;
    return this.http.get<MotivoCancelacion[]>(URL, {withCredentials: true}).pipe();
  }

  public consultarMunicipio(): Observable<Municipio[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarMunicipio`;
    return this.http.get<Municipio[]>(URL, {withCredentials: true}).pipe();
  }


  public consultarPiso(): Observable<Piso[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarPiso`;
    return this.http.get<Piso[]>(URL, {withCredentials: true}).pipe();
  }


  public consultarPlanSalud(): Observable<PlanSalud[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarPlanSalud`;
    return this.http.get<PlanSalud[]>(URL, {withCredentials: true}).pipe();
  }


  public consultarTipoNutricion(): Observable<TipoNutricion[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarTipoNutricion`;
    return this.http.get<TipoNutricion[]>(URL, {withCredentials: true}).pipe();
  }


  public consultarTipoIdentificacion(): Observable<TipoIdentificacion[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarTipoIdentificacion`;
    return this.http.get<TipoIdentificacion[]>(URL, {withCredentials: true}).pipe();
  }


  public consultarTipoSoporteNutricional(): Observable<TiposSoporteNutricional[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarTipoSoporteNutricional`;
    return this.http.get<TiposSoporteNutricional[]>(URL, {withCredentials: true}).pipe();
  }


  public consultarViaAdministracion(): Observable<ViaAdministracion[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarViaAdministracion`;
    return this.http.get<ViaAdministracion[]>(URL, {withCredentials: true}).pipe();
  }

  /***Solo Novedades*/

  public consultarCausasLlamadas(): Observable<CausasLlamadaNoContestada[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarCausasLlamadas`;
    return this.http.get<CausasLlamadaNoContestada[]>(URL, {withCredentials: true}).pipe();
  }


  public consultarEstadoPaciente(): Observable<EstadoPaciente[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarEstadoPaciente`;
    return this.http.get<EstadoPaciente[]>(URL, {withCredentials: true}).pipe();
  }


  public consultarMotivoAplicacionCuidador(): Observable<MotivoAplicacionCuidador[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarMotivoAplicacionCuidador`;
    return this.http.get<MotivoAplicacionCuidador[]>(URL, {withCredentials: true}).pipe();
  }

  public consultarMotivoFijarCita(): Observable<MotivoFijarCita[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarMotivoFijarCita`;
    return this.http.get<MotivoFijarCita[]>(URL, {withCredentials: true}).pipe();
  }


  public consultarNovedadPorTipoAdmision(): Observable<any[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarNovedadPorTipoAdmision`;
    return this.http.get<any[]>(URL, {withCredentials: true}).pipe();
  }


  public consultarPermisosTerceros(): Observable<any[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarPermisosTerceros`;
    return this.http.get<any[]>(URL, {withCredentials: true}).pipe();
  }

  public consultarProveedor(): Observable<Proveedor[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarProveedor`;
    return this.http.get<Proveedor[]>(URL, {withCredentials: true}).pipe();
  }

  public consultarTipoCuracion(): Observable<TipoCuracion[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarTipoCuracion`;
    return this.http.get<TipoCuracion[]>(URL, {withCredentials: true}).pipe();
  }


  public consultarSedesSaludEnCasa(): Observable<any[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarSedesSaludEnCasa`;
    return this.http.get<any[]>(URL, {withCredentials: true}).pipe();
  }


  public consultarTipoEquipoMedico(): Observable<TipoEquipoBiomedico[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarTipoEquipoMedico`;
    return this.http.get<TipoEquipoBiomedico[]>(URL, {withCredentials: true}).pipe();
  }

  public consultarTipoMuestra(): Observable<TipoMuestra[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarTipoMuestra`;
    return this.http.get<TipoMuestra[]>(URL, {withCredentials: true}).pipe();
  }


  public consultarTipoTerapia(): Observable<TipoTerapia[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarTipoTerapia`;
    return this.http.get<TipoTerapia[]>(URL, {withCredentials: true}).pipe();
  }


  public consultarTipoPlanParticular(): Observable<any[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarTipoPlanParticular`;
    return this.http.get<any[]>(URL, {withCredentials: true}).pipe();
  }

  public consultarPrograma(): Observable<Programa[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarPrograma`;
    return this.http.get<Programa[]>(URL, {withCredentials: true}).pipe();
  }

  public consultarProfesional(): Observable<Profesional[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarProfesional`;
    return this.http.get<Profesional[]>(URL, {withCredentials: true}).pipe();
  }

  public consultarValoraciones(): Observable<Valoracion[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarValoraciones`;
    return this.http.get<Valoracion[]>(URL, {withCredentials: true}).pipe();
  }


  public consultarTipoSondajeIngreso(): Observable<TipoSondajeIngreso[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarTipoSondajeIngreso`;
    return this.http.get<TipoSondajeIngreso[]>(URL, {withCredentials: true}).pipe();
  }

  public consultarValidacionOPC(): Observable<any[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarValidacionOPC`;
    return this.http.get<any[]>(URL, {withCredentials: true}).pipe();
  }


  public consultarMotivoEgreso(): Observable<MotivoEgreso[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarMotivoEgreso`;
    return this.http.get<MotivoEgreso[]>(URL, {withCredentials: true}).pipe();
  }


  public consultarTipoSondajeNovedades(): Observable<TipoSondajeNovedades[]> {
    const URL = `${this.url}${this.port}/api_maestros/consultarTipoSondajeNovedades`;
    return this.http.get<TipoSondajeNovedades[]>(URL, {withCredentials: true}).pipe();
  }

}
