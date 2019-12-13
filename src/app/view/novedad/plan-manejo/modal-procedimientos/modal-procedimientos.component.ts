import {AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatOption} from '@angular/material';
import {TabView} from 'primeng/primeng';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import * as moment from 'moment';
import {PlanManejoService} from '../../../../domain/usecase/novedad/plan-manejo-novedad.service';
import {MensajesService} from '../../../../shared/services/mensajes.service';
import {Guid} from 'guid-typescript';
import {Curacion} from '../../../../domain/model/novedad/entity/plan-manejo/procedimientos/curacion.model';
import {Fototerapia} from '../../../../domain/model/novedad/entity/plan-manejo/procedimientos/fototerapia.model';
import {ModalProcedimientosViewModel} from './modal-procedimientos.view-model';
import {PlanManejoComponent} from '../plan-manejo.component';
import {TomaMuestra} from '../../../../domain/model/novedad/entity/plan-manejo/procedimientos/toma-muestra.model';
import {AspiracionSecrecion} from '../../../../domain/model/novedad/entity/plan-manejo/procedimientos/aspiracion-secrecion.model';
import {Canalizacion} from '../../../../domain/model/novedad/entity/plan-manejo/procedimientos/canalizacion.model';
import {Sondaje} from '../../../../domain/model/novedad/entity/plan-manejo/procedimientos/sondaje-model';
import {Observable} from 'rxjs/Observable';
import {Medicamento} from '../../../../domain/model/maestro/entity/medicamento.model';
import {TipoProcedimientoEnum} from '../../../../shared/utils/enums/tipo-procedimiento.enum';
import {Dosis} from '../../../../domain/model/maestro/entity/dosis.model';
import {SoporteNutricional} from '../../../../domain/model/novedad/entity/plan-manejo/procedimientos/soporte-nutricional.model';
import {ComunService} from '../../../../domain/usecase/comun/comun.service';
import {EventoSoporteNutricional} from '../../../../domain/model/comun/entity/evento-soporte-nutricional.model';
import {TipoCuracion} from '../../../../domain/model/maestro/entity/tipo-curacion.model';
import {ProgramacionSemana} from '../../../../shared/models/programacion-semana.model';
import {AgregadosComunService} from '../../../../shared/services/agregados-comun.service';
import {TipoNutricion} from '../../../../domain/model/maestro/entity/tipo-nutricion.model';
import {Frecuencia} from '../../../../domain/model/maestro/entity/frecuencia.model';
import {TiposSoporteNutricional} from '../../../../domain/model/maestro/entity/tipos-soporte-nutricional.model';
import {CapturarErrores} from '../../../../shared/services/capturar-errores';
import {Subject} from 'rxjs/Subject';

moment.locale('es');


@Component({
  selector: 'sura-novedad-procedimientos',
  templateUrl: './modal-procedimientos.component.html',
  styleUrls: ['./modal-procedimientos.component.scss']
})
export class ModalProcedimientosComponent implements OnInit, OnDestroy, AfterViewInit {

  public formularioCuraciones: FormGroup;
  public formularioSondajes: FormGroup;
  public formularioFototerapias: FormGroup;
  public formularioTomaMuestras: FormGroup;
  public formularioAspiracionSecreciones: FormGroup;
  public formularioCanalizaciones: FormGroup;
  public formularioSoporteNutricional: FormGroup;
  public nombreFormulario: string;
  public modalProcedimientosViewModel: ModalProcedimientosViewModel = this.iniciarViewModel();
  @ViewChild(TabView, { static: true }) tabView: TabView;
  public seleccionCuraciones: boolean;
  public seleccionSondaje: boolean;
  public seleccionTerapias: boolean;
  public seleccionFototerapias: boolean;
  public seleccionTomaMuestras: boolean;
  public seleccionSecreciones: boolean;
  public seleccionCanalizaciones: boolean;
  public seleccionSoporteNutricional: boolean;
  public habilitarCuraciones = true;
  public habilitarSondaje = true;
  public habilitarTerapias = true;
  public habilitarFototerapias = true;
  public habilitarTomaMuestras = true;
  public habilitarSecreciones = true;
  public habilitarCanalizaciones = true;
  public habilitarSoporteNutricional = true;
  public fechaTomaMuestra: Date;
  public configEspanolCalendario: any;
  public verFormCalendario = false;
  public curacionesSubscription: Subscription = new Subscription();
  public terapiasSubscription: Subscription = new Subscription();
  public frecuenciaSubscripcion: Subscription = new Subscription();
  public textoMedicamento = new Subject<string>();
  public medicamentosFiltrados: Observable<Medicamento[]>;
  public columnasEventos: any[];
  public columnasSondajes: any[];
  public fechaMinimaCalendarioActual: Date;
  public fechaSondaje: Date;
  private tipoProcedimiento: string;
  private medicamentosSubscripcion: Subscription = new Subscription();
  private dosisSubscripcion: Subscription = new Subscription();
  private viasAdministracionSubscripcion: Subscription = new Subscription();
  private frecuenciaSoporteSubscripcion: Subscription = new Subscription();
  private tiposNutricionSubscripcion: Subscription = new Subscription();
  private tiposMuestraSubscripcion: Subscription = new Subscription();
  @ViewChild('todosDias', { static: false }) private todosDias: MatOption;


  constructor(public dialogRef: MatDialogRef<PlanManejoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private mensajesService: MensajesService,
              private planManejoService: PlanManejoService,
              private comunService: ComunService,
              private infoComunes: AgregadosComunService,
              public cdRef: ChangeDetectorRef,
              private capturaDeErroresService: CapturarErrores) {
    this.habilitarCuraciones = true;
    this.crearFormularioCuraciones();
    this.crearFormularioSondajes();
    this.crearFormularioFototerapias();
    this.crearFormularioTomaMuestras();
    this.crearFormularioAspiracionSecreciones();
    this.crearFormularioCanalizaciones();
    this.crearFormularioSoporteNutricional();
    this.generarColumnasEventos();
    this.generarColumnasSondajes();
    this.suscribirCampoTextoMedicamentos();
    this.configurarMinimaFechaActual();
  }

  ngAfterViewInit() {

    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.habilitarCuraciones = true;
    this.configurarCalendario();
    this.verDatos();
    if (this.data.procedimiento != null) {
      this.verEdicion(this.data.procedimiento);
    }
    this.modalProcedimientosViewModel.esDetalle = this.data.esDetalle;
  }


  ngOnDestroy() {
    this.curacionesSubscription.unsubscribe();
    this.terapiasSubscription.unsubscribe();
    this.frecuenciaSubscripcion.unsubscribe();
    this.medicamentosSubscripcion.unsubscribe();
    this.dosisSubscripcion.unsubscribe();
    this.viasAdministracionSubscripcion.unsubscribe();
    this.frecuenciaSoporteSubscripcion.unsubscribe();
    this.tiposNutricionSubscripcion.unsubscribe();
    this.tiposMuestraSubscripcion.unsubscribe();
  }

  onChangeNoPBS(event) {
    if (event.checked) {
      window.open(this.modalProcedimientosViewModel.mensajes.urls.urlNoPBS, '_blank');
    }
  }

  public seleccionEnvioAspirador(event: any): void {
    if (event.checked) {
      this.formularioAspiracionSecreciones.get('visitaEnfermeria').setValue(true);
    }
  }

  public seleccionTipoNutricion(tipo: any): void {

    this.cargarTipoNutricion(tipo);
    this.formularioSoporteNutricional.controls['nutricion'].reset();
  }

  verEdicion(data: any) {
    if (data !== null) {

      if (data instanceof Curacion) {
        this.tipoProcedimiento = TipoProcedimientoEnum.CURACIONES;
      } else if (data instanceof Sondaje) {
        this.tipoProcedimiento = TipoProcedimientoEnum.SONDAJES;
      } else if (data instanceof Fototerapia) {
        this.tipoProcedimiento = TipoProcedimientoEnum.FOTOTERAPIAS;
      } else if (data instanceof TomaMuestra) {
        this.tipoProcedimiento = TipoProcedimientoEnum.TOMA_MUESTRAS;
      } else if (data instanceof AspiracionSecrecion) {
        this.tipoProcedimiento = TipoProcedimientoEnum.ASPIRACION_SECRECIONES;
      } else if (data instanceof Canalizacion) {
        this.tipoProcedimiento = TipoProcedimientoEnum.CANALIZACIONES;
      } else if (data instanceof SoporteNutricional) {
        this.tipoProcedimiento = TipoProcedimientoEnum.SOPORTE_NUTRICIONAL;
      }


      switch (this.tipoProcedimiento) {

        case TipoProcedimientoEnum.CURACIONES: {
          this.getTiposCuraciones();
          this.nombreFormulario = this.modalProcedimientosViewModel.mensajes.opcionesMenu.curaciones;
          this.modalProcedimientosViewModel.tituloVentana = this.modalProcedimientosViewModel
            .mensajes.tituloVentana.agregarEditarCuraciones;
          this.verTabSeleccionado(
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false);
          this.formularioCuraciones.get('tipoCuracion').setValue(data.tipoCuracion.descripcion);
          this.formularioCuraciones.get('sesiones').setValue(data.sesiones);
          this.formularioCuraciones.get('descripcion').setValue(data.descripcion);
          this.modalProcedimientosViewModel.diasSeleccionados = data.dias;
          break;
        }
        case TipoProcedimientoEnum.FOTOTERAPIAS: {
          this.getTiposFrecuenciaFototerapia('FOTOTERAPIA');
          this.nombreFormulario = this.modalProcedimientosViewModel.mensajes.opcionesMenu.fototerapias;
          this.modalProcedimientosViewModel.tituloVentana = this.modalProcedimientosViewModel
            .mensajes.tituloVentana.agregarEditarFototerapias;
          this.verTabSeleccionado(true, false, false, false, false, false, false, false);
          this.formularioFototerapias.get('diasTratamiento').setValue(data.diasTratamiento);
          this.formularioFototerapias.get('tipoFrecuencia').setValue(data.tipoFrecuencia);
          break;
        }
        case TipoProcedimientoEnum.SONDAJES: {
          this.nombreFormulario = this.modalProcedimientosViewModel.mensajes.opcionesMenu.sondajes;
          this.modalProcedimientosViewModel.tituloVentana = this.modalProcedimientosViewModel
            .mensajes.tituloVentana.agregarEditarSondajes;
          this.verTabSeleccionado(false, true, false, false, false, false, false, false);
          this.modalProcedimientosViewModel.respuestaSondajes = this.infoComunes.datosSondajes
            .find(sondaje => sondaje.idTipo === data.idTipoSondaje).listaSondaje;
          this.modalProcedimientosViewModel.esEdicionSondaje = true;
          this.modalProcedimientosViewModel.idSondaje = data.id;
          this.formularioSondajes.controls['tipoSondajeNovedades'].setValue(data.idTipoSondaje);
          this.formularioSondajes.controls['sondaje'].setValue(data.idSondaje);
          this.formularioSondajes.controls['sesionesSondaje'].setValue(data.totalSesiones);
          if (data.fechaSondaje !== null) {
            this.formularioSondajes.controls['fechaSondaje'].setValue(new Date(data.fechaSondaje));
            this.fechaSondaje = new Date(data.fechaSondaje);
          }
          this.modalProcedimientosViewModel.respuestaSondajesTabla
            .push(new Sondaje(data.id, data.idTipoSondaje, data.tipoSondaje,
              data.idSondaje, data.sondaje, data.fechaSondaje, data.totalSesiones));
          break;
        }
        case TipoProcedimientoEnum.FOTOTERAPIAS: {
          this.nombreFormulario = this.modalProcedimientosViewModel.mensajes.opcionesMenu.fototerapias;
          this.modalProcedimientosViewModel.tituloVentana = this.modalProcedimientosViewModel.mensajes
            .tituloVentana.agregarEditarFototerapias;
          this.verTabSeleccionado(false, false, false, true, false, false, false, false);
          this.formularioFototerapias.get('diasTratamiento').setValue(data.diasTratamiento);
          this.formularioFototerapias.get('tipoFrecuencia').setValue(data.tipoFrecuencia);
          break;
        }
        case TipoProcedimientoEnum.TOMA_MUESTRAS: {
          this.getTiposTomaMuestra();
          this.nombreFormulario = this.modalProcedimientosViewModel.mensajes.opcionesMenu.tomaMuestras;
          this.modalProcedimientosViewModel.tituloVentana = this.modalProcedimientosViewModel.mensajes
            .tituloVentana.agregarEditarTomaMuestras;
          this.verTabSeleccionado(false, false, false, false, true, false, false, false);
          this.formularioTomaMuestras.get('tipoMuestra').setValue(data.tipoMuestra.descripcion);
          this.formularioTomaMuestras.get('fechaMuestra').setValue(new Date(data.fechaMuestra));
          this.fechaTomaMuestra = new Date(data.fechaMuestra);
          this.formularioTomaMuestras.get('requiereAyuno').setValue(data.requiereAyuno);
          break;
        }
        case TipoProcedimientoEnum.ASPIRACION_SECRECIONES: {
          this.nombreFormulario = this.modalProcedimientosViewModel.mensajes.opcionesMenu.secreciones;
          this.modalProcedimientosViewModel.tituloVentana = this.modalProcedimientosViewModel.mensajes
            .tituloVentana.agregarEditarAspiracionSecreciones;
          this.verTabSeleccionado(false, false, false, false, false, true, false, false);
          this.formularioAspiracionSecreciones.get('diasTratamiento').setValue(data.diasTratamiento);
          this.formularioAspiracionSecreciones.get('envioAspirador').setValue(data.envioAspirador);
          this.formularioAspiracionSecreciones.get('visitaEnfermeria').setValue(data.visitaEnfermeria);
          this.formularioAspiracionSecreciones.get('tipoSonda').setValue(data.tipoSonda);
          const TIPO_SONDA = data.tipoSonda === this.modalProcedimientosViewModel.mensajes.secreciones.campos.pediatrica ?
            this.modalProcedimientosViewModel.mensajes.secreciones.campos.pediatrica :
            this.modalProcedimientosViewModel.mensajes.secreciones.campos.adulto;
          this.modalProcedimientosViewModel.tipoSondaSecrecion = TIPO_SONDA;
          this.formularioAspiracionSecreciones.get('nasal').setValue(data.nasal);
          this.formularioAspiracionSecreciones.get('traqueostomia').setValue(data.traqueostomia);
          break;
        }
        case TipoProcedimientoEnum.CANALIZACIONES: {
          this.nombreFormulario = this.modalProcedimientosViewModel.mensajes.opcionesMenu.canalizaciones;
          this.modalProcedimientosViewModel.tituloVentana = this.modalProcedimientosViewModel.mensajes
            .tituloVentana.agregarEditarCanalizaciones;
          this.verTabSeleccionado(false, false, false, false, false, false, true, false);
          this.formularioCanalizaciones.get('tipoCanalizacion').setValue(data.tipoCanalizacion);
          const TIPO_CANALIZACION = data.tipoCanalizacion === this.modalProcedimientosViewModel.mensajes
            .canalizaciones.campos.intravenosa ?
            this.modalProcedimientosViewModel.mensajes.canalizaciones.campos.intravenosa :
            this.modalProcedimientosViewModel.mensajes.canalizaciones.campos.subcutanea;
          this.modalProcedimientosViewModel.tipoCanalizacion = TIPO_CANALIZACION;
          break;
        }
        case TipoProcedimientoEnum.SOPORTE_NUTRICIONAL: {
          this.validarControlesEventoSoporte();
          this.nombreFormulario = this.modalProcedimientosViewModel.mensajes.opcionesMenu.soporteNutricional;
          this.modalProcedimientosViewModel.tituloVentana = this.modalProcedimientosViewModel.mensajes
            .tituloVentana.agregarEditarSoporteNutricional;
          this.verTabSeleccionado(false, false, false, false, false, false, false, true);
          this.formularioSoporteNutricional.get('medicamento').setValue(data.medicamento);
          this.formularioSoporteNutricional.get('cantidadDosis').setValue(data.cantidadDosis);
          this.formularioSoporteNutricional.get('unidadDosis').setValue(data.unidadDosis.descripcion);
          this.formularioSoporteNutricional.get('tipoNutricion').setValue(data.tipoNutricion.tipo);
          this.formularioSoporteNutricional.get('nutricion').setValue(data.tipoNutricion.descripcion);
          this.modalProcedimientosViewModel.nutricion = data.tipoNutricion.descripcion;
          this.formularioSoporteNutricional.get('duracion').setValue(data.duracion);
          this.formularioSoporteNutricional.get('diasTratamiento').setValue(data.diasTratamiento);
          this.formularioSoporteNutricional.get('volumen').setValue(data.volumen);
          this.formularioSoporteNutricional.get('noPBS').setValue(data.noPBS);
          data.eventos.forEach(elemento => {
            const EVENTO: EventoSoporteNutricional = new EventoSoporteNutricional(elemento.id, elemento.diasEvento,
              elemento.frecuencia, elemento.tipoEvento, elemento.diasTratamiento);
            this.modalProcedimientosViewModel.eventos.push(EVENTO);
          });
          break;
        }
      }
    }
  }

  public seleccionarPlan($event) {
    this.configurarFormulario(this.tabView.tabs[$event.index].header);
  }

  /**
   * Obtiene las frecuencias para Soporte nutricional
   * @param tipo
   */
  getFrecuencia(tipo: string) {
    this.frecuenciaSubscripcion = this.planManejoService.getFrecuencias(tipo).subscribe(
      response => {
        this.modalProcedimientosViewModel.respuestaFrecuenciasSoporteNutricional = response;
      },
      error => {
        this.capturaDeErroresService.mapearErrores(error.status, error.error);
      },
      () => {
        this.frecuenciaSubscripcion.unsubscribe();
      }
    );
  }

  /**
   * Obtiene los tipos de soporte nutricional (Tipo evento) para Soporte nutricional
   */
  getTiposSoporteNutricional() {
    this.planManejoService.getTiposSoporteNutricionalNovedad().subscribe(
      response => {
        this.modalProcedimientosViewModel.respuestaTiposSoporteNutricional = response;
      },
      error => {
        this.capturaDeErroresService.mapearErrores(error.status, error.error);
      },
      () => {
        this.frecuenciaSubscripcion.unsubscribe();
      }
    );
  }

  /**
   * Obtiene los medicamentos para Soporte nutricional
   */
  public getMedicamentos(): void {
    const valorConsulta = this.formularioSoporteNutricional.get('medicamento').value;

    if (valorConsulta && valorConsulta.length > 2) {
      this.modalProcedimientosViewModel.cargando = true;
      this.medicamentosSubscripcion =
        this.planManejoService.getMedicamentos(valorConsulta.toUpperCase())
          .subscribe(
            response => {
              this.modalProcedimientosViewModel.respuestaMedicamentos = response;
            },
            error => {
              this.capturaDeErroresService.mapearErrores(error.status, error.error);
            },
            () => {
              this.modalProcedimientosViewModel.cargando = false;
            }
          );
    }
  }

  public abrirCalendario(): void {
    this.verFormCalendario = true;
  }

  public cerrarCalendario(): void {
    this.verFormCalendario = false;
  }

  public guardarProcedimiento(): void {
    switch (this.nombreFormulario) {
      case this.modalProcedimientosViewModel.mensajes.opcionesMenu.curaciones: {

        const TIPO_CURACION: TipoCuracion = this.modalProcedimientosViewModel.respuestaCuracionesTiposCuraciones
          .find(c => c.descripcion === this.formularioCuraciones.controls['tipoCuracion'].value);

        if (this.formularioCuraciones.valid && this.modalProcedimientosViewModel.diasSeleccionados.length > 0) {

          const CURACION_NOVEDAD = new Curacion(
            Guid.create().toString(),
            TIPO_CURACION,
            this.modalProcedimientosViewModel.diasSeleccionados,
            this.formularioCuraciones.controls['sesiones'].value,
            this.formularioCuraciones.controls['descripcion'].value,
            null
          );

          console.log('CURACION_NOVEDAD ', JSON.stringify(CURACION_NOVEDAD));
          this.dialogRef.close(CURACION_NOVEDAD);

        } else {
          this.validarTodosLosCamposDelFormulario(this.formularioCuraciones);
        }

        break;
      }
      case this.modalProcedimientosViewModel.mensajes.opcionesMenu.sondajes: {

        if (this.formularioSondajes.valid) {

          this.dialogRef.close(this.modalProcedimientosViewModel.respuestaSondajesTabla);

        } else {
          this.validarTodosLosCamposDelFormulario(this.formularioSondajes);
        }

        break;
      }
      case this.modalProcedimientosViewModel.mensajes.opcionesMenu.fototerapias: {

        if (this.formularioFototerapias.valid) {

          const FOTOTERAPIA = new Fototerapia(
            Guid.create().toString(),
            this.formularioFototerapias.controls['diasTratamiento'].value,
            this.formularioFototerapias.controls['tipoFrecuencia'].value,
          );

          this.dialogRef.close(FOTOTERAPIA);

        } else {
          this.validarTodosLosCamposDelFormulario(this.formularioFototerapias);
        }

        break;
      }
      case this.modalProcedimientosViewModel.mensajes.opcionesMenu.tomaMuestras: {

        if (this.formularioTomaMuestras.valid) {

          const TIPO_MUESTRA = this.modalProcedimientosViewModel.respuestaTomaMuestrasTipoMuestra
            .find(s => s.descripcion === this.formularioTomaMuestras.controls['tipoMuestra'].value);

          const TOMA_MUESTRA = new TomaMuestra(
            Guid.create().toString(),
            TIPO_MUESTRA,
            this.formularioTomaMuestras.controls['fechaMuestra'].value,
            this.formularioTomaMuestras.controls['requiereAyuno'].value
          );

          this.dialogRef.close(TOMA_MUESTRA);

        } else {
          this.validarTodosLosCamposDelFormulario(this.formularioTomaMuestras);
        }

        break;
      }
      case this.modalProcedimientosViewModel.mensajes.opcionesMenu.secreciones: {

        if (this.formularioAspiracionSecreciones.valid) {

          const ASPIRACION_SECRECION = new AspiracionSecrecion(
            Guid.create().toString(),
            this.formularioAspiracionSecreciones.controls['diasTratamiento'].value,
            this.formularioAspiracionSecreciones.controls['envioAspirador'].value,
            this.formularioAspiracionSecreciones.controls['visitaEnfermeria'].value,
            this.formularioAspiracionSecreciones.controls['tipoSonda'].value,
            this.formularioAspiracionSecreciones.controls['nasal'].value,
            this.formularioAspiracionSecreciones.controls['traqueostomia'].value
          );

          this.dialogRef.close(ASPIRACION_SECRECION);

        } else {
          this.validarTodosLosCamposDelFormulario(this.formularioAspiracionSecreciones);
        }

        break;
      }
      case this.modalProcedimientosViewModel.mensajes.opcionesMenu.canalizaciones: {

        if (this.formularioCanalizaciones.valid) {

          const CANALIZACION = new Canalizacion(
            Guid.create().toString(),
            this.formularioCanalizaciones.controls['tipoCanalizacion'].value,
          );

          this.dialogRef.close(CANALIZACION);

        } else {
          this.validarTodosLosCamposDelFormulario(this.formularioCanalizaciones);
        }

        break;
      }
      case this.modalProcedimientosViewModel.mensajes.opcionesMenu.soporteNutricional: {

        this.validarControlesEventoSoporte();
        if (this.formularioSoporteNutricional.valid && this.modalProcedimientosViewModel.eventos.length > 0) {

          const UNIDAD_DOSIS: Dosis = this.modalProcedimientosViewModel.respuestaUnidadesDosisSoporteNutricional
            .find(c => c.descripcion === this.formularioSoporteNutricional.controls['unidadDosis'].value);
          const TIPO_NUTRICION: TipoNutricion = this.infoComunes.datosTiposNutricion
            .find(c => c.descripcion === this.formularioSoporteNutricional.controls['nutricion'].value &&
              c.tipo === this.formularioSoporteNutricional.controls['tipoNutricion'].value);

          const SOPORTE_NUTRICIONAL = new SoporteNutricional(
            Guid.create().toString(),
            this.formularioSoporteNutricional.controls['medicamento'].value,
            this.formularioSoporteNutricional.controls['cantidadDosis'].value,
            UNIDAD_DOSIS,
            TIPO_NUTRICION,
            this.formularioSoporteNutricional.controls['duracion'].value,
            this.formularioSoporteNutricional.controls['volumen'].value,
            this.formularioSoporteNutricional.controls['noPBS'].value,
            this.modalProcedimientosViewModel.eventos
          );

          console.log('SOPORTE_NUTRICIONAL ', JSON.stringify(SOPORTE_NUTRICIONAL));
          this.dialogRef.close(SOPORTE_NUTRICIONAL);

        } else {
          this.validarTodosLosCamposDelFormulario(this.formularioSoporteNutricional);
        }

        break;
      }
    }
  }

  public agregarEvento(esEdicion: boolean): void {
    if (this.formularioSoporteNutricional.controls['diasEvento'].value &&
      (this.formularioSoporteNutricional.controls['frecuencia'].value) &&
      this.formularioSoporteNutricional.controls['tipoEvento'].value &&
      this.formularioSoporteNutricional.controls['diasTratamiento'].value) {

      const LISTA_DIAS: ProgramacionSemana[] = [];
      this.formularioSoporteNutricional.controls['diasEvento'].value.forEach(dia => {
        LISTA_DIAS.push(this.modalProcedimientosViewModel.listaDias.find(s => s.dia === dia));
      });

      const FRECUENCIA: Frecuencia = this.modalProcedimientosViewModel.respuestaFrecuenciasSoporteNutricional
        .find(c => c.descripcion === this.formularioSoporteNutricional.controls['frecuencia'].value);

      const TIPO_EVENTO: TiposSoporteNutricional = this.modalProcedimientosViewModel.respuestaTiposSoporteNutricional
        .find(c => c.descripcion === this.formularioSoporteNutricional.controls['tipoEvento'].value);

      const EVENTO = new EventoSoporteNutricional(Guid.create().toString(),
        LISTA_DIAS,
        FRECUENCIA,
        TIPO_EVENTO,
        this.formularioSoporteNutricional.controls['diasTratamiento'].value
      );

      if (!esEdicion) {
        const dato = this.modalProcedimientosViewModel.eventos.findIndex(elemento =>
          elemento.frecuencia.descripcion === EVENTO.frecuencia.descripcion && (elemento.tipoEvento === EVENTO.tipoEvento));
        if (dato === -1) {
          console.log('EVENTO ', EVENTO);
          this.modalProcedimientosViewModel.eventos.push(EVENTO);
        } else {
          return;
        }

      } else {
        EVENTO.id = this.modalProcedimientosViewModel.idEventoSoporte;
        const index = this.modalProcedimientosViewModel.eventos.findIndex(elemento =>
          elemento.id === EVENTO.id
        );
        if (index !== null && index !== undefined && index !== -1) {
          this.modalProcedimientosViewModel.eventos[index] = EVENTO;
        }
      }

      this.validarControlesEventoSoporte();
      this.formularioSoporteNutricional.controls['diasEvento'].reset();
      this.formularioSoporteNutricional.controls['frecuencia'].reset();
      this.formularioSoporteNutricional.controls['tipoEvento'].reset();
      this.formularioSoporteNutricional.controls['diasTratamiento'].reset();
      this.modalProcedimientosViewModel.esEdicionEventoSoporte = false;
    }
  }

  public editarEvento(evento: any): void {
    if (evento && evento.id) {
      this.modalProcedimientosViewModel.esEdicionEventoSoporte = true;
      this.modalProcedimientosViewModel.idEventoSoporte = evento.id;
      const LISTA_DIAS: string[] = [];
      evento.diasEvento.forEach(element => {
        if (element !== undefined) {
          LISTA_DIAS.push(element.dia);
        }
      });
      this.formularioSoporteNutricional.get('diasEvento').setValue(LISTA_DIAS);
      this.formularioSoporteNutricional.controls['frecuencia'].setValue(evento.frecuencia.descripcion);
      this.formularioSoporteNutricional.controls['tipoEvento'].setValue(evento.tipoEvento.descripcion);
      this.formularioSoporteNutricional.controls['diasTratamiento'].setValue(evento.diasTratamiento);
    }
  }

  public eliminarEvento(evento: any): void {
    if (evento && evento.id) {
      const index = this.modalProcedimientosViewModel.eventos.findIndex(elemento =>
        elemento.id === evento.id
      );
      if (index !== null && index !== undefined) {
        this.modalProcedimientosViewModel.eventos.splice(index, 1);
      }
    }

    this.validarControlesEventoSoporte();
  }

  public seleccionDia(all): any {
    if (this.todosDias.selected) {
      this.todosDias.deselect();
      return false;
    }
    if (this.formularioSoporteNutricional.controls.diasEvento.value.length ===
      this.modalProcedimientosViewModel.listaDias.length) {
      this.todosDias.select();
    }
  }

  public seleccionarTodosDias(): void {
    if (this.todosDias.selected) {
      this.formularioSoporteNutricional.controls.diasEvento
        .patchValue([...this.modalProcedimientosViewModel.listaDias.map(item => item.dia), 0]);
    } else {
      this.formularioSoporteNutricional.controls.diasEvento.patchValue([]);
    }
  }

  public agregarSondaje(esEdicion: boolean): void {
    if (this.formularioSondajes.valid) {

      const TIPO_SONDAJE = this.infoComunes.datosSondajes
        .find(c => c.idTipo === this.formularioSondajes.controls['tipoSondajeNovedades'].value);
      const SONDAJE = this.modalProcedimientosViewModel.respuestaSondajes
        .find(c => c.idTipoSondaje === this.formularioSondajes.controls['sondaje'].value);

      const OBJETO_SONDAJE = new Sondaje(Guid.create().toString(),
        TIPO_SONDAJE.idTipo,
        TIPO_SONDAJE.tipo,
        SONDAJE.idTipoSondaje,
        SONDAJE.descripcion,
        this.formularioSondajes.controls['fechaSondaje'].value,
        this.formularioSondajes.controls['sesionesSondaje'].value);

      if (!esEdicion) {
        const dato = this.modalProcedimientosViewModel.respuestaSondajesTabla.findIndex(elemento =>
          elemento.idTipoSondaje === OBJETO_SONDAJE.idTipoSondaje &&
          elemento.idSondaje === OBJETO_SONDAJE.idTipoSondaje &&
          elemento.fechaSondaje === OBJETO_SONDAJE.fechaSondaje);
        if (dato === -1) {
          this.modalProcedimientosViewModel.respuestaSondajesTabla.push(OBJETO_SONDAJE);
        } else {
          return;
        }

      } else {
        OBJETO_SONDAJE.id = this.modalProcedimientosViewModel.idSondaje;
        const index = this.modalProcedimientosViewModel.respuestaSondajesTabla.findIndex(elemento =>
          elemento.id === OBJETO_SONDAJE.id
        );
        if (index !== null && index !== undefined && index !== -1) {
          this.modalProcedimientosViewModel.respuestaSondajesTabla[index] = OBJETO_SONDAJE;
        }
      }

      this.validarCamposSondajes();
      this.formularioSondajes.controls['tipoSondajeNovedades'].reset();
      this.formularioSondajes.controls['sondaje'].reset();
      this.formularioSondajes.controls['sesionesSondaje'].reset();
      this.formularioSondajes.controls['fechaSondaje'].reset();
      this.modalProcedimientosViewModel.esEdicionSondaje = false;
    } else {
      this.validarTodosLosCamposDelFormulario(this.formularioSondajes);
    }
  }

  public editarSondaje(sondaje: any): void {
    if (sondaje && sondaje.id) {
      this.modalProcedimientosViewModel.esEdicionSondaje = true;
      this.modalProcedimientosViewModel.idSondaje = sondaje.id;
      this.formularioSondajes.controls['tipoSondajeNovedades'].setValue(sondaje.idTipoSondaje);

      this.formularioSondajes.controls['sondaje'].setValue(sondaje.idSondaje);
      this.formularioSondajes.controls['sesionesSondaje'].setValue(sondaje.totalSesiones);
      this.formularioSondajes.controls['fechaSondaje'].setValue(sondaje.fechaSondaje);
    }
  }

  public eliminarSondaje(sondaje: any): void {
    if (sondaje && sondaje.id) {
      const index = this.modalProcedimientosViewModel.respuestaSondajesTabla.findIndex(elemento =>
        elemento.id === sondaje.id
      );
      if (index !== null && index !== undefined) {
        this.modalProcedimientosViewModel.respuestaSondajesTabla.splice(index, 1);
      }
    }

    this.validarCamposSondajes();
  }

  public cargarSondajes(tipoSondaje: any) {
    console.log("llegó: " + tipoSondaje)
    const TIPO_SONDAJE = this.infoComunes.datosSondajes.find(c => c.idTipo === tipoSondaje);
    this.modalProcedimientosViewModel.respuestaSondajes = TIPO_SONDAJE.listaSondaje;
  }

  public cerrarModal() {
    this.dialogRef.close();
  }

  public findInvalidControls(formulario: FormGroup) {
    const invalid = [];
    const controls = formulario.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log('invalidos ', invalid);
  }

  private cargarTipoNutricion(tipo: any) {
    if (tipo === this.modalProcedimientosViewModel.mensajes.soporteNutricional.tiposNutricion.parenteral) {
      this.modalProcedimientosViewModel.datosNutricionSoporteNutricional =
        this.infoComunes.datosTiposNutricion
          .filter(s => s.tipo === this.modalProcedimientosViewModel.mensajes.soporteNutricional.tiposNutricion.parenteral);
    } else {
      this.modalProcedimientosViewModel.datosNutricionSoporteNutricional =
        this.infoComunes.datosTiposNutricion
          .filter(s => s.tipo === this.modalProcedimientosViewModel.mensajes.soporteNutricional.tiposNutricion.enteral);
    }
  }

  private verTabSeleccionado(esCuraciones: boolean, esSondajes: boolean, esTerapias: boolean, esFototerapias: boolean,
                             esTomaMuestras: boolean, esAspiracionSecreciones: boolean, esCanalizaciones: boolean,
                             esSoporteNutricional: boolean): void {
    this.seleccionCuraciones = esCuraciones;
    this.seleccionSondaje = esSondajes;
    this.seleccionTerapias = esTerapias;
    this.seleccionFototerapias = esFototerapias;
    this.seleccionTomaMuestras = esTomaMuestras;
    this.seleccionSecreciones = esAspiracionSecreciones;
    this.seleccionCanalizaciones = esCanalizaciones;
    this.seleccionSoporteNutricional = esSoporteNutricional;

    this.habilitarCuraciones = esCuraciones;
    this.habilitarSondaje = esSondajes;
    this.habilitarTerapias = esTerapias;
    this.habilitarFototerapias = esFototerapias;
    this.habilitarTomaMuestras = esTomaMuestras;
    this.habilitarSecreciones = esAspiracionSecreciones;
    this.habilitarCanalizaciones = esCanalizaciones;
    this.habilitarSoporteNutricional = esSoporteNutricional;
  }

  private configurarFormulario(header: string): void {
    this.nombreFormulario = header;

    switch (header) {
      case this.modalProcedimientosViewModel.mensajes.opcionesMenu.curaciones: {
        this.modalProcedimientosViewModel.tituloVentana = this.modalProcedimientosViewModel.mensajes
          .tituloVentana.agregarEditarCuraciones;
        this.verOpcionCuraciones();
        break;
      }
      case this.modalProcedimientosViewModel.mensajes.opcionesMenu.sondajes: {
        this.modalProcedimientosViewModel.tituloVentana = this.modalProcedimientosViewModel.mensajes
          .tituloVentana.agregarEditarSondajes;
        break;
      }
      case this.modalProcedimientosViewModel.mensajes.opcionesMenu.fototerapias: {
        this.modalProcedimientosViewModel.tituloVentana = this.modalProcedimientosViewModel.mensajes
          .tituloVentana.agregarEditarFototerapias;
        this.verOpcionFototerapias();
        break;
      }
      case this.modalProcedimientosViewModel.mensajes.opcionesMenu.tomaMuestras: {
        this.modalProcedimientosViewModel.tituloVentana = this.modalProcedimientosViewModel.mensajes
          .tituloVentana.agregarEditarTomaMuestras;
        this.verOpcionTomaMuestras();
        break;
      }
      case this.modalProcedimientosViewModel.mensajes.opcionesMenu.secreciones: {
        this.modalProcedimientosViewModel.tituloVentana = this.modalProcedimientosViewModel.mensajes
          .tituloVentana.agregarEditarAspiracionSecreciones;
        break;
      }
      case this.modalProcedimientosViewModel.mensajes.opcionesMenu.canalizaciones: {
        this.modalProcedimientosViewModel.tituloVentana = this.modalProcedimientosViewModel.mensajes
          .tituloVentana.agregarEditarCanalizaciones;
        break;
      }
      case this.modalProcedimientosViewModel.mensajes.opcionesMenu.soporteNutricional: {
        this.modalProcedimientosViewModel.tituloVentana = this.modalProcedimientosViewModel.mensajes
          .tituloVentana.agregarEditarSoporteNutricional;
        break;
      }
    }
  }

  private verDatos(): void {
    this.verOpcionCuraciones();
    this.verOpcionSoporteNutricional();
  }

  private verOpcionCuraciones(): void {
    this.nombreFormulario = this.modalProcedimientosViewModel.mensajes.opcionesMenu.curaciones;
    this.modalProcedimientosViewModel.tituloVentana = this.modalProcedimientosViewModel.mensajes.tituloVentana.agregarEditarCuraciones;
    this.getTiposCuraciones();
    this.getDiasSemana();
  }

  private verOpcionFototerapias(): void {
    this.getTiposFrecuenciaFototerapia('FOTOTERAPIA');
  }

  private verOpcionTomaMuestras(): void {
    this.getTiposTomaMuestra();
  }

  private verOpcionSoporteNutricional(): void {
    this.getMedicamentos();
    this.getDosis(TipoProcedimientoEnum.SOPORTE_NUTRICIONAL);
    this.getFrecuencia(TipoProcedimientoEnum.SOPORTE_NUTRICIONAL);
    this.getTipoNutricion();
    this.getTiposSoporteNutricional();
  }

  /**
   * Obtiene las dosis para Soporte nutricional
   * @param tipo
   */
  private getDosis(tipo: string) {
    this.dosisSubscripcion = this.planManejoService.getDosis(tipo).subscribe(
      response => {
        this.modalProcedimientosViewModel.respuestaUnidadesDosisSoporteNutricional = response;
      },
      error => {
        this.capturaDeErroresService.mapearErrores(error.status, error.error);
      },
      () => {
        this.dosisSubscripcion.unsubscribe();
      });
  }

  /**
   * Obtiene los tipos de nutricón para Soporte nutricional
   */
  private getTipoNutricion(): void {

    this.tiposNutricionSubscripcion = this.planManejoService.getTiposNutricion().subscribe(
      response => {
        this.infoComunes.datosTiposNutricion = response;
        this.modalProcedimientosViewModel.respuestaTiposNutricionesSoporteNutricional = Array
          .from(new Set(response.map((item: any) => item.tipo)));
        if (this.data.procedimiento instanceof SoporteNutricional) {
          this.cargarTipoNutricion(this.data.procedimiento.tipoNutricion.tipo);
        }
      },
      error => {
        this.capturaDeErroresService.mapearErrores(error.status, error.error);
      },
      () => {
        this.tiposNutricionSubscripcion.unsubscribe();
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
          if (this.modalProcedimientosViewModel.respuestaMedicamentos) {
            typeof textoABuscar === 'string' ?
              medicamentos = this.filtrar(textoABuscar) :
              medicamentos = this.filtrarObjetoMedicamento(textoABuscar);
          }
        }
        return Observable.of(medicamentos);
      });
  }

  /**
   * Filtra un objeto de tipo Medicamento por idMedicamento y nombre
   * @param {Medicamento} valor
   * @returns {Medicamento[]}
   */
  private filtrarObjetoMedicamento(valor: Medicamento): Medicamento[] {
    return this.modalProcedimientosViewModel.respuestaMedicamentos
      ? this.modalProcedimientosViewModel.respuestaMedicamentos.filter(
        option =>
          option.idMedicamento.toLowerCase().indexOf(valor.idMedicamento.toLowerCase()) !== -1 &&
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
    return this.modalProcedimientosViewModel.respuestaMedicamentos ?
      this.modalProcedimientosViewModel.respuestaMedicamentos.filter(option =>
        option.idMedicamento.toLowerCase().indexOf(valor.toLowerCase()) !== -1 ||
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
    return medicamento && medicamento.idMedicamento && medicamento.nombre && medicamento.presentacion ?
      `${medicamento.idMedicamento}' '${medicamento.nombre}' '${medicamento.presentacion}` :
      undefined;
  }

  private validarControlesEventoSoporte() {
    if (this.modalProcedimientosViewModel.eventos.length > 0) {
      this.cambiarValidadorFormularioAOpcional(this.formularioSoporteNutricional, 'diasEvento');
      this.cambiarValidadorFormularioAOpcional(this.formularioSoporteNutricional, 'frecuencia');
      this.cambiarValidadorFormularioAOpcional(this.formularioSoporteNutricional, 'tipoEvento');
      this.cambiarValidadorFormularioAOpcional(this.formularioSoporteNutricional, 'diasTratamiento');
    } else {
      this.cambiarValidadorFormularioARequerido(this.formularioSoporteNutricional, 'diasEvento');
      this.cambiarValidadorFormularioARequerido(this.formularioSoporteNutricional, 'frecuencia');
      this.cambiarValidadorFormularioARequerido(this.formularioSoporteNutricional, 'tipoEvento');
      this.cambiarValidadorFormularioARequerido(this.formularioSoporteNutricional, 'diasTratamiento');
    }
  }

  private validarCamposSondajes(): void {
    if (this.modalProcedimientosViewModel.respuestaSondajesTabla.length > 0) {
      this.cambiarValidadorFormularioAOpcional(this.formularioSondajes, 'tipoSondajeNovedades');
      this.cambiarValidadorFormularioAOpcional(this.formularioSondajes, 'sondaje');
      this.cambiarValidadorFormularioAOpcional(this.formularioSondajes, 'sesionesSondaje');
      this.cambiarValidadorFormularioAOpcional(this.formularioSondajes, 'fechaSondaje');
    } else {
      this.cambiarValidadorFormularioARequerido(this.formularioSondajes, 'tipoSondajeNovedades');
      this.cambiarValidadorFormularioARequerido(this.formularioSondajes, 'sondaje');
      this.cambiarValidadorFormularioARequerido(this.formularioSondajes, 'sesionesSondaje');
      this.cambiarValidadorFormularioARequerido(this.formularioSondajes, 'fechaSondaje');
    }
  }

  /**
   * obtiene los sondajes de Toma de muestra - Curaciones
   */
  private getTiposCuraciones(): void {

    this.curacionesSubscription = this.planManejoService.getTiposCuracion().subscribe(
      response => {
        this.modalProcedimientosViewModel.respuestaCuracionesTiposCuraciones = response;
      },
      error => {
        this.capturaDeErroresService.mapearErrores(error.status, error.error);
      },
      () => {
        this.curacionesSubscription.unsubscribe();
      }
    );
  }

  /**
   * Obtiene las frecuencias - Fototerapias
   * @param tipo
   */
  private getTiposFrecuenciaFototerapia(tipo: string): void {
    this.frecuenciaSubscripcion = this.planManejoService.getFrecuencias(tipo).subscribe(
      response => {
        this.modalProcedimientosViewModel.respuestaFototerapiasTipoFrecuencia = response;
      },
      error => {
        this.capturaDeErroresService.mapearErrores(error.status, error.error);
      },
      () => {
        this.frecuenciaSubscripcion.unsubscribe();
      }
    );
  }

  /**
   * obtiene los días de las curaciones - Curaciones
   */
  private getDiasSemana(): void {
    this.modalProcedimientosViewModel.listaDias = this.comunService.getDiasSemanas();
  }

  /**
   * obtiene los tipos de muestra - Toma de muestra
   */
  private getTiposTomaMuestra(): void {

    this.tiposMuestraSubscripcion = this.planManejoService.getTomasMuestra().subscribe(
      response => {
        this.modalProcedimientosViewModel.respuestaTomaMuestrasTipoMuestra = response;
      },
      error => {
        this.capturaDeErroresService.mapearErrores(error.status, error.error);
      },
      () => {
        this.dosisSubscripcion.unsubscribe();
      });
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
   * Crea los campos del formulario curaciones con sus respectivas validaciones
   */
  private crearFormularioCuraciones(): void {
    this.formularioCuraciones = this.fb.group({
      tipoCuracion: [{value: null, disabled: this.data.esDetalle}, Validators.compose([
        Validators.required
      ])],
      sesiones: [{value: null, disabled: this.data.esDetalle},
        Validators.compose([
          Validators.required,
          Validators.pattern('[0-9]+'),
          Validators.min(1),
          Validators.max(99)
        ])],
      descripcion: [{value: null, disabled: this.data.esDetalle},
        Validators.compose([
          Validators.required,
          Validators.maxLength(300)
        ])
      ],
      diasSeleccionados: [{value: null, disabled: this.data.esDetalle}, Validators.compose([])],
    });
  }

  /**
   * Crea los campos del formulario Sondajes con sus respectivas validaciones
   */
  private crearFormularioSondajes(): void {
    this.formularioSondajes = this.fb.group({
      tipoSondajeNovedades: [{value: null, disabled: this.data.esDetalle}, Validators.compose([
        Validators.required
      ])],
      sondaje: [{value: null, disabled: this.data.esDetalle}, Validators.compose([
        Validators.required
      ])],
      fechaSondaje: [{value: null, disabled: this.data.esDetalle}, Validators.compose([
        Validators.required
      ])],
      sesionesSondaje: [{value: null, disabled: this.data.esDetalle},
        Validators.compose([
          Validators.required,
          Validators.pattern('[0-9]+'),
          Validators.min(1),
          Validators.max(99)
        ])],
    });
  }

  /**
   * Crea los campos del formulario Fototerapias con sus respectivas validaciones
   */
  private crearFormularioFototerapias(): void {
    this.formularioFototerapias = this.fb.group({
      diasTratamiento: [{value: null, disabled: this.data.esDetalle},
        Validators.compose([
          Validators.required,
          Validators.maxLength(1),
          Validators.pattern('[0-9]+'),
          Validators.min(1),
          Validators.max(2)
        ])
      ],
      tipoFrecuencia: [{value: null, disabled: this.data.esDetalle}, Validators.compose([
        Validators.required
      ])]
    });
  }

  /**
   * Crea los campos del formulario toma de muestras con sus respectivas validaciones
   */
  private crearFormularioTomaMuestras(): void {
    this.formularioTomaMuestras = this.fb.group({
      tipoMuestra: [{value: null, disabled: this.data.esDetalle}, Validators.compose([
        Validators.required
      ])],
      fechaMuestra: [{value: null, disabled: this.data.esDetalle}],
      requiereAyuno: [{value: null, disabled: this.data.esDetalle}]
    });
  }

  /**
   * Crea los campos del formulario Aspiración de secreciones con sus respectivas validaciones
   */
  private crearFormularioAspiracionSecreciones(): void {
    this.formularioAspiracionSecreciones = this.fb.group({
      diasTratamiento: [{value: null, disabled: this.data.esDetalle},
        Validators.compose([
          Validators.required,
          Validators.pattern('[0-9]+'),
          Validators.min(1),
          Validators.max(30)
        ])
      ],
      envioAspirador: [{value: false, disabled: this.data.esDetalle}],
      visitaEnfermeria: [{value: false, disabled: this.data.esDetalle}],
      tipoSonda: [{value: null, disabled: this.data.esDetalle}, Validators.compose([
        Validators.required
      ])],
      nasal: [{value: false, disabled: this.data.esDetalle}],
      traqueostomia: [{value: false, disabled: this.data.esDetalle}]
    });
  }

  /**
   * Crea los campos del formulario canalizaciones con sus respectivas validaciones
   */
  private crearFormularioCanalizaciones(): void {
    this.formularioCanalizaciones = this.fb.group({
      tipoCanalizacion: [{value: null, disabled: this.data.esDetalle}, Validators.compose([
        Validators.required
      ])],
    });
  }

  /**
   * Crea los campos del formulario Soporte Nutricional con sus respectivas validaciones
   */
  private crearFormularioSoporteNutricional(): void {
    this.formularioSoporteNutricional = this.fb.group({
      medicamento: [{value: null, disabled: this.data.esDetalle},
        Validators.compose([
          Validators.required,
          Validators.maxLength(100)
        ])
      ],
      cantidadDosis: [{value: null, disabled: this.data.esDetalle},
        Validators.compose([
          Validators.required,
          Validators.maxLength(8),
          Validators.pattern('^([0-9]{1,4})+([.][0-9]{1,3})?$')
        ])
      ],
      unidadDosis: [{value: null, disabled: this.data.esDetalle}, Validators.compose([Validators.required])],
      tipoNutricion: [{value: null, disabled: this.data.esDetalle}, Validators.compose([Validators.required])],
      nutricion: [{value: '', disabled: this.data.esDetalle}, Validators.compose([Validators.required])],
      duracion: [{value: null, disabled: this.data.esDetalle},
        Validators.compose([
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern('[0-9]+'),
          Validators.min(1),
          Validators.max(999)
        ])
      ],
      diasTratamiento: [{value: null, disabled: this.data.esDetalle},
        Validators.compose([
          Validators.required,
          Validators.pattern('[0-9]+'),
          Validators.min(1),
          Validators.max(99)
        ])
      ],
      volumen: [{value: null, disabled: this.data.esDetalle},
        Validators.compose([
          Validators.required,
          Validators.pattern('[0-9]+'),
          Validators.min(0),
          Validators.max(9000)
        ])
      ],
      noPBS: [{value: false, disabled: this.data.esDetalle}],
      diasEvento: [{value: null, disabled: this.data.esDetalle}, Validators.compose([Validators.required])],
      frecuencia: [{value: null, disabled: this.data.esDetalle}, Validators.compose([Validators.required])],
      tipoEvento: [{value: null, disabled: this.data.esDetalle}, Validators.compose([Validators.required])]
    });
  }

  /**
   * Genera columnas para la tabla soporte nutricional
   */
  private generarColumnasEventos(): void {
    this.columnasEventos = [
      {
        field: this.modalProcedimientosViewModel.mensajes.soporteNutricional.tabla.diasCampo,
        header: this.modalProcedimientosViewModel.mensajes.soporteNutricional.tabla.dias
      },
      {
        field: this.modalProcedimientosViewModel.mensajes.soporteNutricional.tabla.horaCampo,
        header: this.modalProcedimientosViewModel.mensajes.soporteNutricional.tabla.hora
      },
      {
        field: this.modalProcedimientosViewModel.mensajes.soporteNutricional.tabla.eventoCampo,
        header: this.modalProcedimientosViewModel.mensajes.soporteNutricional.tabla.evento
      },
    ];
  }

  /**
   * Genera columnas para la tabla sondajes
   */
  private generarColumnasSondajes(): void {
    this.columnasSondajes = [
      {
        field: this.modalProcedimientosViewModel.mensajes.sondajes.tabla.tipoSondajeCampo,
        header: this.modalProcedimientosViewModel.mensajes.sondajes.tabla.tipoSondajeNovedades
      },
      {
        field: this.modalProcedimientosViewModel.mensajes.sondajes.tabla.sondajeCampo,
        header: this.modalProcedimientosViewModel.mensajes.sondajes.tabla.sondaje
      },
      {
        field: this.modalProcedimientosViewModel.mensajes.sondajes.tabla.fechaSondajeCampo,
        header: this.modalProcedimientosViewModel.mensajes.sondajes.tabla.fechaSondaje
      },
      {
        field: this.modalProcedimientosViewModel.mensajes.sondajes.tabla.fechaSondaje,
        header: this.modalProcedimientosViewModel.mensajes.sondajes.tabla.fechaSondaje
      },
    ];
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): ModalProcedimientosViewModel {
    return new ModalProcedimientosViewModel(
      null,
      false,
      '',
      [],
      [],
      [],
      [],
      [],
      '',
      '',
      false,
      [],
      [],
      [],
      [],
      '',
      [],
      [],
      false,
      null,
      [],
      [],
      false,
      [],
      [],
      [],
      '',
      [],
      []);
  }

  /**
   * Cambia los validadores de un control del formulario
   * @param {FormGroup} formulario
   * @param {string} nombrecontrol
   */
  private cambiarValidadorFormularioARequerido(formulario: FormGroup, nombrecontrol: string): void {
    formulario.get(nombrecontrol).clearValidators();
    formulario.get(nombrecontrol).setValidators(
      Validators.compose([
        Validators.required
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
      monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
        'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      today: 'Hoy',
      clear: 'Borrar'
    };
  }
}
