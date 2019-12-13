import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ModalEquiposBiomedico} from './modal-equipo-biomedico-model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EstadosEquipoBiomedicoEnum} from '../../../../shared/utils/enums/estados-equipo-biomedico.enum';
import {MensajesService} from '../../../../shared/services/mensajes.service';


@Component({
  selector: 'sura-modal-equipos-biomedicos-cancelar',
  templateUrl: './modal-equipos-biomedicos-cancelar.component.html',
  styleUrls: ['./modal-equipos-biomedicos-cancelar.component.scss']
})
export class ModalEquiposBiomedicosCancelarComponent implements OnInit {
  public formulario: FormGroup;
  public modalCancelaRemisionPendienteViewModel: ModalEquiposBiomedico = this.iniciarViewModel();
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<ModalEquiposBiomedicosCancelarComponent>,
              private fb: FormBuilder,
              private mensajesService: MensajesService ) {
    this.crearFormulario();
  }

  ngOnInit() {
    console.log(this.data);
    console.log(this.data.estado);
    console.log(this.data.estadoDescripcion);
    console.log(this.data.esEliminado);
    console.log(this.data.esModificado);
    console.log(this.data.nota);
  }


  private iniciarViewModel() {
    return new ModalEquiposBiomedico(null, null);
  }

 public continuar() {
    const estadoEquipoBioMedico = this.data.estadoDescripcion;
    const nuevoEquipoBiomedico = this.data;
    if (this.formulario.valid) {
      if (estadoEquipoBioMedico === (EstadosEquipoBiomedicoEnum.SOLICITADO) ||
        estadoEquipoBioMedico === EstadosEquipoBiomedicoEnum.ASIGNADO.toString()) {
        nuevoEquipoBiomedico.esEliminado = true;
        nuevoEquipoBiomedico.esModificado = true;
        nuevoEquipoBiomedico.estadoDescripcion = EstadosEquipoBiomedicoEnum.CANCELADO;
        nuevoEquipoBiomedico.nota = this.formulario.get('observaciones').value;
        nuevoEquipoBiomedico.estado.idEstado = '5';
        nuevoEquipoBiomedico.estado.descripcion = EstadosEquipoBiomedicoEnum.CANCELADO;
      } else if (estadoEquipoBioMedico === (EstadosEquipoBiomedicoEnum.ENTREGADO)) {
        nuevoEquipoBiomedico.esEliminado = true;
        nuevoEquipoBiomedico.esModificado = true;
        nuevoEquipoBiomedico.estadoDescripcion = EstadosEquipoBiomedicoEnum.TERMINADO;
        nuevoEquipoBiomedico.nota = this.formulario.get('observaciones').value;
        nuevoEquipoBiomedico.estado.idEstado = '4';
        nuevoEquipoBiomedico.estado.descripcion = EstadosEquipoBiomedicoEnum.TERMINADO;
      }
    } else {
      this.mensajesService.mostrarMensajeError('Debes ingresar una nota');
    }
     this.dialogRef.close(nuevoEquipoBiomedico);
  }


  public cancelar() {
    this.dialogRef.close(false);
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formulario = this.fb.group({
      observaciones: ['', Validators.compose([Validators.required,
        Validators.maxLength(4000)])]
    });
  }
}
