import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TabView } from 'primeng/primeng';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

import { MensajesService } from '../../../../shared/services/mensajes.service';
import { TipoTratamientoEnum } from '../../../../shared/utils/enums/tipo-tratamiento.enum';
import { Guid } from 'guid-typescript';
import { Tratamiento } from '../../../../domain/model/novedad/entity/plan-manejo/tratamiento.model';

import { PlanManejoComponent } from '../plan-manejo.component';
import { ModalTratamientosViewModel } from './modal-tratamientos.view-model';
import { PlanManejoService } from '../../../../domain/usecase/novedad/plan-manejo-novedad.service';
import { Medicamento } from '../../../../domain/model/maestro/entity/medicamento.model';
import { Dosis } from '../../../../domain/model/maestro/entity/dosis.model';
import { ViaAdministracion } from '../../../../domain/model/maestro/entity/via-administracion.model';
import { Frecuencia } from '../../../../domain/model/maestro/entity/frecuencia.model';
import { CapturarErrores } from '../../../../shared/services/capturar-errores';
import { TurnoEnfermeria } from '../../../../shared/utils/enums/TurnoEnfermeria.enum';


moment.locale('es');


@Component({
  selector: 'sura-novedad-tratamientos',
  templateUrl: './modal-tratamientos.component.html',
  styleUrls: ['./modal-tratamientos.component.scss']
})
export class ModalTratamientosComponent implements OnInit, OnDestroy, AfterViewInit {

  public formularioMedicamentos: FormGroup;
  public formularioNebulizaciones: FormGroup;
  public formularioOxigeno: FormGroup;
  public dateUltimaAplicacion: Date;
  public ultimaAplicacionMedicamentos: Date;
  public ultimaAplicacionNebulizaciones: Date;
  public codigoMedicamentoModel: string;
  public configEspanolCalendario: any;
  public nombreFormulario: string;
  public modalTratamientosViewModel: ModalTratamientosViewModel = this.iniciarViewModel();
  @ViewChild(TabView, { static: true }) tabView: TabView;
  public textoMedicamento = new Subject<string>();
  public medicamentosFiltrados: Observable<Medicamento[]>;
  public fechaFinTratamiento: Date = new Date();
  public horasDosisFrecuencia: number;
  public seleccionMedicamentos: boolean;
  public seleccionNebulizaciones: boolean;
  public seleccionOxigenoterapia: boolean;
  public habilitarMedicamentos = true;
  public habilitarNebulizaciones = true;
  public habilitarOxigenoterapia = true;
  public readonly medicamentosData = 'MEDICAMENTO';
  public readonly nebulizacionData = 'NEBULIZACION';
  public readonly oxigenoTerapiaData = 'OXIGENO';
  private medicamentosSubscripcion: Subscription = new Subscription();
  private dosisSubscripcion: Subscription = new Subscription();
  private viasAdministracionSubscripcion: Subscription = new Subscription();
  private frecuenciaSubscripcion: Subscription = new Subscription();
  public valor = true;
  public rescate = true;
  public turno = true;
  public almacenar: any;

  constructor(public dialogRef: MatDialogRef<PlanManejoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private mensajesService: MensajesService,
    private planManejoService: PlanManejoService,
    public cdRef: ChangeDetectorRef,
    private capturaDeErroresService: CapturarErrores) {
    this.crearFormularioMedicamentos();
    this.crearFormularioNebulizaciones();
    this.crearFormularioOxigenoterapia();
    this.suscribirCampoTextoMedicamentos();
  }


  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.verDatos();
    this.configurarCalendario();
    this.verEdicionDetalle(this.data.tratamiento);
    this.modalTratamientosViewModel.esDetalle = this.data.esDetalle;
    this.cambiosParaCalcularFechaFinTratamiento();

  }


  ngOnDestroy() {
    this.medicamentosSubscripcion.unsubscribe();
    this.dosisSubscripcion.unsubscribe();
    this.viasAdministracionSubscripcion.unsubscribe();
    this.frecuenciaSubscripcion.unsubscribe();
  }

  calcularFechaFinTratamiento(fechaFinTratamiento: any, frecuencia: any, duracion: any): void {

    if ((fechaFinTratamiento !== '' && fechaFinTratamiento !== undefined) &&
      (frecuencia !== '' && frecuencia !== undefined) && duracion !== '') {
      this.fechaFinTratamiento = new Date(fechaFinTratamiento);
      this.horasDosisFrecuencia = frecuencia.split(' ')[0] * duracion;
      this.modalTratamientosViewModel.valorFechaFinTratamiento =
        moment(this.fechaFinTratamiento).add(this.horasDosisFrecuencia, 'hours').format('DD-MMMM-YYYY, hh:mm A');
    }
  }


  verEdicionDetalle(data: Tratamiento) {
    console.log('data: Tratamiento  edicion', data);
    if (data !== null) {
      switch (data.tratamiento) {
        case TipoTratamientoEnum.MEDICAMENTOS: {
          this.configurarFormulario(this.modalTratamientosViewModel.mensajes.opcionesMenu.medicamentos);
          this.nombreFormulario = this.modalTratamientosViewModel.mensajes.opcionesMenu.medicamentos;
          this.verTabSeleccionado(true, false, false);
          this.formularioMedicamentos.get('medicamento').setValue(data.medicamento);
          this.formularioMedicamentos.get('cantidadDosis').setValue(data.cantidadDosis);
          this.formularioMedicamentos.get('unidadDosis').setValue(data.unidadDosis.descripcion);
          this.formularioMedicamentos.get('viaAdministracion').setValue(data.viaAdministracion.descripcion);
          this.formularioMedicamentos.get('frecuencia').setValue(data.frecuencia.descripcion);
          this.formularioMedicamentos.get('duracion').setValue(data.duracion);
          this.formularioMedicamentos.get('tieneUltimaAplicacion').setValue(data.ultimaAplicacion != null ? true : false);
          this.formularioMedicamentos.get('turnoEnfermeria').setValue(data.turnoEnfermeria);

          if (data.rescate && data.unidadDosisRescate && data.cantidadDosisRescate != null) {
            this.formularioMedicamentos.get('rescate').setValue(data.rescate);
            this.formularioMedicamentos.get('cantidadDosisRescate').setValue(data.cantidadDosisRescate);
            this.formularioMedicamentos.get('unidadDosisRescate').setValue(data.unidadDosisRescate.descripcion);
            this.formularioMedicamentos.get('dosisDiaRescate').setValue(data.dosisDiaRescate);
            this.apareceRescate(this.formularioMedicamentos.get('viaAdministracion').value); //hubo cambio
            if (data.rescate == true) {
              this.medicamentoRescateOnchange({ value: true });
            } else {
              this.medicamentoRescateOnchange({ value: false });
            }
          }

          if (data.ultimaAplicacion != null) {
            this.calcularFechaFinTratamiento(data.ultimaAplicacion, data.frecuencia.descripcion, data.duracion);
            this.formularioMedicamentos.get('ultimaAplicacion').setValue(new Date(data.ultimaAplicacion));
            this.ultimaAplicacionMedicamentos = new Date(data.ultimaAplicacion);
          }

          this.formularioMedicamentos.get('noPBS').setValue(data.noPBS);

          break;
        }
        case TipoTratamientoEnum.NEBULIZACIONES: {
          this.configurarFormulario(this.modalTratamientosViewModel.mensajes.opcionesMenu.nebulizaciones);
          this.nombreFormulario = this.modalTratamientosViewModel.mensajes.opcionesMenu.nebulizaciones;
          this.verTabSeleccionado(false, true, false);

          this.formularioNebulizaciones.get('medicamento').setValue(data.medicamento);
          this.formularioNebulizaciones.get('cantidadDosis').setValue(data.cantidadDosis);
          this.formularioNebulizaciones.get('unidadDosis').setValue(data.unidadDosis.descripcion);
          this.formularioNebulizaciones.get('viaAdministracion').setValue(data.viaAdministracion.descripcion);
          const DILUYENTE = data.diluyente === this.modalTratamientosViewModel.mensajes.campos.diluyenteSolucionSalina ?
            this.modalTratamientosViewModel.mensajes.campos.diluyenteSolucionSalina :
            this.modalTratamientosViewModel.mensajes.campos.diluyenteOtro;
          this.modalTratamientosViewModel.diluyente = DILUYENTE;
          const OTRO_DILUYENTE = data.diluyente === this.modalTratamientosViewModel.mensajes.campos.diluyenteSolucionSalina ?
            null : data.diluyente;
          this.formularioNebulizaciones.get('otroDiluyente').setValue(OTRO_DILUYENTE);
          this.formularioNebulizaciones.get('cantidadDiluyente').setValue(data.cantidadDiluyente);
          this.formularioNebulizaciones.get('frecuencia').setValue(data.frecuencia.descripcion);
          this.formularioNebulizaciones.get('duracion').setValue(data.duracion);

          if (data.ultimaAplicacion != null) {
            this.calcularFechaFinTratamiento(data.ultimaAplicacion, data.frecuencia.descripcion, data.duracion);
            this.formularioNebulizaciones.get('ultimaAplicacion').setValue(new Date(data.ultimaAplicacion));
            this.ultimaAplicacionNebulizaciones = new Date(data.ultimaAplicacion);
          }

          this.formularioNebulizaciones.get('noPBS').setValue(data.noPBS);
          break;
        }
        case TipoTratamientoEnum.OXIGENO: {
          this.configurarFormulario(this.modalTratamientosViewModel.mensajes.opcionesMenu.oxigenoterapia);
          this.nombreFormulario = this.modalTratamientosViewModel.mensajes.opcionesMenu.oxigenoterapia;
          this.verTabSeleccionado(false, false, true);
          this.formularioOxigeno.get('medicamento').setValue(data.medicamento);
          this.formularioOxigeno.get('cantidadDosis').setValue(data.cantidadDosis);
          this.formularioOxigeno.get('unidadDosis').setValue(data.unidadDosis.descripcion);
          this.formularioOxigeno.get('viaAdministracion').setValue(data.viaAdministracion.descripcion);
          this.formularioOxigeno.get('frecuencia').setValue(data.frecuencia.descripcion);
          this.formularioOxigeno.get('duracion').setValue(data.duracion);
          this.formularioOxigeno.get('noPBS').setValue(data.noPBS);
          break;
        }
      }
    }
  }

  verTabSeleccionado(esMedicamentos: boolean, esNebulizaciones: boolean, esOxigenoterapia: boolean): void {
    this.seleccionMedicamentos = esMedicamentos;
    this.seleccionNebulizaciones = esNebulizaciones;
    this.seleccionOxigenoterapia = esOxigenoterapia;

    this.habilitarMedicamentos = esMedicamentos;
    this.habilitarNebulizaciones = esNebulizaciones;
    this.habilitarOxigenoterapia = esOxigenoterapia;
  }

  seleccionarPlan($event) {
    this.configurarFormulario(this.tabView.tabs[$event.index].header);
  }

  public fechaFinTratamientoVisible(): boolean {
    return this.formularioMedicamentos.controls['frecuencia'].value &&
      this.formularioMedicamentos.controls['duracion'].value && this.formularioMedicamentos.controls['ultimaAplicacion'].value;
  }

  public guardarPlanManejo(): void {
    switch (this.nombreFormulario) {
      case this.modalTratamientosViewModel.mensajes.opcionesMenu.medicamentos: {

        if (this.mostrarInformacion(this.formularioMedicamentos.controls['medicamento'].value) === undefined) {
          this.formularioMedicamentos.get('medicamento').setValue(null);
        }

        if (this.formularioMedicamentos.valid) {

          const UNIDAD_DOSIS: Dosis = this.modalTratamientosViewModel.respuestaUnidadesDosisMedicamentos
            .find(c => c.descripcion === this.formularioMedicamentos.controls['unidadDosis'].value);
          const VIA_ADMINISTRACION: ViaAdministracion =
            this.modalTratamientosViewModel.respuestaViasAdministracionMedicamentos
              .find(c => c.descripcion === this.formularioMedicamentos.controls['viaAdministracion'].value);
          const FRECUENCIA: Frecuencia = this.modalTratamientosViewModel.respuestaFrecuenciasMedicamentos
            .find(c => c.descripcion === this.formularioMedicamentos.controls['frecuencia'].value);
          const UNIDAD_DOSIS_RESCATE: Dosis = this.modalTratamientosViewModel.respuestaUnidadesDosisMedicamentos.find(c => c.descripcion === this.formularioMedicamentos.controls['unidadDosisRescate'].value);


          const TRATAMIENTO = new Tratamiento(
            /////original
            '',
            Guid.create().toString(),
            '',
            TipoTratamientoEnum.MEDICAMENTOS,
            this.formularioMedicamentos.controls['medicamento'].value,
            this.formularioMedicamentos.controls['cantidadDosis'].value,
            UNIDAD_DOSIS,
            VIA_ADMINISTRACION,
            null,
            null,
            FRECUENCIA,
            this.formularioMedicamentos.controls['duracion'].value,
            this.formularioMedicamentos.controls['tieneUltimaAplicacion'].value === true ?
              this.formularioMedicamentos.controls['ultimaAplicacion'].value : null,
            this.formularioMedicamentos.controls['noPBS'].value,
            this.formularioMedicamentos.controls['duracion'].value,
            ////

            ///////rescate
            this.formularioMedicamentos.controls['rescate'].value,
            this.formularioMedicamentos.controls['turnoEnfermeria'].value,
            this.formularioMedicamentos.controls['cantidadDosisRescate'].value,
            UNIDAD_DOSIS_RESCATE,
            this.formularioMedicamentos.controls['dosisDiaRescate'].value,
            /////////////
          );
          console.log('TRATAMIENTO ', TRATAMIENTO);
          this.dialogRef.close(TRATAMIENTO);

        } else {
          this.validarTodosLosCamposDelFormulario(this.formularioMedicamentos);
        }

        break;
      }
      case this.modalTratamientosViewModel.mensajes.opcionesMenu.nebulizaciones: {

        if (this.mostrarInformacion(this.formularioNebulizaciones.controls['medicamento'].value) === undefined) {
          this.formularioNebulizaciones.get('medicamento').setValue(null);
        }

        if (this.formularioNebulizaciones.valid) {

          const UNIDAD_DOSIS: Dosis = this.modalTratamientosViewModel.respuestaUnidadesDosisNebulizaciones
            .find(c => c.descripcion === this.formularioNebulizaciones.controls['unidadDosis'].value);
          const VIA_ADMINISTRACION: ViaAdministracion =
            this.modalTratamientosViewModel.respuestaViasAdministracionNebulizaciones
              .find(c => c.descripcion === this.formularioNebulizaciones.controls['viaAdministracion'].value);
          const FRECUENCIA: Frecuencia = this.modalTratamientosViewModel.respuestaFrecuenciasNebulizaciones
            .find(c => c.descripcion === this.formularioNebulizaciones.controls['frecuencia'].value);

          const TRATAMIENTO = new Tratamiento(
            '',
            Guid.create().toString(),
            '',
            TipoTratamientoEnum.NEBULIZACIONES,
            this.formularioNebulizaciones.controls['medicamento'].value,
            this.formularioNebulizaciones.controls['cantidadDosis'].value,
            UNIDAD_DOSIS,
            VIA_ADMINISTRACION,
            this.formularioNebulizaciones.controls['diluyente'].value ===
              this.modalTratamientosViewModel.mensajes.campos.diluyenteSolucionSalina ?
              this.modalTratamientosViewModel.mensajes.campos.diluyenteSolucionSalina :
              this.formularioNebulizaciones.controls['otroDiluyente'].value,
            this.formularioNebulizaciones.controls['cantidadDiluyente'].value,
            FRECUENCIA,
            this.formularioNebulizaciones.controls['duracion'].value,
            this.formularioNebulizaciones.controls['ultimaAplicacion'].value,
            this.formularioNebulizaciones.controls['noPBS'].value,
            null,
            this.formularioNebulizaciones.controls['duracion'].value
          );

          this.dialogRef.close(TRATAMIENTO);

        } else {
          this.validarTodosLosCamposDelFormulario(this.formularioNebulizaciones);
        }

        break;
      }
      case this.modalTratamientosViewModel.mensajes.opcionesMenu.oxigenoterapia: {

        if (this.formularioOxigeno.valid) {

          const UNIDAD_DOSIS: Dosis = this.modalTratamientosViewModel.respuestaUnidadesDosisOxigenoterapia
            .find(c => c.descripcion === this.formularioOxigeno.controls['unidadDosis'].value);
          const VIA_ADMINISTRACION: ViaAdministracion =
            this.modalTratamientosViewModel.respuestaViasAdministracionOxigenoterapia
              .find(c => c.descripcion === this.formularioOxigeno.controls['viaAdministracion'].value);
          const FRECUENCIA: Frecuencia = this.modalTratamientosViewModel.respuestaFrecuenciasOxigenoterapia
            .find(c => c.descripcion === this.formularioOxigeno.controls['frecuencia'].value);

          const TRATAMIENTO = new Tratamiento(
            '',
            Guid.create().toString(),
            '',
            TipoTratamientoEnum.OXIGENO,
            this.formularioOxigeno.controls['medicamento'].value,
            this.formularioOxigeno.controls['cantidadDosis'].value,
            UNIDAD_DOSIS,
            VIA_ADMINISTRACION,
            null,
            null,
            FRECUENCIA,
            this.formularioOxigeno.controls['duracion'].value,
            null,
            this.formularioOxigeno.controls['noPBS'].value,
            this.formularioOxigeno.controls['duracion'].value

          );

          this.dialogRef.close(TRATAMIENTO);

        } else {
          this.validarTodosLosCamposDelFormulario(this.formularioOxigeno);
        }

        break;
      }
    }
  }


  //esta validacion es para cuando da click en el select suputaneo
  apareceRescate(event) { //hubo cambio aca, el event quedo sin el value
    console.log('este es el evento del click', event);
    console.log('el programa si llega?', this.data.programa)
    const cantidadDosisRescate = this.formularioMedicamentos.get('cantidadDosisRescate');
    const unidadDosisRescate = this.formularioMedicamentos.get('unidadDosisRescate');
    const dosisDiaRescate = this.formularioMedicamentos.get('dosisDiaRescate');



    this.validacionesRescateTurno(event)

    if (this.data.programa == 'Paliativos' && event == 'S.C.') {
      this.rescate = false; 
      this.turno = false; 
    }
    else if (event == this.data.descripcion) {
      this.rescate = false; 
      this.turno = false;
    }
    else if (event != 'S.C.') {
      this.rescate = true;
      this.valor = true; 
      this.turno = true;
      this.formularioMedicamentos.get('rescate').setValue(null);
      this.formularioMedicamentos.get('turnoEnfermeria').setValue(null);
      this.formularioMedicamentos.get('cantidadDosisRescate').setValue(null),
      this.formularioMedicamentos.get('unidadDosisRescate').setValue(null),
      this.formularioMedicamentos.get('dosisDiaRescate').setValue(null),
      cantidadDosisRescate.setValidators(null);
      unidadDosisRescate.setValidators(null);
      dosisDiaRescate.setValidators(null);
    }
    cantidadDosisRescate.updateValueAndValidity();
    unidadDosisRescate.updateValueAndValidity();
    dosisDiaRescate.updateValueAndValidity();
  }

  medicamentoRescateOnchange(event) { 
    this.validacionesRescate(event,null);
    console.log("el evento del checkbox 2", event)
    if (event) {
      this.valor = false;
    } else {
      this.valor = true;
    }
  }

  validacionesRescateTurno(event: string) {
    const turnoEnfermeria = this.formularioMedicamentos.get('turnoEnfermeria');
    this.validacionesRescate(null,event);

    if (event == 'S.C.') {
      turnoEnfermeria.setValidators(Validators.required);

    } else {
      turnoEnfermeria.clearValidators();
    }
    turnoEnfermeria.updateValueAndValidity();
  }

  validacionesRescate(check: boolean,programa: string) { 
    console.log('si entro en required y ', check)
    const cantidadDosisRescate = this.formularioMedicamentos.get('cantidadDosisRescate');
    const unidadDosisRescate = this.formularioMedicamentos.get('unidadDosisRescate');
    const dosisDiaRescate = this.formularioMedicamentos.get('dosisDiaRescate');


    if (check == true) {
      cantidadDosisRescate.setValidators(Validators.compose([
        Validators.required,
        Validators.maxLength(8),
        Validators.pattern('^([0-9]{1,4})+([.][0-9]{1,3})?$')
      ]));
      unidadDosisRescate.setValidators(Validators.required);
      dosisDiaRescate.setValidators(Validators.compose([
        Validators.required,
        Validators.maxLength(3),
        Validators.pattern('[0-9]+'),
        Validators.min(1),
        Validators.max(999)
      ]));


    } else if (check == false ) {
      cantidadDosisRescate.clearValidators();
      unidadDosisRescate.clearValidators();
      dosisDiaRescate.clearValidators();
      this.formularioMedicamentos.get('cantidadDosisRescate').setValue(null),
      this.formularioMedicamentos.get('unidadDosisRescate').setValue(null),
      this.formularioMedicamentos.get('dosisDiaRescate').setValue(null)

    }
    cantidadDosisRescate.updateValueAndValidity();
    unidadDosisRescate.updateValueAndValidity();
    dosisDiaRescate.updateValueAndValidity();

  };



  /**
   * obtiene los medicamentos
   */
  public getMedicamentos(data: string): void {
    let valorConsulta: string;
    if (data === this.nebulizacionData) {
      valorConsulta = this.formularioNebulizaciones.get('medicamento').value;
    } else if (data === this.medicamentosData) {
      valorConsulta = this.formularioMedicamentos.get('medicamento').value;
    } else if (data === this.oxigenoTerapiaData) {
      valorConsulta = this.formularioOxigeno.get('medicamento').value;
    }
    if (valorConsulta.length > 2) {
      this.medicamentosSubscripcion =
        this.planManejoService.getMedicamentos(valorConsulta.toUpperCase())
          .subscribe(
            response => {
              this.modalTratamientosViewModel.respuestaMedicamentos = response;
            },
            error => {
              this.capturaDeErroresService.mapearErrores(error.status, error.error);
            },
            () => {
              this.medicamentosSubscripcion.unsubscribe();
            }
          );
    }

  }

  /**
   * Obtiene las frecuencias según el tipo de tratamiento
   * @param tipo
   */
  getFrecuencia(tipo: string) {
    this.frecuenciaSubscripcion = this.planManejoService.getFrecuencias(tipo).subscribe(
      response => {
        if (response) {
          switch (tipo) {
            case TipoTratamientoEnum.MEDICAMENTOS: {
              this.modalTratamientosViewModel.respuestaFrecuenciasMedicamentos = response;
              break;
            }
            case TipoTratamientoEnum.NEBULIZACIONES: {
              this.modalTratamientosViewModel.respuestaFrecuenciasNebulizaciones = response;
              break;
            }
            case TipoTratamientoEnum.OXIGENO: {
              this.modalTratamientosViewModel.respuestaFrecuenciasOxigenoterapia = response;
              break;
            }
          }
        }
      },
      error => {
        this.capturaDeErroresService.mapearErrores(error.status, error.error);
      },
      () => {
        this.frecuenciaSubscripcion.unsubscribe();
      }
    );
  }

  public cerrarModal() {
    this.dialogRef.close();
  }

  /**
   * Cambia el campo del formulario
   * @param event
   */
  public cambiarDiluyente(event): void {
    const valor = event.value;
    if (valor === this.modalTratamientosViewModel.mensajes.campos.diluyenteOtro) {
      this.cambiarValidadorFormularioARequerido(this.formularioNebulizaciones, 'otroDiluyente', 100, '');
    } else {
      this.cambiarValidadorFormularioAOpcional(this.formularioNebulizaciones, 'otroDiluyente', 100, '');
    }
  }

  onChangeTieneUltimaAplicacion(event) {
    console.log('tiene ultima aplicacion', event)
    if (event.checked) {
      this.cambiarValidadorFormularioARequerido(this.formularioMedicamentos, 'ultimaAplicacion', null, null);
    } else {
      this.formularioMedicamentos.controls['ultimaAplicacion'].setValue(null);
      this.cambiarValidadorFormularioAOpcional(this.formularioMedicamentos, 'ultimaAplicacion', null, null);
    }
  }

  onChangeNoPBS(event) {
    if (event.checked) {
      window.open(this.modalTratamientosViewModel.mensajes.urls.urlNoPBS, '_blank');
    }
  }

  onCloseUltimaAplicacion() {

    switch (this.nombreFormulario) {
      case this.modalTratamientosViewModel.mensajes.opcionesMenu.medicamentos: {
        this.fechaFinTratamiento = new Date(this.formularioMedicamentos.controls['ultimaAplicacion'].value);
        this.horasDosisFrecuencia = this.formularioMedicamentos.controls['frecuencia'].value.split(' ')[0] *
          this.formularioMedicamentos.controls['duracion'].value;
        break;
      }
      case this.modalTratamientosViewModel.mensajes.opcionesMenu.nebulizaciones: {
        this.fechaFinTratamiento = new Date(this.formularioNebulizaciones.controls['ultimaAplicacion'].value);
        this.horasDosisFrecuencia = this.formularioNebulizaciones.controls['frecuencia'].value.split(' ')[0] *
          this.formularioNebulizaciones.controls['duracion'].value;
        break;
      }
    }
    this.modalTratamientosViewModel.valorFechaFinTratamiento = moment(this.fechaFinTratamiento).add(this.horasDosisFrecuencia, 'hours')
      .format('DD-MMMM-YYYY, hh:mm A'); // ('LLL');
  }

  /**
   * Observa los cambios en los controles de ultima aplicación, frecuencia y duración para calcular la fecha
   * fin de tratamiento
   */
  cambiosParaCalcularFechaFinTratamiento() {

    this.formularioMedicamentos.get('ultimaAplicacion').valueChanges.subscribe(
      value => this.calcularFechaFinTratamiento(value, this.formularioMedicamentos.controls['frecuencia'].value,
        this.formularioMedicamentos.controls['duracion'].value));

    this.formularioMedicamentos.get('frecuencia').valueChanges.subscribe(
      value => this.calcularFechaFinTratamiento(this.formularioMedicamentos.controls['ultimaAplicacion'].value, value,
        this.formularioMedicamentos.controls['duracion'].value));

    this.formularioMedicamentos.get('duracion').valueChanges.subscribe(
      value => this.calcularFechaFinTratamiento(this.formularioMedicamentos.controls['ultimaAplicacion'].value,
        this.formularioMedicamentos.controls['frecuencia'].value, value));


    this.formularioNebulizaciones.get('ultimaAplicacion').valueChanges.subscribe(
      value => this.calcularFechaFinTratamiento(value, this.formularioNebulizaciones.controls['frecuencia'].value,
        this.formularioNebulizaciones.controls['duracion'].value));

    this.formularioNebulizaciones.get('frecuencia').valueChanges.subscribe(
      value => this.calcularFechaFinTratamiento(this.formularioNebulizaciones.controls['ultimaAplicacion'].value, value,
        this.formularioNebulizaciones.controls['duracion'].value));

    this.formularioNebulizaciones.get('duracion').valueChanges.subscribe(
      value => this.calcularFechaFinTratamiento(this.formularioNebulizaciones.controls['ultimaAplicacion'].value,
        this.formularioNebulizaciones.controls['frecuencia'].value, value));
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

  private configurarFormulario(header: string): void {
    this.nombreFormulario = header;

    switch (header) {
      case this.modalTratamientosViewModel.mensajes.opcionesMenu.medicamentos: {
        this.modalTratamientosViewModel.tituloVentana =
          this.modalTratamientosViewModel.mensajes.tituloVentana.agregarEditarMedicamentos;
        this.verOpcionMedicamentos();
        break;
      }
      case this.modalTratamientosViewModel.mensajes.opcionesMenu.nebulizaciones: {
        this.modalTratamientosViewModel.tituloVentana =
          this.modalTratamientosViewModel.mensajes.tituloVentana.agregarEditarNebulizaciones;
        this.verOpcionNebulizaciones();
        break;
      }
      case this.modalTratamientosViewModel.mensajes.opcionesMenu.oxigenoterapia: {
        this.modalTratamientosViewModel.tituloVentana = this.modalTratamientosViewModel.mensajes.tituloVentana.agregarEditarOxigeno;
        this.verOpcionOxigenoterapia();
        break;
      }
    }
  }

  private verDatos(): void {
    this.verOpcionMedicamentos();
    this.verOpcionNebulizaciones();
    this.verOpcionOxigenoterapia();
  }

  private verOpcionMedicamentos(): void {
    this.nombreFormulario = this.modalTratamientosViewModel.mensajes.opcionesMenu.medicamentos;
    this.modalTratamientosViewModel.tituloVentana = this.modalTratamientosViewModel.mensajes.tituloVentana.agregarEditarMedicamentos;
    this.getDosis(TipoTratamientoEnum.MEDICAMENTOS);
    this.getViasAdministracion(TipoTratamientoEnum.MEDICAMENTOS);
    this.getFrecuencia(TipoTratamientoEnum.MEDICAMENTOS);
  }

  private verOpcionNebulizaciones(): void {
    this.getDosis(TipoTratamientoEnum.NEBULIZACIONES);
    this.getViasAdministracion(TipoTratamientoEnum.NEBULIZACIONES);
    this.getFrecuencia(TipoTratamientoEnum.NEBULIZACIONES);
  }

  private verOpcionOxigenoterapia(): void {
    this.getDosis(TipoTratamientoEnum.OXIGENO);
    this.getViasAdministracion(TipoTratamientoEnum.OXIGENO);
    this.getFrecuencia(TipoTratamientoEnum.OXIGENO);
  }

  /**
   * Obtiene las dosis según el tipo de tratamiento
   * @param tipo
   */
  private getDosis(tipo: string) {
    this.dosisSubscripcion = this.planManejoService.getDosis(tipo).subscribe(
      response => {
        if (response) {
          switch (tipo) {
            case TipoTratamientoEnum.MEDICAMENTOS: {
              this.modalTratamientosViewModel.respuestaUnidadesDosisMedicamentos = response;
              break;
            }
            case TipoTratamientoEnum.NEBULIZACIONES: {
              this.modalTratamientosViewModel.respuestaUnidadesDosisNebulizaciones = response;
              break;
            }
            case TipoTratamientoEnum.OXIGENO: {
              this.modalTratamientosViewModel.respuestaUnidadesDosisOxigenoterapia = response;
              break;
            }
          }
        }
      },
      error => {
        this.capturaDeErroresService.mapearErrores(error.status, error.error);

      },
      () => {
        this.dosisSubscripcion.unsubscribe();
      });
  }

  /**
   * Obtiene las vías de administración según el tipo de tratamiento
   * @param tipo
   */
  private getViasAdministracion(tipo: string) {
    this.viasAdministracionSubscripcion = this.planManejoService.getViasAdministracion(tipo).subscribe(
      response => {
        if (response) {
          switch (tipo) {
            case TipoTratamientoEnum.MEDICAMENTOS: {
              this.modalTratamientosViewModel.respuestaViasAdministracionMedicamentos = response;
              break;
            }
            case TipoTratamientoEnum.NEBULIZACIONES: {
              this.modalTratamientosViewModel.respuestaViasAdministracionNebulizaciones = response;
              break;
            }
            case TipoTratamientoEnum.OXIGENO: {
              this.modalTratamientosViewModel.respuestaViasAdministracionOxigenoterapia = response;
              break;
            }
          }
        }
      },
      error => {
        this.capturaDeErroresService.mapearErrores(error.status, error.error);
      },
      () => {
        this.viasAdministracionSubscripcion.unsubscribe();
      }
    );
  }

  /**
   * Suscribe los cambios cuando se cambia el medicamento
   */
  private suscribirCampoTextoMedicamentos(): void {
    this.medicamentosFiltrados = this.textoMedicamento
      .map(valor => (<HTMLInputElement>event.target).value)
      .debounceTime(1000)
      .distinctUntilChanged()
      .flatMap((textoABuscar) => {
        let medicamentos = new Array<Medicamento>();
        if (textoABuscar && textoABuscar !== '') {
          if (this.modalTratamientosViewModel.respuestaMedicamentos) {
            typeof textoABuscar === 'string' ?
              medicamentos = this.filtrar(textoABuscar) :
              medicamentos = this.filtrarObjetoMedicamento(textoABuscar);
          }
        }
        return Observable.of(medicamentos);
      });
  }

  /**
   * Filtra un objeto de tipo Medicamento por codigoMedicamento y nombre
   * @param {Medicamento} valor
   * @returns {Medicamento[]}
   */
  private filtrarObjetoMedicamento(valor: Medicamento): Medicamento[] {
    return this.modalTratamientosViewModel.respuestaMedicamentos
      ? this.modalTratamientosViewModel.respuestaMedicamentos.filter(
        option =>
          option.codigoMedicamento.toLowerCase().indexOf(valor.codigoMedicamento.toLowerCase()) !== -1 &&
          option.nombre.toLowerCase().indexOf(valor.nombre.toLowerCase()) !== -1 &&
          option.presentacion.toLowerCase().indexOf(valor.presentacion.toLowerCase()) !== -1
      )
      : new Array<Medicamento>();
  }

  /**
   * Filtra por codigo y nombre
   * @param {string} valor
   * @returns {string[]}
   */
  private filtrar(valor: string): Medicamento[] {
    return this.modalTratamientosViewModel.respuestaMedicamentos ?
      this.modalTratamientosViewModel.respuestaMedicamentos.filter(option =>
        option.codigoMedicamento.toLowerCase().indexOf(valor.toLowerCase()) !== -1 ||
        option.nombre.toLowerCase().indexOf(valor.toLowerCase()) !== -1 ||
        option.presentacion.toLowerCase().indexOf(valor.toLowerCase()) !== -1
      ) :
      new Array<Medicamento>();
  }

  /**
   * Muestra la informacion seleccionada como texto en el input
   * @param {Medicamento} medicamento
   * @returns {string | undefined}
   */
  private mostrarInformacion(medicamento?: Medicamento): string | undefined {
    return medicamento && medicamento.codigoMedicamento && medicamento.nombre && medicamento.presentacion ?
      `${medicamento.codigoMedicamento}' '${medicamento.nombre}' '${medicamento.presentacion}` :
      undefined;
  }

  /**
   * Cambia los validadores de un control del formulario
   * @param {FormGroup} formulario
   * @param {string} nombrecontrol
   * @param {number} numeroDigitos
   * @param {string} patronValidacion
   */
  private cambiarValidadorFormularioARequerido(formulario: FormGroup, nombrecontrol: string, numeroDigitos: number,
    patronValidacion: string): void {
    formulario.get(nombrecontrol).clearValidators();
    formulario.get(nombrecontrol).setValidators(
      Validators.compose([
        Validators.required,
        Validators.maxLength(numeroDigitos),
        Validators.pattern(patronValidacion)
      ])
    );
    formulario.get(nombrecontrol).updateValueAndValidity();
  }

  /**
   * Cambia los validadores de un control del formulario
   * @param {FormGroup} formulario
   * @param {string} nombrecontrol
   * @param {number} numeroDigitos
   * @param {string} patronValidacion
   */
  private cambiarValidadorFormularioAOpcional(formulario: FormGroup, nombrecontrol: string, numeroDigitos: number,
    patronValidacion: string): void {
    formulario.get(nombrecontrol).clearValidators();
    formulario.get(nombrecontrol).setValidators(
      Validators.compose([
        Validators.maxLength(numeroDigitos),
        Validators.pattern(patronValidacion)
      ])
    );
    formulario.get(nombrecontrol).updateValueAndValidity();
  }

  /**
   * Crea los campos del formulario Medicamentos con sus respectivas validaciones
   */
  private crearFormularioMedicamentos(): void {
    this.formularioMedicamentos = this.fb.group({
      medicamento: [{ value: null, disabled: this.data.esDetalle },
      Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])
      ],
      cantidadDosis: [{ value: null, disabled: this.data.esDetalle },
      Validators.compose([
        Validators.required,
        Validators.maxLength(8),
        Validators.pattern('^([0-9]{1,4})+([.][0-9]{1,3})?$')
      ])
      ],
      unidadDosis: [{ value: null, disabled: this.data.esDetalle },
      Validators.compose([Validators.required])],
      viaAdministracion: [{ value: null, disabled: this.data.esDetalle },
      Validators.compose([Validators.required])],
      frecuencia: [{ value: '', disabled: this.data.esDetalle },
      Validators.compose([Validators.required])],
      duracion: [{ value: null, disabled: this.data.esDetalle },
      Validators.compose([
        Validators.required,
        Validators.maxLength(3),
        Validators.pattern('[0-9]+'),
        Validators.min(1),
        Validators.max(999)
      ])
      ],
      tieneUltimaAplicacion: [{ value: false, disabled: this.data.esDetalle }],
      ultimaAplicacion: [{ value: null, disabled: this.data.esDetalle }],
      noPBS: [{ value: false, disabled: this.data.esDetalle }],

      rescate: [{ value: false, disabled: this.data.esDetalle }],
      turnoEnfermeria: [{ value: null, disabled: this.data.esDetalle }],

      cantidadDosisRescate: [{ value: null, disabled: this.data.esDetalle },
      Validators.compose([
        Validators.maxLength(8),
        Validators.pattern('^([0-9]{1,4})+([.][0-9]{1,3})?$')
      ])
      ],
      unidadDosisRescate: [{ value: null, disabled: this.data.esDetalle }],
      dosisDiaRescate: [{ value: null, disabled: this.data.esDetalle },
      Validators.compose([
        Validators.maxLength(3),
        Validators.pattern('[0-9]+'),
        Validators.min(1),
        Validators.max(999)
      ])
      ],
    });
  }

  /**
   * Crea los campos del formulario Nebulizaciones con sus respectivas validaciones
   */
  private crearFormularioNebulizaciones(): void {
    this.formularioNebulizaciones = this.fb.group({
      medicamento: [{ value: null, disabled: this.data.esDetalle },
      Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])
      ],
      cantidadDosis: [{ value: null, disabled: this.data.esDetalle },
      Validators.compose([
        Validators.required,
        Validators.maxLength(8),
        Validators.pattern('^([0-9]{1,4})+([.][0-9]{1,3})?$')
      ])
      ],
      unidadDosis: [{ value: null, disabled: this.data.esDetalle },
      Validators.compose([Validators.required])],
      viaAdministracion: [{ value: null, disabled: this.data.esDetalle },
      Validators.compose([Validators.required])],
      diluyente: [{ value: null, disabled: this.data.esDetalle }, Validators.compose([
        Validators.required
      ])],
      otroDiluyente: [{ value: null, disabled: this.data.esDetalle }],
      cantidadDiluyente: [{ value: null, disabled: this.data.esDetalle },
      Validators.compose([
        Validators.required,
        Validators.maxLength(8),
        Validators.pattern('^([0-9]{1,4})+([.][0-9]{1,3})?$')])],
      frecuencia: [{ value: '', disabled: this.data.esDetalle },
      Validators.compose([Validators.required])],
      duracion: [{ value: null, disabled: this.data.esDetalle },
      Validators.compose([
        Validators.required,
        Validators.maxLength(3),
        Validators.pattern('[0-9]+'),
        Validators.min(1),
        Validators.max(999)
      ])
      ],
      ultimaAplicacion: [{ value: null, disabled: this.data.esDetalle }],
      noPBS: [{ value: false, disabled: this.data.esDetalle }]
    });
  }

  /**
   * Crea los campos del formulario Oxigenoterapia con sus respectivas validaciones
   */
  private crearFormularioOxigenoterapia(): void {
    this.formularioOxigeno = this.fb.group({
      medicamento: [{ value: null, disabled: this.data.esDetalle },
      Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])
      ],
      cantidadDosis: [{ value: null, disabled: this.data.esDetalle },
      Validators.compose([
        Validators.required,
        Validators.maxLength(8),
        Validators.pattern('^([0-9]{1,4})+([.][0-9]{1,3})?$')
      ])
      ],
      unidadDosis: [{ value: null, disabled: this.data.esDetalle }, Validators.compose([Validators.required])],
      viaAdministracion: [{ value: null, disabled: this.data.esDetalle }, Validators.compose([Validators.required])],
      frecuencia: [{ value: '', disabled: this.data.esDetalle }, Validators.compose([Validators.required])],
      duracion: [{ value: null, disabled: this.data.esDetalle },
      Validators.compose([
        Validators.required,
        Validators.maxLength(3),
        Validators.pattern('[0-9]+'),
        Validators.min(1),
        Validators.max(999)
      ])
      ],
      noPBS: [{ value: false, disabled: this.data.esDetalle }],


    });
  }

  /**
   * Inicializa variables del view model
   */
  private iniciarViewModel(): ModalTratamientosViewModel {
    return new ModalTratamientosViewModel(
      null,
      false,
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      null,
      null,
      null,
      null,
      false);
  }

  private configurarCalendario(): void {
    this.configEspanolCalendario = {
      firstDayOfWeek: 1,
      dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre',
        'octubre', 'noviembre', 'diciembre'],
      monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      today: 'Hoy',
      clear: 'Borrar'
    };
  }
}
