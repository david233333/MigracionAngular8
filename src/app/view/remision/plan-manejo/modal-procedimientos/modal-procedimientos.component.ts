import {AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatOption} from '@angular/material';
import {TabView} from 'primeng/primeng';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import * as moment from 'moment';
import {ModalProcedimientosViewModel} from './modal-procedimientos.view-model';
import {PlanManejoComponent} from '../plan-manejo.component';
import {PlanManejoService} from '../../../../domain/usecase/remision/plan-manejo.service';
import {MensajesService} from '../../../../shared/services/mensajes.service';
import {Guid} from 'guid-typescript';
import {Curacion} from '../../../../domain/model/remision/entity/plan-manejo/procedimientos/curacion.model';
import {Sondaje} from '../../../../domain/model/remision/entity/plan-manejo/procedimientos/sondaje.model';
import {Fototerapia} from '../../../../domain/model/remision/entity/plan-manejo/procedimientos/fototerapia.model';
import {AspiracionSecrecion} from '../../../../domain/model/remision/entity/plan-manejo/procedimientos/aspiracion-secrecion.model';
import {SoporteNutricional} from '../../../../domain/model/remision/entity/plan-manejo/procedimientos/soporte-nutricional.model';
import {Dosis} from '../../../../domain/model/maestro/entity/dosis.model';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Medicamento} from '../../../../domain/model/maestro/entity/medicamento.model';
import {TipoProcedimientoEnum} from '../../../../shared/utils/enums/tipo-procedimiento.enum';
import {ComunService} from '../../../../domain/usecase/comun/comun.service';
import {EventoSoporteNutricional} from '../../../../domain/model/comun/entity/evento-soporte-nutricional.model';
import {ProgramacionSemana} from '../../../../shared/models/programacion-semana.model';
import {TipoNutricion} from '../../../../domain/model/maestro/entity/tipo-nutricion.model';
import {Frecuencia} from '../../../../domain/model/maestro/entity/frecuencia.model';
import {TiposSoporteNutricional} from '../../../../domain/model/maestro/entity/tipos-soporte-nutricional.model';
import {AgregadosComunService} from '../../../../shared/services/agregados-comun.service';
import {CapturarErrores} from '../../../../shared/services/capturar-errores';

moment.locale('es');


@Component({
  selector: 'sura-procedimientos',
  templateUrl: './modal-procedimientos.component.html',
  styleUrls: ['./modal-procedimientos.component.scss']
})
export class ModalProcedimientosComponent implements OnInit, OnDestroy, AfterViewInit {

  public formularioCuraciones: FormGroup;
  public formularioSondajes: FormGroup;
  public formularioFototerapias: FormGroup;
  public formularioAspiracionSecreciones: FormGroup;
  public formularioSoporteNutricional: FormGroup;
  public ultimaCuracion: Date;
  public ultimaTomaMuestra: Date;
  public configEspanolCalendario: any;
  public nombreFormulario: string;
  public modalProcedimientosViewModel: ModalProcedimientosViewModel = this.iniciarViewModel();
  @ViewChild(TabView, { static: true }) tabView: TabView;
  public seleccionCuraciones: boolean;
  public seleccionSondajes: boolean;
  public seleccionFototerapias: boolean;
  public seleccionSecreciones: boolean;
  public seleccionSoporteNutricional: boolean;
  public habilitarCuraciones = true;
  public habilitarSondajes = true;
  public habilitarFototerapias = true;
  public habilitarSecreciones = true;
  public habilitarSoporteNutricional = true;
  public fechaMaximaCalendarioActual: Date;
  public verTomaMuestra = true;
  public verAlimentacion = true;
  public verEvacuacion = true;
  public verDrenaje = true;
  public textoMedicamento = new Subject<string>();
  public medicamentosFiltrados: Observable<Medicamento[]>;
  public columnasEventos: any[];
  private sondajeSubscripcion: Subscription = new Subscription();
  private frecuenciaSubscripcion: Subscription = new Subscription();
  private medicamentosSubscripcion: Subscription = new Subscription();
  private dosisSubscripcion: Subscription = new Subscription();
  private viasAdministracionSubscripcion: Subscription = new Subscription();
  private frecuenciaSoporteSubscripcion: Subscription = new Subscription();
  private tiposNutricionSubscripcion: Subscription = new Subscription();
  private tipoProcedimiento: string;
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
    this.crearFormularioCuraciones();
    this.crearFormularioSondajes();
    this.crearFormularioFototerapias();
    this.crearFormularioAspiracionSecreciones();
    this.crearFormularioSoporteNutricional();
    this.generarColumnasEventos();
    this.configurarMaximaFechaActual();
    this.suscribirCampoTextoMedicamentos();
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.configurarCalendario();
    this.verDatos();
    console.log(this.data);
    if (this.data.procedimiento != null) {
      this.verEdicion(this.data.procedimiento);
    }
  }


  ngOnDestroy() {
    this.sondajeSubscripcion.unsubscribe();
    this.frecuenciaSubscripcion.unsubscribe();
    this.medicamentosSubscripcion.unsubscribe();
    this.dosisSubscripcion.unsubscribe();
    this.viasAdministracionSubscripcion.unsubscribe();
    this.frecuenciaSoporteSubscripcion.unsubscribe();
    this.tiposNutricionSubscripcion.unsubscribe();

  }

  public onChangeNoPBS(event) {
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
    console.log('VerEdicion data ', data);
    if (data !== null) {

      if (data instanceof Curacion) {
        this.tipoProcedimiento = TipoProcedimientoEnum.CURACIONES;
      } else if (data instanceof Sondaje) {
        this.tipoProcedimiento = TipoProcedimientoEnum.SONDAJES;
      } else if (data instanceof Fototerapia) {
        this.tipoProcedimiento = TipoProcedimientoEnum.FOTOTERAPIAS;
      } else if (data instanceof AspiracionSecrecion) {
        this.tipoProcedimiento = TipoProcedimientoEnum.ASPIRACION_SECRECIONES;
      } else if (data instanceof SoporteNutricional) {
        this.tipoProcedimiento = TipoProcedimientoEnum.SOPORTE_NUTRICIONAL;
      }

      switch (this.tipoProcedimiento) {
        case TipoProcedimientoEnum.CURACIONES: {
          this.nombreFormulario = this.modalProcedimientosViewModel.mensajes.opcionesMenu.curaciones;
          this.modalProcedimientosViewModel.tituloVentana =
            this.modalProcedimientosViewModel.mensajes.tituloVentana.agregarEditarCuraciones;
          this.verTabSeleccionado(true, false, false, false, false);
          this.formularioCuraciones.get('descripcion').setValue(data.descripcion);
          this.formularioCuraciones.get('ultimaCuracion').setValue(new Date(data.ultimaCuracion));
          this.ultimaCuracion = new Date(data.ultimaCuracion);
          break;
        }
        case TipoProcedimientoEnum.SONDAJES: {
          this.nombreFormulario = this.modalProcedimientosViewModel.mensajes.opcionesMenu.sondajes;
          this.modalProcedimientosViewModel.tituloVentana = this.modalProcedimientosViewModel.mensajes.tituloVentana.agregarEditarSondajes;
          this.verTabSeleccionado(false, true, false, false, false);

          switch (data.tipo) {
            case this.modalProcedimientosViewModel.mensajes.sondajes.tipos.tomaMuestra: {
              this.verSondajes(true, false, false, false);
              this.formularioSondajes.get('opcionTomaMuestra').setValue(true);
              this.formularioSondajes.get('requiereAyuno').setValue(data.ayuno);
              this.formularioSondajes.get('tomaMuestra').setValue(data.sondaje);
            }
              break;
            case this.modalProcedimientosViewModel.mensajes.sondajes.tipos.alimentacion: {
              this.verSondajes(false, true, false, false);
              this.formularioSondajes.get('opcionAlimentacion').setValue(true);
              this.formularioSondajes.get('alimentacion').setValue(data.sondaje);
            }
              break;
            case this.modalProcedimientosViewModel.mensajes.sondajes.tipos.evacuacion: {
              this.verSondajes(false, false, true, false);
              this.formularioSondajes.get('opcionEvacuacion').setValue(true);
              this.formularioSondajes.get('evacuacion').setValue(data.sondaje);
            }
              break;
            case this.modalProcedimientosViewModel.mensajes.sondajes.tipos.drenaje: {
              this.verSondajes(false, false, false, true);
              this.formularioSondajes.get('opcionDrenaje').setValue(true);
              this.formularioSondajes.get('drenaje').setValue(data.sondaje);
            }
              break;
          }

          break;
        }
        case TipoProcedimientoEnum.FOTOTERAPIAS: {
          this.nombreFormulario = this.modalProcedimientosViewModel.mensajes.opcionesMenu.fototerapias;
          this.modalProcedimientosViewModel.tituloVentana =
            this.modalProcedimientosViewModel.mensajes.tituloVentana.agregarEditarFototerapias;
          this.verTabSeleccionado(false, false, true, false, false);
          this.formularioFototerapias.get('diasTratamiento').setValue(data.diasTratamiento);
          this.formularioFototerapias.get('bilirrubinaTotal').setValue(data.bilirrubinaTotal);
          this.ultimaTomaMuestra = new Date(data.ultimaTomaMuestra);
          this.formularioFototerapias.get('tipoFrecuencia').setValue(data.tipoFrecuencia);
          break;
        }
        case TipoProcedimientoEnum.ASPIRACION_SECRECIONES: {
          this.nombreFormulario = this.modalProcedimientosViewModel.mensajes.opcionesMenu.secreciones;
          this.modalProcedimientosViewModel.tituloVentana =
            this.modalProcedimientosViewModel.mensajes.tituloVentana.agregarEditarAspiracionSecreciones;
          this.verTabSeleccionado(false, false, false, true, false);
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
        case TipoProcedimientoEnum.SOPORTE_NUTRICIONAL: {
          this.validarControlesEventoSoporte();
          this.nombreFormulario = this.modalProcedimientosViewModel.mensajes.opcionesMenu.soporteNutricional;
          this.verTabSeleccionado(
            false, false, false, false, true
          );
          this.formularioSoporteNutricional.get('medicamento').setValue(data.medicamento);
          this.formularioSoporteNutricional.get('cantidadDosis').setValue(data.cantidadDosis);
          this.formularioSoporteNutricional.get('unidadDosis').setValue(data.unidadDosis.descripcion);
          this.formularioSoporteNutricional.get('tipoNutricion').setValue(data.tipoNutricion.tipo);
          this.formularioSoporteNutricional.get('nutricion').setValue(data.tipoNutricion.descripcion);
          this.modalProcedimientosViewModel.nutricion = data.tipoNutricion.descripcion;
          this.formularioSoporteNutricional.get('duracion').setValue(data.duracion);
          this.formularioSoporteNutricional.get('volumen').setValue(data.volumen);
          this.formularioSoporteNutricional.get('noPBS').setValue(data.noPBS);
          this.modalProcedimientosViewModel.eventos = [];
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

  public guardarProcedimiento(): void {
    switch (this.nombreFormulario) {
      case this.modalProcedimientosViewModel.mensajes.opcionesMenu.curaciones: {

        if (this.formularioCuraciones.valid) {

          const CURACION = new Curacion(
            Guid.create().toString(),
            this.formularioCuraciones.controls['descripcion'].value,
            this.formularioCuraciones.controls['ultimaCuracion'].value
          );

          console.log('CURACION ', CURACION);

          this.dialogRef.close(CURACION);

        } else {
          this.validarTodosLosCamposDelFormulario(this.formularioCuraciones);
        }

        break;
      }
      case this.modalProcedimientosViewModel.mensajes.opcionesMenu.sondajes: {

        const listaSondajes: Array<Sondaje> = new Array<Sondaje>();

        this.validarFormulario();

        if (this.formularioSondajes.valid) {

          if (this.formularioSondajes.controls['opcionTomaMuestra'].value) {

            const SONDAJE = this.modalProcedimientosViewModel.respuestaSondajesTomaMuestra
              .find(s => s.sondaje === this.formularioSondajes.controls['tomaMuestra'].value);
            console.log('SONDAJE ', SONDAJE);
            const TOMA_MUESTRA = new Sondaje(
              Guid.create().toString(),
              SONDAJE.sondaje,
              SONDAJE.idSondaje,
              SONDAJE.idTipoSondaje);
            listaSondajes.push(TOMA_MUESTRA);
          }

          if (this.formularioSondajes.controls['opcionAlimentacion'].value) {

            const SONDAJE = this.modalProcedimientosViewModel.respuestaSondajesAlimentacion
              .find(s => s.sondaje === this.formularioSondajes.controls['alimentacion'].value);

            const ALIMENTACION = new Sondaje(
              Guid.create().toString(),
              SONDAJE.sondaje,
              SONDAJE.idSondaje,
              SONDAJE.idTipoSondaje);
            listaSondajes.push(ALIMENTACION);
          }

          if (this.formularioSondajes.controls['opcionEvacuacion'].value) {

            const SONDAJE = this.modalProcedimientosViewModel.respuestaSondajesEvacuacion
              .find(s => s.sondaje === this.formularioSondajes.controls['evacuacion'].value);

            const EVACUACION = new Sondaje(
              Guid.create().toString(),
              SONDAJE.sondaje,
              SONDAJE.idSondaje,
              SONDAJE.idTipoSondaje);
            listaSondajes.push(EVACUACION);
          }

          if (this.formularioSondajes.controls['opcionDrenaje'].value) {

            const SONDAJE = this.modalProcedimientosViewModel.respuestaSondajesDrenaje
              .find(s => s.sondaje === this.formularioSondajes.controls['drenaje'].value);

            const DRENAJE = new Sondaje(
              Guid.create().toString(),
              SONDAJE.sondaje,
              SONDAJE.idSondaje,
              SONDAJE.idTipoSondaje);
            listaSondajes.push(DRENAJE);
          }

          this.dialogRef.close(listaSondajes);

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
            this.formularioFototerapias.controls['bilirrubinaTotal'].value,
            this.formularioFototerapias.controls['ultimaTomaMuestra'].value,
            this.formularioFototerapias.controls['tipoFrecuencia'].value,
          );

          this.dialogRef.close(FOTOTERAPIA);

        } else {
          this.validarTodosLosCamposDelFormulario(this.formularioFototerapias);
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
    } else {
      this.cambiarValidadorFormularioARequerido(this.formularioSoporteNutricional, 'diasEvento');
      this.cambiarValidadorFormularioARequerido(this.formularioSoporteNutricional, 'frecuencia');
      this.cambiarValidadorFormularioARequerido(this.formularioSoporteNutricional, 'tipoEvento');
      this.cambiarValidadorFormularioARequerido(this.formularioSoporteNutricional, 'diasTratamiento');
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

  /**
   * Obtiene las frecuencias para Soporte nutricional
   * @param tipo
   */
  getFrecuencia(tipo: string) {
    this.planManejoService.getFrecuencias(tipo).subscribe(
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
    this.planManejoService.getTiposSoporteNutricional().subscribe(
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

  public cerrarModal() {
    this.dialogRef.close();
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

  private verSondajes(tomaMuestra: boolean, alimentacion: boolean, evacuacion: boolean, drenaje: boolean): void {
    this.verTomaMuestra = tomaMuestra;
    this.verAlimentacion = alimentacion;
    this.verEvacuacion = evacuacion;
    this.verDrenaje = drenaje;
  }

  private verTabSeleccionado(esCuraciones: boolean, esSondajes: boolean, esFototerapias: boolean,
                             esAspiracionSecreciones: boolean, esSoporteNutricional: boolean): void {
    this.seleccionCuraciones = esCuraciones;
    this.seleccionSondajes = esSondajes;
    this.seleccionFototerapias = esFototerapias;
    this.seleccionSecreciones = esAspiracionSecreciones;
    this.seleccionSoporteNutricional = esSoporteNutricional;

    this.habilitarCuraciones = esCuraciones;
    this.habilitarSondajes = esSondajes;
    this.habilitarFototerapias = esFototerapias;
    this.habilitarSecreciones = esAspiracionSecreciones;
    this.habilitarSoporteNutricional = esSoporteNutricional;
  }

  private configurarFormulario(header: string): void {
    this.nombreFormulario = header;

    switch (header) {
      case this.modalProcedimientosViewModel.mensajes.opcionesMenu.curaciones: {
        this.modalProcedimientosViewModel.tituloVentana = this.modalProcedimientosViewModel.mensajes.tituloVentana.agregarEditarCuraciones;
        break;
      }
      case this.modalProcedimientosViewModel.mensajes.opcionesMenu.sondajes: {
        this.modalProcedimientosViewModel.tituloVentana = this.modalProcedimientosViewModel.mensajes.tituloVentana.agregarEditarSondajes;
        break;
      }
      case this.modalProcedimientosViewModel.mensajes.opcionesMenu.fototerapias: {
        this.modalProcedimientosViewModel.tituloVentana =
          this.modalProcedimientosViewModel.mensajes.tituloVentana.agregarEditarFototerapias;
        break;
      }
      case this.modalProcedimientosViewModel.mensajes.opcionesMenu.secreciones: {
        this.modalProcedimientosViewModel.tituloVentana =
          this.modalProcedimientosViewModel.mensajes.tituloVentana.agregarEditarAspiracionSecreciones;
        break;
      }
      case this.modalProcedimientosViewModel.mensajes.opcionesMenu.soporteNutricional: {
        this.modalProcedimientosViewModel.tituloVentana =
          this.modalProcedimientosViewModel.mensajes.tituloVentana.agregarEditarSoporteNutricional;
        break;
      }
    }
  }

  private verDatos(): void {
    this.verOpcionCuraciones();
    this.verOpcionSondajes();
    this.verOpcionFototerapias();
    this.verOpcionSoporteNutricional();
    this.getDiasSemana();
  }

  private verOpcionCuraciones(): void {
    this.nombreFormulario = this.modalProcedimientosViewModel.mensajes.opcionesMenu.curaciones;
    this.modalProcedimientosViewModel.tituloVentana = this.modalProcedimientosViewModel.mensajes.tituloVentana.agregarEditarCuraciones;
  }

  private verOpcionSondajes(): void {
    this.getTiposSondaje();
  }

  private verOpcionFototerapias(): void {
    this.getTiposFrecuenciaFototerapia('FOTOTERAPIA');
  }

  private verOpcionSoporteNutricional(): void {
    this.getMedicamentos();
    this.getDosis(TipoProcedimientoEnum.SOPORTE_NUTRICIONAL);
    this.getFrecuencia(TipoProcedimientoEnum.SOPORTE_NUTRICIONAL);
    this.getTipoNutricion();
    this.getTiposSoporteNutricional();
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

  private validarFormulario(): void {
    const esFormularioInValido = !this.formularioSondajes.controls['opcionTomaMuestra'].value &&
      !this.formularioSondajes.controls['opcionAlimentacion'].value &&
      !this.formularioSondajes.controls['opcionDrenaje'].value
      && !this.formularioSondajes.controls['opcionEvacuacion'].value;

    if (esFormularioInValido) {
      this.cambiarValidadorFormularioARequerido(this.formularioSondajes, 'sondajesSeleccionados');
    } else {
      this.cambiarValidadorFormularioAOpcional(this.formularioSondajes, 'sondajesSeleccionados');
    }

    if (this.formularioSondajes.controls['opcionTomaMuestra'].value) {
      this.cambiarValidadorFormularioARequerido(this.formularioSondajes, 'tomaMuestra');
    } else {
      this.cambiarValidadorFormularioAOpcional(this.formularioSondajes, 'tomaMuestra');
    }

    if (this.formularioSondajes.controls['opcionAlimentacion'].value) {
      this.cambiarValidadorFormularioARequerido(this.formularioSondajes, 'alimentacion');
    } else {
      this.cambiarValidadorFormularioAOpcional(this.formularioSondajes, 'alimentacion');
    }

    if (this.formularioSondajes.controls['opcionEvacuacion'].value) {
      this.cambiarValidadorFormularioARequerido(this.formularioSondajes, 'evacuacion');
    } else {
      this.cambiarValidadorFormularioAOpcional(this.formularioSondajes, 'evacuacion');
    }
    if (this.formularioSondajes.controls['opcionDrenaje'].value) {
      this.cambiarValidadorFormularioARequerido(this.formularioSondajes, 'drenaje');
    } else {
      this.cambiarValidadorFormularioAOpcional(this.formularioSondajes, 'drenaje');
    }
  }

  /**
   * Obtiene los tipos de sondaje
   */
  private getTiposSondaje(): void {

    this.sondajeSubscripcion = this.planManejoService.getTiposSondaje().subscribe(
      response => {
        console.log('response get tipoSondajeIngreso ', response);
        if (response) {
          this.modalProcedimientosViewModel.respuestaSondajesTomaMuestra = response
            .filter(s => s.idTipoSondaje === this.modalProcedimientosViewModel.mensajes.sondajes.tipos.tomaMuestra);
          this.modalProcedimientosViewModel.respuestaSondajesAlimentacion = response
            .filter(s => s.idTipoSondaje === this.modalProcedimientosViewModel.mensajes.sondajes.tipos.alimentacion);
          this.modalProcedimientosViewModel.respuestaSondajesEvacuacion = response
            .filter(s => s.idTipoSondaje === this.modalProcedimientosViewModel.mensajes.sondajes.tipos.evacuacion);
          this.modalProcedimientosViewModel.respuestaSondajesDrenaje = response
            .filter(s => s.idTipoSondaje === this.modalProcedimientosViewModel.mensajes.sondajes.tipos.drenaje);
        }
      },
      error => {
        this.capturaDeErroresService.mapearErrores(error.status, error.error);
      },
      () => {
        this.sondajeSubscripcion.unsubscribe();
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
        if (response) {
          this.modalProcedimientosViewModel.respuestaFototerapiasTipoFrecuencia = response;
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
   * obtiene los días de las sesiones
   */
  private getDiasSemana(): void {
    this.modalProcedimientosViewModel.listaDias = this.comunService.getDiasSemanas();
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

  private configurarMaximaFechaActual(): void {
    const fechaHoy = new Date();
    this.fechaMaximaCalendarioActual = new Date();
    this.fechaMaximaCalendarioActual.setDate(fechaHoy.getDate());
    this.fechaMaximaCalendarioActual.setMonth(fechaHoy.getMonth());
    this.fechaMaximaCalendarioActual.setFullYear(fechaHoy.getFullYear());
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
   * Crea los campos del formulario Curaciones con sus respectivas validaciones
   */
  private crearFormularioCuraciones(): void {
    this.formularioCuraciones = this.fb.group({
      descripcion: ['',
        Validators.compose([
          Validators.required,
          Validators.maxLength(300)
        ])
      ],
      ultimaCuracion: ['',
        Validators.compose([
          Validators.required
        ])]
    });
  }

  /**
   * Crea los campos del formulario Sondajes con sus respectivas validaciones
   */
  private crearFormularioSondajes(): void {
    this.formularioSondajes = this.fb.group({
      opcionTomaMuestra: [false],
      requiereAyuno: [false],
      tomaMuestra: [''],
      opcionAlimentacion: [false],
      alimentacion: [''],
      opcionEvacuacion: [false],
      opcionDrenaje: [false],
      drenaje: [''],
      evacuacion: [''],
      sondajesSeleccionados: [null, Validators.compose([
        Validators.required
      ])]
    });
  }

  /**
   * Crea los campos del formulario Fototerapias con sus respectivas validaciones
   */
  private crearFormularioFototerapias(): void {
    this.formularioFototerapias = this.fb.group({
      diasTratamiento: ['',
        Validators.compose([
          Validators.required,
          Validators.maxLength(1),
          Validators.pattern('[0-9]+'),
          Validators.min(1),
          Validators.max(7)
        ])
      ],
      bilirrubinaTotal: ['',
        Validators.compose([
          Validators.required,
          Validators.maxLength(5),
          Validators.pattern('[1-7]?[0-9](\.[0-9]{1,2})?|21(\.00?)?'),
          Validators.min(0),
          Validators.max(20.99)
        ])
      ],
      ultimaTomaMuestra: ['', Validators.compose([
        Validators.required
      ])],
      tipoFrecuencia: [null, Validators.compose([
        Validators.required
      ])]
    });
  }


  /**
   * Crea los campos del formulario Aspiración de secreciones con sus respectivas validaciones
   */
  private crearFormularioAspiracionSecreciones(): void {
    this.formularioAspiracionSecreciones = this.fb.group({
      diasTratamiento: ['',
        Validators.compose([
          Validators.required,
          Validators.pattern('[0-9]+'),
          Validators.min(1),
          Validators.max(30)
        ])
      ],
      envioAspirador: [false],
      visitaEnfermeria: [false],
      tipoSonda: [null, Validators.compose([
        Validators.required
      ])],
      nasal: [false],
      traqueostomia: [false]
    });
  }

  /**
   * Crea los campos del formulario Soporte Nutricional con sus respectivas validaciones
   */
  private crearFormularioSoporteNutricional(): void {
    this.formularioSoporteNutricional = this.fb.group({
      medicamento: ['',
        Validators.compose([
          Validators.required,
          Validators.maxLength(100)
        ])
      ],
      cantidadDosis: ['',
        Validators.compose([
          Validators.required,
          Validators.maxLength(8),
          Validators.pattern('^([0-9]{1,4})+([.][0-9]{1,3})?$')
        ])
      ],
      unidadDosis: ['', Validators.compose([Validators.required])],
      tipoNutricion: ['', Validators.compose([Validators.required])],
      nutricion: ['', Validators.compose([Validators.required])],
      duracion: ['',
        Validators.compose([
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern('[0-9]+'),
          Validators.min(1),
          Validators.max(999)
        ])
      ],
      diasTratamiento: ['',
        Validators.compose([
          Validators.required,
          Validators.pattern('[0-9]+'),
          Validators.min(1),
          Validators.max(99)
        ])
      ],
      volumen: ['',
        Validators.compose([
          Validators.required,
          Validators.pattern('[0-9]+'),
          Validators.min(0),
          Validators.max(9000)
        ])
      ],
      noPBS: [false],
      diasEvento: ['', Validators.compose([Validators.required])],
      frecuencia: ['', Validators.compose([Validators.required])],
      tipoEvento: ['', Validators.compose([Validators.required])]
    });
  }


  /**
   * Genera columnas para la tabla
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
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): ModalProcedimientosViewModel {
    return new ModalProcedimientosViewModel(
      null,
      false,
      '',
      '',
      [],
      [],
      [],
      [],
      [],
      [],
      '',
      [],
      [],
      [],
      [],
      null,
      [],
      [],
      false,
      '',
      [],
      []);
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
