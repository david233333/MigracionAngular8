import {Injectable} from '@angular/core';
import {InformesGateway} from '../../model/informes/gateway/informes-gateway';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class InformesUsecase {
  constructor(private informes: InformesGateway) {
  }

  public consultarInformeEgreso(idCiudad: string, idPrograma: string, fechaInicio: string,
                                fechaFin: string, idPsio?: string): Observable<any> {
    return this.informes.consutlarInformeEgreso(idCiudad, idPrograma, fechaInicio, fechaFin, idPsio);
  }

  public consultarInformeEquipoBiomedicos(estado: string, fechaInicio: string,
                                fechaFin: string): Observable<any> {
    return this.informes.consultarInformeEquipoBiomedicos(estado, fechaInicio, fechaFin);
  }

  public consultarInformeCuraciones(idCiudad: string, idPrograma: string, fechaInicio: string,
                                fechaFin: string, idPsio?: string): Observable<any> {
    return this.informes.consutlarInformeCuraciones(idCiudad, idPrograma, fechaInicio, fechaFin, idPsio);
  }

  public consultarInformesPaliativos(fechaInicio: string, fechaFin: string): Observable<any> {
   return this.informes.consultarInformePaliativos(fechaInicio, fechaFin);
  }

  public consultarCoberturaRiesgo(codigoBarrio: string, ciudad: string): Observable<any> {
    return this.informes.consultarCoberturaRiesgo(codigoBarrio, ciudad);
  }

  public cargarRegistros(fileName: File): Observable<any> {
    return this.informes.cargarRegistros(fileName);
  }

  public consultarInformePacientes(idCiudad: string, idPsio?: string, estados?: string): Observable<any> {
    return this.informes.consultarInformePacientes(idCiudad, idPsio, estados);
  }

}
