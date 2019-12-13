import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MensajesService} from '../../../../shared/services/mensajes.service';
import {MaestrosService} from '../../../../domain/usecase/comun/maestros.service';
import {CapturarErrores} from '../../../../shared/services/capturar-errores';
import {ModalMaestroViewModel} from './modal-maestro.view-model';
import {TablaMaestroComponent} from '../tabla-maestro/tabla-maestro.component';
import {SelectMaestro} from '../selectMaestro';

@Component({
  selector: 'sura-modal-maestro',
  templateUrl: './modal-maestro.component.html',
  styleUrls: ['./modal-maestro.component.scss']
})
export class ModalMaestroComponent implements OnInit {
  public test = 'Test';
  public formulario: FormGroup;
  public modalMaestroViewModel: ModalMaestroViewModel = this.iniciarViewModel();
  public selectMaestro: SelectMaestro = this.iniciarSelectMaestro();

  constructor(
    public dialogRef: MatDialogRef<TablaMaestroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public mensajesService: MensajesService,
    public maestrosService: MaestrosService,
    public cdRef: ChangeDetectorRef,
    private capturaErroresService: CapturarErrores,
    private fb: FormBuilder,
  ) {
    this.crearFormulario();
  }

  ngOnInit() {
    console.log(this.data);
    if (this.data.requestMaestro.actualizar) {
      this.llenarFormulario();
    }
  }

  cerrarModal() {
    this.dialogRef.close();
  }

  guardar() {
    this.validarTodosLosCamposDelFormulario(this.formulario);
    console.log('this.data.requestMaestro.maestro ', this.data.requestMaestro.maestro);
    if (this.data.requestMaestro.actualizar) {
      this.maestrosService.updateCiudad(this.data.requestMaestro).subscribe(
        maestro => {
          console.log(maestro);
          alert('Editado!!');
        },
        error => {
          this.capturaErroresService.mapearErrores(error.status, error.error);
        }
      );
    } else if (this.data.requestMaestro.crear) {
      this.selectMaestro.saveMaestro(this.data.requestMAestro);
    }
  }

  public iniciarSelectMaestro() {
    return new SelectMaestro(this.formulario, this.fb);
  }

  private iniciarViewModel(): ModalMaestroViewModel {
    return new ModalMaestroViewModel(null, null);
  }

  private crearFormulario() {
    console.log(this.formulario);
    this.formulario = this.selectMaestro.createForm(this.data.requestMaestro.nombreMaestro);
  }

  private llenarFormulario() {
    console.log(this.data.requestMaestro);
    this.selectMaestro.fillForm(this.data.requestMaestro);
  }

  private validarTodosLosCamposDelFormulario(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validarTodosLosCamposDelFormulario(control);
      }
    });
  }
}
