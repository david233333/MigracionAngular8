import {Component, ElementRef, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild, TestabilityRegistry, ɵConsole} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Subscription} from 'rxjs/Subscription';
import {MensajesService} from '../../../shared/services/mensajes.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {ModalConfirmacionComponent} from '../../../shared/components/modal-confirmacion/modal-confirmacion.component';
import {ModalConfirmacion} from '../../../shared/models/modal-confirmacion.model';
import {Tratamiento} from '../../../domain/model/novedad/entity/plan-manejo/tratamiento.model';
import {Fototerapia} from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/fototerapia.model';
import {Curacion} from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/curacion.model';
import {PlanManejoViewModel} from './plan-manejo.view-model';
import {ModalTratamientosComponent} from './modal-tratamientos/modal-tratamientos.component';
import {ModalProcedimientosComponent} from './modal-procedimientos/modal-procedimientos.component';
import {PlanManejoService} from '../../../domain/usecase/novedad/plan-manejo-novedad.service';
import {TomaMuestra} from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/toma-muestra.model';
import {AspiracionSecrecion} from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/aspiracion-secrecion.model';
import {Canalizacion} from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/canalizacion.model';
import {PlanManejo} from '../../../domain/model/novedad/entity/plan-manejo/plan-manejo.model';
import {Procedimiento} from '../../../domain/model/novedad/entity/plan-manejo/procedimiento.model';
import {Sondaje} from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/sondaje-model';
import {AgregadosNovedadService} from '../../../shared/services/agregados-novedad.service';
import {ProcedimientoNovedadEnum} from '../../../shared/utils/enums/procedimiento-novedad.enum.';
import {Utilidades} from '../../../shared/utils/utilidades';
import {PlanManejoRequest} from '../../../infraestructure/request-model/novedad/plan-manejo.request';
import {SoporteNutricional} from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/soporte-nutricional.model';
import {TipoTratamientoEnum} from '../../../shared/utils/enums/tipo-tratamiento.enum';
import {DOCUMENT} from '@angular/common';
import {AgregadosComunService} from '../../../shared/services/agregados-comun.service';
import {UsuarioService} from '../../../shared/services/usuario.service';
import {CapturarErrores} from '../../../shared/services/capturar-errores';
import { RemisionContenedorService } from '../../../domain/usecase/remision/remision-contenedor.service';
import { GestionNovedadService } from '../../../domain/usecase/novedad/gestion-novedad.service';
import { FiltrosGestionNovedadesRequest } from '../../../infraestructure/request-model/novedad/filtros-gestion-novedad.request';
import { GestionarNovedadRequest } from '../../../infraestructure/request-model/novedad/gestionar-novedad.request';
import { EstadosNovedadEnum } from '../../../shared/utils/enums/estados-novedad.enum';
import { CreacionNovedadComponent } from '../creacion-novedad/creacion-novedad.component';
import { ModalEdicionNovedadesComponent } from './modal-edicion-novedades/modal-edicion-novedades.component';


moment.locale('es');

@Component({
  selector: 'sura-novedad-plan-manejo',
  templateUrl: './plan-manejo.component.html',
  styleUrls: ['./plan-manejo.component.scss']
})
export class PlanManejoComponent implements OnInit, OnDestroy {
  public transporte: CreacionNovedadComponent;
  public planManejoViewModel: PlanManejoViewModel = this.iniciarViewModel();
  public columnasTratamientos: any[];
  public columnasCuraciones: any[];
  public columnasSondajes: any[];
  public columnasTerapias: any[];
  public columnasFototerapias: any[];
  public columnasTomaMuestras: any[];
  public columnasSecreciones: any[];
  public columnasCanalizaciones: any[];
  public columnasSoporteNutricional: any[];
  public formulario: FormGroup;
  public tipoProcedimiento = ProcedimientoNovedadEnum;
  public isValid = true;
  public pendientes: any[] = [];
  public ediciones: any[] = [];
  public totalRegistros = 0;

  public tratamientosEdicion: Tratamiento[] = [];
  public datosEdicion: any;
  public curacionesEdicion: Procedimiento[] = [];

  @ViewChild('scrollDownTratamiento', { static: false }) scrollDownTratamiento: ElementRef;
  @ViewChild('scrollDownProcedimientoCuracion', { static: false })
  scrollDownProcedimientoCuracion: ElementRef;
  @ViewChild('scrollDownProcedimientoSondaje', { static: false })
  scrollDownProcedimientoSondaje: ElementRef;
  @ViewChild('scrollDownProcedimientoFototerapia', { static: false })
  scrollDownProcedimientoFototerapia: ElementRef;
  @ViewChild('scrollDownProcedimientoTomaMuestra', { static: false })
  scrollDownProcedimientoTomaMuestra: ElementRef;
  @ViewChild('scrollDownProcedimientoSecrecion', { static: false })
  scrollDownProcedimientoSecrecion: ElementRef;
  @ViewChild('scrollDownProcedimientoCanalizacion', { static: false })
  scrollDownProcedimientoCanalizacion: ElementRef;
  @ViewChild('scrollDownProcedimientoSoporteNutricional', { static: false })
  scrollDownProcedimientoSoporteNutricional: ElementRef;
  @Output()
  public cargando: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  public regresarPrincipal: EventEmitter<boolean> = new EventEmitter<boolean>();
  private planManejoSubscripcion: Subscription = new Subscription();
  private sondajeSubscripcion: Subscription = new Subscription();
  private tratamientosAgregado: Tratamiento[] = [];
  private curacionesAgregado: Curacion[] = [];
  private sondajesAgregado: Sondaje[] = [];
  private fototerapiasAgregado: Fototerapia[] = [];
  private tomaMuestrasAgregado: TomaMuestra[] = [];
  private secrecionesAgregado: AspiracionSecrecion[] = [];
  private canalizacionesAgregado: Canalizacion[] = [];
  private soporteNutricionalesAgregado: SoporteNutricional[] = [];


  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private planManejoService: PlanManejoService,
    private gestionNovedadService: GestionNovedadService,
    private mensajesService: MensajesService,
    private infoRemisionNovedad: AgregadosNovedadService,
    private remisionService: RemisionContenedorService,
    private infoComunes: AgregadosComunService,
    private util: Utilidades,
    @Inject(DOCUMENT) private document: Document,
    private usuarioService: UsuarioService,
    private capturaDeErroresService: CapturarErrores
  ) {
    this.generarColumnasTratamientos();
    this.generarColumnasProcedimientos();
    this.crearFormulario();
  }

  ngOnInit() {

    this.validarNovedades();
    if (this.infoRemisionNovedad.datosNovedad.idPlanManejoPk != null) {
      this.getAgregadoPlanManejo();
      this.getTiposSondaje();

    }
  }

  ngOnDestroy() {
    this.planManejoSubscripcion.unsubscribe();
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
    }
  }

  public verTratamientos(): boolean {
    return this.planManejoViewModel.tratamientos.length > 0;
  }

  public verTratamientosEdicion(): boolean {
    return this.tratamientosEdicion.length > 0;
  }

  public verProcedimientos(): boolean {
    return (
      this.planManejoViewModel.curaciones.length > 0 ||
      this.planManejoViewModel.sondajes.length > 0 ||
      this.planManejoViewModel.fototerapias.length > 0 ||
      this.planManejoViewModel.tomaMuestras.length > 0 ||
      this.planManejoViewModel.secreciones.length > 0 ||
      this.planManejoViewModel.canalizaciones.length > 0 ||
      this.planManejoViewModel.soporteNutricionales.length > 0
    );
  }

  /**
   * Elimina el tratamiento de la lista y tabla
   * @param {Tratamiento} tratamiento
   */
  public eliminarTratamiento(tratamiento: Tratamiento): void {
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      width: '30%',
      disableClose: false,
      data: new ModalConfirmacion( this.planManejoViewModel.mensajes.tabla.tituloEliminarTratamiento, this.planManejoViewModel.mensajes.tabla.contenidoEliminarTratamiento )
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
        btnEditar: true,
        programa : this.infoRemisionNovedad.datosRemision.programa.nombre
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
      curacion.tipoCuracion,
      curacion.dias,
      curacion.sesiones,
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
      sondaje.idTipoSondaje,
      sondaje.tipoSondaje,
      sondaje.idSondaje,
      sondaje.sondaje,
      sondaje.fechaSondaje,
      sondaje.totalSesiones
    );

    console.log('sONDAJEEE: ' + JSON.stringify(SONDAJE));

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
   * Elimina el procedimiento tipo de muestra de la lista y tabla
   * @param {TomaMuestra} tomaMuestra
   */
  public eliminarProcedimientoTomaMuestra(tomaMuestra: TomaMuestra): void {
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
        if (tomaMuestra && tomaMuestra.id) {
          const index = this.planManejoViewModel.tomaMuestras.findIndex(
            elemento => elemento.id === tomaMuestra.id
          );
          if (index !== null && index !== undefined) {
            this.planManejoViewModel.tomaMuestras.splice(index, 1);
          }
          this.actualizarProcedimientoTomaMuestras();
        }
      }
    });
  }

  /**
   * Edita el procedimiento tipo de muestra de la lista y tabla
   * @param {TomaMuestra} tomaMuestra
   */
  public editarProcedimientoTomaMuestra(tomaMuestra: TomaMuestra): void {
    const TOMA_MUESTRA = new TomaMuestra(
      tomaMuestra.id,
      tomaMuestra.tipoMuestra,
      tomaMuestra.fechaMuestra,
      tomaMuestra.requiereAyuno
    );

    const dialogRef = this.dialog.open(ModalProcedimientosComponent, {
      width: '90%',
      disableClose: false,
      data: {
        procedimiento: TOMA_MUESTRA,
        esDetalle: false,
        btnEditar: true
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.id) {
        data.id = tomaMuestra.id;
        const index = this.planManejoViewModel.tomaMuestras.findIndex(
          elemento => elemento.id === data.id
        );
        if (index !== null && index !== undefined && index !== -1) {
          this.planManejoViewModel.tomaMuestras[index] = data;
        }
        this.actualizarProcedimientoTomaMuestras();
      }
    });
  }

  /**
   * Elimina el procedimiento tipo aspiración de secreción de la lista y tabla
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
   * Edita el procedimiento tipo aspiración de secreción de la lista y tabla
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
   * Elimina el procedimiento canalización de la lista y tabla
   * @param {Canalizacion} canalizacion
   */
  public eliminarProcedimientoCanalizacion(canalizacion: Canalizacion): void {
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
        if (canalizacion && canalizacion.id) {
          const index = this.planManejoViewModel.canalizaciones.findIndex(
            elemento => elemento.id === canalizacion.id
          );
          if (index !== null && index !== undefined) {
            this.planManejoViewModel.canalizaciones.splice(index, 1);
          }
          this.actualizarProcedimientoCanalizaciones();
        }
      }
    });
  }

  /**
   * Edita el procedimiento tipo aspiración de secreción de la lista y tabla
   * @param {Canalizacion} canalizacion
   */
  public editarProcedimientoCanalizacion(canalizacion: Canalizacion): void {
    const CANALIZACION = new Canalizacion(
      canalizacion.id,
      canalizacion.tipoCanalizacion
    );

    const dialogRef = this.dialog.open(ModalProcedimientosComponent, {
      width: '90%',
      disableClose: false,
      data: {
        procedimiento: CANALIZACION,
        esDetalle: false,
        btnEditar: true
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.id) {
        data.id = canalizacion.id;

        const dato = this.planManejoViewModel.canalizaciones.findIndex(
          elemento => elemento.tipoCanalizacion === data.tipoCanalizacion
        );

        if (dato === -1) {
          const index = this.planManejoViewModel.canalizaciones.findIndex(
            elemento => elemento.id === data.id
          );
          if (index !== null && index !== undefined && index !== -1) {
            this.planManejoViewModel.canalizaciones[index] = data;
          }
          this.actualizarProcedimientoCanalizaciones();
        } else {
          return;
        }
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

  public deshabilitarGuardarPlanManejo(): boolean {
    return false;
  }

  public guardarPlanManejo(): void {
   
    const esDosisFaltante: boolean = this.planManejoViewModel.tratamientos.some(
      s =>

        s.tratamiento === TipoTratamientoEnum.MEDICAMENTOS &&
        s.dosisFaltantes == null

    );

   console.log('es dosis faltante', esDosisFaltante);


    if (esDosisFaltante) {
      this.mensajesService.mostrarMensajeError(
        this.planManejoViewModel.mensajes.tratamientos.mensajesAlerta
          .noDosisFaltantesMedicamentos
      );
      return;
    }

    const esDiasCuracionFaltante: boolean = this.planManejoViewModel.curaciones.some(
      s => s.dias.length === 0
    );

    if (esDiasCuracionFaltante) {
      this.mensajesService.mostrarMensajeError(
        this.planManejoViewModel.mensajes.procedimientos.curaciones
          .mensajesAlerta.noDiasCuraciones
      );
      return;
    }

    const PROCEDIMIENTO_INICIAL = new Procedimiento(
      this.curacionesAgregado,
      this.sondajesAgregado,
      this.fototerapiasAgregado,
      this.tomaMuestrasAgregado,
      this.secrecionesAgregado,
      this.canalizacionesAgregado,
      this.soporteNutricionalesAgregado
    );

    const PLAN_MANEJO_INICIAL = new PlanManejoRequest(
      this.infoRemisionNovedad.datosRemision.idRemision,
      new PlanManejo(this.tratamientosAgregado, PROCEDIMIENTO_INICIAL, null),
      null
    );

    const PROCEDIMIENTO = new Procedimiento(
      this.planManejoViewModel.curaciones,
      this.planManejoViewModel.sondajes,
      this.planManejoViewModel.fototerapias,
      this.planManejoViewModel.tomaMuestras,
      this.planManejoViewModel.secreciones,
      this.planManejoViewModel.canalizaciones,
      this.planManejoViewModel.soporteNutricionales
    );

    const PLAN_MANEJO = new PlanManejoRequest( this.infoRemisionNovedad.datosRemision.idRemision,
    new PlanManejo(
        this.planManejoViewModel.tratamientos,
        PROCEDIMIENTO,
        null
      ),
      null
    );

    const ES_IGUAL = this.util.compararObjetos(
      PLAN_MANEJO_INICIAL,
      PLAN_MANEJO
    );

    console.log('REQUEST - Plan Manejo ', JSON.stringify(PLAN_MANEJO));

    if (ES_IGUAL) {
      this.mensajesService.mostrarMensajeError(
        this.planManejoViewModel.mensajes.mensajesAlerta.noCambioPlan
      );
    } else {
      this.cambiarPlan(PLAN_MANEJO);
    }
  }

  /**
   * Agregado de plan de manejo
   * @param idPlanManejo
   */
  private getAgregadoPlanManejo(): void {
    this.planManejoSubscripcion = this.planManejoService
      .getAgregadoPlanManejo( this.infoRemisionNovedad.datosNovedad.idPlanManejoPk)
      .subscribe(
        response => {
          console.log('Respuesta - Los planes de manejos que hay agregados ', response);
          console.log('id para solucion', response.idRemision);

          if (this.datosEdicion != null){
            response = this.datosEdicion;
            this.planManejoViewModel = this.iniciarViewModel();
            console.log('Plan nuevo quinto', JSON.stringify(response));

          }

          this.tratamientosAgregado = response.tratamientos;
          response.tratamientos.forEach(tratamiento => {
            this.agregarTratamiento(tratamiento);
          });

          this.curacionesAgregado = response.procedimientos.curaciones;
          response.procedimientos.curaciones.forEach(curacion => {
            this.agregarProcedimientoCuracion(curacion);
          });

          this.sondajesAgregado = response.procedimientos.sondajes;
          response.procedimientos.sondajes.forEach(sondaje => {
            this.agregarProcedimientoSondajeAgregado(sondaje);
          });

          this.fototerapiasAgregado = response.procedimientos.fototerapias;
          response.procedimientos.fototerapias.forEach(fototerapia => {
            this.agregarProcedimientoFototerapia(fototerapia);
          });

          this.tomaMuestrasAgregado = response.procedimientos.tomaMuestras;
          response.procedimientos.tomaMuestras.forEach(tomaMuestra => {
            this.agregarProcedimientoTomaMuestra(tomaMuestra);
          });

          this.secrecionesAgregado = response.procedimientos.secreciones;
          response.procedimientos.secreciones.forEach(secrecion => {
            this.agregarProcedimientoSecrecion(secrecion);
          });

          this.canalizacionesAgregado = response.procedimientos.canalizaciones;
          response.procedimientos.canalizaciones.forEach(canalizacion => {
            this.agregarProcedimientoCanalizacion(canalizacion);
          });

          this.soporteNutricionalesAgregado =
            response.procedimientos.soporteNutricionales;
          response.procedimientos.soporteNutricionales.forEach(
            soporteNutricional => {
              this.agregarProcedimientoSoporteNutricional(soporteNutricional);
            }
          );
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
        }
      );
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
        btnEditar: false,
        programa : this.infoRemisionNovedad.datosRemision.programa.nombre
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      console.log(data);
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
      console.log('tratamiento daviiidd', tratamiento);
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
        tratamiento.noPBS,
        tratamiento.duracion,
        tratamiento.rescate,
        tratamiento.turnoEnfermeria,
        tratamiento.cantidadDosisRescate,
        tratamiento.unidadDosisRescate,
        tratamiento.dosisDiaRescate  
      );
      this.planManejoViewModel.tratamientos.push(TRATAMIENTO);
      tratamiento = null;
    }
    this.actualizarTratamientos();
  }

  /**
   * Actualiza los tratamientos del formulario
   */
  private actualizarTratamientos(): void {
    this.formulario.get('tratamientos').setValue(this.planManejoViewModel.tratamientos);
    this.formulario.get('tratamientos').setValue(this.tratamientosEdicion);
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
        esDetalle: false,
        btnEditar: false
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
        if (data[0] instanceof Object) {
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
      } else if (data instanceof TomaMuestra) {
        this.agregarProcedimientoTomaMuestra(data);
        setTimeout(
          () => this.scrollDownProcedimientoTomaMuestra.nativeElement.focus(),
          0
        );
      } else if (data instanceof AspiracionSecrecion) {
        this.agregarProcedimientoSecrecion(data);
        setTimeout(
          () => this.scrollDownProcedimientoSecrecion.nativeElement.focus(),
          0
        );
      } else if (data instanceof Canalizacion) {
        this.agregarProcedimientoCanalizacion(data);
        setTimeout(
          () => this.scrollDownProcedimientoCanalizacion.nativeElement.focus(),
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
      const CURACION: Curacion = new Curacion(
        curacion.id,
        curacion.tipoCuracion,
        curacion.dias,
        curacion.sesiones,
        curacion.descripcion,
        curacion.ultimaCuracion
      );
      this.planManejoViewModel.curaciones.push(CURACION);
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
   * Obtiene los tipos de sondaje
   */
  private getTiposSondaje(): void {
    this.sondajeSubscripcion = this.planManejoService
      .getTiposSondajeNovedad()
      .subscribe(
        response => {
          this.infoComunes.datosSondajes = response;
          console.log('Response sondajes: ' + JSON.stringify(response));
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
   * Agrega el procedimiento tipo sondaje a la tabla
   * @param {Array<Sondaje>} sondaje
   */
  private agregarProcedimientoSondaje(listaSondajes: any): void {
    if (listaSondajes) {
      listaSondajes.forEach(registro => {
        this.planManejoViewModel.sondajes.push(registro);
      });
      listaSondajes = null;
    }
    this.actualizarProcedimientoSondajes();
  }

  /**
   * Agrega el procedimiento tipo sondaje agregado a la tabla
   * @param {Sondaje} sondaje
   */
  private agregarProcedimientoSondajeAgregado(sondaje: Sondaje): void {
    if (sondaje) {
      this.planManejoViewModel.sondajes.push(sondaje);
    }
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
   * Agrega el procedimiento tipo toma de muestra a la tabla
   * @param {TomaMuestra} tomaMuestra
   */
  private agregarProcedimientoTomaMuestra(tomaMuestra: TomaMuestra): void {
    if (tomaMuestra) {
      this.planManejoViewModel.tomaMuestras.push(tomaMuestra);
    }
    this.actualizarProcedimientoTomaMuestras();
  }

  /**
   * Actualiza los procedimientos tipo toma de muestra del formulario
   */
  private actualizarProcedimientoTomaMuestras(): void {
    this.formulario
      .get('tomaMuestras')
      .setValue(this.planManejoViewModel.tomaMuestras);
  }

  /**
   * Agrega el procedimiento tipo aspiración de secreción a la tabla
   * @param {AspiracionSecrecion} secrecion
   */
  private agregarProcedimientoSecrecion(secrecion: AspiracionSecrecion): void {
    if (secrecion) {
      this.planManejoViewModel.secreciones.push(secrecion);
    }
    this.actualizarProcedimientoSecreciones();
  }

  /**
   * Actualiza los procedimientos tipo aspiración de secreción del formulario
   */
  private actualizarProcedimientoSecreciones(): void {
    this.formulario
      .get('secreciones')
      .setValue(this.planManejoViewModel.secreciones);
  }

  /**
   * Agrega el procedimiento canalizacion a la tabla
   * @param {Canalizacion} canalizacion
   */
  private agregarProcedimientoCanalizacion(canalizacion: Canalizacion): void {
    if (canalizacion) {
      const dato = this.planManejoViewModel.canalizaciones.findIndex(
        elemento => elemento.tipoCanalizacion === canalizacion.tipoCanalizacion
      );

      if (dato === -1) {
        this.planManejoViewModel.canalizaciones.push(canalizacion);
      } else {
        return;
      }
    }
    this.actualizarProcedimientoCanalizaciones();
  }

  /**
   * Actualiza los procedimientos tipo aspiración de secreción del formulario
   */
  private actualizarProcedimientoCanalizaciones(): void {
    this.formulario
      .get('canalizaciones')
      .setValue(this.planManejoViewModel.canalizaciones);
  }

  /**
   * Agrega el procedimiento soporte nutricional a la tabla
   * @param {SoporteNutricional} soporteNutricional
   */
  private agregarProcedimientoSoporteNutricional( soporteNutricional: SoporteNutricional): void {
    if (soporteNutricional) {
      const SOPORTE: SoporteNutricional = new SoporteNutricional(
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
      this.planManejoViewModel.soporteNutricionales.push(SOPORTE);
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

  private cambiarPlan(planManejo: PlanManejoRequest): void {
    console.log('este es el plan de manejo lunes actual', planManejo)
    planManejo.usuario = this.usuarioService.InfoUsuario;
    this.planManejoSubscripcion = this.planManejoService
      .cambiarPlanManejo(planManejo)
      .subscribe(
        response => {
          console.log('RESPONSE - Plan Manejo ', response);
          this.mensajesService.mostrarMensajeExito(
            this.planManejoViewModel.mensajes.mensajesAlerta.exitoCambioPlan
          );
          this.regresarPrincipal.emit(true);
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
          this.regresarPrincipal.emit(false);
        },
        () => {
          this.planManejoSubscripcion.unsubscribe();
        }
      );
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
      [],
      false
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
     * Genera columnas para la tabla de sondajes
     */
    this.columnasSondajes = [
      {
        field: this.planManejoViewModel.mensajes.procedimientos.sondajes.tabla
          .tipoSondajeCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.sondajes.tabla
          .tipoSondajeNovedades
      },
      {
        field: this.planManejoViewModel.mensajes.procedimientos.sondajes.tabla
          .sondajeCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.sondajes.tabla
          .sondaje
      },
      {
        field: this.planManejoViewModel.mensajes.procedimientos.sondajes.tabla
          .fechaSondajeCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.sondajes.tabla
          .fechaSondaje
      },
      {
        field: this.planManejoViewModel.mensajes.procedimientos.sondajes.tabla
          .totalSesionesCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.sondajes.tabla
          .totalSesiones
      }
    ];

    /**
     * Genera columnas para la tabla de terapias
     */
    this.columnasCuraciones = [
      {
        field: this.planManejoViewModel.mensajes.procedimientos.curaciones.tabla
          .tipoCuracionCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.curaciones
          .tabla.tipoCuracion
      },
      {
        field: this.planManejoViewModel.mensajes.procedimientos.curaciones.tabla
          .diasSemanaCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.curaciones
          .tabla.diasSemana
      },
      {
        field: this.planManejoViewModel.mensajes.procedimientos.curaciones.tabla
          .sesionesCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.curaciones
          .tabla.sesiones
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
          .tabla.tipoFrecuenciaCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.fototerapias
          .tabla.tipoFrecuencia
      }
    ];

    /**
     * Genera columnas para la tabla de toma de muestras
     */
    this.columnasTomaMuestras = [
      {
        field: this.planManejoViewModel.mensajes.procedimientos.tomaMuestra
          .tabla.tipoMuestraCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.tomaMuestra
          .tabla.tipoMuestra
      },
      {
        field: this.planManejoViewModel.mensajes.procedimientos.tomaMuestra
          .tabla.fechaMuestraCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.tomaMuestra
          .tabla.fechaMuestra
      },
      {
        field: this.planManejoViewModel.mensajes.procedimientos.tomaMuestra
          .tabla.requiereAyunoCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.tomaMuestra
          .tabla.requiereAyuno
      }
    ];

    /**
     * Genera columnas para la tabla de toma de muestras
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
     * Genera columnas para la tabla de canalizaciones
     */
    this.columnasCanalizaciones = [
      {
        field: this.planManejoViewModel.mensajes.procedimientos.canalizaciones
          .tabla.tipoCanalizacionCampo,
        header: this.planManejoViewModel.mensajes.procedimientos.canalizaciones
          .tabla.tipoCanalizacion
      }
    ];

    /**
     * Genera columnas para la tabla de soporte nutricional
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

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formulario = this.fb.group({
      tratamientos: [null, Validators.compose([Validators.required])],
      curaciones: [null, Validators.compose([Validators.required])],
      sondajes: [null, Validators.compose([Validators.required])],
      fototerapias: [null, Validators.compose([Validators.required])],
      tomaMuestras: [null, Validators.compose([Validators.required])],
      secreciones: [null, Validators.compose([Validators.required])],
      canalizaciones: [null, Validators.compose([Validators.required])],
      soporteNutricionales: [null, Validators.compose([Validators.required])]
    });
  }

  private validarNovedades(){
      this.isValid = true;
      const objeto: any = {
        ciudad: this.infoRemisionNovedad.datosRemision.ciudad.idCiudad,
        estado: null,
        idRemision: this.infoRemisionNovedad.datosRemision.idRemision,
        numeroIdentificacion: null,
        page: 0,
        pisos: null,
        size: 1000,
        tipoIdentificacion: null
      };


    this.gestionNovedadService.getSolicitudesNovedades(objeto).subscribe(

      planManejo => {
        this.pendientes = planManejo.content;
        console.log('esto me trae la novedades en la bandeja de gestion', this.pendientes);
        for (const i in planManejo.content){
        if (planManejo.content[i].estadoSolicitudNovedad ==  'PENDIENTE_GESTION' && planManejo.content[i].tipoNovedad == 'PLAN_MANEJO'){
          this.isValid = false;
        }
        }
  });
  }


  public cargar(){

    const dialogRef = this.dialog.open(ModalEdicionNovedadesComponent, {
      width: '50%',
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result === 'saved'){

      const id = this.infoRemisionNovedad.datosRemision.idRemision;
      this.gestionNovedadService.getSolicitudesNovedadesEdicion(id).subscribe( respuesta => {

        const GESTION_NOVEDAD = new GestionarNovedadRequest(respuesta.idSolicitud, EstadosNovedadEnum.ESCALADA, respuesta.tipoNovedad, null, this.usuarioService.InfoUsuario);
        this.escalar(GESTION_NOVEDAD);
        this.tratamientosEdicion = respuesta.objectNovedad.planManejo.tratamientos;
        this.datosEdicion = respuesta.objectNovedad.planManejo;
        this.getAgregadoPlanManejo();
        this.curacionesEdicion = respuesta.objectNovedad.planManejo.procedimientos.curaciones;

      }

      );
    }

    });


 }




  private escalar(GESTION_NOVEDAD): void {
     this.gestionNovedadService.gestionarNovedadManual(GESTION_NOVEDAD)
      .subscribe(
        response => {
        },
      );
  }

}
