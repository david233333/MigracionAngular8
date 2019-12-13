import {Injectable} from '@angular/core';


@Injectable()
export class AgregadosComunService {
  constructor() {
  }

  public static _datosProfesionales: any;

  get datosProfesionales(): any {
    return AgregadosComunService._datosProfesionales;
  }

  set datosProfesionales(datosProfesionales: any) {
    AgregadosComunService._datosProfesionales = datosProfesionales;
  }

  public static _datosSondajes: any;

  get datosSondajes(): any {
    return AgregadosComunService._datosSondajes;
  }

  set datosSondajes(datosSondajes: any) {
    AgregadosComunService._datosSondajes = datosSondajes;
  }

  public static _datosTiposNutricion: any;

  get datosTiposNutricion(): any {
    return AgregadosComunService._datosTiposNutricion;
  }

  set datosTiposNutricion(datosTiposNutricion: any) {
    AgregadosComunService._datosTiposNutricion = datosTiposNutricion;
  }

}
