import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy, AfterViewInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import * as moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ModalGestionBandejaDinamicaViewModel } from './modal-gestion-bandeja-dinamica.view-model';
import { GestionBandejaDinamicaComponent } from '../gestion-bandeja-dinamica.component';
moment.locale('es');

@Component({
  selector: 'sura-modal-gestion-bandeja-dinamica',
  templateUrl: './modal-gestion-bandeja-dinamica.component.html',
  styleUrls: ['./modal-gestion-bandeja-dinamica.component.scss']
})
export class ModalGestionBandejaDinamicaComponent implements OnInit, OnDestroy, AfterViewInit {
  public configEspanolCalendario: any;
  public modalGestionBandejaDinamicaViewModel: ModalGestionBandejaDinamicaViewModel = this.iniciarViewModel();
  public formulario: FormGroup;
  public fechaInicio: any;

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {
    this.configurarCalendario();
    console.log('data ayuda diagnostica ', this.data);
    this.verEdicion(this.data.ayudaDiagnostica);
  }

  ngOnDestroy() {
  }

  constructor(
    public dialogRef: MatDialogRef<GestionBandejaDinamicaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public cdRef: ChangeDetectorRef
  ) {
    this.crearFormulario();
  }

  verEdicion(data: any) {
    if (data !== null) {
      console.log('DATA ', data);
      this.formulario.get('nombreCompleto').setValue(data.nombrePaciente);
      this.formulario.get('tipoDocumento').setValue(data.tipoIdentificacion.idTipo);
      this.formulario
        .get('numeroDocumento')
        .setValue(data.numeroIdentificacion);
      this.formulario
        .get('genero')
        .setValue(data.sexoPaciente);
        this.formulario.get('direccion').setValue(data.direccion);
        this.formulario.get('barrio').setValue(data.barrio);
        this.formulario.get('telefonoContacto').setValue(data.telefono);
        this.formulario.get('laboratorio').setValue(data.laboratorio);
        this.formulario.get('medicoSolicita').setValue(data.medicoSolicita);
        this.formulario
        .get('fechaSolicitud')
        .setValue(new Date(data.fechaSolicitud));
        this.formulario
        .get('fechaProgramacion')
        .setValue(new Date(data.fechaTomaMuestra));
      this.formulario.get('usuarioSolicita').setValue(data.usuarioSolicita);
    }
  }

  public cerrarModal(): void {
    this.dialogRef.close();
  }


  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): ModalGestionBandejaDinamicaViewModel {
    return new ModalGestionBandejaDinamicaViewModel(null, null);
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formulario = this.fb.group({
      nombreCompleto: [
        { value: null, disabled: true },
        Validators.compose([Validators.maxLength(100)])
      ],
      tipoDocumento: [
        { value: null, disabled: true },
        Validators.compose([Validators.maxLength(20)])
      ],
      numeroDocumento: [
        { value: null, disabled: true },
        Validators.compose([
          Validators.maxLength(15),
          Validators.pattern('[0-9]+')
        ])
      ],
      genero: [
        { value: null, disabled: true },
        Validators.compose([Validators.maxLength(15)])
      ],
      direccion: [
        { value: null, disabled: true },
        Validators.compose([Validators.maxLength(200)])
      ],
      barrio: [
        { value: null, disabled: true },
        Validators.compose([Validators.maxLength(50)])
      ],
      telefonoContacto: [
        { value: null, disabled: true },
        Validators.compose([Validators.maxLength(20)])
      ],
      laboratorio: [
        { value: null, disabled: true },
        Validators.compose([Validators.maxLength(100)])
      ],
      medicoSolicita: [
        { value: null, disabled: true },
        Validators.compose([Validators.maxLength(100)])
      ],
      fechaSolicitud: [{ value: null, disabled: true }],
      fechaProgramacion: [{ value: null, disabled: true }],
      usuarioSolicita: [
        { value: null, disabled: true },
        Validators.compose([Validators.maxLength(50)])
      ],
    });
  }

  private configurarCalendario(): void {
    this.configEspanolCalendario = {
      firstDayOfWeek: 1,
      dayNames: [
        'domingo',
        'lunes',
        'martes',
        'miércoles',
        'jueves',
        'viernes',
        'sábado'
      ],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: [
        'enero',
        'febrero',
        'marzo',
        'abril',
        'mayo',
        'junio',
        'julio',
        'agosto',
        'septiembre',
        'octubre',
        'noviembre',
        'diciembre'
      ],
      monthNamesShort: [
        'ene',
        'feb',
        'mar',
        'abr',
        'may',
        'jun',
        'jul',
        'ago',
        'sep',
        'oct',
        'nov',
        'dic'
      ],
      today: 'Hoy',
      clear: 'Borrar'
    };
  }

  /**
   * Válida todos los campos del formulario
   * @param formGroup
   */
  validarTodosLosCamposDelFormulario(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validarTodosLosCamposDelFormulario(control);
      }
    });
  }
}
