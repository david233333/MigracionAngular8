import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { LocalStorage } from '@ngx-pwa/local-storage';

import { MatDialog } from '@angular/material';
import { AgregadosNovedadService } from '../../../shared/services/agregados-novedad.service';
import { CapturarErrores } from '../../../shared/services/capturar-errores';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { BandejaDinamicaViewModel } from './gestion-bandeja-dinamica.view-model';
import { ModalGestionBandejaDinamicaComponent } from './modal-gestion-bandeja-dinamica/modal-gestion-bandeja-dinamica.component';
import { FiltrosBandejaDinamicaRequest } from '../../../infraestructure/request-model/bandejaDinamica/filtros-bandeja-dinamica.request';
import { ModalConfirmacionComponent } from '../../../shared/components/modal-confirmacion/modal-confirmacion.component';
import { ModalConfirmacion } from '../../../shared/models/modal-confirmacion.model';
import { GestionBandejaDinamicaService } from '../../../domain/usecase/bandejaDinamica/gestion-bandeja-dinamica.service';
import { MensajesService } from '../../../shared/services/mensajes.service';
import { GestionarBandejaDinamicaRequest } from '../../../infraestructure/request-model/bandejaDinamica/gestionar-bandeja-dinamica.request';
moment.locale('es');

@Component({
  selector: 'sura-gestion-bandeja-dinamica',
  templateUrl: './gestion-bandeja-dinamica.component.html',
  styleUrls: ['./gestion-bandeja-dinamica.component.scss']
})
export class GestionBandejaDinamicaComponent implements OnInit, AfterViewInit, OnDestroy {
  public configEspanolCalendario: any;
  public bandejaDinamicaViewModel: BandejaDinamicaViewModel = this.iniciarViewModel();
  public formularioFiltros: FormGroup;
  public columnas: any[];
  private tiposIdentificacionSubscripcion = new Subscription();
  private ciudadesSubscripcion = new Subscription();
  private estadosSubscripcion = new Subscription();
  private ayudasDiagnosticasSubscripcion = new Subscription();
  private gestionarBandejaSubscripcion = new Subscription();
  public totalRegistros: number;
  public loading: boolean;

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  SeleccionFechaInicio() {
      this.cambiarValidadorFormularioARequerido(this.formularioFiltros, 'fechaFin');
  }

  SeleccionFechaFin() {
    this.cambiarValidadorFormularioARequerido(this.formularioFiltros, 'fechaInicio');
  }

  ngOnInit(): void {
    this.configurarCalendario();
    this.getDatos();

    console.log(
      'this.infoGestionNovedad.datosPacienteNovedad ',
      this.infoGestionNovedad.datosPacienteNovedad
    );
    if (
      this.infoGestionNovedad.datosPacienteNovedad !== undefined &&
      this.infoGestionNovedad.datosPacienteNovedad !== null
    ) {
      this.formularioFiltros.controls['tipoDocumento'].setValue(
        this.infoGestionNovedad.datosPacienteNovedad.tipoDocumentoPaciente
          .idTipo
      );
      this.formularioFiltros.controls['numeroDocumento'].setValue(
        this.infoGestionNovedad.datosPacienteNovedad.numeroDocumentoPaciente
      );
      this.formularioFiltros.controls['ciudad'].setValue(
        this.infoGestionNovedad.datosPacienteNovedad.piso.idCiudad
      );
      this.formularioFiltros.controls['remision'].setValue(
        this.infoGestionNovedad.datosPacienteNovedad.idRemision
      );

      this.infoGestionNovedad.datosPacienteNovedad = null;
    } else {
      this.localStorage
        .getItem<any>('formFiltrosBandejaDinamica')
        .subscribe(filtros => {
          if (filtros !== null) {
            this.formularioFiltros.controls['tipoDocumento'].setValue(
              filtros.tipoDocumento
            );
            this.formularioFiltros.controls['numeroDocumento'].setValue(
              filtros.numeroDocumento
            );
            this.formularioFiltros.controls['ciudad'].setValue(filtros.ciudad);
            this.formularioFiltros.controls['remision'].setValue(
              filtros.remision
            );
            this.formularioFiltros.controls['estado'].setValue(filtros.estado);
            this.formularioFiltros.controls['usuario'].setValue(
              filtros.usuario
            );
            this.formularioFiltros.controls['fechaInicio'].setValue(
              filtros.fechaInicio
            );
            this.formularioFiltros.controls['fechaFin'].setValue(
              filtros.fechaFin
            );
          }
        });
    }

    this.busqueda(0, 10);
  }

  ngOnDestroy() {
    this.tiposIdentificacionSubscripcion.unsubscribe();
    this.ciudadesSubscripcion.unsubscribe();
    this.estadosSubscripcion.unsubscribe();
    this.ayudasDiagnosticasSubscripcion.unsubscribe();
    this.gestionarBandejaSubscripcion.unsubscribe();
  }

  constructor(
    private fb: FormBuilder,
    private gestionBandejaDinamicaService: GestionBandejaDinamicaService,
    private infoGestionNovedad: AgregadosNovedadService,
    protected localStorage: LocalStorage,
    public cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private capturaDeErroresService: CapturarErrores,
    private usuarioService: UsuarioService,
    private mensajesService: MensajesService,
  ) {
    this.crearFormularioFiltros();
    this.generarColumnas();
  }

  private getDatos(): void {
    this.getTiposIdentificacion();
    this.getCiudades();
    this.getEstados();
    this.busqueda(0, 10);
  }

  public habilitarGestionar(): boolean {
    return this.bandejaDinamicaViewModel.ayudasSeleccionadas.length > 0
      ? false
      : true;
  }

  /**
   * Abre el modal
   */
  public verDetalleAyudaDiagnostica(
    ayudaDiagnostica: any
  ): void {
    const dialogRef = this.dialog.open(ModalGestionBandejaDinamicaComponent, {
      width: '90%',
      disableClose: false,
      data: {
        ayudaDiagnostica: ayudaDiagnostica
      }
    });

    dialogRef.afterClosed().subscribe(esDetalle => {
      if (!esDetalle) {
        this.busqueda(0, 10);
      }
    });
  }

  /**
   * Abre el modal
   */
  public gestionar(
  ): void {
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      width: '30%',
      disableClose: false,
      data: new ModalConfirmacion(
        this.bandejaDinamicaViewModel.mensajes.mensajesAlerta.tituloGestionarBandejaDinamica,
        this.bandejaDinamicaViewModel.mensajes.mensajesAlerta.contenidoGestionarBandejaDinamica
      )
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data === true) {
        const GESTION_AYUDAS_DIAGNOSTICAS = new GestionarBandejaDinamicaRequest(
          this.bandejaDinamicaViewModel.ayudasSeleccionadas,
          this.usuarioService.InfoUsuario
        );
        console.log('REQUEST - GESTIONAR ', JSON.stringify(GESTION_AYUDAS_DIAGNOSTICAS));

        this.gestionarBandejaSubscripcion = this.gestionBandejaDinamicaService
          .gestionBandejaDinamica(GESTION_AYUDAS_DIAGNOSTICAS)
          .subscribe(
            response => {
              console.log('RESPONSE - GESTIONAR ', response);
              this.mensajesService.mostrarMensajeExito(
                this.bandejaDinamicaViewModel.mensajes.mensajesAlerta
                  .exitoGestionBandejaDinamica
              );
              this.bandejaDinamicaViewModel.ayudasSeleccionadas = [];
              this.busqueda(0, 10);
            },
            error => {
              this.capturaDeErroresService.mapearErrores(error.status, error.error);
            },
            () => {}
          );
      }
    });
  }

  /**
   * Obtiene los tipos de identificación
   */
  private getTiposIdentificacion(): void {
    this.tiposIdentificacionSubscripcion = this.gestionBandejaDinamicaService
      .getTiposIdentificacion()
      .subscribe(
        response => {
          this.bandejaDinamicaViewModel.respuestaTiposIdentificacion = response;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {}
      );
  }

  /**
   * Obtiene las ciudades
   */
  private getCiudades(): void {
    this.ciudadesSubscripcion = this.gestionBandejaDinamicaService
      .getCiudades()
      .subscribe(
        response => {
          this.bandejaDinamicaViewModel.respuestaCiudades = response;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {}
      );
  }

  /**
   * Obtiene los estados de los equipos biomédicos
   */
  private getEstados(): void {
    this.estadosSubscripcion = this.gestionBandejaDinamicaService
      .getEstados()
      .subscribe(
        response => {
          this.bandejaDinamicaViewModel.respuestaEstados = response;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {}
      );
  }

  /**
   *
   */
  public buscar(): void {
    this.busqueda(0, 10);
  }

  public onPageGestionBandejaDinamica(event: any): void {
    this.busqueda(event.first, event.rows);
  }

  public busqueda(pagina: number, tamano: number) {
    if (this.formularioFiltros.valid) {
      const paginaTabla = pagina / tamano;
      console.log(pagina);
      console.log(paginaTabla);

      const CONSULTA = new FiltrosBandejaDinamicaRequest(
        this.formularioFiltros.controls['tipoDocumento'].value,
        this.formularioFiltros.controls['numeroDocumento'].value === ''
          ? null
          : this.formularioFiltros.controls['numeroDocumento'].value,
        this.formularioFiltros.controls['ciudad'].value,
        this.formularioFiltros.controls['remision'].value === ''
          ? null
          : this.formularioFiltros.controls['remision'].value,
        this.formularioFiltros.controls['estado'].value,
      this.usuarioService.InfoUsuario.username !== undefined ? this.usuarioService.InfoUsuario.username : null,
        this.formularioFiltros.controls['fechaInicio'].value === ''
          ? null
          : this.formularioFiltros.controls['fechaInicio'].value,
        this.formularioFiltros.controls['fechaFin'].value === ''
          ? null
          : this.formularioFiltros.controls['fechaFin'].value,
        paginaTabla,
        tamano
      );

      console.log(
        'REQUEST Filtro - Gestion bandeja dinámica ',
        JSON.stringify(CONSULTA)
      );

      this.ayudasDiagnosticasSubscripcion = this.gestionBandejaDinamicaService
        .getBandejaDinamica(CONSULTA)
        .subscribe(
          response => {
            console.log(
              'RESPONSE Filtro - Gestion bandeja dinámicng servea ',
              response
            );
            this.bandejaDinamicaViewModel.respuestaBandejaDinamica =
              response.content;
            this.totalRegistros = response.totalElements;
          },
          error => {
            this.capturaDeErroresService.mapearErrores(
              error.status,
              error.error
            );
          },
          () => {
            this.ayudasDiagnosticasSubscripcion.unsubscribe();
          }
        );
    } else {
      this.validarTodosLosCamposDelFormulario(this.formularioFiltros);
    }
  }

  public guardarFiltros(): void {
    this.localStorage
      .setItem('formFiltrosBandejaDinamica', this.formularioFiltros.value)
      .subscribe(() => {});
  }

  public limpiar(): void {
    this.localStorage
      .removeItem('formFiltrosBandejaDinamica')
      .subscribe(() => {});
    this.formularioFiltros.reset();
    this.cambiarValidadorFormularioAOpcional(this.formularioFiltros, 'fechaInicio');
    this.cambiarValidadorFormularioAOpcional(this.formularioFiltros, 'fechaFin');
  }

  public limpiarDocumento(): void {
    this.formularioFiltros.controls['numeroDocumento'].setValue(null);
  }

  public limpiarRemision(): void {
    this.formularioFiltros.controls['remision'].setValue(null);
  }

  public limpiarUsuario(): void {
    this.formularioFiltros.controls['usuario'].setValue(null);
  }

  /**
   * Genera columnas para la tabla
   */
  private generarColumnas(): void {
    this.columnas = [
      {
        field: this.bandejaDinamicaViewModel.mensajes.tabla.nombrePacienteCampo,
        header: this.bandejaDinamicaViewModel.mensajes.tabla.nombrePaciente
      },
      {
        field: this.bandejaDinamicaViewModel.mensajes.tabla
          .identificacionCampo,
        header: this.bandejaDinamicaViewModel.mensajes.tabla.identificacion
      },
      {
        field: this.bandejaDinamicaViewModel.mensajes.tabla.laboratorioCampo,
        header: this.bandejaDinamicaViewModel.mensajes.tabla.laboratorio
      },
      {
        field: this.bandejaDinamicaViewModel.mensajes.tabla.fechaSolicitudCampo,
        header: this.bandejaDinamicaViewModel.mensajes.tabla.fechaSolicitud
      },
      {
        field: this.bandejaDinamicaViewModel.mensajes.tabla.fechaTomaMuestraCampo,
        header: this.bandejaDinamicaViewModel.mensajes.tabla.fechaTomaMuestra
      },
      {
        field: this.bandejaDinamicaViewModel.mensajes.tabla.usuarioSolicitudCampo,
        header: this.bandejaDinamicaViewModel.mensajes.tabla.usuarioSolicitud
      },
      {
        field: this.bandejaDinamicaViewModel.mensajes.tabla.estadoSolicitudCampo,
        header: this.bandejaDinamicaViewModel.mensajes.tabla.estadoSolicitud
      }
    ];
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): BandejaDinamicaViewModel {
    return new BandejaDinamicaViewModel(null, null, [], [], [], [], []);
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormularioFiltros(): void {
    this.formularioFiltros = this.fb.group({
      tipoDocumento: [null],
      numeroDocumento: [
        null,
        Validators.compose([
          Validators.maxLength(20),
          Validators.pattern('[0-9]+')
        ])
      ],
      ciudad: [null],
      remision: [null, Validators.compose([Validators.maxLength(50)])],
      estado: [null],
      usuario: [null, Validators.compose([Validators.maxLength(50)])],
      fechaInicio: [null],
      fechaFin: [null]
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

  /**
   * Cambia los validadores de un control del formulario
   * @param {FormGroup} formulario
   * @param {string} nombrecontrol
   */
  private cambiarValidadorFormularioARequerido(
    formulario: FormGroup,
    nombrecontrol: string
  ): void {
    formulario.get(nombrecontrol).clearValidators();
    formulario
      .get(nombrecontrol)
      .setValidators(Validators.compose([Validators.required]));
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
}
