import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModalCondicionPacienteAceptaViewModel } from './modal-condicion-paciente-acepta.view-model';
import {RemisionContenedorService} from '../../../../domain/usecase/remision/remision-contenedor.service';
import {MensajesService} from '../../../../shared/services/mensajes.service';
import {Router} from '@angular/router';
import {EstadosRemisionEnum} from '../../../../shared/utils/enums/estados-remision.enum';

@Component({
  selector: 'sura-modal-condicion-paciente-acepta',
  templateUrl: './modal-condicion-paciente-acepta.component.html',
  styleUrls: ['./modal-condicion-paciente-acepta.component.scss']
})
export class ModalCondicionPacienteAceptaComponent implements OnInit {

  public modalCondicionPacienteAceptaViewModel: ModalCondicionPacienteAceptaViewModel = this.iniciarViewModel();

  constructor(private dialogRef: MatDialogRef<ModalCondicionPacienteAceptaComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,  private remisionService: RemisionContenedorService,
              private mensajesService: MensajesService, private route: Router) { }

  ngOnInit() {
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): ModalCondicionPacienteAceptaViewModel {
    return new ModalCondicionPacienteAceptaViewModel(
      null,
    );
  }

  /**
   * Cancela y cierra el modal
   */
  public cancelar(): void {
    this.dialogRef.close(false);
  }

  /**
   * Cierra la remision
   */
  public continuar(): void {
      const estado = EstadosRemisionEnum.CANCELADO;
      const mensaje = 'Se ha cancelado la remision correctamente';
      this.remisionService.obtenerRemision(estado, mensaje);
      this.dialogRef.close();
    }
}
