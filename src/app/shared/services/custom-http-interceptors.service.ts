import {Injectable} from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpResponse,
  HttpErrorResponse, HttpHandler, HttpEvent
} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/finally';

import {CargandoService} from './cargando.service';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {

  constructor(private cargandoService: CargandoService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    /*
    const customReq = request.clone({
      headers: request.headers.set('app-language', 'it')
    });
    */

    this.mostrarCargando();
    return next
      .handle(request)
      .do(
        (ev: HttpEvent<any>) => {

        }
      )
      .catch(response => {
        if (response instanceof HttpErrorResponse) {
          console.log('Processing http error', response);
        }

        return Observable.throw(response);
      })
      .finally(
        () => {
          this.ocultarCargando();
        });
  }

  private mostrarCargando(): void {
    this.cargandoService.mostrar();
  }

  private ocultarCargando(): void {
    this.cargandoService.ocultar();
  }
}
