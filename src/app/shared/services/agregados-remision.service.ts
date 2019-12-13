import { Injectable } from '@angular/core';

@Injectable()
export class AgregadosRemisionService {

  public  static _datosPaciente: any;
  public  static _datosRemision: any;
  public  static _remision: any;


  set datosPaciente(datosPaciente: any) {
      AgregadosRemisionService._datosPaciente = datosPaciente;
  }

  get datosPaciente(): any{
    return AgregadosRemisionService._datosPaciente;
  }

  set datosRemision(datosRemision){
    AgregadosRemisionService._datosRemision = datosRemision;
  }

  get datosRemision(): any {
    return AgregadosRemisionService._datosRemision;
  }

  get remision(): any {
    return AgregadosRemisionService._remision;
  }

  set remision(idRemision){
    AgregadosRemisionService._remision = idRemision;
  }

}
