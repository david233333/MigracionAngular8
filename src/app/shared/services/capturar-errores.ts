import {Injectable} from '@angular/core';
import {MensajesService} from './mensajes.service';
import {mensajes as mensajesListaRemisiones} from '../utils/mensajes';
import {LoginUsecaseServices} from '../../domain/usecase/seguridad/loginUsecase-services';
import {ConfiguracionService} from './configuracion.service';

@Injectable()
export class CapturarErrores {
  private url: string;
  private mensajes: any;

  constructor(private mensaje: MensajesService,
              private seguridadService: LoginUsecaseServices) {
    this.mensajes = mensajesListaRemisiones.errores;
    this.url = `${ConfiguracionService.config.seusBaseUrl}`;
  }

  public mapearErrores(status, mensaje?) {
    switch (status) {
      case 0: {
        this.mensaje.mostrarMensajeError(this.mensajes.cinco00);
        break;
      }
      case 401: {
        this.cargarLogin();
        this.mensaje.mostrarMensajeError(this.mensajes.cuatro01);
        break;
      }
      case 403: {
        this.mensaje.mostrarMensajeError(this.mensajes.cuatro03);
        break;
      }
      case 404: {
        this.mensaje.mostrarMensajeError(this.mensajes.cuatro04);
        break;
      }
      case 500: {
        this.mensaje.mostrarMensajeError(mensaje);
        break;
      }
      case 503: {
        this.mensaje.mostrarMensajeError(this.mensajes.cinco00);
        break;
      }
    }
  }

  private cargarLogin() {
    this.seguridadService.checkLogin().subscribe(
      value => {
        console.log(value);
        if (value) {
        } else {
          const url = {
            url: this.url
          };
          this.seguridadService.login(url);
        }
      },
      error1 => {
        console.log(error1);
      }
    );
  }
}
