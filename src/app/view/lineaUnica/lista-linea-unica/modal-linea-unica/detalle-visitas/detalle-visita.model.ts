import {mensajes as mensajesListaRemisiones} from '../../../../../shared/utils/mensajes';

export class DetalleVisitaModel {
  constructor(public  mensaje: any,
              public  respuestaProgramacion: any,
              public respuestaProcedimientos: any,
              public respuestaCuraciones:  Array<any>,
              public respuestaTomaDeMuestra:  Array<any>,
              public respuestaSecreciones:  Array<any>,
              public respuestaFotoTerapia:  Array<any>,
              public especialidad: any,
              public respuestaTratamientos: Array<any>,
              public respuestaSondajes:  Array<any>,
              public respuestaCanalizaciones:  Array<any>,
              public respuestaSoporteNutricional:  Array<any>,
              public respuestaValoraciones: any,
              public respuestaVisitaProfesional: string) {
    this.mensaje = mensajesListaRemisiones.detalleVisita  ;
  }

}
