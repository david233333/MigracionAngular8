import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { GestionEquipoBiomedicoService } from '../../../domain/usecase/equipoBiomedico/gestion-equipo-biomedico.service';
import { FiltrosEquiposBiomedicosRequest } from '../../../infraestructure/request-model/equipoBiomedico/filtros-equipos-biomedicos.request';
import { EquipoBiomedicoViewModel } from './gestion-equipo-biomedico.view-model';
import { MatDialog } from '@angular/material';
import { ModalGestionEquipoBiomedicoComponent } from './modal-gestion-equipo-biomedico/modal-gestion-equipo-biomedico.component';
import { AgregadosNovedadService } from '../../../shared/services/agregados-novedad.service';
import { CapturarErrores } from '../../../shared/services/capturar-errores';
import { UsuarioService } from '../../../shared/services/usuario.service';
moment.locale('es');

@Component({
  selector: 'sura-gestion-equipo-biomedico',
  templateUrl: './gestion-equipo-biomedico.component.html',
  styleUrls: ['./gestion-equipo-biomedico.component.scss']
})
export class GestionEquipoBiomedicoComponent
  implements OnInit, AfterViewInit, OnDestroy {
  public configEspanolCalendario: any;
  public equipoBiomedicoViewModel: EquipoBiomedicoViewModel = this.iniciarViewModel();
  public formularioFiltros: FormGroup;
  public columnas: any[];
  private tiposIdentificacionSubscripcion = new Subscription();
  private ciudadesSubscripcion = new Subscription();
  private estadosSubscripcion = new Subscription();
  private equiposBiomedicosSubscripcion = new Subscription();
  public totalRegistros: number;
  public loading: boolean;
  public nombreUsuario: string;

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  SeleccionFechaFin() {
    this.cambiarValidadorFormularioARequerido(
      this.formularioFiltros,
      'fechaInicio'
    );
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
        .getItem<any>('formFiltrosEquipoBiomedico')
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
    this.equiposBiomedicosSubscripcion.unsubscribe();
  }

  constructor(
    private fb: FormBuilder,
    private gestionEquipoBiomedicoService: GestionEquipoBiomedicoService,
    private infoGestionNovedad: AgregadosNovedadService,
    protected localStorage: LocalStorage,
    public cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private capturaDeErroresService: CapturarErrores,
    private usuarioService: UsuarioService
  ) {
    this.localStorage.getItem<any>('nombreUsuario').subscribe(usuario => {
      this.nombreUsuario = usuario;
    });
    this.crearFormularioFiltros();
    this.generarColumnas();
  }

  private getDatos(): void {
    this.getTiposIdentificacion();
    this.getCiudades();
    this.getEstados();
    this.busqueda(0, 10);
  }

  /**
   * Abre el modal
   */
  public gestionarEquipoBiomedico(
    equipoBiomedico: any,
    esDetalle: boolean
  ): void {
    console.log(equipoBiomedico);
    const dialogRef = this.dialog.open(ModalGestionEquipoBiomedicoComponent, {
      width: '90%',
      disableClose: false,
      data: {
        equipoBiomedico: equipoBiomedico,
        esDetalle: esDetalle
      }
    });

    dialogRef.afterClosed().subscribe(esDetalle => {
      console.log(esDetalle);
      if (!esDetalle) {
        this.busqueda(0, 10);
      }
    });
  }

  /**
   * Obtiene los tipos de identificación
   */
  private getTiposIdentificacion(): void {
    this.tiposIdentificacionSubscripcion = this.gestionEquipoBiomedicoService
      .getTiposIdentificacion()
      .subscribe(
        response => {
          this.equipoBiomedicoViewModel.respuestaTiposIdentificacion = response;
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
    this.ciudadesSubscripcion = this.gestionEquipoBiomedicoService
      .getCiudades()
      .subscribe(
        response => {
          this.equipoBiomedicoViewModel.respuestaCiudades = response;
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
    this.estadosSubscripcion = this.gestionEquipoBiomedicoService
      .getEstados('0', localStorage.getItem('nombreUsuario'))
      .subscribe(
        response => {
          this.equipoBiomedicoViewModel.respuestaEstados = response;
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

  public onPageGestionEquipoBiomedico(event: any): void {
    this.busqueda(event.first, event.rows);
  }

  public busqueda(pagina: number, tamano: number) {
    if (this.formularioFiltros.valid) {
      const paginaTabla = pagina / tamano;
      console.log(pagina);

      const CONSULTA = new FiltrosEquiposBiomedicosRequest(
        this.formularioFiltros.controls['tipoDocumento'].value,
        this.formularioFiltros.controls['numeroDocumento'].value === ''
          ? null
          : this.formularioFiltros.controls['numeroDocumento'].value,
        this.formularioFiltros.controls['ciudad'].value,
        this.formularioFiltros.controls['remision'].value === ''
          ? null
          : this.formularioFiltros.controls['remision'].value,
        this.formularioFiltros.controls['estado'].value,
        localStorage.getItem('nombreUsuario'),
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
        'REQUEST Filtro - Gestion Gestion equipo biomédico ',
        JSON.stringify(CONSULTA)
      );

      this.equiposBiomedicosSubscripcion = this.gestionEquipoBiomedicoService
        .getEquiposBiomedicos(CONSULTA)
        .subscribe(
          response => {
            console.log(
              'RESPONSE Filtro - Gestion equipo biomédico ',
              response
            );
            this.equipoBiomedicoViewModel.respuestaEquiposBiomedcos =
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
            this.equiposBiomedicosSubscripcion.unsubscribe();
          }
        );
    } else {
      this.validarTodosLosCamposDelFormulario(this.formularioFiltros);
    }
  }

  public guardarFiltros(): void {
    this.localStorage
      .setItem('formFiltrosEquipoBiomedico', this.formularioFiltros.value)
      .subscribe(() => {});
  }

  public limpiar(): void {
    this.localStorage
      .removeItem('formFiltrosEquipoBiomedico')
      .subscribe(() => {});
    this.formularioFiltros.reset();
    this.cambiarValidadorFormularioAOpcional(
      this.formularioFiltros,
      'fechaInicio'
    );
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
        field: this.equipoBiomedicoViewModel.mensajes.tabla.remisionCampo,
        header: this.equipoBiomedicoViewModel.mensajes.tabla.remision
      },
      {
        field: this.equipoBiomedicoViewModel.mensajes.tabla
          .equipoBiomedicoCampo,
        header: this.equipoBiomedicoViewModel.mensajes.tabla.equipoBiomedico
      },
      {
        field: this.equipoBiomedicoViewModel.mensajes.tabla.fechaInicioCampo,
        header: this.equipoBiomedicoViewModel.mensajes.tabla.fechaInicio
      },
      {
        field: this.equipoBiomedicoViewModel.mensajes.tabla.fechaFinCampo,
        header: this.equipoBiomedicoViewModel.mensajes.tabla.fechaFin
      },
      {
        field: this.equipoBiomedicoViewModel.mensajes.tabla.estadoCampo,
        header: this.equipoBiomedicoViewModel.mensajes.tabla.estado
      },
      {
        field: this.equipoBiomedicoViewModel.mensajes.tabla.usuarioCampo,
        header: this.equipoBiomedicoViewModel.mensajes.tabla.usuario
      },
      {
        field: this.equipoBiomedicoViewModel.mensajes.tabla.fechaRegistroCampo,
        header: this.equipoBiomedicoViewModel.mensajes.tabla.fechaRegistro
      }
    ];
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): EquipoBiomedicoViewModel {
    return new EquipoBiomedicoViewModel(
      null,
      null,
      [],
      [],
      [],
      [],
      this.usuarioService.InfoUsuario
    );
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
