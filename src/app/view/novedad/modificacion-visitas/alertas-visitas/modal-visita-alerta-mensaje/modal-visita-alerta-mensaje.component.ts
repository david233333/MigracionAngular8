import { Component, Inject, OnInit } from '@angular/core';
import { ModalAlertaModel } from './modal-alerta-model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { MensajesService } from '../../../../../shared/services/mensajes.service';
import { AlertaVisita } from '../../../../../domain/model/novedad/entity/alerta.model';
import { GestionNovedadService } from '../../../../../domain/usecase/novedad/gestion-novedad.service';
import { Usuario } from '../../../../../shared/models/usuario.model';
import {CapturarErrores} from '../../../../../shared/services/capturar-errores';

@Component({
  selector: 'sura-modal-visita-alerta-mensaje',
  templateUrl: './modal-visita-alerta-mensaje.component.html',
  styleUrls: ['./modal-visita-alerta-mensaje.component.scss']
})
export class ModalVisitaAlertaMensajeComponent implements OnInit {
  public alertasVisitasModel: ModalAlertaModel = this.initModelVisitas();
  constructor(@Inject(MAT_DIALOG_DATA) public datos: any, private dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private mensajesService: MensajesService,
              private gestionNovedadServices: GestionNovedadService,
              private capturaDeErroresService: CapturarErrores) { }

  ngOnInit() {
  }


  private initModelVisitas(): ModalAlertaModel {
    return new ModalAlertaModel(null);
  }

  /**
   * Cancela y cierra el modal
   */
  public cerrar(): void {
    this.dialogRef.close(false);
    this.mensajesService.mostrarMensajeExito('No se realizo ningun cambio');
  }

  /**
   * Guardar  alerta
   */
  public guardar() {
    const alertas = this.datos.alerta;
    const duracion = this.datos.duracion * 60;
    const cambiarDuracion = this.datos.cambiarDuracion;
    const IDREMISION = this.datos.idRemision;
    const idCitaNumber = this.datos.visita.idCitaNumber;
    const alerta: AlertaVisita = new AlertaVisita(null,
      IDREMISION, idCitaNumber, new Date(),
      alertas, cambiarDuracion, duracion,
      new Usuario(null, null, null, null, null, null, null, null));
    this.gestionNovedadServices.guardarAlertaVisita(alerta).subscribe(() => {
      this.dialogRef.close(false);
      this.mensajesService.mostrarMensajeExito('Se guardo correctamente la alerta');
    }, error => {
      this.dialogRef.close(false);
      this.capturaDeErroresService.mapearErrores(error.status, error.error);
    });
    console.log(alerta);
  }


}
