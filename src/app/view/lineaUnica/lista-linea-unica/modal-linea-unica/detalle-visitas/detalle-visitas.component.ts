import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {DetalleVisitaModel} from './detalle-visita.model';

@Component({
  selector: 'sura-detalle-visitas',
  templateUrl: './detalle-visitas.component.html',
  styleUrls: ['./detalle-visitas.component.scss']
})
export class DetalleVisitasComponent implements OnInit {

  public visitasDetalleModel: DetalleVisitaModel = this.inicializarModelo();
  public colCuraciones: any[];
  public colTomaDeMuestras: any[];
  public colSecreciones: any[];
  public colFotoTerapia: any[];
  public colTratamientos: any[];
  public colSondajes: any[];
  public colSoporteNutricional: any[];
  public colCanalizacion: any[];


  constructor(@Inject(MAT_DIALOG_DATA) public datos: any, private dialog: MatDialog,
              public dialogRef: MatDialogRef<any>) {
    this.obtenerProgramacion();
    this.generarColumnasCuraciones();
    this.generarColumnasTomaDeMuestras();
    this.generarColumnasSecreciones();
    this.generarColumnasFotoTerapia();
    this.generarColumnasTratamientos();
    this.generarColumnasSondajes();
    this.generarColumnasSoporteNutricial();
    this.generarColumnasCanalizacion();
  }

  ngOnInit() {
    this.mostrarTablas();
  }

  /**
   * Muestra la tabla medicamentos si tiene datos
   */
  public mostrarMedicamentos(): boolean {
    if (this.visitasDetalleModel.respuestaTratamientos.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Mustra la tabla curaciones si tiene datos
   */
  public mostrarCuraciones() {
    if (this.visitasDetalleModel.respuestaCuraciones.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Muestra la tabla de toma de muestras
   */
  public mostrarTomaDeMuestras(): boolean {
    if (this.visitasDetalleModel.respuestaTomaDeMuestra.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Muestra la tabla de secreciones si tiene datos
   */
  public mostrarSecreciones(): boolean {
    if (this.visitasDetalleModel.respuestaSecreciones.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Muestra la tabla de sondajes si tiene datos
   */
  public mostrarSondajes(): boolean {
    if (this.visitasDetalleModel.respuestaSondajes.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Muestra la tabla de nutricion si tiene datos
   */
  public mostrarSoporteNutricional(): boolean {
    if (this.visitasDetalleModel.respuestaSoporteNutricional.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Muestra la tabla de nutricion si tiene datos
   */
  public mostrarFotoTerapia(): boolean {
    if (this.visitasDetalleModel.respuestaFotoTerapia.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  public mostrarCanalizaciones(): boolean {
    if (this.visitasDetalleModel.respuestaCanalizaciones.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Cierra el modal
   * de detalle visitas
   */
  public cerrar() {
    this.dialogRef.close();
  }

  /**
   *
   * Llama las funciones de mostrarTablas
   */
  private mostrarTablas() {
    this.mostrarMedicamentos();
    this.mostrarCuraciones();
    this.mostrarTomaDeMuestras();
    this.mostrarSecreciones();
    this.mostrarSondajes();
    this.mostrarSoporteNutricional();
    this.mostrarFotoTerapia();
    this.mostrarCanalizaciones();
  }

  /**
   * OBtiene las programaciones por
   * idRemisión
   */
  private obtenerProgramacion() {
    console.table(this.datos.cita.sondajes);
    this.visitasDetalleModel.especialidad = this.datos.cita.especialidad;
    this.visitasDetalleModel.respuestaCuraciones = this.datos.cita.procedimientos.curaciones;
    this.visitasDetalleModel.respuestaTomaDeMuestra = this.datos.cita.procedimientos.tomaMuestras;
    this.visitasDetalleModel.respuestaSecreciones = this.datos.cita.procedimientos.secreciones;
    this.visitasDetalleModel.respuestaFotoTerapia = this.datos.cita.procedimientos.fototerapias;
    this.visitasDetalleModel.respuestaTratamientos = this.datos.cita.tratamientos;
    this.visitasDetalleModel.respuestaSondajes = this.datos.cita.procedimientos.sondajes;
    this.visitasDetalleModel.respuestaCanalizaciones = this.datos.cita.procedimientos.canalizaciones;
    this.visitasDetalleModel.respuestaSoporteNutricional = this.datos.cita.procedimientos.soporteNutricionales;
  }

  /**
   * Inicializa el modelo
   * @returns {DetalleVisitaModel}
   */

  private inicializarModelo(): DetalleVisitaModel {
    return new DetalleVisitaModel(null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null);
  }

  /**
   * Genera la tabla de columnas Curaciones
   */
  private generarColumnasCuraciones(): void {
    this.colCuraciones = [
      {
        field: this.visitasDetalleModel.mensaje.tabla.procedimientos.curaciones.ubicacionHeridaCampo,
        header: this.visitasDetalleModel.mensaje.tabla.procedimientos.curaciones.ubicacionHerida
      },
      {
        field: this.visitasDetalleModel.mensaje.tabla.procedimientos.curaciones.tipoCuracionCampo,
        header: this.visitasDetalleModel.mensaje.tabla.procedimientos.curaciones.tipoCuracion
      }
    ];
  }

  /**
   * Genera la tabla de columnas toma de muestras
   */
  private generarColumnasTomaDeMuestras(): void {
    this.colTomaDeMuestras = [
      {
        field: this.visitasDetalleModel.mensaje.tabla.procedimientos.tomaDeMuestra.tipoPrestacion,
        header: this.visitasDetalleModel.mensaje.tabla.procedimientos.tomaDeMuestra.tipoPrestacionCampo
      },
      {
        field: this.visitasDetalleModel.mensaje.tabla.procedimientos.tomaDeMuestra.tipoMuestraCampo,
        header: this.visitasDetalleModel.mensaje.tabla.procedimientos.tomaDeMuestra.tipoMuestra
      }
    ];
  }


  /**
   * Genera la tabla de columnas toma de secreciones
   */
  private generarColumnasSecreciones(): void {
    this.colSecreciones = [
      {
        field: this.visitasDetalleModel.mensaje.tabla.procedimientos.secreciones.tipoPrestacionCampo,
        header: this.visitasDetalleModel.mensaje.tabla.procedimientos.secreciones.tipoPrestacion
      },
      {
        field: this.visitasDetalleModel.mensaje.tabla.procedimientos.secreciones.tipoSondaCampo,
        header: this.visitasDetalleModel.mensaje.tabla.procedimientos.secreciones.tipoSonda
      }
    ];
  }

  /**
   * Genera la tabla de columnas toma de fotoTeperapia
   */
  private generarColumnasFotoTerapia(): void {
    this.colFotoTerapia = [
      {
        field: this.visitasDetalleModel.mensaje.tabla.procedimientos.fototerapias.tipoPrestacionCampo,
        header: this.visitasDetalleModel.mensaje.tabla.procedimientos.fototerapias.tipoPrestacion
      },
      {
        field: this.visitasDetalleModel.mensaje.tabla.procedimientos.fototerapias.bilirrubinaTotalCampo,
        header: this.visitasDetalleModel.mensaje.tabla.procedimientos.fototerapias.bilirrubinaTotal
      }
    ];
  }


  /**
   * Genera columnas para la tabla
   */
  private generarColumnasTratamientos(): void {
    this.colTratamientos = [
      {
        field: this.visitasDetalleModel.mensaje.tabla.tratamientos.medicamentoCampo,
        header: this.visitasDetalleModel.mensaje.tabla.tratamientos.medicamento
      },
      {
        field: this.visitasDetalleModel.mensaje.tabla.tratamientos.dosisCampo,
        header: this.visitasDetalleModel.mensaje.tabla.tratamientos.dosis
      },
      {
        field: this.visitasDetalleModel.mensaje.tabla.tratamientos.viaAdministracionCampo,
        header: this.visitasDetalleModel.mensaje.tabla.tratamientos.viaAdministracion
      },
      {
        field: this.visitasDetalleModel.mensaje.tabla.tratamientos.frecuenciaCampo,
        header: this.visitasDetalleModel.mensaje.tabla.tratamientos.frecuencia
      },
    ];
  }

  /**
   * Genera la tabla de columnas Curaciones
   */
  private generarColumnasSondajes(): void {
    this.colSondajes = [
      {
        field: this.visitasDetalleModel.mensaje.tabla.procedimientos.sondaje.sondajeCampo,
        header: this.visitasDetalleModel.mensaje.tabla.procedimientos.sondaje.sondaje
      },
      {
        field: this.visitasDetalleModel.mensaje.tabla.procedimientos.sondaje.tipoPresentacionCampo,
        header: this.visitasDetalleModel.mensaje.tabla.procedimientos.sondaje.tipoPresentacion
      },
      {
        field: this.visitasDetalleModel.mensaje.tabla.procedimientos.sondaje.totalSesionesCampo,
        header: this.visitasDetalleModel.mensaje.tabla.procedimientos.sondaje.totalSesiones
      },
      {
        field: this.visitasDetalleModel.mensaje.tabla.procedimientos.sondaje.fechaSondajeCampo,
        header: this.visitasDetalleModel.mensaje.tabla.procedimientos.sondaje.fechaSondaje
      }
    ];
  }

  /**
   * Genera la tabla de columnas Curaciones
   */
  private generarColumnasSoporteNutricial(): void {
    this.colSoporteNutricional = [
      {
        field: this.visitasDetalleModel.mensaje.tabla.procedimientos.soporteNutricional.nombreMedicamentoCampo,
        header: this.visitasDetalleModel.mensaje.tabla.procedimientos.soporteNutricional.nombreMedicamento
      },
      {
        field: this.visitasDetalleModel.mensaje.tabla.procedimientos.soporteNutricional.duracionCampo,
        header: this.visitasDetalleModel.mensaje.tabla.procedimientos.soporteNutricional.duracion
      },
      {
        field: this.visitasDetalleModel.mensaje.tabla.procedimientos.soporteNutricional.tipoNutricionCampo,
        header: this.visitasDetalleModel.mensaje.tabla.procedimientos.soporteNutricional.tipoNutricion
      },
      {
        field: this.visitasDetalleModel.mensaje.tabla.procedimientos.soporteNutricional.nutricionCampo,
        header: this.visitasDetalleModel.mensaje.tabla.procedimientos.soporteNutricional.nutricion
      },
      {
        field: this.visitasDetalleModel.mensaje.tabla.procedimientos.soporteNutricional.dosisCampo,
        header: this.visitasDetalleModel.mensaje.tabla.procedimientos.soporteNutricional.dosis
      }
    ];
  }

  private generarColumnasCanalizacion(): void {
    this.colCanalizacion = [
      {
        field: this.visitasDetalleModel.mensaje.tabla.procedimientos.canalizaciones.tipoCanalziacion,
        header: this.visitasDetalleModel.mensaje.tabla.procedimientos.canalizaciones.tipoDeCanalizacionCampo
      },
    ];
  }

}
