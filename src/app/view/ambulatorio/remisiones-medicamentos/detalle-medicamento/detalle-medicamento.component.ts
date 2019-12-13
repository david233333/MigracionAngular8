import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { RemisionesMedicamentosModel } from '../remisiones-medicamentos-model';
import { DetalleMedicamentoModel } from './detalle-medicamento-model';

@Component({
  selector: 'sura-detalle-medicamento',
  templateUrl: './detalle-medicamento.component.html',
  styleUrls: ['./detalle-medicamento.component.scss']
})
export class DetalleMedicamentoComponent implements OnInit {

  public detalleModel = this.iniciarViewModel();
  public colTratamientos: any;

  constructor(@Inject(MAT_DIALOG_DATA) public datos: any, public dialogRef: MatDialogRef<any>) {
    this.generarColumnasTratamientos();
  }

  ngOnInit() {
    this.cargarDatosTabla();
  }

  private cargarDatosTabla() {
    this.detalleModel.respuestaMedicamentos = this.datos.planManejo;
  }
  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): DetalleMedicamentoModel {
    return new DetalleMedicamentoModel(
      null,
      null
    );
  }
  /**
   * Genera columnas para la tabla
   */
  private generarColumnasTratamientos(): void {
    this.colTratamientos = [
      {
        field: this.detalleModel.mensaje.tabla.medicamentoCampo,
        header: this.detalleModel.mensaje.tabla.medicamento
      },
      {
        field: this.detalleModel.mensaje.tabla.dosisCampo,
        header: this.detalleModel.mensaje.tabla.dosis
      },
      {
        field: this.detalleModel.mensaje.tabla.viaAdministracionCampo,
        header: this.detalleModel.mensaje.tabla.viaAdministracion
      },
      {
        field: this.detalleModel.mensaje.tabla.frecuenciaCampo,
        header: this.detalleModel.mensaje.tabla.frecuencia
      },
    ];
  }

  public cerrar() {
    this.dialogRef.close();
  }


}
