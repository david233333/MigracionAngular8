import { Injectable } from '@angular/core';

declare var environment: any;

@Injectable()
export class ConfiguracionService {

  /**
   * Retorna la configuracion
   * @returns {{urlBase: any}}
   * @returns {{portBase: any}}
   */
  static get config() {
    return {
      urlBase: environment.apiBaseUrl,
      portBase: environment.portBaseUrl,
      seusBaseUrl: environment.seusBaseUrl
    };
  }
}
