import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ModalCondicionPacienteAceptaComponent} from
    '../../datos-atencion/modal-condicion-paciente-acepta/modal-condicion-paciente-acepta.component';
import {ModalViewModel} from './modal.view-model';
import {AdmisionService} from '../../../../domain/usecase/remision/admision.service';
import {MensajesService} from '../../../../shared/services/mensajes.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RemisionContenedorService} from '../../../../domain/usecase/remision/remision-contenedor.service';

@Component({
  selector: 'sura-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  public modalViewModel: ModalViewModel = this.iniciarViewModel();
  public formulario: FormGroup;

  constructor(private dialogRef: MatDialogRef<ModalCondicionPacienteAceptaComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private fb: FormBuilder,
              private admisionService: AdmisionService,
              private mensajesService: MensajesService,
              private remisionService: RemisionContenedorService) {

          this.crearFormulario();
  }

  ngOnInit() {
   this.getCentroEstadiaTemporal();
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
    console.log(this.modalViewModel.respuestaCentroEstadia[0]);
    const datos = {
    marcar: true,
    ubicacion:
      this.modalViewModel.respuestaCentroEstadia[0]
  }
    if (this.formulario.valid) {
      this.dialogRef.close(datos);
    } else {
      datos.ubicacion = '';
      datos.marcar = false;
      this.dialogRef.close(datos);
      this.mensajesService.mostrarMensajeError(this.modalViewModel.mensajes.error.errorAceptar);
    }

  }

  /**
   * consulta los centros de estadia temporal
   * por ciuidad
   */
  private getCentroEstadiaTemporal() {
    this.admisionService.getCentroEstadia(this.data.ciudad).subscribe(centrosEstadia => {
      this.modalViewModel.respuestaCentroEstadia = centrosEstadia;
      console.log(centrosEstadia);
    });
  }


  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): ModalViewModel {
    return new ModalViewModel(
      null, null
    );
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formulario = this.fb.group({
      centroEstadia: ['', Validators.compose([Validators.required])],
    });
  }

}
