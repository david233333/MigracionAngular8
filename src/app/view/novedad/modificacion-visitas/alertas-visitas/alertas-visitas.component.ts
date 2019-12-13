import { Component, OnInit } from '@angular/core';
import { AlertasVisitasModel } from './alertas-visitas.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MensajesService } from '../../../../shared/services/mensajes.service';
import { MatDialog } from '@angular/material';
import { ModalVisitaAlertaMensajeComponent } from './modal-visita-alerta-mensaje/modal-visita-alerta-mensaje.component';
import { AgregadosNovedadService } from '../../../../shared/services/agregados-novedad.service';
import { ProgramacionCitaService } from '../../../../domain/usecase/programacion/programacion-cita.service';
import { DetalleVisitasComponent } from '../../../lineaUnica/lista-linea-unica/modal-linea-unica/detalle-visitas/detalle-visitas.component';
import { GestionNovedadService } from '../../../../domain/usecase/novedad/gestion-novedad.service';
import { AlertaVisita } from '../../../../domain/model/novedad/entity/alerta.model';
import { UsuarioService } from '../../../../shared/services/usuario.service';
import {CapturarErrores} from '../../../../shared/services/capturar-errores';

@Component({
  selector: 'sura-alertas-visitas',
  templateUrl: './alertas-visitas.component.html',
  styleUrls: ['./alertas-visitas.component.scss']
})
export class AlertasVisitasComponent implements OnInit {

  public formulario: FormGroup;
  public alertasVisitasModel: AlertasVisitasModel = this.initModelVisitas();
  public columnasCitas: any[];
  public visita: any;
  private textocambioAlerta = '';
  private duracion = '';
  private activarAlerta: boolean;
  public activarInput = true;

  constructor(private fb: FormBuilder,
    private mensajesService: MensajesService,
    private dialog: MatDialog,
    private infoRemisionNovedad: AgregadosNovedadService,
    private mensajeServices: MensajesService,
    private programacionServices: ProgramacionCitaService,
    private gestionNovedadServices: GestionNovedadService,
    private usuarioService: UsuarioService,
              private capturaDeErroresService: CapturarErrores) { }

  ngOnInit() {
    this.inicializarFormulario();
    this.generarColumnas();
    this.getDatosLista();

  }

  public activarValidadores($event) {

    if ($event.checked) {
      this.formulario.get('duracion').enable();
      this.activarValidoresMinutos(true);
    } else {
      this.formulario.controls['duracion'].disable();
      this.activarValidoresMinutos(false);
    }
  }

  public enviar() {
    if (this.formulario.valid) {
      this.guardar();
    } else {
      this.mensajesService.mostrarMensajeError(' Debes llenar todos los campos requeridos');
    }
  }

  public detalleVisita(rowData: any) {
    const dialogRef = this.dialog.open(DetalleVisitasComponent, {
      width: '70%',
      disableClose: true,
      data: { cita: rowData }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }



  public cambioAlerta() {
    if (this.textocambioAlerta.length !== this.formulario.get('alerta').value) {
      this.activarAlerta = true;
    } else if (this.textocambioAlerta === this.formulario.get('alerta').value) {
      this.activarAlerta = false;
    }
  }

  public cambioTiempo() {
    if (this.duracion.length !== this.formulario.get('duracion').value) {
      this.activarAlerta = true;
    } else if (this.duracion === this.formulario.get('duracion').value) {
      this.activarAlerta = false;
    }
  }

  public citasSeleccionadas($cita: any) {
    if (this.activarAlerta) {
      this.abrirConfirmacionAlerta();
    }
    if ($cita.alertaCitas.textoAlerta !== null) {
      this.formulario.get('alerta').setValue($cita.alertaCitas.textoAlerta);
    } else {
      this.formulario.get('alerta').setValue('');
    }
    this.formulario.controls['duracion'].disable();
    this.formulario.get('cambiarDuracion').setValue(null);
    this.alertasVisitasModel.alertaSeleccionada = $cita;
    const tiempoCita = this.alertasVisitasModel.alertaSeleccionada.duracion / 60;
    this.formulario.get('duracion').setValue(tiempoCita)
    this.textocambioAlerta = this.formulario.get('alerta').value;
    this.duracion = this.formulario.get('duracion').value;
    this.visita = $cita;
  }

  /**
   * Genera columnas para la tabla
   */
  private generarColumnas(): void {
    this.columnasCitas = [
      {
        field: this.alertasVisitasModel.mensajes.tabla.especialistaCampo,
        header: this.alertasVisitasModel.mensajes.tabla.especialista
      }, {
        field: this.alertasVisitasModel.mensajes.tabla.fechaVisitaCampo,
        header: this.alertasVisitasModel.mensajes.tabla.fechaVisita
      },
    ];
  }

  private getDatosLista() {
    this.consultarCitas();
  }


  private initModelVisitas(): AlertasVisitasModel {
    return new AlertasVisitasModel(null, null,
      [], null, '');
  }

  private inicializarFormulario() {
    this.formulario = this.fb.group({
      alerta: ['', Validators.compose([])],
      duracion: [{ value: '', disabled: this.activarInput }, Validators.compose([])],
      cambiarDuracion: [false, Validators.compose([])]
    });
  }

  /**
   * Abre el modal
   */
  private abrirConfirmacionAlerta(): void {
    const IDREMISION = this.infoRemisionNovedad.datosRemision.idRemision;
    const dialogRef = this.dialog.open(ModalVisitaAlertaMensajeComponent, {
      width: '50%',
      disableClose: true,
      data: {
        idRemision: IDREMISION,
        visita: this.visita,
        alerta: this.formulario.get('alerta').value,
        duracion: this.formulario.get('duracion').value,
        cambiarDuracion: this.formulario.get('cambiarDuracion').value
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.activarAlerta = result;
    });
  }

  private consultarCitas() {
    if (this.infoRemisionNovedad.datosRemision !== null || this.infoRemisionNovedad.datosRemision !== undefined) {
      this.alertasVisitasModel.idRemision = this.infoRemisionNovedad.datosRemision.idRemision;
      const IDREMISION = this.infoRemisionNovedad.datosRemision.idRemision;
      const ESPECIALIDAD = 'Enfermeria';
      this.programacionServices.getProgramacionEspecialidad(IDREMISION, ESPECIALIDAD)
        .subscribe((programacion) => {
          this.alertasVisitasModel.respuestaCitas = programacion;
          console.log(this.alertasVisitasModel.respuestaCitas);
        }, error => this.capturaDeErroresService.mapearErrores(error.status, error.error));
    }

  }
  private activarValidoresMinutos(validador: boolean) {
    if (validador) {
      this.formulario.get('duracion').clearValidators();
      this.formulario.get('duracion').setValidators(
        Validators.compose([
          Validators.required,
          Validators.pattern('^([0-9]{1,3600})')
        ])
      );
      this.formulario.get('duracion').updateValueAndValidity();
      this.findInvalidControls(this.formulario);
    } else {

      this.formulario.get('duracion').clearValidators();
      this.formulario.get('duracion').setValidators(
        Validators.compose([

        ])
      );
      this.formulario.get('duracion').updateValueAndValidity();
      this.findInvalidControls(this.formulario);

    }
  }

  private findInvalidControls(formulario: FormGroup) {
    const invalid = [];
    const controls = formulario.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log('invalidos ', invalid);
  }

  private guardar() {
    const alertas = this.alertasVisitasModel.alertaSeleccionada;
    const converterSegundos = this.formulario.get('duracion').value * 60;
    console.log(converterSegundos);
    const IDREMISION = this.infoRemisionNovedad.datosRemision.idRemision;
    const alerta: AlertaVisita = new AlertaVisita(null,
      alertas.idCitaNumber, IDREMISION, new Date(),
      this.formulario.get('alerta').value,
      this.formulario.get('cambiarDuracion').value, converterSegundos,
      this.usuarioService.InfoUsuario);
    this.gestionNovedadServices.guardarAlertaVisita(alerta).subscribe(() => {
      this.mensajeServices.mostrarMensajeExito('Se guardo correctamente la alerta');
    }, error => {
      this.capturaDeErroresService.mapearErrores(error.status, error.error)
    });
    this.activarAlerta = false;

  }


}
