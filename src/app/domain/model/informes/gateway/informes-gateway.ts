import {Observable} from 'rxjs/Observable';

export abstract class InformesGateway {
  abstract consultarInformePaliativos(fechaInicio: string, fechaFin: string): Observable<any>;

  abstract consultarCoberturaRiesgo(codigoBarrio: string, ciudad: string): Observable<any>;

  abstract cargarRegistros(fileName: File): Observable<any>;

  abstract consutlarInformeEgreso(idCiudad: string, idPrograma: string, fechaInicio: string,
                                  fechaFin: string, idPiso?: string): Observable<any>;

  abstract consutlarInformeCuraciones(idCiudad: string, idPrograma: string, fechaInicio: string,
                                  fechaFin: string, idPiso?: string): Observable<any>;

  abstract consultarInformeEquipoBiomedicos(estado, fechaInicio, fechaFin);

  abstract consultarInformePacientes(idCiudad, piso?: string, estados?: string);
}
