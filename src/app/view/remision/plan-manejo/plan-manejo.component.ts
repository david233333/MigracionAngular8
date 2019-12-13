import {ChangeDetectorRef,Component,ElementRef,EventEmitter,Input,OnChanges,OnDestroy,OnInit,Output, SimpleChanges,ViewChild} from '@angular/core';

import {PlanManejoViewModel} from './plan-manejo.view-model';
import {MatDialog, MatSelectionList} from '@angular/material';
import {ModalTratamientosComponent} from './modal-tratamientos/modal-tratamientos.component';
import {PlanManejoService} from '../../../domain/usecase/remision/plan-manejo.service';
import {Subscription} from 'rxjs/Subscription';
import {MensajesService} from '../../../shared/services/mensajes.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {ModalProcedimientosComponent} from './modal-procedimientos/modal-procedimientos.component';
import {ModalConfirmacionComponent} from '../../../shared/components/modal-confirmacion/modal-confirmacion.component';
import {ModalConfirmacion} from '../../../shared/models/modal-confirmacion.model';
import {Valoracion} from '../../../domain/model/remision/entity/plan-manejo/valoracion.model';
import {Tratamiento} from '../../../domain/model/remision/entity/plan-manejo/tratamiento.model';
import {Curacion} from '../../../domain/model/remision/entity/plan-manejo/procedimientos/curacion.model';
import {Sondaje} from '../../../domain/model/remision/entity/plan-manejo/procedimientos/sondaje.model';
import {Fototerapia} from '../../../domain/model/remision/entity/plan-manejo/procedimientos/fototerapia.model';
import {AspiracionSecrecion} from '../../../domain/model/remision/entity/plan-manejo/procedimientos/aspiracion-secrecion.model';
import {Procedimientos} from '../../../domain/model/remision/entity/plan-manejo/procedimiento.model';
import {AgregadosRemisionService} from '../../../shared/services/agregados-remision.service';
import {Router} from '@angular/router';
import {RemisionContenedorService} from '../../../domain/usecase/remision/remision-contenedor.service';
import {EstadosRemisionEnum} from '../../../shared/utils/enums/estados-remision.enum';
import {SoporteNutricional} from '../../../domain/model/remision/entity/plan-manejo/procedimientos/soporte-nutricional.model';

import * as lodash from 'lodash';
import {CapturarErrores} from '../../../shared/services/capturar-errores';

moment.locale('es');

@Component({
  selector: 'sura-plan-manejo',
  templateUrl: './plan-manejo.component.html',
  styleUrls: ['./plan-manejo.component.scss']
})
export class PlanManejoComponent implements OnInit, OnDestroy {
  public planManejoViewModel: PlanManejoViewModel = this.iniciarViewModel();

  public columnasTratamientos: any[];
  public columnasCuraciones: any[];
  public columnasSondajes: any[];
  public columnasFototerapias: any[];
  public columnasTomaMuestras: any[];
  public columnasSecreciones: any[];
  public columnasSoporteNutricional: any[];
  public formulario: FormGroup;
  public valoracionesPorTipoSeleccionadas: Valoracion[] = new Array<Valoracion>();
  public verValorizacionesPoliza = false;
  public verValoraciones = false;
  public disableButton = false;
  public fechaExamenMedico: Date;
  public fechaMinimaCalendarioActual: Date;
  public configEspanolCalendario: any;
  @ViewChild('lista', { static: false }) lista: ElementRef;
  @ViewChild('listaPoliza', { static: false }) listaPoliza: MatSelectionList;
  @ViewChild('scrollDownTratamiento', { static: false }) scrollDownTratamiento: ElementRef;
  @ViewChild('scrollDownProcedimientoCuracion', { static: false })
  scrollDownProcedimientoCuracion: ElementRef;
  @ViewChild('scrollDownProcedimientoSondaje', { static: false })
  scrollDownProcedimientoSondaje: ElementRef;
  @ViewChild('scrollDownProcedimientoFototerapia', { static: false })
  scrollDownProcedimientoFototerapia: ElementRef;
  @ViewChild('scrollDownProcedimientoSecrecion', { static: false })
  scrollDownProcedimientoSecrecion: ElementRef;
  @ViewChild('scrollDownProcedimientoSoporteNutricional', { static: false })
  scrollDownProcedimientoSoporteNutricional: ElementRef;
  @ViewChild('scrollDownValoracion', { static: false }) scrollDownValoracion: ElementRef;
  @Output()
  public continuar: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  public cargando: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  public tratamientos: EventEmitter<Tratamiento[]> = new EventEmitter<Tratamiento[]>();
  @Output()
  public valoraciones: EventEmitter<Valoracion> = new EventEmitter<Valoracion>();
  @Output()
  public procedimientos: EventEmitter<Procedimientos> = new EventEmitter<Procedimientos>();
  @Output()
  public habilitarGuardar: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  public habilitarEnviar: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('lista', { static: false })


  listas: any;
  private tratamientosSubscripcion: Subscription = new Subscription();
  private valoracionesSubscripcion: Subscription = new Subscription();
  private valoracionesPolizaSubscripcion: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private planManejoService: PlanManejoService,
    private mensajesService: MensajesService,
    private agregadoRemision: AgregadosRemisionService,
    private router: Router,
    private remisionServices: RemisionContenedorService,
    private remisionService: RemisionContenedorService,
    private cdRef: ChangeDetectorRef,
    private capturaDeErroresService: CapturarErrores,
  ) {
    this.generarColumnasTratamientos();
    this.generarColumnasProcedimientos();
    this.crearFormulario();
    this.suscribirFormulario();
    this.configurarCalendario();
    this.configurarMinimaFechaActual();
    this.getDatos();
  }

  ngOnInit() {

    this.editarPlanManejo();
  }



  ngOnDestroy() {
    this.tratamientosSubscripcion.unsubscribe();
    this.valoracionesSubscripcion.unsubscribe();
    this.valoracionesPolizaSubscripcion.unsubscribe();
  }

  public seleccionarPlan(texto: string) {
    switch (texto) {
      case this.planManejoViewModel.mensajes.campos.tratamientos: {
        this.abrirModalTratamientos();
        break;
      }
      case this.planManejoViewModel.mensajes.campos.procedimientos: {
        this.abrirModalProcedimientos();
        break;
      }
      case this.planManejoViewModel.mensajes.campos.valoraciones: {
        this.verValoraciones = true;
        setTimeout(() => this.scrollDownValoracion.nativeElement.focus(), 0);
        break;
      }
    }
  }

  /**
   * Elimina el tratamiento de la lista y tabla
   * @param {Tratamiento} tratamiento
   */
  public eliminarTratamiento(tratamiento: Tratamiento): void {
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      width: '30%',
      disableClose: false,
      data: new ModalConfirmacion(
        this.planManejoViewModel.mensajes.tabla.tituloEliminarTratamiento,
        this.planManejoViewModel.mensajes.tabla.contenidoEliminarTratamiento
      )
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data === true) {
        if (tratamiento && tratamiento.idTratamiento) {
          const index = this.planManejoViewModel.tratamientos.findIndex(
            elemento => elemento.idTratamiento === tratamiento.idTratamiento
          );
          if (index !== null && index !== undefined) {
            this.planManejoViewModel.tratamientos.splice(index, 1);
          }
          this.actualizarTratamientos();
        }
      }
    });
  }

  /**
   * Edita el tratamiento de la lista y tabla
   * @param {Tratamiento} tratamiento
   */
  public editarTratamiento(tratamiento: Tratamiento): void {
    const dialogRef = this.dialog.open(ModalTratamientosComponent, {
      width: '90%',
      disableClose: false,
      data: {
        tratamiento: tratamiento,
        esDetalle: false,
        btnEditar: true
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.idTratamiento) {
        data.idTratamiento = tratamiento.idTratamiento;
        const index = this.planManejoViewModel.tratamientos.findIndex(
          elemento => elemento.idTratamiento === data.idTratamiento
        );
        if (index !== null && index !== undefined && index !== -1) {
          this.planManejoViewModel.tratamientos[index] = data;
        }
        this.actualizarTratamientos();
      }
    });
  }

  /**
   *
   */
  public abrirModalTratamientoDetalle(tratamiento: any): void {
    const dialogRef = this.dialog.open(ModalTratamientosComponent, {
      width: '90%',
      disableClose: false,
      data: {
        tratamiento: tratamiento,
        esDetalle: true
      }
    });
  }

  public verProcedimientos(): boolean {
    return (
      this.planManejoViewModel.curaciones.length > 0 ||
      this.planManejoViewModel.sondajes.length > 0 ||
      this.planManejoViewModel.fototerapias.length > 0 ||
      this.planManejoViewModel.secreciones.length > 0 ||
      this.planManejoViewModel.soporteNutricionales.length > 0
    );
  }

  /**
   * Elimina la curación de la lista y tabla
   * @param {Curacion} curacion
   */
  public eliminarProcedimientoCuracion(curacion: Curacion): void {
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      width: '30%',
      disableClose: false,
      data: new ModalConfirmacion(
        this.planManejoViewModel.mensajes.tabla.tituloEliminarProcedimiento,
        this.planManejoViewModel.mensajes.tabla.contenidoEliminarProcedimiento
      )
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data === true) {
        if (curacion && curacion.id) {
          const index = this.planManejoViewModel.curaciones.findIndex(
            elemento => elemento.id === curacion.id
          );
          if (index !== null && index !== undefined) {
            this.planManejoViewModel.curaciones.splice(index, 1);
          }
          this.actualizarProcedimientoCuraciones();
        }
      }
    });
  }

  /**
   * Edita el procedimiento tipo curación de la lista y tabla
   * @param {Curacion} curacion
   */
  public editarProcedimientoCuracion(curacion: Curacion): void {
    const CURACION = new Curacion(
      curacion.id,
      curacion.descripcion,
      curacion.ultimaCuracion
    );

    const dialogRef = this.dialog.open(ModalProcedimientosComponent, {
      width: '90%',
      disableClose: false,
      data: {
        procedimiento: CURACION,
        esDetalle: false,
        btnEditar: true
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.id) {
        data.id = curacion.id;
        const index = this.planManejoViewModel.curaciones.findIndex(
          elemento => elemento.id === data.id
        );
        if (index !== null && index !== undefined && index !== -1) {
          this.planManejoViewModel.curaciones[index] = data;
        }
        this.actualizarProcedimientoCuraciones();
      }
    });
  }

  /**
   * Elimina el sondaje de la lista y tabla
   * @param {Sondaje} sondaje
   */
  public eliminarProcedimientoSondajes(sondaje: Sondaje): void {
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      width: '30%',
      disableClose: false,
      data: new ModalConfirmacion(
        this.planManejoViewModel.mensajes.tabla.tituloEliminarProcedimiento,
        this.planManejoViewModel.mensajes.tabla.contenidoEliminarProcedimiento
      )
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data === true) {
        if (sondaje && sondaje.id) {
          const index = this.planManejoViewModel.sondajes.findIndex(
            elemento => elemento.id === sondaje.id
          );
          if (index !== null && index !== undefined) {
            this.planManejoViewModel.sondajes.splice(index, 1);
          }
          this.actualizarProcedimientoSondajes();
        }
      }
    });
  }

  /**
   * Edita el procedimiento tipo sondaje de la lista y tabla
   * @param {Sondaje} sondaje
   */
  public editarProcedimientoSondajes(sondaje: Sondaje): void {
    const SONDAJE = new Sondaje(
      sondaje.id,
      sondaje.sondaje,
      sondaje.idSondaje,
      sondaje.idTipoSondaje,
    );

    const dialogRef = this.dialog.open(ModalProcedimientosComponent, {
      width: '90%',
      disableClose: false,
      data: {
        procedimiento: SONDAJE,
        esDetalle: false,
        btnEditar: true
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data[0] && data[0].id) {
        data[0].id = sondaje.id;
        const index = this.planManejoViewModel.sondajes.findIndex(
          elemento => elemento.id === data[0].id
        );
        if (index !== null && index !== undefined && index !== -1) {
          this.planManejoViewModel.sondajes[index] = data[0];
        }
        this.actualizarProcedimientoSondajes();
      }
    });
  }

  /**
   * Elimina la fototerapia de la lista y tabla
   * @param {Fototerapia} fototerapia
   */
  public eliminarProcedimientoFototerapia(fototerapia: Fototerapia): void {
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      width: '30%',
      disableClose: false,
      data: new ModalConfirmacion(
        this.planManejoViewModel.mensajes.tabla.tituloEliminarProcedimiento,
        this.planManejoViewModel.mensajes.tabla.contenidoEliminarProcedimiento
      )
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data === true) {
        if (fototerapia && fototerapia.id) {
          const index = this.planManejoViewModel.fototerapias.findIndex(
            elemento => elemento.id === fototerapia.id
          );
          if (index !== null && index !== undefined) {
            this.planManejoViewModel.fototerapias.splice(index, 1);
          }
          this.actualizarProcedimientoFototerapias();
        }
      }
    });
  }

 

  /**
   * Edita el procedimiento tipo fototerapia de la lista y tabla
   * @param {Fototerapia} fototerapia
   */
  public editarProcedimientoFototerapia(fototerapia: Fototerapia): void {
    const FOTOTERAPIA = new Fototerapia(
      fototerapia.id,
      fototerapia.diasTratamiento,
      fototerapia.bilirrubinaTotal,
      fototerapia.ultimaTomaMuestra,
      fototerapia.tipoFrecuencia
    );

    const dialogRef = this.dialog.open(ModalProcedimientosComponent, {
      width: '90%',
      disableClose: false,
      data: {
        procedimiento: FOTOTERAPIA,
        esDetalle: false,
        btnEditar: true
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.id) {
        data.id = fototerapia.id;
        const index = this.planManejoViewModel.fototerapias.findIndex(
          elemento => elemento.id === data.id
        );
        if (index !== null && index !== undefined && index !== -1) {
          this.planManejoViewModel.fototerapias[index] = data;
        }
        this.actualizarProcedimientoFototerapias();
      }
    });
  }

  /**
   * Elimina el procedimiento aspiración de secreción de la lista y tabla
   * @param {AspiracionSecrecion} secrecion
   */
  public eliminarProcedimientoSecrecion(secrecion: AspiracionSecrecion): void {
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      width: '30%',
      disableClose: false,
      data: new ModalConfirmacion(
        this.planManejoViewModel.mensajes.tabla.tituloEliminarProcedimiento,
        this.planManejoViewModel.mensajes.tabla.contenidoEliminarProcedimiento
      )
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data === true) {
        if (secrecion && secrecion.id) {
          const index = this.planManejoViewModel.secreciones.findIndex(
            elemento => elemento.id === secrecion.id
          );
          if (index !== null && index !== undefined) {
            this.planManejoViewModel.secreciones.splice(index, 1);
          }
          this.actualizarProcedimientoSecreciones();
        }
      }
    });
  }

  /**
   * Edita el procedimiento aspiración de secreción de la lista y tabla
   * @param {AspiracionSecrecion} secrecion
   */
  public editarProcedimientoSecrecion(secrecion: AspiracionSecrecion): void {
    const SECRECION = new AspiracionSecrecion(
      secrecion.id,
      secrecion.diasTratamiento,
      secrecion.envioAspirador,
      secrecion.visitaEnfermeria,
      secrecion.tipoSonda,
      secrecion.nasal,
      secrecion.traqueostomia
    );

    const dialogRef = this.dialog.open(ModalProcedimientosComponent, {
      width: '90%',
      disableClose: false,
      data: {
        procedimiento: SECRECION,
        esDetalle: false,
        btnEditar: true
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.id) {
        data.id = secrecion.id;
        const index = this.planManejoViewModel.secreciones.findIndex(
          elemento => elemento.id === data.id
        );
        if (index !== null && index !== undefined && index !== -1) {
          this.planManejoViewModel.secreciones[index] = data;
        }
        this.actualizarProcedimientoSecreciones();
      }
    });
  }

  /**
   * Elimina el procedimiento aspiración de secreción de la lista y tabla
   * @param {SoporteNutricional} soporteNutricional
   */
  public eliminarProcedimientoSoporteNutricional(
    soporteNutricional: SoporteNutricional
  ): void {
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      width: '30%',
      disableClose: false,
      data: new ModalConfirmacion(
        this.planManejoViewModel.mensajes.tabla.tituloEliminarProcedimiento,
        this.planManejoViewModel.mensajes.tabla.contenidoEliminarProcedimiento
      )
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data === true) {
        if (soporteNutricional && soporteNutricional.id) {
          const index = this.planManejoViewModel.soporteNutricionales.findIndex(
            elemento => elemento.id === soporteNutricional.id
          );
          if (index !== null && index !== undefined) {
            this.planManejoViewModel.soporteNutricionales.splice(index, 1);
          }
          this.actualizarProcedimientoSoporteNutricionales();
        }
      }
    });
  }

  /**
   * Edita el procedimiento soporte nutricionales de la lista y tabla
   * @param {SoporteNutricional} soporteNutricional
   */
  public editarProcedimientoSoporteNutricional(
    soporteNutricional: SoporteNutricional
  ): void {
    const SOPORTE_NUTRICIONAL = new SoporteNutricional(
      soporteNutricional.id,
      soporteNutricional.medicamento,
      soporteNutricional.cantidadDosis,
      soporteNutricional.unidadDosis,
      soporteNutricional.tipoNutricion,
      soporteNutricional.duracion,
      soporteNutricional.volumen,
      soporteNutricional.noPBS,
      soporteNutricional.eventos
    );

    const dialogRef = this.dialog.open(ModalProcedimientosComponent, {
      width: '90%',
      disableClose: false,
      data: {
        procedimiento: SOPORTE_NUTRICIONAL,
        esDetalle: false,
        btnEditar: true
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.id) {
        data.id = soporteNutricional.id;
        const index = this.planManejoViewModel.soporteNutricionales.findIndex(
          elemento => elemento.id === data.id
        );
        if (index !== null && index !== undefined && index !== -1) {
          this.planManejoViewModel.soporteNutricionales[index] = data;
        }
        this.actualizarProcedimientoSoporteNutricionales();
      }
    });
  }

  seleccionValoracion(event: any, valoracion: any) {
    switch (event.option.value.idValoracion) {
      case this.planManejoViewModel.mensajes.valoraciones.identificadores
        .ingresoPolizaVida:
        if (event.option._selected === true) {
          this.verValorizacionesPoliza = true;

          this.cambiarValidadorFormularioARequerido(
            this.formulario,
            'fechaExamenMedico',
            20,
            ''
          );

          event.source.selectedOptions.selected.forEach(element => {
            if (
              element.value.idValoracion !==
              this.planManejoViewModel.mensajes.valoraciones.identificadores
                .ingresoPolizaVida
            ) {
              element.selected = false;
            }
          });

          this.planManejoViewModel.valoraciones.forEach(item => {
            if (
              item.idValoracion !==
              this.planManejoViewModel.mensajes.valoraciones.identificadores
                .ingresoPolizaVida
            ) {
              item['disabled'] = true;
            }
          });

          this.planManejoViewModel.valoracionesPoliza.forEach(item => {
            if (
              item.idValoracion ===
              this.planManejoViewModel.mensajes.valoraciones.identificadores
                .examenMedico
            ) {
              item['selected'] = true;
              item['disabled'] = true;
              this.planManejoViewModel.valoracionesSeleccionadasPoliza.push(
                item
              );
              return;
            }
          });
        } else {
          this.cambiarValidadorFormularioAOpcional(
            this.formulario,
            'fechaExamenMedico',
            20,
            ''
          );
          this.formulario.get('fechaExamenMedico').setValue(null);
          this.planManejoViewModel.valoraciones.forEach(item => {
            item['disabled'] = false;
          });
          this.verValorizacionesPoliza = false;
          this.planManejoViewModel.valoracionesSeleccionadasPoliza = [];
        }
        break;
    }
    this.formulario
      .get('valoracionesPoliza')
      .setValue(this.planManejoViewModel.valoracionesSeleccionadasPoliza);
  }

  verValoracionesSeleccionadas(lista) {
    const POLIZA = lista.selectedOptions.selected.find(
      item =>
        item.value.idValoracion ===
        this.planManejoViewModel.mensajes.valoraciones.identificadores
          .ingresoPolizaVida
    );
    if (POLIZA !== undefined) {
      this.planManejoViewModel.valoracionesSeleccionadas = lista.selectedOptions.selected.map(
        item => item.value
      );
      const ID_POLIZA_VIDA = this.planManejoViewModel.mensajes.valoraciones
        .identificadores.ingresoPolizaVida;
      this.planManejoViewModel.valoracionesSeleccionadas = lodash.remove(
        this.planManejoViewModel.valoracionesSeleccionadas,
        function (valoracion) {
          return valoracion.idValoracion === ID_POLIZA_VIDA;
        }
      );
    } else {
      this.planManejoViewModel.valoracionesSeleccionadas = lista.selectedOptions.selected.map(
        item => item.value
      );
    }
    this.formulario
      .get('valoraciones')
      .setValue(this.planManejoViewModel.valoracionesSeleccionadas);
  }

  verValoracionesSeleccionadasPoliza(listaPoliza) {
    this.planManejoViewModel.valoracionesSeleccionadasPoliza = listaPoliza.selectedOptions.selected.map(
      item => item.value
    );
    this.formulario
      .get('valoracionesPoliza')
      .setValue(this.planManejoViewModel.valoracionesSeleccionadasPoliza);
  }

  /**
   * Abre el modal
   */
  private abrirModalTratamientos(): void {
    const dialogRef = this.dialog.open(ModalTratamientosComponent, {
      width: '90%',
      disableClose: false,
      data: {
        tratamiento: null,
        esDetalle: false,
        btnEditar: false
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (typeof data !== 'undefined') {
        this.agregarTratamiento(data);
        setTimeout(() => this.scrollDownTratamiento.nativeElement.focus(), 0);
      }
    });
  }

  /**
   * Agrega el tratamiento a la tabla
   * @param {Tratamiento} tratamiento
   */
  private agregarTratamiento(tratamiento: Tratamiento): void {
    if (tratamiento) {
      console.log('tratamiento ', tratamiento);
      this.planManejoViewModel.tratamientos.push(tratamiento);
      tratamiento = null;
    }
    this.actualizarTratamientos();
  }

  /**
   * Actualiza los tratamientos del formulario
   */
  private actualizarTratamientos(): void {
    this.formulario
      .get('tratamientos')
      .setValue(this.planManejoViewModel.tratamientos);
  }

  /**
   * Abre el modal
   */
  private abrirModalProcedimientos(): void {
    const dialogRef = this.dialog.open(ModalProcedimientosComponent, {
      width: '90%',
      disableClose: false,
      data: {
        procedimiento: null,
        esDetalle: false
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data instanceof Curacion) {
        this.agregarProcedimientoCuracion(data);
        setTimeout(
          () => this.scrollDownProcedimientoCuracion.nativeElement.focus(),
          0
        );
      } else if (data instanceof Array) {
        if (data[0] instanceof Sondaje) {
          this.agregarProcedimientoSondaje(data);
          setTimeout(
            () => this.scrollDownProcedimientoSondaje.nativeElement.focus(),
            0
          );
        }
      } else if (data instanceof Fototerapia) {
        this.agregarProcedimientoFototerapia(data);
        setTimeout(
          () => this.scrollDownProcedimientoFototerapia.nativeElement.focus(),
          0
        );
      } else if (data instanceof AspiracionSecrecion) {
        this.agregarProcedimientoSecrecion(data);
        setTimeout(
          () => this.scrollDownProcedimientoSecrecion.nativeElement.focus(),
          0
        );
      } else if (data instanceof SoporteNutricional) {
        this.agregarProcedimientoSoporteNutricional(data);
        setTimeout(
          () =>
            this.scrollDownProcedimientoSoporteNutricional.nativeElement.focus(),
          0
        );
      }
    });
  }

  /**
   * Agrega el procedimiento tipo curación a la tabla
   * @param {Curacion} curacion
   */
  private agregarProcedimientoCuracion(curacion: Curacion): void {
    if (curacion) {
      this.planManejoViewModel.curaciones.push(curacion);
      curacion = null;
    }
    this.actualizarProcedimientoCuraciones();
  }

  /**
   * Actualiza los procedimientos tipo curaciones del formulario
   */
  private actualizarProcedimientoCuraciones(): void {
    this.formulario
      .get('curaciones')
      .setValue(this.planManejoViewModel.curaciones);
  }

  /**
   * Agrega el procedimiento tipo sondaje a la tabla
   * @param {Array<Sondaje>} sondaje
   */
  private agregarProcedimientoSondaje(listaSondajes: any): void {
    console.log(listaSondajes);
    console.log(typeof listaSondajes[0]);
    if (listaSondajes) {
      listaSondajes.forEach(registro => {
        console.log('agregarProcedimientoSondaje registro ', registro);
        const dato = this.planManejoViewModel.sondajes.findIndex(
          elemento =>
            elemento.idTipoSondaje === registro.idTipoSondaje &&
            elemento.sondaje === registro.sondaje
        );

        if (dato === -1) {
          this.planManejoViewModel.sondajes.push(registro);
        } else {
          return;
        }
      });
      listaSondajes = null;
    }
    console.log('this.planManejoViewModel.sondajes ', this.planManejoViewModel.sondajes);
    this.actualizarProcedimientoSondajes();
  }

  /**
   * Actualiza los procedimientos tipo sondajes del formulario
   */
  private actualizarProcedimientoSondajes(): void {
    this.formulario.get('sondajes').setValue(this.planManejoViewModel.sondajes);
  }

  /**
   * Agrega el procedimiento tipo fototerapia a la tabla
   * @param {Fototerapia} fototerapia
   */
  private agregarProcedimientoFototerapia(fototerapia: Fototerapia): void {
    if (fototerapia) {
      this.planManejoViewModel.fototerapias.push(fototerapia);
      fototerapia = null;
    }
    this.actualizarProcedimientoFototerapias();
  }

  /**
   * Actualiza los procedimientos tipo fototerapia del formulario
   */
  private actualizarProcedimientoFototerapias(): void {
    this.formulario
      .get('fototerapias')
      .setValue(this.planManejoViewModel.fototerapias);
  }

  /**
   * Agrega el procedimiento aspiración de secreción a la tabla
   * @param {AspiracionSecrecion} secrecion
   */
  private agregarProcedimientoSecrecion(secrecion: AspiracionSecrecion): void {
    if (secrecion) {
      this.planManejoViewModel.secreciones.push(secrecion);
    }
    this.actualizarProcedimientoSecreciones();
  }

  /**
   * Actualiza los procedimientos aspiración de secreción del formulario
   */
  private actualizarProcedimientoSecreciones(): void {
    this.formulario
      .get('secreciones')
      .setValue(this.planManejoViewModel.secreciones);
  }

  /**
   * Agrega el procedimiento soporte nutricional a la tabla
   * @param {SoporteNutricional} soporteNutricional
   */
  private agregarProcedimientoSoporteNutricional(
    soporteNutricional: SoporteNutricional
  ): void {
    if (soporteNutricional) {
      this.planManejoViewModel.soporteNutricionales.push(soporteNutricional);
    }
    this.actualizarProcedimientoSoporteNutricionales();
  }

  /**
   * Actualiza los procedimientos soporte nutricionales del formulario
   */
  private actualizarProcedimientoSoporteNutricionales(): void {
    this.formulario
      .get('soporteNutricionales')
      .setValue(this.planManejoViewModel.soporteNutricionales);
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): PlanManejoViewModel {
    return new PlanManejoViewModel(
      null,
      null,
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      null,
      [],
      [],
      [],
      [],
      [],
      []
    );
  }

  /**
   * Genera columnas para la tabla
   */
  private generarColumnasTratamientos(): void {
    this.columnasTratamientos = [
      {
        field: this.planManejoViewModel.mensajes.tabla.medicamentoCampo,
        header: this.planManejoViewModel.mensajes.tabla.medicamento
      },
      {
        field: this.planManejoViewModel.mensajes.tabla.dosisCampo,
        header: this.planManejoViewModel.mensajes.tabla.dosis
      },
      {
        field: this.planManejoViewModel.mensajes.tabla.frecuenciaCampo,
        header: this.planManejoViewModel.mensajes.tabla.frecuencia
      },
      {
        field: this.planManejoViewModel.mensajes.tabla.duracionCampo,
        header: this.planManejoViewModel.mensajes.tabla.duracion
      },
      {
        field: this.planManejoViewModel.mensajes.tabla.dosisFaltantesCampo,
        header: this.planManejoViewModel.mensajes.tabla.dosisFaltantes
      }
    ];
  }

  private generarColumnasProcedimientos(): void {
    /**
     * Genera columnas para la tabla de curaciones
     */
    this.columnasCuraciones = [
      {
        header: this.planManejoViewModel.mensajes.procedimientos.curaciones
          .tabla.tipoCuracion
      },
      {
        field: this.planManejoViewModel.mensajes.procedimientos.curaciones.tabla
          .descripcionCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.curaciones
          .tabla.descripcion
      },
      {
        field: this.planManejoViewModel.mensajes.procedimientos.curaciones.tabla
          .ultimaCuracionCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.curaciones
          .tabla.ultimaCuracion
      }
    ];

    /**
     * Genera columnas para la tabla de sondajes
     */
    this.columnasSondajes = [
      {
        field: this.planManejoViewModel.mensajes.procedimientos.sondajes.tabla
          .tipoSondajeCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.sondajes.tabla
          .tipoSondajeIngreso
      },
      {
        field: this.planManejoViewModel.mensajes.procedimientos.sondajes.tabla
          .categoriaSondajeCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.sondajes.tabla
          .categoriaSondaje
      }
    ];

    /**
     * Genera columnas para la tabla de fototerapias
     */
    this.columnasFototerapias = [
      {
        field: this.planManejoViewModel.mensajes.procedimientos.fototerapias
          .tabla.diasTratamientoCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.fototerapias
          .tabla.diasTratamiento
      },
      {
        field: this.planManejoViewModel.mensajes.procedimientos.fototerapias
          .tabla.bilirrubinaTotalCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.fototerapias
          .tabla.bilirrubinaTotal
      },
      {
        field: this.planManejoViewModel.mensajes.procedimientos.fototerapias
          .tabla.ultimaTomaMuestraCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.fototerapias
          .tabla.ultimaTomaMuestra
      },
      {
        field: this.planManejoViewModel.mensajes.procedimientos.fototerapias
          .tabla.tipoFrecuenciaCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.fototerapias
          .tabla.tipoFrecuencia
      }
    ];

    /**
     * Genera columnas para la tabla de secreciones
     */
    this.columnasSecreciones = [
      {
        field: this.planManejoViewModel.mensajes.procedimientos.secreciones
          .tabla.diasTratamientoCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.secreciones
          .tabla.diasTratamiento
      },
      {
        field: this.planManejoViewModel.mensajes.procedimientos.secreciones
          .tabla.envioAspiradorCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.secreciones
          .tabla.envioAspirador
      },
      {
        field: this.planManejoViewModel.mensajes.procedimientos.secreciones
          .tabla.visitaEnfermeriaCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.secreciones
          .tabla.visitaEnfermeria
      },
      {
        field: this.planManejoViewModel.mensajes.procedimientos.secreciones
          .tabla.tipoSondaCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.secreciones
          .tabla.tipoSonda
      },
      {
        field: this.planManejoViewModel.mensajes.procedimientos.secreciones
          .tabla.nasalCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.secreciones
          .tabla.nasal
      },
      {
        field: this.planManejoViewModel.mensajes.procedimientos.secreciones
          .tabla.traqueostomiaCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.secreciones
          .tabla.traqueostomia
      }
    ];

    /**
     * Genera columnas para la tabla
     */
    this.columnasSoporteNutricional = [
      {
        field: this.planManejoViewModel.mensajes.procedimientos
          .soporteNutricional.tabla.medicamentoCampo,
        header: this.planManejoViewModel.mensajes.procedimientos
          .soporteNutricional.tabla.medicamento
      },
      {
        field: this.planManejoViewModel.mensajes.procedimientos
          .soporteNutricional.tabla.dosisCampo,
        header: this.planManejoViewModel.mensajes.procedimientos
          .soporteNutricional.tabla.dosis
      },
      {
        field: this.planManejoViewModel.mensajes.procedimientos
          .soporteNutricional.tabla.viaAdministracionCampo,
        header: this.planManejoViewModel.mensajes.procedimientos
          .soporteNutricional.tabla.viaAdministracion
      },
      {
        field: this.planManejoViewModel.mensajes.procedimientos
          .soporteNutricional.tabla.tipoNutricionCampo,
        header: this.planManejoViewModel.mensajes.procedimientos
          .soporteNutricional.tabla.tipoNutricion
      },
      {
        field: this.planManejoViewModel.mensajes.procedimientos
          .soporteNutricional.tabla.nutricionCampo,
        header: this.planManejoViewModel.mensajes.procedimientos
          .soporteNutricional.tabla.nutricion
      },
      {
        field: this.planManejoViewModel.mensajes.procedimientos
          .soporteNutricional.tabla.frecuenciaCampo,
        header: this.planManejoViewModel.mensajes.procedimientos
          .soporteNutricional.tabla.frecuencia
      },
      {
        field: this.planManejoViewModel.mensajes.procedimientos
          .soporteNutricional.tabla.duracionCampo,
        header: this.planManejoViewModel.mensajes.procedimientos
          .soporteNutricional.tabla.duracion
      }
    ];
  }

  private getDatos(): void {
    this.getValoraciones();
    this.getValoracionesPorTipo('poliza');
  }

  /**
   * obtiene las valoraciones
   */
  private getValoraciones(): void {
    this.planManejoViewModel.cargando = true;
    this.valoracionesSubscripcion = this.planManejoService
      .getValoraciones()
      .subscribe(
        response => {
          this.planManejoViewModel.valoraciones = response;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
          this.planManejoViewModel.cargando = false;
        }
      );
  }

  /**
   * obtiene las valoraciones por tipo de valoración
   */
  private getValoracionesPorTipo(tipo: string): void {
    this.planManejoViewModel.cargando = true;
    this.valoracionesSubscripcion = this.planManejoService
      .getValoracionesPorTipo(tipo)
      .subscribe(
        response => {
          this.planManejoViewModel.valoracionesPoliza = response;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
          this.planManejoViewModel.cargando = false;
        }
      );
  }

  /**
   *Suscribe los
   *cambios del formulario
   */
  private suscribirFormulario(): void {

    this.formulario.valueChanges.subscribe(formulario => {
      this.continuar.emit(this.formulario.valid);
      this.tratamientos.emit(formulario);
      this.procedimientos.emit(formulario);
      this.valoraciones.emit(formulario);
      this.habilitarEnviar.emit(true);


      /*if (
        (this.formulario.value.curaciones &&
          this.formulario.value.curaciones.length > 0) ||
        (this.formulario.value.fototerapias &&
          this.formulario.value.fototerapias.length > 0) ||
        (this.formulario.value.secreciones &&
          this.formulario.value.secreciones.length > 0) ||
        (this.formulario.value.sondajes &&
          this.formulario.value.sondajes.length > 0) ||
        (this.formulario.value.soporteNutricionales &&
          this.formulario.value.soporteNutricionales.length > 0) ||
        (this.formulario.value.tratamientos &&
          this.formulario.value.tratamientos.length > 0) ||
        (this.formulario.value.valoraciones &&
          this.formulario.value.valoraciones.length > 0)
      ) {
        this.habilitarEnviar.emit(true);
      } else {
        this.habilitarEnviar.emit(true);
      }

      if (this.formulario.valid) {
        this.habilitarGuardar.emit(true);
      } else {
        this.habilitarGuardar.emit(false);
        this.habilitarEnviar.emit(false);
      }*/
    });
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formulario = this.fb.group({
      tratamientos: [null, Validators.compose([])],
      valoraciones: [null, Validators.compose([])],
      valoracionesPoliza: [null, Validators.compose([])],
      fechaExamenMedico: [null, Validators.compose([])],
      curaciones: [null, Validators.compose([])],
      sondajes: [null, Validators.compose([])],
      fototerapias: [null, Validators.compose([])],
      secreciones: [null, Validators.compose([])],
      soporteNutricionales: [null, Validators.compose([])]
    });
  }

  private editarPlanManejo() {
    if (this.router.url === '/remision/editar') {
      this.bloquearCampos();
      if (this.agregadoRemision.datosRemision) {
        const idRemisionPk = this.agregadoRemision.datosRemision.idRemisionPK;
        this.planManejoService.getPlanManejoAgregado(idRemisionPk).subscribe(
          planManejo => {
            // this.planManejoViewModel.tratamientos = [];
            console.log(' planManejo.tratamientos ', planManejo.tratamientos);
            planManejo.tratamientos.forEach(tratamiento => {
              const TRATAMIENTO: Tratamiento = new Tratamiento(
                tratamiento.id,
                tratamiento.idTratamiento,
                tratamiento.idRemisionPK,
                tratamiento.tratamiento,
                tratamiento.medicamento,
                tratamiento.cantidadDosis,
                tratamiento.unidadDosis,
                tratamiento.viaAdministracion,
                tratamiento.diluyente,
                tratamiento.cantidadDiluyente,
                tratamiento.frecuencia,
                tratamiento.duracion,
                tratamiento.ultimaAplicacion,
                tratamiento.noPBS
              );
              this.planManejoViewModel.tratamientos.push(TRATAMIENTO);
            });

            this.formulario
              .get('tratamientos')
              .setValue(this.planManejoViewModel.tratamientos);
            this.planManejoViewModel.curaciones =
              planManejo.procedimientos.curaciones;
            this.formulario
              .get('curaciones')
              .setValue(planManejo.procedimientos.curaciones);
            this.planManejoViewModel.sondajes =
              planManejo.procedimientos.sondajes;
            this.formulario
              .get('sondajes')
              .setValue(planManejo.procedimientos.sondajes);
            this.planManejoViewModel.fototerapias =
              planManejo.procedimientos.fototerapias;
            this.formulario
              .get('fototerapias')
              .setValue(planManejo.procedimientos.fototerapias);
            this.planManejoViewModel.secreciones =
              planManejo.procedimientos.secreciones;
            this.formulario
              .get('secreciones')
              .setValue(planManejo.procedimientos.secreciones);
            // this.planManejoViewModel.soporteNutricionales = [];
            planManejo.procedimientos.soporteNutricionales.forEach(soporte => {
              const SOPORTE: SoporteNutricional = new SoporteNutricional(
                soporte.id,
                soporte.medicamento,
                soporte.cantidadDosis,
                soporte.unidadDosis,
                soporte.tipoNutricion,
                soporte.duracion,
                soporte.volumen,
                soporte.noPBS,
                soporte.eventos
              );
              this.planManejoViewModel.soporteNutricionales.push(SOPORTE);
            });
            this.formulario
              .get('soporteNutricionales')
              .setValue(this.planManejoViewModel.soporteNutricionales);
            if (planManejo.valoraciones.valoraciones.length > 0) {
              console.log('planManejo.valoraciones ', planManejo.valoraciones);
              this.verValoraciones = true;

              this.valoracionesSubscripcion = this.planManejoService
                .getValoraciones()
                .subscribe(
                  response => {
                    this.planManejoViewModel.valoraciones = response.map(
                      valoracion => {
                        const isExiste = planManejo.valoraciones.valoraciones.some(
                          valoracionExistente =>
                            valoracionExistente.idValoracion ===
                            valoracion.idValoracion
                        );
                        if (isExiste) {
                          return Object.assign(valoracion, {selected: true});
                        }
                        return valoracion;
                      }
                    );
                  },
                  error => {
                    this.capturaDeErroresService.mapearErrores(error.status, error.error);
                  },
                  () => {
                    this.planManejoViewModel.cargando = false;
                  }
                );
              /*this.planManejoViewModel.valoraciones = this.planManejoViewModel.valoraciones
              .map(valoracion => {
                const isExiste = planManejo.valoraciones.valoraciones.some(valoracionExistente =>
                  valoracionExistente.idValoracion === valoracion.idValoracion);
                if (isExiste) {
                  return Object.assign( valoracion, { selected: true });
                }
                this.cdRef.detectChanges();
                return valoracion;

              });*/
              if (planManejo.valoraciones.valoracionesPoliza.length > 0) {
                if (planManejo.valoraciones.fechaExamenMedico != null) {
                  this.formulario
                    .get('fechaExamenMedico')
                    .setValue(
                      new Date(planManejo.valoraciones.fechaExamenMedico)
                    );
                  this.fechaExamenMedico = new Date(
                    planManejo.valoraciones.fechaExamenMedico
                  );
                }

                this.planManejoViewModel.valoracionesPoliza.forEach(item => {
                  const VALORACION = planManejo.valoraciones.valoracionesPoliza.find(
                    polizaExistente =>
                      polizaExistente.idValoracion === item.idValoracion
                  );

                  if (VALORACION !== undefined) {
                    if (
                      item.idValoracion ===
                      this.planManejoViewModel.mensajes.valoraciones
                        .identificadores.examenMedico
                    ) {
                      item['disabled'] = true;
                    }
                    item['selected'] = true;
                  }
                });

                this.verValorizacionesPoliza = true;
              }
            }
            this.planManejoViewModel.valoracionesSeleccionadas =
              planManejo.valoraciones.valoraciones;
            this.planManejoViewModel.valoracionesSeleccionadasPoliza =
              planManejo.valoraciones.valoracionesPoliza;
            this.formulario
              .get('valoraciones')
              .setValue(planManejo.valoraciones.valoraciones);
            this.formulario
              .get('valoracionesPoliza')
              .setValue(planManejo.valoraciones.valoracionesPoliza);
            this.remisionServices.generarObjetoValoracionesPlanManejo(
              planManejo.valoraciones
            );
            this.remisionServices.generarObjetoProcedimientosPlanManejo(
              planManejo.procedimientos
            );
            this.remisionServices.generarObjetoTratamientosPlanManejo(
              planManejo.tratamientos
            );
            this.continuar.emit(this.formulario.valid);
          },
          error1 => console.log(error1)
        );
      }
    }
  }

  private bloquearCampos() {
    if (this.remisionService.remision) {
      if (
        this.remisionService.remision.estado === EstadosRemisionEnum.ADMITIDO ||
        this.remisionService.remision.estado ===
        EstadosRemisionEnum.CANCELADO ||
        this.remisionService.remision.estado === EstadosRemisionEnum.EGRESADO ||
        this.remisionService.remision.estado === EstadosRemisionEnum.NO_ADMITIDO
      ) {
        this.disableButton = true;
      }
    }
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

  /**
   * Cambia los validadores de un control del formulario
   * @param {FormGroup} formulario
   * @param {string} nombrecontrol
   * @param {number} numeroDigitos
   * @param {string} patronValidacion
   */
  private cambiarValidadorFormularioARequerido(
    formulario: FormGroup,
    nombrecontrol: string,
    numeroDigitos: number,
    patronValidacion: string
  ): void {
    formulario.get(nombrecontrol).clearValidators();
    formulario
      .get(nombrecontrol)
      .setValidators(
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
  private cambiarValidadorFormularioAOpcional(
    formulario: FormGroup,
    nombrecontrol: string,
    numeroDigitos: number,
    patronValidacion: string
  ): void {
    formulario.get(nombrecontrol).clearValidators();
    formulario
      .get(nombrecontrol)
      .setValidators(
        Validators.compose([
          Validators.maxLength(numeroDigitos),
          Validators.pattern(patronValidacion)
        ])
      );
    formulario.get(nombrecontrol).updateValueAndValidity();
  }


}
