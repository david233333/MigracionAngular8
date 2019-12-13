import {Injectable} from '@angular/core';
import {BodyOutputType, Toast, ToasterConfig, ToasterService} from 'angular2-toaster';

declare var environment: any;

@Injectable()
export class MensajesService {

  public configuracion: ToasterConfig = this.configurarToast();

  constructor(private toasterService: ToasterService) {
  }

  /**
   * Muestra los mensajes de error
   * @param {string} mensaje
   */
  public mostrarMensajeError(mensaje: string): void {
    let toast = this.crearToast(mensaje, 'error');

    this.toasterService.popAsync(toast);
  }

  /**
   * Muestra los mensajes de exito
   * @param {string} mensaje
   */
  public mostrarMensajeExito(mensaje: string): void {
    let toast = this.crearToast(mensaje, 'success');

    this.toasterService.popAsync(toast);
  }

  /**
   * Configura el toast
   * @returns {ToasterConfig}
   */
  private configurarToast(): ToasterConfig {
    return new ToasterConfig({
      showCloseButton: true,
      positionClass: 'toast-bottom-right',
      timeout: 5000,
      newestOnTop: true,
      tapToDismiss: true,
      preventDuplicates: false,
      animation: 'slideup',
      limit: 1,
    });
  }

  /**
   * Crea el toast
   * @param mensaje
   * @returns {Toast}
   */
  private crearToast(mensaje: string, tipo: string): Toast {
    return {
      type: tipo,
      title: '',
      body: mensaje,
      timeout: 7000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
  }
}
