import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {LineaUnicaModelNoContestada} from './lineaUnicaModelNoContestada';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MensajesService} from '../../../../shared/services/mensajes.service';
import {LineaUnicaUseCaseService} from '../../../../domain/usecase/lineaUnica/lineaUnicaUseCase-services';
import {CapturarErrores} from '../../../../shared/services/capturar-errores';

@Component({
  selector: 'sura-linea-unica-modal-no-exitosa',
  templateUrl: './linea-unica-modal-no-exitosa.component.html',
  styleUrls: ['./linea-unica-modal-no-exitosa.component.scss']
})
export class LineaUnicaModalNoExitosaComponent implements OnInit {
  public lineaModalUnicaModel: LineaUnicaModelNoContestada  = this.modelInit();
  readonly SELECCIONAR = 'SELECCIONAR';
  public formulario: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public datos: any, private dialog: MatDialog,
              public dialogRef: MatDialogRef<any>, private fb: FormBuilder,
              private mensajeServices: MensajesService,
              private lineaUnicaServices: LineaUnicaUseCaseService,
              private capturaDeErroresService: CapturarErrores) { }

  ngOnInit() {
    console.log(this.datos);
    this.inicializarForm();
    this.consultarListaLlamadaNoContesatada();
  }

  /**
   * Cancela y cierra el modal
   */
  public cancelar(): void {
    this.dialogRef.close();
  }

  /**
   * Guardaa causas
   */
  public guardar() {
    const causa = this.formulario.get('causa').value;
    const objectoCausa = this.lineaModalUnicaModel.repuestaCausas.filter(value => value.idCausa === causa);
    console.log(JSON.stringify(this.lineaModalUnicaModel.lineaUnica));
    if (this.datos !== undefined || this.datos !== null) {
      if (this.datos.intentos < 4) {
        this.datos.bloqueoUsuario = false;
        this.datos.estado = 'POR_GESTIONAR';
        this.lineaModalUnicaModel.lineaUnica = Object.assign({}, this.datos,
          {'causasLlamadaNoContestada': objectoCausa[0]} );
        this.guardarIntento();
      } else if (this.datos.intentos === 4 ) {
        this.datos.bloqueoUsuario = false;
        this.datos.estado =  'NO_GESTIONADO';
        this.lineaModalUnicaModel.lineaUnica = Object.assign({}, this.datos,
          {'causasLlamadaNoContestada': objectoCausa[0]} );
        this.guardarIntento();
      }
    }

  }

  /**
   * inicializa formulario
   * @returns {LineaUnicaModelNoContestada}
   */
 public modelInit(): LineaUnicaModelNoContestada {
    return new LineaUnicaModelNoContestada(null, null, null, null);
 }


 private inicializarForm() {
    this.formulario = this.fb.group({
      causa: [{value: ''}, Validators.compose([Validators.required])]
    });
 }

 private consultarListaLlamadaNoContesatada() {
   this.lineaUnicaServices.consultarCausaLLamadaNoContestada()
     .subscribe(causasLlamada => {
          this.lineaModalUnicaModel.repuestaCausas = causasLlamada;
     }, error => {
       this.capturaDeErroresService.mapearErrores(error.status, error.error)

     }, () => {});
 }


  /**
   * Guarda los intentos del usuario
   */
 private guardarIntento() {
   this.lineaUnicaServices.guardarIntento(this.lineaModalUnicaModel.lineaUnica)
     .subscribe(value => {
       this.mensajeServices.mostrarMensajeExito('Se guardo correctamente');
       const cerrar = true;
       this.dialogRef.close(cerrar);
     }, error => {
       this.capturaDeErroresService.mapearErrores(error.status, error.error)
     });
 }


}
