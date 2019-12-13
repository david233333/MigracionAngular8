import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import * as moment from 'moment';
import {MensajesService} from '../../../shared/services/mensajes.service';
import {CreacionNovedadViewModel} from './creacion-novedad.view-model';
import {CreacionNovedadService} from '../../../domain/usecase/novedad/creacion-novedad.service';
import {ConsultaRemisionRequest} from '../../../infraestructure/request-model/novedad/consulta-remision.request';
import {AgregadosNovedadService} from '../../../shared/services/agregados-novedad.service';
import {ComunService} from '../../../domain/usecase/comun/comun.service';
import {AgregadosComunService} from '../../../shared/services/agregados-comun.service';
import {LocalStorage} from '@ngx-pwa/local-storage';
import {CapturarErrores} from '../../../shared/services/capturar-errores';
import {GestionNovedadService} from '../../../domain/usecase/novedad/gestion-novedad.service';

moment.locale('es');

@Component({
  selector: 'sura-creacion-novedad',
  templateUrl: './creacion-novedad.component.html',
  styleUrls: ['./creacion-novedad.component.scss']
})
export class CreacionNovedadComponent implements OnInit, OnDestroy {
  public opcionPantalla: string;
  public tituloPantalla: string;
  public configEspanolCalendario: any;
  public creacionNovedadViewModel: CreacionNovedadViewModel = this.iniciarViewModel();
  public formularioPrincipal: FormGroup;
  public verInfoRemision = false;
  private remisionSubscripcion: Subscription = new Subscription();
  private tiposIdentificacionSubscripcion = new Subscription();
  private profesionesSubscripcion: Subscription = new Subscription();
  public especialidad = '';
  public nombreCiudad;
  public idPrograma = '';
  public remisionMoment = '';
  public idProgramaAsignarInfoPaciente = '';

  constructor(
    private fb: FormBuilder,
    private creacionNovedadService: CreacionNovedadService,
    private mensajesService: MensajesService,
    private comunService: ComunService,
    private infoRemisionNovedad: AgregadosNovedadService,
    private infoComunes: AgregadosComunService,
    private infoGestionNovedad: AgregadosNovedadService,
    private capturaDeErroresService: CapturarErrores,
    private gestionService: GestionNovedadService
  ) {
    this.crearFormularioPrincipal();
  }

  ngOnInit(): void {
    this.configurarCalendario();
    this.opcionPantalla = this.creacionNovedadViewModel.mensajes.opcionesMenu.principal;
    this.getDatos();

    if (
      this.infoGestionNovedad.datosPacienteNovedad !== undefined &&
      this.infoGestionNovedad.datosPacienteNovedad !== null
    ) {
      this.formularioPrincipal
        .get('remisionPaciente')
        .setValue(this.infoGestionNovedad.datosPacienteNovedad.idRemision);
      this.consultarRemision(false);
      this.infoGestionNovedad.datosPacienteNovedad = null;
    }
  }

  ngOnDestroy() {
    this.remisionSubscripcion.unsubscribe();
    this.tiposIdentificacionSubscripcion.unsubscribe();
    this.profesionesSubscripcion.unsubscribe();
  }

  seleccionarMenu(nombrePantalla: string) {
    switch (nombrePantalla) {
      case this.creacionNovedadViewModel.mensajes.opcionesMenu
        .tratamientoProcedimiento: {
        this.opcionPantalla = nombrePantalla;
        this.tituloPantalla = this.creacionNovedadViewModel.mensajes.titulos.tratamientoProcedimiento;
        break;
      }
      case this.creacionNovedadViewModel.mensajes.opcionesMenu.cita: {
        this.opcionPantalla = nombrePantalla;
        this.tituloPantalla = this.creacionNovedadViewModel.mensajes.titulos.cita;
        break;
      }
      case this.creacionNovedadViewModel.mensajes.opcionesMenu.modificarVisitas: {
        this.opcionPantalla = nombrePantalla;
        this.tituloPantalla = this.creacionNovedadViewModel.mensajes.titulos.modificarVisitas;
        break;
      }
      case this.creacionNovedadViewModel.mensajes.opcionesMenu.infoPaciente: {
        this.opcionPantalla = nombrePantalla;
        this.tituloPantalla = this.creacionNovedadViewModel.mensajes.titulos.infoPaciente;
        break;
      }
      case this.creacionNovedadViewModel.mensajes.opcionesMenu
        .equiposBiomedicos: {
        this.opcionPantalla = nombrePantalla;
        this.tituloPantalla = this.creacionNovedadViewModel.mensajes.titulos.equiposBiomedicos;
        break;
      }
      case this.creacionNovedadViewModel.mensajes.opcionesMenu.egreso: {
        this.opcionPantalla = nombrePantalla;
        this.tituloPantalla = this.creacionNovedadViewModel.mensajes.titulos.egreso;
        break;
      }

      /*case this.creacionNovedadViewModel.mensajes.opcionesMenu.cancelaVisita: {
        this.opcionPantalla = nombrePantalla;
        this.tituloPantalla = this.creacionNovedadViewModel.mensajes.titulos.cancelaVisita;
        break;
      }
      case this.creacionNovedadViewModel.mensajes.opcionesMenu
        .aplicacionesCuidador: {
        this.opcionPantalla = nombrePantalla;
        this.tituloPantalla = this.creacionNovedadViewModel.mensajes.titulos.aplicacionesCuidador;
        break;
      }
      case this.creacionNovedadViewModel.mensajes.opcionesMenu.alertasVisitas: {
        this.opcionPantalla = nombrePantalla;
        this.tituloPantalla = this.creacionNovedadViewModel.mensajes.titulos.alertasVisitas;
        break;
      }*/

      case this.creacionNovedadViewModel.mensajes.opcionesMenu.principal: {
        this.opcionPantalla = nombrePantalla;
        break;
      }
    }
  }

  public pantallaPrincipal(retornar: boolean, conFiltros: boolean): void {
    if (retornar) {
      this.opcionPantalla = this.creacionNovedadViewModel.mensajes.opcionesMenu.principal;
      if (!conFiltros) {
        this.formularioPrincipal.reset();
        this.verInfoRemision = false;
      }
    }
  }

  /**
   * Obtiene los tipos de identificación
   */
  public getTiposIdentificacion(): void {
    this.tiposIdentificacionSubscripcion = this.creacionNovedadService
      .getTiposIdentificacion()
      .subscribe(
        response => {
          if (response) {
            this.creacionNovedadViewModel.respuestaTiposIdentificacion = response;
          }
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
        }
      );
  }

  /**
   * Obtiene las profesiones usadas donde se deban visualizar citas
   */
  public getProfesiones(): void {
    this.profesionesSubscripcion = this.comunService.getProfesiones().subscribe(
      response => {
        this.infoComunes.datosProfesionales = response;
      },
      error => {
        this.capturaDeErroresService.mapearErrores(error.status, error.error);
      },
      () => {
      }
    );
  }

  onKeydown(event) {
    console.log('esto es un ensayo de david', event);
  }

  /**
   *
   */
  public consultarRemision(porIdentificacion: boolean): void {

    this.validadores(porIdentificacion);

    const tipoDocumento = this.formularioPrincipal.get('tipoDocumentoPaciente').value;
    const numeroDocumento = this.formularioPrincipal.get('numeroDocumentoPaciente').value;
    const remision = this.formularioPrincipal.get('remisionPaciente').value;

    this.remisionMoment = remision;

    const CONSULTA = new ConsultaRemisionRequest(remision, tipoDocumento, numeroDocumento);
    let id2: string = CONSULTA.idRemision;

    console.log('REQUEST - Creacion novedad77 ', JSON.stringify(CONSULTA));
    console.log('datos de consulta para generar la novedad ', CONSULTA);

    this.remisionSubscripcion = this.creacionNovedadService
      .getConsultaRemision(CONSULTA)
      .subscribe(
        response => {
          console.log('RESPONSE - Creacion novedad respuesta ', response);
          this.idProgramaAsignarInfoPaciente = response.remision.programa.idPrograma;
          this.especialidad = response.remision.programa.especialidad;
          this.nombreCiudad = response.remision.ciudad;
          this.idPrograma = response.remision.programa.idPrograma;
          this.infoRemisionNovedad.datosRemision = response.remision;
          this.infoRemisionNovedad.datosNovedad = response.novedad;
          this.creacionNovedadViewModel.infoRemision = response.remision;
          this.infoRemisionNovedad.datosRemision = response.remision; //asigan los datos de la remision
          this.infoRemisionNovedad.datosNovedad = response.novedad;  //asigan los datos de la novedad
          this.creacionNovedadViewModel.infoRemision = response.remision; // asigana los datos de la remision
          this.verInfoRemision = true;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
          this.remisionSubscripcion.unsubscribe();
        }
      );
  }


  public habilitarBuscadorPorIdentificacion(): boolean {
    return (
      !this.formularioPrincipal.controls['numeroDocumentoPaciente'].valid ||
      !this.formularioPrincipal.controls['tipoDocumentoPaciente'].valid ||
      this.formularioPrincipal.get('numeroDocumentoPaciente').value === '' ||
      this.formularioPrincipal.get('tipoDocumentoPaciente').value === ''
    );
  }

  public habilitarBuscadorPorRemision(): boolean {
    return (
      !this.formularioPrincipal.controls['remisionPaciente'].valid ||
      this.formularioPrincipal.get('remisionPaciente').value === ''
    );
  }

  public validadores(porIdentificacion: boolean) {
    if (porIdentificacion) {
      this.cambiarValidadorFormularioAOpcional(
        this.formularioPrincipal,
        'remisionPaciente'
      );
      this.cambiarValidadorFormularioARequerido(
        this.formularioPrincipal,
        'tipoDocumentoPaciente'
      );
      this.cambiarValidadorFormularioARequerido(
        this.formularioPrincipal,
        'numeroDocumentoPaciente'
      );
      this.formularioPrincipal.get('remisionPaciente').setValue('');
    } else {
      this.cambiarValidadorFormularioAOpcional(
        this.formularioPrincipal,
        'tipoDocumentoPaciente'
      );
      this.cambiarValidadorFormularioAOpcional(
        this.formularioPrincipal,
        'numeroDocumentoPaciente'
      );
      this.cambiarValidadorFormularioARequerido(
        this.formularioPrincipal,
        'remisionPaciente'
      );
      this.formularioPrincipal.get('tipoDocumentoPaciente').setValue('');
      this.formularioPrincipal.get('numeroDocumentoPaciente').setValue('');
    }
  }

  public VerInfoPaciente(): boolean {
    return;
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
    this.getProfesiones();
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): CreacionNovedadViewModel {
    return new CreacionNovedadViewModel(
      null,
      null,
      null,
      null,
      [],
      [],
      [],
      [],
      null
    );
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormularioPrincipal(): void {
    this.formularioPrincipal = this.fb.group({
      tipoDocumentoPaciente: [''],
      numeroDocumentoPaciente: [
        '',
        Validators.compose([
          Validators.maxLength(20),
          Validators.pattern('[0-9]+')
        ])
      ],
      remisionPaciente: ['', Validators.compose([Validators.maxLength(15)])]
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
