import {AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {TabView} from 'primeng/primeng';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {MensajesService} from '../../../../shared/services/mensajes.service';
import {Guid} from 'guid-typescript';
import {ModalCitasViewModel} from './modal-citas.view-model';
import {CitasComponent} from '../citas.component';
import {Cita} from '../../../../domain/model/novedad/entity/cita.model';
import {ProgramacionSemana} from '../../../../shared/models/programacion-semana.model';
import {AgregadosComunService} from '../../../../shared/services/agregados-comun.service';
import {EstadosCitaEnum} from '../../../../shared/utils/enums/estados-cita.enum';
import {AgregadosNovedadService} from '../../../../shared/services/agregados-novedad.service';
import {ProgramacionCitaService} from '../../../../domain/usecase/programacion/programacion-cita.service';
import {ComunService} from '../../../../domain/usecase/comun/comun.service';
import {TipoCita} from '../../../../domain/model/maestro/entity/tipo-cita.model';
import {Usuario} from '../../../../shared/models/usuario.model';
import {CapturarErrores} from '../../../../shared/services/capturar-errores';
import {ModalConfirmacion} from '../../../../shared/models/modal-confirmacion.model';
import {ModalConfirmacionComponent} from '../../../../shared/components/modal-confirmacion/modal-confirmacion.component';
import {ProfesionalResponseModel} from '../../../../domain/model/maestro/entity/ProfesionalResponse.model';
import {MaestrosService} from '../../../../domain/usecase/comun/maestros.service';
import {RecursoPreferidoService} from '../../../../domain/usecase/novedad/RecursoPreferido.service';
import {Subscription} from 'rxjs/Subscription';

moment.locale('es');

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'sura-modal-citas',
  templateUrl: './modal-citas.component.html',
  styleUrls: ['./modal-citas.component.scss']
})
export class ModalCitasComponent implements OnInit, OnDestroy, AfterViewInit {
  public formularioCitas: FormGroup;
  public fechaFija: Date;
  public fechaPeriodica: Date;
  public configEspanolCalendario: any;
  public modalCitasViewModel: ModalCitasViewModel = this.iniciarViewModel();
  @ViewChild(TabView, { static: false }) tabView: TabView;
  public listaProgramacionSemana: Array<ProgramacionSemana> = [];
  public verTipoCita = false;
  public profesionalSeleccionado: any;
  public fechaMinimaCalendarioActual: Date;
  private citasSubscripcion: Subscription = new Subscription();
  private profesionesSubscripcion: Subscription = new Subscription();
  private fechaCita: any = null;
  public verProfesionalPreferido = false;
  private profesional: ProfesionalResponseModel;
  private CONTROL_TELEFONICO = '3';
  private REVISICON_EXAMENES = '21';
  private IDMEDICINACRONICOS = '3';
  private IDMEDICINAPALIATIVOS = '2';
  private IDPSICOLOGIA = '14';
  private IDTRABAJOSOCIAL = '13';
  private TIPO_MANEJO = '2';
  private tipoCita = '';
  public profesionalesList: ProfesionalResponseModel[] = [];
  private recursoPreferidoSubscription: Subscription = new Subscription();
  public deshabilitarRecursoPreferidoInput = false;
  public deshabilitarCheckBoxTipoCita = false;
  public deshabilitarTipoCitaSelect = false;
  private profesion: any = null;
  public loading = false;

  constructor(
    public dialogRef: MatDialogRef<CitasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private maestrosService: MaestrosService,
    private mensajesService: MensajesService,
    private comunService: ComunService,
    public infoComunes: AgregadosComunService,
    private infoRemisionNovedad: AgregadosNovedadService,
    private programacionCitaService: ProgramacionCitaService,
    public cdRef: ChangeDetectorRef,
    private capturaDeErroresService: CapturarErrores,
    private dialog: MatDialog,
    private recursoPreferido: RecursoPreferidoService
  ) {

    this.crearFormularioCitas();
    if (this.data.esDetalle) {
      this.verDatosDetalles();
    } else {
      this.data.esHistorial ? this.verDatosHistorial(this.data.remision) : this.verDatos();
    }
    this.configurarMinimaFechaActual();
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  ngOnInit() {

    this.configurarCalendario();
    this.modalCitasViewModel.esDetalle = this.data.esDetalle;

    if (this.data.btnEditar || this.data.esDetalle || this.data.esHistorial) {
      this.profesionalesList.push(this.data.cita.profesionalAsignado);
      this.deshabilitarCheckBoxTipoCita = true;
      this.deshabilitarTipoCitaSelect = true;

    }

  }

  ngOnDestroy() {
    this.citasSubscripcion.unsubscribe();
    this.profesionesSubscripcion.unsubscribe();
  }

  private verDatosDetalles(): void {
    this.verOpcionCitas();
    this.getProfesiones1();
  }

  public getProfesiones1(): void {
    this.profesionesSubscripcion = this.comunService.getProfesiones().subscribe(
      response => {
        console.log('Respuesta ', response);
        this.infoComunes.datosProfesionales = response;
        this.verEdicion(this.data.cita);
      },
      error => {
        this.capturaDeErroresService.mapearErrores(error.status, error.error);
      },
      () => {
      }
    );
  }


  public verValidacionProgramacion(): boolean {
    return this.modalCitasViewModel.diasSeleccionados.length <= 0;
  }


  public seleccionProfesional(profesion: any) {

    const elementosProfesionales: Array<any> = this.infoComunes.datosProfesionales;

    this.profesion = elementosProfesionales.filter(elemento => profesion === elemento.profesion)[0]; // antes profesion.value ahora profesion


    if (this.tipoCita !== '') {
      this.seleccionTipoCita({value: this.tipoCita});
    }

    this.modalCitasViewModel.diasSeleccionados = [];
    this.modalCitasViewModel.verProgramacionSemana = false;
    this.modalCitasViewModel.verOpcionManejo = true;
    this.modalCitasViewModel.verTipoCita = true;
    if (
      profesion ===  // antes profesion.value ahora profesion
      this.modalCitasViewModel.mensajes.profesiones.enfermeria.nombre
    ) {
      /*if (
        this.formularioCitas.controls['tipo'].value ===
        this.modalCitasViewModel.mensajes.campos.tipoAtencion.codigoValoracion
      ) {
        this.modalCitasViewModel.respuestaTiposCita = this.infoComunes.datosProfesionales
          .filter(
            s =>
              s.idProfesion ===
              this.modalCitasViewModel.mensajes.profesiones.enfermeria.id
          )[0]
          .profesionalList.filter(
            s =>
              s.idCita ===
              this.modalCitasViewModel.mensajes.profesiones.enfermeria.tiposCita
                .idHeridaMayor
          );
        this.formularioCitas.controls['tipoCita'].setValue(
          this.modalCitasViewModel.mensajes.profesiones.enfermeria.tiposCita
            .idHeridaMayor
        );
        this.modalCitasViewModel.verTipoCita = true;
        this.controlesRequeridosManejo(false);
      }*//*if (
        this.formularioCitas.controls['tipo'].value ===
        this.modalCitasViewModel.mensajes.campos.tipoAtencion.codigoManejo
      ) {
        this.modalCitasViewModel.verTipoCita = true;
        this.modalCitasViewModel.verOpcionManejo = true;
        this.formularioCitas.controls['tipoCita'].setValue(null);
      }*/
      this.modalCitasViewModel.tipoFecha = null;
      this.modalCitasViewModel.verFechaPeriodica = false;
      this.modalCitasViewModel.verProgramacionSemana = false;
      this.modalCitasViewModel.verFechaFija = false;
    } else {
      /*if (
        this.formularioCitas.controls['tipo'].value ===
        this.modalCitasViewModel.mensajes.campos.tipoAtencion.codigoValoracion
      ) {
        this.modalCitasViewModel.verTipoCita = false;
        this.formularioCitas.controls['tipoCita'].reset();
        this.controlesRequeridosManejo(false);
        this.limpiarControlesManejo();
      }*/
      this.controlesRequeridosManejo(true);
      this.modalCitasViewModel.verOpcionManejo = true;
      this.modalCitasViewModel.verGrupoFecha = true;
      this.modalCitasViewModel.verTipoCita = true;
      this.modalCitasViewModel.verFechaFija = false;
      this.modalCitasViewModel.verCitaExistente = false;
      this.modalCitasViewModel.verFechaPeriodica = false;
      this.modalCitasViewModel.verSemanas = false;
    }
    this.formularioCitas.get('tipoFecha').setValue(null);
    this.modalCitasViewModel.tipoFecha = null;
    this.modalCitasViewModel.respuestaTiposCita = this.infoComunes.datosProfesionales.filter(
      s => s.profesion === profesion // antes profesion.value ahora profesion
    )[0].profesionalList;


  }

  public seleccionTipo(tipo: any): void {
    // console.log('seleccionTipo tipo ', tipo);
    // if (this.formularioCitas.controls['profesional'].value) {
    //   if (tipo.value === this.modalCitasViewModel.mensajes.campos.tipoAtencion.codigoManejo) {
    //     this.modalCitasViewModel.respuestaTiposCita = this.infoComunes.datosProfesionales
    //       .filter(s => s.profesion.toLowerCase() === this.formularioCitas.controls['profesional'].value.toLowerCase())[0].profesionalList;
    //     this.modalCitasViewModel.verTipoCita = true;
    //     this.modalCitasViewModel.verOpcionManejo = true;
    //     this.controlesRequeridosManejo(true);
    //
    //   } else {
    //     if (this.formularioCitas.controls['profesional'].value === this.modalCitasViewModel.mensajes.profesiones.enfermeria.nombre) {
    //       this.modalCitasViewModel.respuestaTiposCita = this.infoComunes.datosProfesionales
    //         .filter(s => s.idProfesion === this.modalCitasViewModel.mensajes.profesiones.enfermeria.id)[0].profesionalList.filter(
    //         s => s.idCita === this.modalCitasViewModel.mensajes.profesiones.enfermeria.tiposCita.idHeridaMayor);
    //       this.formularioCitas.controls['tipoCita'].setValue(this.modalCitasViewModel.respuestaTiposCita[0].tipoCita);
    //       this.modalCitasViewModel.verTipoCita = true;
    //       this.modalCitasViewModel.verOpcionManejo = false;
    //       this.verProfesionalPreferido = false;
    //       this.formularioCitas.get('recursoPreferido').setValidators([]);
    //       this.formularioCitas.get('recursoPreferido').setValue('');
    //       this.formularioCitas.get('recursoPreferido').updateValueAndValidity();
    //     } else {
    //       this.modalCitasViewModel.verTipoCita = false;
    //       this.formularioCitas.controls['tipoCita'].setValue('');
    //       this.formularioCitas.get('recursoPreferido').setValidators([]);
    //       this.formularioCitas.get('recursoPreferido').setValue('');
    //       this.formularioCitas.get('recursoPreferido').updateValueAndValidity();
    //       this.verProfesionalPreferido = false;
    //       this.modalCitasViewModel.verOpcionManejo = false;
    //     }
    //     this.modalCitasViewModel.diasSeleccionados = [];
    //     this.controlesRequeridosManejo(false);
    //     this.limpiarControlesManejo();
    //   }
    // }
  }


  public seleccionTipoCita(tipo: any): void {
    this.validarMotrarRecursoPreferido(tipo);

    if (tipo === this.modalCitasViewModel.mensajes.profesiones.enfermeria.tiposCita.idHeridaMayor) { // ANTES tipo.value ahora tipo
      this.modalCitasViewModel.tituloGrupoFecha = this.modalCitasViewModel.mensajes.profesiones.enfermeria.tiposCita.heridaMayor;
      this.modalCitasViewModel.verGrupoFecha = false;
      this.fechaFija = null;
      this.modalCitasViewModel.verFechaFija = false;
      this.modalCitasViewModel.verCitaExistente = false;
      this.controlesRequeridosTipoCita(tipo); // ANTES tipo.value ahora tipo
      this.modalCitasViewModel.verSemanas = true;
      this.modalCitasViewModel.verProgramacionSemana = true;
      this.formularioCitas.controls['tipoFecha'].setValue(null);
      this.formularioCitas.controls['totalSesiones'].setValue(null);
    } else if (tipo === this.modalCitasViewModel.mensajes.profesiones.enfermeria.tiposCita.idHeridaMenor) { // ANTES tipo.value ahora tipo
      this.modalCitasViewModel.tituloGrupoFecha = this.modalCitasViewModel.mensajes.profesiones.enfermeria.tiposCita.heridaMenor;
      this.formularioCitas.controls['citaExistente'].reset();
      this.getCitasExistentes();
      this.modalCitasViewModel.verGrupoFecha = false;
      this.fechaFija = null;
      this.modalCitasViewModel.verFechaFija = false;
      this.modalCitasViewModel.verCitaExistente = true;
      this.controlesRequeridosTipoCita(tipo);  // ANTES tipo.value ahora tipo
      this.modalCitasViewModel.verSemanas = false;
      this.modalCitasViewModel.verProgramacionSemana = false;
      this.formularioCitas.controls['semanas'].setValue(null);
      this.modalCitasViewModel.diasSeleccionados = [];
      this.formularioCitas.controls['totalSesiones'].setValue(null);
    } else {
      this.modalCitasViewModel.tipoFecha = null;
      this.modalCitasViewModel.verCitaExistente = false;
      this.modalCitasViewModel.verFechaFija = false;
      this.modalCitasViewModel.verFechaPeriodica = false;
      this.modalCitasViewModel.tituloGrupoFecha = 'Fecha';
      this.modalCitasViewModel.verGrupoFecha = true;
      this.controlesRequeridosTipoCita(tipo);  // ANTES tipo.value ahora tipo
      this.modalCitasViewModel.verSemanas = false;
      this.modalCitasViewModel.verFechaPeriodica = false;
      this.modalCitasViewModel.verProgramacionSemana = false;
    }
  }

  private validarRecursoPreferido(): void {
    if ((this.data.idPrograma === '545' || this.data.idPrograma === '547' || this.data.idPrograma === '546') &&
      (this.profesion.idProfesion === this.IDMEDICINAPALIATIVOS || this.profesion.idProfesion === this.IDMEDICINACRONICOS ||
        this.profesion.idProfesion === this.IDPSICOLOGIA || this.profesion.idProfesion === this.IDTRABAJOSOCIAL)) {
      this.loading = true;
      this.getInfoRecursoPreferido();

    } else {
      this.deshabilitarRecursoPreferidoInput = false;
      this.formularioCitas.get('recursoPreferido').setValue('');
      this.formularioCitas.get('recursoPreferido').updateValueAndValidity();
      if (this.data.cita.profesionalAsignado.idProfesional && this.data.btnEditar) {
        this.formularioCitas.get('recursoPreferido').setValue(this.data.cita.profesionalAsignado.idProfesional);
        this.profesional = this.data.cita.profesionalAsignado;
        this.deshabilitarRecursoPreferidoInput = true;
      }
    }
  }

  private getInfoRecursoPreferido(): void {

    if (this.data.idNovedadPk !== null) {
      console.log(this.data.idNovedadPk);
      this.recursoPreferidoSubscription = this.recursoPreferido
        .getAgregadoRecursoPreferido(
          this.data.idNovedadPk
        )
        .subscribe(
          response => {


            const profesional = response.profesionalList.filter(elem => {
              if (this.data.codigoCiudad === '5608' && elem.especialidad === 'Medicina') {
                return elem.especialidad === 'Medicina';
              }
              return elem.especialidad === this.profesion.especialidad;
            })[0];

            this.deshabilitarRecursoPreferidoInput = true;
            if (response.profesionalList !== null && profesional !== undefined) {
              this.formularioCitas.get('recursoPreferido').setValue(profesional.idProfesional);
              this.formularioCitas.get('recursoPreferido').updateValueAndValidity();
              this.deshabilitarRecursoPreferidoInput = true;
              this.filtrarProfesional({value: this.formularioCitas.get('recursoPreferido').value});
            } else {
              this.mensajesService.mostrarMensajeError('Se debe asignar primero un profesional preferido en la sección "Info. Paciente"');
            }

            this.loading = false;
          },
          error => {
            this.capturaDeErroresService.mapearErrores(
              error.status,
              error.error
            );
            this.loading = false;
          },
          () => {
          }
        );
    } else {
      this.formularioCitas.get('recursoPreferido').setValue('');
      this.formularioCitas.get('recursoPreferido').updateValueAndValidity();
      this.deshabilitarRecursoPreferidoInput = true;
      this.loading = false;
      this.mensajesService.mostrarMensajeError('Se debe asignar primero un profesional preferido en la sección "Info. Paciente"');
    }

  }

  public filtrarProfesional(event): void {
    this.profesional = this.profesionalesList.filter(pro => pro.idProfesional === event)[0]; //ante event.value ahora event
  }

  public seleccionFecha(value: any): void {
    switch (value) {
      case this.modalCitasViewModel.mensajes.campos.tipoFechaCita
        .codigoCitaExistente:
        this.fechaFija = null;
        this.fechaPeriodica = null;
        this.formularioCitas.get('totalSesiones').setValue(null);
        this.modalCitasViewModel.verCitaExistente = true;
        this.modalCitasViewModel.verFechaFija = false;
        this.getCitasExistentes();
        this.controlesRequeridosFecha(this.modalCitasViewModel.mensajes.campos.tipoFechaCita.codigoCitaExistente);
        break;
      case this.modalCitasViewModel.mensajes.campos.tipoFechaCita.codigoFija:
        this.modalCitasViewModel.verFechaFija = true;
        this.fechaPeriodica = null;
        this.formularioCitas.get('totalSesiones').setValue(null);
        this.modalCitasViewModel.diasSeleccionados = [];
        this.modalCitasViewModel.verFechaPeriodica = false;
        this.modalCitasViewModel.verProgramacionSemana = false;
        this.modalCitasViewModel.verCitaExistente = false;
        this.controlesRequeridosFecha(this.modalCitasViewModel.mensajes.campos.tipoFechaCita.codigoFija);
        break;
      case this.modalCitasViewModel.mensajes.campos.tipoFechaCita.codigoPeriodica:
        this.fechaFija = null;
        this.formularioCitas.get('totalSesiones').setValue(null);
        this.modalCitasViewModel.verSemanas = false;
        this.modalCitasViewModel.verFechaPeriodica = true;
        this.modalCitasViewModel.verProgramacionSemana = true;
        this.modalCitasViewModel.verFechaFija = false;
        this.modalCitasViewModel.diasSeleccionados = [];
        this.controlesRequeridosFecha(this.modalCitasViewModel.mensajes.campos.tipoFechaCita.codigoPeriodica);
        break;
    }
  }

  public crearCita(): void {

    this.buscarControlesInvalidos();
    if (this.formularioCitas.valid) {
      const heridaMayorValoracion = this.formularioCitas.controls['tipoCita'].value ===
        this.modalCitasViewModel.mensajes.profesiones.enfermeria.tiposCita.idHeridaMayor;

      if (this.formularioCitas.controls['tipoFecha'].value === this.modalCitasViewModel.mensajes.campos.tipoFechaCita
        .codigoPeriodica || heridaMayorValoracion) {
        if (this.modalCitasViewModel.diasSeleccionados.length > 0) {
          this.modalCitasViewModel.diasSeleccionados.forEach(item => {
            this.listaProgramacionSemana.push(new ProgramacionSemana(item.id, item.dia));
          });
        } else {
          return;
        }
      }

      switch (this.formularioCitas.controls['tipoFecha'].value) {
        case this.modalCitasViewModel.mensajes.campos.tipoFechaCita.codigoCitaExistente:
          this.fechaCita = this.formularioCitas.controls['citaExistente'].value;
          break;
        case this.modalCitasViewModel.mensajes.campos.tipoFechaCita.codigoFija:
          this.fechaCita = this.formularioCitas.controls['fechaFija'].value;
          break;
        case this.modalCitasViewModel.mensajes.campos.tipoFechaCita.codigoPeriodica:
          this.fechaCita = this.formularioCitas.controls['fechaPeriodica'].value;
          break;
      }

      if (this.formularioCitas.controls['tipoCita'].value ===
        this.modalCitasViewModel.mensajes.profesiones.enfermeria.tiposCita.idHeridaMenor) {
        this.fechaCita = this.formularioCitas.controls['citaExistente'].value;
        this.formularioCitas.controls['tipoFecha'].setValue(this.modalCitasViewModel.mensajes.campos.tipoFechaCita.codigoCitaExistente);
      }

      const ESPECIALIDAD = this.infoComunes.datosProfesionales.filter(
        s => s.profesion === this.formularioCitas.controls['profesional'].value)[0].especialidad;


      const TIPO_CITA: TipoCita = this.modalCitasViewModel.respuestaTiposCita.find(
        c => c.idCita === this.formularioCitas.controls['tipoCita'].value);

      console.log('algonuevo', this.formularioCitas.controls['tipoCita'].value);
      console.log(TIPO_CITA);
      const tipo_citas = TIPO_CITA === undefined ? new TipoCita(null, null) : TIPO_CITA;
      console.log('tiposCitas', tipo_citas);
      //console.log('this.formularioCitas.controls[citaExistente].value ', this.formularioCitas.controls['citaExistente'].value);

      if ((this.tipoCita === this.CONTROL_TELEFONICO || this.tipoCita === this.REVISICON_EXAMENES) && this.profesional === null) {


      } else {
        const CITA = new Cita(
          Guid.create().toString(),
          this.infoRemisionNovedad.datosRemision.idRemision,
          this.formularioCitas.controls['profesional'].value,
          ESPECIALIDAD,
          this.TIPO_MANEJO,
          tipo_citas,
          this.formularioCitas.controls['tipoFecha'].value,
          this.fechaCita,
          this.formularioCitas.controls['semanas'].value,
          this.listaProgramacionSemana,
          EstadosCitaEnum.CREADO,
          this.formularioCitas.controls['tipoFecha'].value ===
          this.modalCitasViewModel.mensajes.campos.tipoFechaCita.codigoFija ? 1 : this.formularioCitas.controls['totalSesiones'].value,
          this.formularioCitas.controls['tipoFecha'].value ===
          this.modalCitasViewModel.mensajes.campos.tipoFechaCita.codigoFija ? 1 : this.formularioCitas.controls['totalSesiones'].value,
          new Usuario(null, null, null, null, null, null, null, null),
          null,
          this.profesional
        );

        console.log('CITA ', JSON.stringify(CITA));

        if (this.data.cita != null) {
          const dialogRefConfirmacion = this.dialog.open(ModalConfirmacionComponent,
            {
              width: '30%',
              disableClose: false,
              data: new ModalConfirmacion(
                '',
                this.modalCitasViewModel.mensajes.tituloVentana.contenidoAgregarReprogramarCita
              )
            }
          );

          dialogRefConfirmacion.afterClosed().subscribe(data => {
            if (data && data === true) {
              this.dialogRef.close(CITA);
            }
          });
        } else {
          this.dialogRef.close(CITA);
        }
      }
    } else {
      this.validarTodosLosCamposDelFormulario(this.formularioCitas);
    }

  }

  /**
   * Obtiene los motivos de cancelacion de visita
   */
  public getProfesiones(idPrograma: string): void {
    this.profesionesSubscripcion = this.comunService.getProfesionesIdPrograma(idPrograma).subscribe(
      response => {
        this.infoComunes.datosProfesionales = response;
        this.verEdicion(this.data.cita);
      },
      error => {
        this.capturaDeErroresService.mapearErrores(error.status, error.error);
      },
      () => {
      }
    );
  }

  public cerrarModal() {
    this.dialogRef.close();
  }

  /**
   * Busca cuales controles son inválidos en el formulario al hacer la petición
   */
  public buscarControlesInvalidos() {
    const invalid = [];
    const controls = this.formularioCitas.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log('controles invalidos ', invalid);
    return invalid;
  }

  private verEdicion1(data: any) {
    if (data !== null) {
      this.formularioCitas.get('profesional').setValue(data.profesional);
      this.modalCitasViewModel.respuestaTiposCita = this.infoComunes.datosProfesionales.filter(
        s => s.profesion === data.profesional
      )[0].profesionalList;
      this.formularioCitas.get('tipo').setValue(data.tipo);
      this.modalCitasViewModel.tipo = data.tipo;
      if (
        data.tipo ===
        this.modalCitasViewModel.mensajes.campos.tipoAtencion.codigoManejo
      ) {
        this.modalCitasViewModel.verOpcionManejo = true;
        this.modalCitasViewModel.verTipoCita = true;
        if (
          data.profesional ===
          this.modalCitasViewModel.mensajes.profesiones.enfermeria.nombre
        ) {
          if (
            data.tipoCita.idCita ===
            this.modalCitasViewModel.mensajes.profesiones.enfermeria.tiposCita
              .idHeridaMayor
          ) {
            this.modalCitasViewModel.verGrupoFecha = false;
            this.modalCitasViewModel.verCitaExistente = false;
            this.modalCitasViewModel.verSemanas = true;
            this.modalCitasViewModel.verProgramacionSemana = true;
            this.formularioCitas.get('semanas').setValue(data.semanas);
            this.controlesRequeridosTipoCita(
              this.modalCitasViewModel.mensajes.profesiones.enfermeria.tiposCita
                .idHeridaMayor
            );
          } else if (
            data.tipoCita.idCita ===
            this.modalCitasViewModel.mensajes.profesiones.enfermeria.tiposCita
              .idHeridaMenor
          ) {
            this.getCitasExistentes();
            this.modalCitasViewModel.verGrupoFecha = false;
            this.modalCitasViewModel.verCitaExistente = true;
            this.formularioCitas.controls['citaExistente'].setValue(data.fecha);
            this.controlesRequeridosTipoCita(
              this.modalCitasViewModel.mensajes.profesiones.enfermeria.tiposCita
                .idHeridaMenor
            );
          } else {
            this.controlesRequeridosTipoCita(null);
          }
        }
      } else {
        this.controlesRequeridosManejo(false);
        this.modalCitasViewModel.verOpcionManejo = false;
        if (
          data.profesional ===
          this.modalCitasViewModel.mensajes.profesiones.enfermeria.nombre
        ) {
          this.modalCitasViewModel.verTipoCita = true;
        }
      }
      this.formularioCitas.get('tipoCita').setValue(data.tipoCita.idCita);

      if (data.tipoFecha != null) {
        this.modalCitasViewModel.tipoFecha = data.tipoFecha;
        switch (data.tipoFecha) {
          case this.modalCitasViewModel.mensajes.campos.tipoFechaCita
            .codigoCitaExistente:
            this.getCitasExistentes();
            this.modalCitasViewModel.verCitaExistente = true;
            this.formularioCitas.controls['citaExistente'].setValue(data.fecha);
            this.controlesRequeridosFecha(
              this.modalCitasViewModel.mensajes.campos.tipoFechaCita
                .codigoCitaExistente
            );
            break;
          case this.modalCitasViewModel.mensajes.campos.tipoFechaCita
            .codigoFija:
            this.modalCitasViewModel.verFechaFija = true;
            this.formularioCitas.controls['fechaFija'].setValue(
              new Date(data.fecha)
            );
            this.fechaFija = new Date(data.fecha);
            this.controlesRequeridosFecha(
              this.modalCitasViewModel.mensajes.campos.tipoFechaCita.codigoFija
            );
            break;
          case this.modalCitasViewModel.mensajes.campos.tipoFechaCita
            .codigoPeriodica:
            this.modalCitasViewModel.verFechaPeriodica = true;
            this.modalCitasViewModel.verProgramacionSemana = true;
            this.formularioCitas.controls['fechaPeriodica'].setValue(
              new Date(data.fecha)
            );
            this.fechaPeriodica = new Date(data.fecha);
            this.controlesRequeridosFecha(
              this.modalCitasViewModel.mensajes.campos.tipoFechaCita
                .codigoPeriodica
            );
            break;
        }
      }

      this.seleccionFecha(data.tipoFecha);
      if (!this.data.esHistorial) {
        this.formularioCitas
          .get('totalSesiones')
          .setValue(data.sesionesFaltantes);
      } else {
        this.formularioCitas
          .get('totalSesiones')
          .setValue(data.totalVisitasPeriodica);
      }

      this.modalCitasViewModel.diasSeleccionados = data.programacionSemana;
    }
  }


  private verEdicion(data: any) {

    if (data !== null) {
      console.log(this.data.esHistorial);
      console.log('Cita: ' + this.modalCitasViewModel.respuestaTiposCita);
      this.formularioCitas.get('profesional').setValue(data.profesional);
      this.data.esHistorial ? this.modalCitasViewModel.respuestaTiposCita =
          this.data.infoComunes.datosProfesionales.filter(
            s => s.profesion.toLowerCase() === data.profesional.toLowerCase())[0].profesionalList
        : this.modalCitasViewModel.respuestaTiposCita =
          this.infoComunes.datosProfesionales.filter(
            s => s.profesion.toLowerCase() === data.profesional.toLowerCase())[0].profesionalList;
      console.log('Tipo: ' + data.tipo);
      data.tipo = data.tipo === '1' ? '2' : data.tipo;
      console.log('Tipo cita: ' + JSON.stringify(data.tipoCita));
      data.tipoCita.tipoCita = data.tipoCita.idCita === '1' && data.tipoCita.tipoCita === null ? 'Ingreso' : data.tipoCita.tipoCita;
      console.log('Tipo cita nueva: ' + JSON.stringify(data.tipoCita));
      this.modalCitasViewModel.verOpcionManejo = true;
      this.modalCitasViewModel.verTipoCita = true;
      if (data.profesional === this.modalCitasViewModel.mensajes.profesiones.enfermeria.nombre) {
        if (data.tipoCita.idCita === this.modalCitasViewModel.mensajes.profesiones.enfermeria.tiposCita.idHeridaMayor) {
          this.modalCitasViewModel.verGrupoFecha = false;
          this.modalCitasViewModel.verCitaExistente = false;
          this.modalCitasViewModel.verSemanas = true;
          this.modalCitasViewModel.verProgramacionSemana = true;
          this.formularioCitas.get('semanas').setValue(data.semanas);
          this.controlesRequeridosTipoCita(this.modalCitasViewModel.mensajes.profesiones.enfermeria.tiposCita.idHeridaMayor);
        } else if (data.tipoCita.idCita === this.modalCitasViewModel.mensajes.profesiones.enfermeria.tiposCita.idHeridaMenor) {
          this.getCitasExistentes();
          this.modalCitasViewModel.verGrupoFecha = false;
          this.modalCitasViewModel.verCitaExistente = true;
          this.formularioCitas.controls['citaExistente'].setValue(data.fecha);
          this.controlesRequeridosTipoCita(this.modalCitasViewModel.mensajes.profesiones.enfermeria.tiposCita.idHeridaMenor);
        } else {
          this.controlesRequeridosTipoCita(null);
        }
      }

      console.log('Tipo cita: ' + this.data.cita.tipoCita.idCita);
      this.formularioCitas.get('tipoCita').setValue(this.data.cita.tipoCita.idCita);
      if (this.data.btnEditar) {
        if (this.data.cita.tipoCita.tipoCita === null) {
          this.formularioCitas.get('tipoCita').setValue('');
        }
      }
      if (this.data.btnEditar || this.data.esDetalle || this.data.esHistorial) {

        this.validarMotrarRecursoPreferido({value: this.formularioCitas.get('tipoCita').value});
      }

      if (data.tipoFecha != null) {
        this.modalCitasViewModel.tipoFecha = data.tipoFecha;
        switch (data.tipoFecha) {
          case this.modalCitasViewModel.mensajes.campos.tipoFechaCita
            .codigoCitaExistente:
            this.getCitasExistentes();
            this.modalCitasViewModel.verCitaExistente = true;
            this.formularioCitas.controls['citaExistente'].setValue(data.fecha);
            this.controlesRequeridosFecha(
              this.modalCitasViewModel.mensajes.campos.tipoFechaCita
                .codigoCitaExistente
            );
            break;
          case this.modalCitasViewModel.mensajes.campos.tipoFechaCita
            .codigoFija:
            this.modalCitasViewModel.verFechaFija = true;
            this.formularioCitas.controls['fechaFija'].setValue(
              new Date(data.fecha)
            );
            this.fechaFija = new Date(data.fecha);
            this.controlesRequeridosFecha(
              this.modalCitasViewModel.mensajes.campos.tipoFechaCita.codigoFija
            );
            break;
          case this.modalCitasViewModel.mensajes.campos.tipoFechaCita
            .codigoPeriodica:
            this.modalCitasViewModel.verFechaPeriodica = true;
            this.modalCitasViewModel.verProgramacionSemana = true;
            this.formularioCitas.controls['fechaPeriodica'].setValue(
              new Date(data.fecha)
            );
            this.fechaPeriodica = new Date(data.fecha);
            this.controlesRequeridosFecha(
              this.modalCitasViewModel.mensajes.campos.tipoFechaCita
                .codigoPeriodica
            );
            break;
        }
      }

      this.seleccionFecha(data.tipoFecha);
      if (!this.data.esHistorial) {
        this.formularioCitas
          .get('totalSesiones')
          .setValue(data.sesionesFaltantes);
      } else {
        this.formularioCitas
          .get('totalSesiones')
          .setValue(data.totalVisitasPeriodica);
      }

      this.modalCitasViewModel.diasSeleccionados = data.programacionSemana;
    }
  }

  private verDatos(): void {


    this.verOpcionCitas();
    this.getProfesiones(this.infoRemisionNovedad.datosRemision.programa.idPrograma);
  }

  private verOpcionCitas(): void {
    this.modalCitasViewModel.tituloVentana = this.modalCitasViewModel.mensajes.tituloVentana.agregarEditarCitas;
    this.getDiasSemana();
  }

  /**
   * obtiene los días de las sesiones
   */
  private getDiasSemana(): void {
    this.modalCitasViewModel.listaDias = this.comunService.getDiasSemanas();
  }

  /**
   * obtiene las citas existentes
   */
  private getCitasExistentes(): void {
    const ESPECIALIDAD = this.infoComunes.datosProfesionales
      .filter(s => s.profesion.toLowerCase() === this.formularioCitas.controls['profesional'].value.toLowerCase())[0].especialidad;

    this.citasSubscripcion = this.programacionCitaService
      .getProgramacionEspecialidad(this.infoRemisionNovedad.datosRemision.idRemision /*'2d706c032173'*/, ESPECIALIDAD)
      .subscribe(
        response => {
          console.log('response getProgramacionEspecialidad ', response);
          this.modalCitasViewModel.respuestaCitasExistentes = response;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
        }
      );
  }

  private limpiarControlesManejo(): void {
    this.modalCitasViewModel.tipoFecha = null;
    this.modalCitasViewModel.verCitaExistente = false;
    this.formularioCitas.controls['citaExistente'].reset();
    this.modalCitasViewModel.verFechaFija = false;
    this.fechaFija = null;
    this.modalCitasViewModel.verFechaPeriodica = false;
    this.modalCitasViewModel.verProgramacionSemana = false;
    this.fechaPeriodica = null;

    this.formularioCitas.controls['tipoFecha'].setValue(null),
      (this.fechaCita = null),
      this.formularioCitas.controls['semanas'].setValue(null),
      this.formularioCitas.controls['totalSesiones'].setValue(null),
      (this.listaProgramacionSemana = []);
  }

  private controlesRequeridosManejo(esManejo: boolean): void {
    if (esManejo) {
      this.cambiarValidadorFormularioARequerido(
        this.formularioCitas,
        'tipoCita',
        null,
        null,
        null
      );
      this.cambiarValidadorFormularioARequerido(
        this.formularioCitas,
        'tipoFecha',
        null,
        null,
        null
      );
      this.cambiarValidadorFormularioARequerido(
        this.formularioCitas,
        'fechaFija',
        null,
        null,
        null
      );
      this.cambiarValidadorFormularioARequerido(
        this.formularioCitas,
        'fechaPeriodica',
        null,
        null,
        null
      );
      this.cambiarValidadorFormularioARequerido(
        this.formularioCitas,
        'totalSesiones',
        '[0-9]+',
        1,
        30
      );
    } else {
      this.cambiarValidadorFormularioAOpcional(this.formularioCitas, 'tipoCita');
      this.cambiarValidadorFormularioAOpcional(this.formularioCitas, 'tipoFecha');
      this.cambiarValidadorFormularioAOpcional(this.formularioCitas, 'citaExistente');
      this.cambiarValidadorFormularioAOpcional(this.formularioCitas, 'fechaFija');
      this.cambiarValidadorFormularioAOpcional(this.formularioCitas, 'fechaPeriodica');
      this.cambiarValidadorFormularioAOpcional(this.formularioCitas, 'semanas');
      this.cambiarValidadorFormularioAOpcional(this.formularioCitas, 'totalSesiones');
    }
  }

  private controlesRequeridosFecha(tipoFecha: string): void {
    switch (tipoFecha) {
      case this.modalCitasViewModel.mensajes.campos.tipoFechaCita
        .codigoCitaExistente:
        this.cambiarValidadorFormularioARequerido(
          this.formularioCitas,
          'citaExistente',
          null,
          null,
          null
        );
        this.cambiarValidadorFormularioAOpcional(
          this.formularioCitas,
          'fechaFija'
        );
        this.cambiarValidadorFormularioAOpcional(
          this.formularioCitas,
          'fechaPeriodica'
        );
        this.cambiarValidadorFormularioAOpcional(
          this.formularioCitas,
          'totalSesiones'
        );
        break;
      case this.modalCitasViewModel.mensajes.campos.tipoFechaCita.codigoFija:
        this.cambiarValidadorFormularioARequerido(
          this.formularioCitas,
          'fechaFija',
          null,
          null,
          null
        );
        this.cambiarValidadorFormularioAOpcional(
          this.formularioCitas,
          'citaExistente'
        );
        this.cambiarValidadorFormularioAOpcional(
          this.formularioCitas,
          'fechaPeriodica'
        );
        this.cambiarValidadorFormularioAOpcional(
          this.formularioCitas,
          'totalSesiones'
        );
        this.cambiarValidadorFormularioAOpcional(
          this.formularioCitas,
          'semanas'
        );
        break;
      case this.modalCitasViewModel.mensajes.campos.tipoFechaCita
        .codigoPeriodica:
        this.cambiarValidadorFormularioARequerido(
          this.formularioCitas,
          'fechaPeriodica',
          null,
          null,
          null
        );
        this.cambiarValidadorFormularioARequerido(
          this.formularioCitas,
          'totalSesiones',
          '[0-9]+',
          1,
          30
        );
        this.cambiarValidadorFormularioAOpcional(
          this.formularioCitas,
          'fechaFija'
        );
        this.cambiarValidadorFormularioAOpcional(
          this.formularioCitas,
          'citaExistente'
        );
        this.cambiarValidadorFormularioAOpcional(
          this.formularioCitas,
          'semanas'
        );
        break;
    }
  }

  private controlesRequeridosTipoCita(tipoCita: string): void {
    switch (tipoCita) {
      case this.modalCitasViewModel.mensajes.profesiones.enfermeria.tiposCita
        .idHeridaMayor:
        this.cambiarValidadorFormularioARequerido(
          this.formularioCitas,
          'semanas',
          '[0-9]+',
          1,
          52
        );
        this.cambiarValidadorFormularioAOpcional(
          this.formularioCitas,
          'tipoFecha'
        );
        this.cambiarValidadorFormularioAOpcional(
          this.formularioCitas,
          'citaExistente'
        );
        this.cambiarValidadorFormularioAOpcional(
          this.formularioCitas,
          'totalSesiones'
        );
        this.cambiarValidadorFormularioAOpcional(
          this.formularioCitas,
          'fechaPeriodica'
        );
        this.cambiarValidadorFormularioAOpcional(
          this.formularioCitas,
          'fechaFija'
        );
        break;
      case this.modalCitasViewModel.mensajes.profesiones.enfermeria.tiposCita
        .idHeridaMenor:
        this.cambiarValidadorFormularioARequerido(
          this.formularioCitas,
          'citaExistente',
          null,
          null,
          null
        );
        this.cambiarValidadorFormularioAOpcional(
          this.formularioCitas,
          'tipoFecha'
        );
        this.cambiarValidadorFormularioAOpcional(
          this.formularioCitas,
          'semanas'
        );
        this.cambiarValidadorFormularioAOpcional(
          this.formularioCitas,
          'totalSesiones'
        );
        this.cambiarValidadorFormularioAOpcional(
          this.formularioCitas,
          'fechaPeriodica'
        );
        this.cambiarValidadorFormularioAOpcional(
          this.formularioCitas,
          'fechaFija'
        );
        break;
      default:
        this.cambiarValidadorFormularioARequerido(
          this.formularioCitas,
          'tipoFecha',
          null,
          null,
          null
        );
        this.cambiarValidadorFormularioAOpcional(
          this.formularioCitas,
          'semanas'
        );
        this.cambiarValidadorFormularioAOpcional(
          this.formularioCitas,
          'citaExistente'
        );
        break;
    }
  }

  /**
   * Cambia los validadores de un control del formulario
   * @param {FormGroup} formulario
   * @param {string} nombrecontrol
   */
  private cambiarValidadorFormularioARequerido(
    formulario: FormGroup,
    nombrecontrol: string,
    expRegular: string,
    valMinimo: number,
    valMaximo: number
  ): void {
    formulario.get(nombrecontrol).clearValidators();
    formulario
      .get(nombrecontrol)
      .setValidators(
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
  private cambiarValidadorFormularioAOpcional(
    formulario: FormGroup,
    nombrecontrol: string
  ): void {
    formulario.get(nombrecontrol).clearValidators();
    formulario.get(nombrecontrol).setValidators(Validators.compose([]));
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
    this.formularioCitas = this.fb.group({
      profesional: [
        {value: null, disabled: this.data.cita !== null},
        Validators.compose([Validators.required])
      ],
      tipoCita: [
        {value: null, disabled: this.data.esDetalle},
      ],
      recursoPreferido: [
        {value: null, disabled: this.data.esDetalle},
        Validators.compose([Validators.required])]
      ,
      citaExistente: [
        {value: null, disabled: this.data.esDetalle},
        Validators.compose([Validators.required])
      ],
      tipoFecha: [
        {value: '', disabled: this.data.esDetalle},
        Validators.compose([Validators.required])
      ],
      fechaFija: [
        {value: '', disabled: this.data.esDetalle},
        Validators.compose([Validators.required])
      ],
      fechaPeriodica: [
        {value: '', disabled: this.data.esDetalle},
        Validators.compose([Validators.required])
      ],
      semanas: [
        {value: '', disabled: this.data.esDetalle},
        Validators.compose([
          Validators.required,
          Validators.pattern('[0-9]+'),
          Validators.min(1),
          Validators.max(52)
        ])
      ],
      totalSesiones: [
        {value: '', disabled: this.data.esDetalle},
        Validators.compose([
          Validators.required,
          Validators.pattern('[0-9]+'),
          Validators.min(1),
          Validators.max(30)
        ])
      ]
    });
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): ModalCitasViewModel {
    return new ModalCitasViewModel(
      null,
      false,
      null,
      null,
      null,
      [],
      [],
      [],
      false,
      false,
      false,
      false,
      [],
      [],
      false,
      false,
      'Fecha',
      false,
      false,
      true,
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


  private validarMotrarRecursoPreferido(tipo: any): void {
    this.tipoCita = tipo; // antes tipo.value ahora tipo
    if ((this.data.idPrograma === '545' || this.data.idPrograma === '546' || this.data.idPrograma === '547') &&
      (tipo === this.CONTROL_TELEFONICO || tipo === this.REVISICON_EXAMENES)) { // antes tipo.value ahora tipo

      this.initProfesionalesDisponibles();
    } else {
      this.verProfesionalPreferido = false;
      this.formularioCitas.get('recursoPreferido').setValidators([]);
      this.formularioCitas.get('recursoPreferido').updateValueAndValidity();
    }
  }

  private initProfesionalesDisponibles(): void {
    if (this.data.esDetalle || this.data.esHistorial) {
      this.verProfesionalPreferido = true;
      this.formularioCitas.get('recursoPreferido').setValue(this.data.cita.profesionalAsignado.idProfesional);
      this.profesional = this.data.cita.profesionalAsignado;
      this.deshabilitarRecursoPreferidoInput = true;

    } else {

      if (this.data.btnEditar) {
        const elementosProfesionales: Array<any> = this.infoComunes.datosProfesionales;
        this.profesion = elementosProfesionales.filter(elemento => this.formularioCitas.get('profesional').value === elemento.profesion)[0];
      }

      if (this.profesion !== null) {
        this.maestrosService.consultarProfesionalesActivos(this.profesion.especialidad, this.data.nombreCiudad).subscribe(
          profesionales => {
            this.profesionalesList = profesionales;
            this.verProfesionalPreferido = true;
            this.formularioCitas.get('recursoPreferido').setValidators([Validators.compose([Validators.required])]);
            this.formularioCitas.get('recursoPreferido').updateValueAndValidity();
            this.validarRecursoPreferido();
          },

          error => {
            this.mensajesService.mostrarMensajeError(
              error.error
            );
            this.profesionalesList = [];
            this.loading = false;
          }
        );

      } else {
        this.mensajesService.mostrarMensajeError(
          'Hubo un error'
        );
      }

    }
  }

  private verDatosHistorial(remision: any) {
    console.log('remision verDatosHistorial ', remision);
    this.verOpcionCitas();
    this.getProfesiones(remision.programa.idPrograma);
  }
}
