import {AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
// tslint:disable-next-line:import-blacklist
import {Subscription} from 'rxjs';
import {ModalCitaGestionViewModel} from './modal-cita-gestion.view-model';
import {DetalleGestionComponent} from '../detalle-gestion.component';
import {MensajesService} from '../../../../../shared/services/mensajes.service';
import {GestionNovedadService} from '../../../../../domain/usecase/novedad/gestion-novedad.service';
import {GestionarNovedadRequest} from '../../../../../infraestructure/request-model/novedad/gestionar-novedad.request';
import {EstadosNovedadEnum} from '../../../../../shared/utils/enums/estados-novedad.enum';
// tslint:disable-next-line:max-line-length
import {DetalleVisitasComponent} from '../../../../lineaUnica/lista-linea-unica/modal-linea-unica/detalle-visitas/detalle-visitas.component';
import {UsuarioService} from '../../../../../shared/services/usuario.service';
import {CapturarErrores} from '../../../../../shared/services/capturar-errores';


moment.locale('es');

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'sura-modal-cita-gestion',
  templateUrl: './modal-cita-gestion.component.html',
  styleUrls: ['./modal-cita-gestion.component.scss']
})
export class ModalCitaGestionComponent implements OnInit, OnDestroy, AfterViewInit {

  public formulario: FormGroup;
  public fechaCita: Date = null;
  public configEspanolCalendario: any;
  public modalCitaGestionViewModel: ModalCitaGestionViewModel = this.iniciarViewModel();
  public columnasCitas: any[];
  public citaSeleccionada: any;
  public fechaMinimaCalendarioActual: Date;
  private gestionarEscalarNovedadSubscripcion = new Subscription();

  constructor(public dialogRef: MatDialogRef<DetalleGestionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private mensajesService: MensajesService,
              private gestionNovedadService: GestionNovedadService,
              public cdRef: ChangeDetectorRef,
              private dialog: MatDialog,
              private usuarioService: UsuarioService,
              private capturaDeErroresService: CapturarErrores) {
    this.crearFormularioCitas();
    this.generarColumnasCitas();
    this.modalCitaGestionViewModel.tipoFecha = this.modalCitaGestionViewModel.mensajes.campos.listaCita;
    this.configurarMinimaFechaActual();
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.verDatos();
    this.configurarCalendario();
  }


  ngOnDestroy() {
    this.gestionarEscalarNovedadSubscripcion.unsubscribe();
  }

  public aplicarCita(): void {

    console.log('modalCitaGestionViewModel.novedadSeleccionada ', this.modalCitaGestionViewModel.novedadSeleccionada);

    let fechaVisita = null;

    if (this.formulario.controls['tipoFecha'].value === this.modalCitaGestionViewModel.mensajes.campos.listaCita) {
      fechaVisita = this.modalCitaGestionViewModel.novedadSeleccionada.fechaInicioCita;
    } else {
      fechaVisita = this.formulario.get('fechaVisita').value;
    }

    const GESTION_NOVEDAD = new GestionarNovedadRequest(
      this.data.idSolicitud,
      EstadosNovedadEnum.GESTIONADA,
      this.data.tipoNovedad,
      fechaVisita,
      this.usuarioService.InfoUsuario
    );

    console.log('REQUEST - GESTIONAR ', JSON.stringify(GESTION_NOVEDAD));

    this.gestionarEscalarNovedadSubscripcion =
      this.gestionNovedadService.gestionarNovedadManual(GESTION_NOVEDAD)
        .subscribe(
          response => {
            console.log('RESPONSE - GESTIONAR ', response);
            this.mensajesService.mostrarMensajeExito
            (this.modalCitaGestionViewModel.mensajes.mensajesAlerta.exitoGestionarSolicitud);
            this.dialogRef.close(true);
          },
          (error) => {
            this.capturaDeErroresService.mapearErrores(error.status, error.error);
          },
          () => {
          }
        );


  }

  public cerrarModal(): void {
    this.dialogRef.close(null);
  }

  public seleccionFecha(fecha: any): void {
    if (fecha.value === this.modalCitaGestionViewModel.mensajes.campos.listaCita) {
      this.fechaCita = null;
      this.formulario.get('fechaVisita').setValue(null);
      this.controlesRequeridosManejo(true);
    } else {
      this.modalCitaGestionViewModel.novedadSeleccionada = null;
      this.controlesRequeridosManejo(false);
    }
  }

  habilitarAplicar(): boolean {
    if (this.modalCitaGestionViewModel.tipoFecha === this.modalCitaGestionViewModel.mensajes.campos.listaCita) {
      return this.modalCitaGestionViewModel.novedadSeleccionada == null ? true : false;
    } else {
      return this.fechaCita == null ? true : false;
    }
  }

  /**
   * Obtiene las citas para aplicar el nuevo plan de manejo
   */
  public getCitas(): void {
    console.log('this.data programacion ', this.data);
  }

  /**
   * Detalle cita
   */
  public detalleCita($detallecita) {
    const dialogRef = this.dialog.open(DetalleVisitasComponent, {
      width: '70%',
      disableClose: true,
      data: {cita: $detallecita}
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  private verDatos(): void {
    console.log('this.data ', this.data);
    if (this.data.visitas.length > 0) {
      this.modalCitaGestionViewModel.respuestaCitas = this.data.visitas;
    } else {
      this.modalCitaGestionViewModel.tipoFecha = 'fechaCita';
    }
  }

  private limpiarControlesManejo(): void {
    this.formulario.reset();
    this.fechaCita = null;
  }


  /**
   * Genera columnas para la tabla
   */
  private generarColumnasCitas(): void {

    this.columnasCitas = [
      {
        field: this.modalCitaGestionViewModel.mensajes.tabla.visitaCampo,
        header: this.modalCitaGestionViewModel.mensajes.tabla.visita
      },
      {
        field: this.modalCitaGestionViewModel.mensajes.tabla.fechaCampo,
        header: this.modalCitaGestionViewModel.mensajes.tabla.fecha
      },
    ];
  }


  private controlesRequeridosManejo(esSeleccionCita: boolean): void {
    if (esSeleccionCita) {
      this.cambiarValidadorFormularioAOpcional(this.formulario, 'fechaVisita');
    } else {
      this.cambiarValidadorFormularioARequerido(this.formulario, 'fechaVisita', null, null, null);
    }
  }


  /**
   * Cambia los validadores de un control del formulario
   * @param {FormGroup} formulario
   * @param {string} nombrecontrol
   */
  private cambiarValidadorFormularioARequerido(formulario: FormGroup, nombrecontrol: string, expRegular: string,
                                               valMinimo: number, valMaximo: number): void {
    formulario.get(nombrecontrol).clearValidators();
    formulario.get(nombrecontrol).setValidators(
      Validators.compose([
        Validators.required,
        Validators.pattern(expRegular),
        Validators.min(valMinimo),
        Validators.max(valMaximo)
      ])
    );
    formulario.get(nombrecontrol).updateValueAndValidity();
  }


  /**
   * Cambia los validadores de un control del formulario
   * @param {FormGroup} formulario
   * @param {string} nombrecontrol
   */
  private cambiarValidadorFormularioAOpcional(formulario: FormGroup, nombrecontrol: string): void {
    formulario.get(nombrecontrol).clearValidators();
    formulario.get(nombrecontrol).setValidators(
      Validators.compose([])
    );
    formulario.get(nombrecontrol).updateValueAndValidity();
  }

  /**
   * Válida todos los campos del formulario
   * @param formGroup
   */
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


  /**
   * Crea los campos del formulario Citas con sus respectivas validaciones
   */
  private crearFormularioCitas(): void {
    console.log('this.data.visitas', this.data.visitas);
    this.formulario = this.fb.group({
      tipoFecha: [{value: null, disabled: this.data.visitas.length === 0},
        Validators.compose([
          Validators.required
        ])],
      fechaVisita: ['', Validators.compose([
        Validators.required
      ])],
    });
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): ModalCitaGestionViewModel {
    return new ModalCitaGestionViewModel(
      null,
      false,
      [],
      false,
      false,
      null,
      null,
      false
    );
  }

  private configurarMinimaFechaActual(): void {
    const fechaHoy = new Date();
    this.fechaMinimaCalendarioActual = new Date();
    this.fechaMinimaCalendarioActual.setDate(fechaHoy.getDate());
    this.fechaMinimaCalendarioActual.setMonth(fechaHoy.getMonth());
    this.fechaMinimaCalendarioActual.setFullYear(fechaHoy.getFullYear());
  }

  private configurarCalendario(): void {
    this.configEspanolCalendario = {
      firstDayOfWeek: 1,
      dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      today: 'Hoy',
      clear: 'Borrar'
    };
  }
}
