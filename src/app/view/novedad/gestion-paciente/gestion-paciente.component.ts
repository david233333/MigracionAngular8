import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import * as moment from 'moment';
import {MensajesService} from '../../../shared/services/mensajes.service';
import {AgregadosNovedadService} from '../../../shared/services/agregados-novedad.service';
import {GestionPacienteViewModel} from './gestion-paciente.view-model';
import {EstadosNovedadEnum} from '../../../shared/utils/enums/estados-novedad.enum';
import {LocalStorage} from '@ngx-pwa/local-storage';
import {Router} from '@angular/router';
import {FiltrosGestionNovedadesRequest} from '../../../infraestructure/request-model/novedad/filtros-gestion-novedad.request';
import {GestionPacienteService} from '../../../domain/usecase/novedad/gestion-paciente.service';
import {EstadosPacienteEnum} from '../../../shared/utils/enums/estados-paciente.enum';
import {CapturarErrores} from '../../../shared/services/capturar-errores';
//import {forEach} from '@angular/router/src/utils/collection';

moment.locale('es');


@Component({
  selector: 'sura-gestion-paciente',
  templateUrl: './gestion-paciente.component.html',
  styleUrls: ['./gestion-paciente.component.scss']
})
export class GestionPacienteComponent implements OnInit, AfterViewInit, OnDestroy {

  public configEspanolCalendario: any;
  public gestionPacienteViewModel: GestionPacienteViewModel = this.iniciarViewModel();
  public formularioFiltros: FormGroup;
  public columnas: any[];
  public totalRegistros = 0;
  public loading = false;
  private tiposIdentificacionSubscripcion = new Subscription();
  private ciudadesSubscripcion = new Subscription();
  private pisosSubscripcion = new Subscription();
  private novedadesSubscripcion = new Subscription();
  private estadosPacienteSubscripcion = new Subscription();
  private totalRegistrosEstadosSubscripcion = new Subscription();

  constructor(
    private fb: FormBuilder,
    private gestionPacienteService: GestionPacienteService,
    private mensajesService: MensajesService,
    private infoGestionNovedad: AgregadosNovedadService,
    protected localStorage: LocalStorage,
    public cdRef: ChangeDetectorRef,
    private route: Router,
    private capturaDeErroresService: CapturarErrores) {
    this.crearFormularioFiltros();
    this.generarColumnas();
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {
    this.configurarCalendario();
    this.getDatos();

    this.localStorage.getItem<any>('formFiltrosPacienteNovedad').subscribe((filtros) => {
      if (filtros !== null) {
        this.formularioFiltros.controls['tipoDocumento'].setValue(filtros.tipoDocumento);
        this.formularioFiltros.controls['numeroDocumento'].setValue(filtros.numeroDocumento);
        this.formularioFiltros.controls['ciudad'].setValue(filtros.ciudad);
        if (filtros.ciudad) {
          this.getPisos(filtros.ciudad);
          this.formularioFiltros.controls['piso'].setValue(filtros.piso);
        }
        this.formularioFiltros.controls['estado'].setValue(filtros.estado);
        if (filtros.estado === EstadosNovedadEnum.PENDIENTE_GESTION) {
          this.gestionPacienteViewModel.verColumnaGestion = true;
        } else {
          this.gestionPacienteViewModel.verColumnaGestion = false;
        }
        this.gestionPacienteViewModel.respuestaPacientes = this.infoGestionNovedad.datosPacienteNovedad;
        console.log('this.gestionPacienteViewModel.respuestaPacientes ', this.gestionPacienteViewModel.respuestaPacientes);

        this.busqueda(0, 10);
      }
    });
  }

  ngOnDestroy() {
    this.tiposIdentificacionSubscripcion.unsubscribe();
    this.ciudadesSubscripcion.unsubscribe();
    this.pisosSubscripcion.unsubscribe();
    this.estadosPacienteSubscripcion.unsubscribe();
    this.totalRegistrosEstadosSubscripcion.unsubscribe();
  }

  public linkHistorialNovedad(paciente: any): void {
    console.log('HISTORIAL NOVEDAD ', paciente);
    this.infoGestionNovedad.datosPacienteNovedad = paciente;
    this.route.navigate(['novedad/historial-plan-manejo']);
  }

  public linkGestionarNovedad(paciente: any): void {
    console.log('GESTIONAR NOVEDAD ', paciente);
    this.infoGestionNovedad.datosPacienteNovedad = paciente;
    this.route.navigate(['novedad/gestionar-novedades']);
  }

  public linkCrearNovedad(paciente: any): void {
    console.log('CREAR NOVEDAD ', paciente);
    this.infoGestionNovedad.datosPacienteNovedad = paciente;
    this.route.navigate(['novedad/nueva']);
  }

  public linkEquipoBiomedico(paciente: any): void {
    console.log('EQUIPO BIOMEDICO ', paciente);
    this.infoGestionNovedad.datosPacienteNovedad = paciente;
    this.route.navigate(['equiposbiomedicos/historial-gestion']);
  }

  public seleccionPiso(event: any): void {
    this.getPisos(event);
  }

  /**
   *
   */
  public buscar(): void {
    this.loading = true;
    this.busqueda(0, 10);
  }

  public onPageGestionPaciente(event: any): void {
    this.busqueda(event.first, event.rows);
  }

  public busqueda(pagina: number, tamano: number) {
    if (this.formularioFiltros.valid) {

      const paginaTabla = pagina / tamano;

      const CONSULTA = new FiltrosGestionNovedadesRequest(this.formularioFiltros.controls['tipoDocumento'].value,
        this.formularioFiltros.controls['numeroDocumento'].value === '' ?
          null : this.formularioFiltros.controls['numeroDocumento'].value,
        this.formularioFiltros.controls['ciudad'].value,
        this.formularioFiltros.controls['piso'].value == null || this.formularioFiltros.controls['piso'].value.length === 0 ?
          null : this.formularioFiltros.controls['piso'].value,
        this.formularioFiltros.controls['estado'].value,
        null,
        paginaTabla,
        tamano);

      console.log('REQUEST Filtro - Gestion paciente ', JSON.stringify(CONSULTA));

      this.gestionPacienteViewModel.cargando = true;
      this.novedadesSubscripcion = this.gestionPacienteService.getPacientesGestionar(CONSULTA)
        .subscribe(
          (response) => {
            console.log('RESPONSE Filtro - Gestion paciente ', response);
            this.setFechaPosibleAlta(response.content);
            this.gestionPacienteViewModel.respuestaPacientes = response.content;
            console.log('After Set FPA ', response.content);
            this.totalRegistros = response.totalElements;
            this.loading = false;
          },
          (error) => {
            this.capturaDeErroresService.mapearErrores(error.status, error.error);
            this.loading = false;
          },
          () => {
            this.novedadesSubscripcion.unsubscribe();
            this.gestionPacienteViewModel.cargando = false;
            this.loading = false;
          });
    } else {
      this.validarTodosLosCamposDelFormulario(this.formularioFiltros);
    }
  }

  public guardarFiltros(): void {
    this.localStorage.setItem('formFiltrosPacienteNovedad', this.formularioFiltros.value).subscribe(() => {
    });
  }

  public limpiar(): void {
    this.localStorage.removeItem('formFiltrosPacienteNovedad').subscribe(() => {
    });
    this.formularioFiltros.reset();
  }

  public limpiarDocumento(): void {
    this.formularioFiltros.controls['numeroDocumento'].setValue(null);
  }

  public asignarRemisionStorage(identificadorStorage: string, valorStorage: any): void {
    this.localStorage.removeItem(identificadorStorage).subscribe(() => {
    });
    this.localStorage.setItem(identificadorStorage, valorStorage).subscribe(() => {
    });
  }

  /**
   * Válida todos los campos del formulario
   * @param formGroup
   */
  validarTodosLosCamposDelFormulario(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validarTodosLosCamposDelFormulario(control);
      }
    });
  }

  private getDatos(): void {

    this.getTiposIdentificacion();
    this.getCiudades();
    this.getEstadosPaciente();
    this.getTotalRegistrosPorEstado();
  }

  /**
   * Obtiene los tipos de identificación
   */
  private getTiposIdentificacion(): void {
    this.tiposIdentificacionSubscripcion =
      this.gestionPacienteService.getTiposIdentificacion()
        .subscribe(
          response => {
            this.gestionPacienteViewModel.respuestaTiposIdentificacion = response;
          },
          error => {
            this.capturaDeErroresService.mapearErrores(error.status, error.error);
          },
          () => {
          }
        );
  }

  /**
   * Obtiene las ciudades
   */
  private getCiudades(): void {
    this.ciudadesSubscripcion =
      this.gestionPacienteService.getCiudades()
        .subscribe(
          response => {
            this.gestionPacienteViewModel.respuestaCiudades = response;
          },
          error => {
            this.capturaDeErroresService.mapearErrores(error.status, error.error);
          },
          () => {
          }
        );
  }

  /**
   * Obtiene los pisos según la ciudad
   */
  private getPisos(ciudad: string): void {
    this.pisosSubscripcion =
      this.gestionPacienteService.getPisosCiudad(ciudad)
        .subscribe(
          response => {
            this.gestionPacienteViewModel.respuestaPisos = response;
          },
          error => {
            this.capturaDeErroresService.mapearErrores(error.status, error.error);
          },
          () => {
          }
        );
  }

  /**
   * Obtiene el total de registros para pacientes según el estado
   */
  private getTotalRegistrosPorEstado(): void {
    this.totalRegistrosEstadosSubscripcion =
      this.gestionPacienteService.getTotalRegistrosPaciente()
        .subscribe(
          (response) => {

            const TOTAL_ACTIVO = response.find(s => s.estadoPaciente === EstadosPacienteEnum.Activo);
            this.gestionPacienteViewModel.totalActivos = TOTAL_ACTIVO !== (null || undefined) ? TOTAL_ACTIVO.total : 0;

            const TOTAL_NUEVO = response.find(s => s.estadoPaciente === EstadosPacienteEnum.Nuevo);
            this.gestionPacienteViewModel.totalNuevos = TOTAL_NUEVO !== (null || undefined) ? TOTAL_NUEVO.total : 0;

            const TOTAL_PREALTA = response.find(s => s.estadoPaciente === EstadosPacienteEnum.PreAlta);
            this.gestionPacienteViewModel.totalPrealta = TOTAL_PREALTA !== (null || undefined) ? TOTAL_PREALTA.total : 0;

            const TOTAL_ALTA = response.find(s => s.estadoPaciente === EstadosPacienteEnum.Alta);
            this.gestionPacienteViewModel.totalAlta = TOTAL_ALTA !== (null || undefined) ? TOTAL_ALTA.total : 0;
          },
          (error) => {
            this.capturaDeErroresService.mapearErrores(error.status, error.error);
          },
          () => {
            this.totalRegistrosEstadosSubscripcion.unsubscribe();
          }
        );
  }

  /**
   * Obtiene los estados de la novedad
   */
  private getEstadosPaciente(): void {
    this.estadosPacienteSubscripcion =
      this.gestionPacienteService.getEstadosPaciente()
        .subscribe(
          response => {
            this.gestionPacienteViewModel.respuestaEstados = response;
          },
          error => {
            this.capturaDeErroresService.mapearErrores(error.status, error.error);
          },
          () => {
          }
        );
  }

  /**
   * Genera columnas para la tabla
   */
  private generarColumnas(): void {
    this.columnas = [
      {
        field: this.gestionPacienteViewModel.mensajes.tabla.remisionCampo,
        header: this.gestionPacienteViewModel.mensajes.tabla.remision
      },
      {
        field: this.gestionPacienteViewModel.mensajes.tabla.identificacionCampo,
        header: this.gestionPacienteViewModel.mensajes.tabla.identificacion
      }, {
        field: this.gestionPacienteViewModel.mensajes.tabla.pacienteCampo,
        header: this.gestionPacienteViewModel.mensajes.tabla.paciente
      },
      {
        field: this.gestionPacienteViewModel.mensajes.tabla.resumenRemisionCampo,
        header: this.gestionPacienteViewModel.mensajes.tabla.resumenRemision
      },
      {
        field: this.gestionPacienteViewModel.mensajes.tabla.novedadCampo,
        header: this.gestionPacienteViewModel.mensajes.tabla.novedad
      },
      {
        field: this.gestionPacienteViewModel.mensajes.tabla.equipoBiomedicoCampo,
        header: this.gestionPacienteViewModel.mensajes.tabla.equipoBiomedico
      },
      {
        field: this.gestionPacienteViewModel.mensajes.tabla.fechaAdmisionCampo,
        header: this.gestionPacienteViewModel.mensajes.tabla.fechaAdmision
      },
      {
        field: this.gestionPacienteViewModel.mensajes.tabla.fechaPosibleAltaCampo,
        header: this.gestionPacienteViewModel.mensajes.tabla.fechaPosibleAlta
      },
      {
        field: this.gestionPacienteViewModel.mensajes.tabla.estadoCampo,
        header: this.gestionPacienteViewModel.mensajes.tabla.estado
      }
    ];
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): GestionPacienteViewModel {
    return new GestionPacienteViewModel(
      null,
      null,
      [],
      [],
      [],
      [],
      [],
      [],
      false,
      null,
      null,
      null,
      null,
    );
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormularioFiltros(): void {
    this.formularioFiltros = this.fb.group({
      tipoDocumento: [null],
      numeroDocumento: [null,
        Validators.compose([
          Validators.maxLength(20),
          Validators.pattern('[0-9]+')])

      ],
      ciudad: [null,
        Validators.compose([
          Validators.required])
      ],
      piso: [null],
      estado: [null]
    });
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

  private setFechaPosibleAlta(content: any) {
    this.loading = true;
    for (let i = 0; i < content.length; i++) {
      this.gestionPacienteService.getUltimaCita(content[i].idRemision).subscribe(
        ult => {
          content[i].fechaPosibleAlta = ult;
        }, err => {
          this.capturaDeErroresService.mapearErrores(err.status, err.error);
        }
      );
    }
    this.loading = false;
  }
}
