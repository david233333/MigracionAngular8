import {Observable} from 'rxjs/Observable';
import {LineaUnicaModel} from '../entity/lineaUnica-model';

export abstract class LineaUnicaGatewayAbstract {


  abstract consultarLineaUnica(idCiudad: string, page: number, size: number): Observable<any>;

  abstract guardarIntento(lineaUnica: LineaUnicaModel ): Observable<any>;

  abstract bucarById(id: string): Observable<LineaUnicaModel[]>;

  abstract bloquearUsuario(lineaUnica: LineaUnicaModel): Observable<any>;

  abstract guardarComoExitoso(lineaUnica: LineaUnicaModel): Observable<any>;
}
