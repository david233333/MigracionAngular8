import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import * as moment from 'moment';
import {DatosPacienteViewModel} from './datos-paciente-novedad.view-model';
import {MensajesService} from '../../../../shared/services/mensajes.service';
import {ModalDireccionComponent} from '../../../remision/datos-atencion/modal-direccion/modal-direccion.component';
import {DatosPacienteNovedadService} from '../../../../domain/usecase/novedad/datos-paciente-novedad.service';
import {AgregadosNovedadService} from '../../../../shared/services/agregados-novedad.service';
import {DatosAtencionPacienteRequest} from '../../../../infraestructure/request-model/novedad/datos-atencion-paciente.request';
import {DatosAtencionPaciente} from '../../../../domain/model/novedad/entity/datos-atencion-paciente.model';
import {ConsultaRemisionRequest} from '../../../../infraestructure/request-model/novedad/consulta-remision.request';
import {CreacionNovedadService} from '../../../../domain/usecase/novedad/creacion-novedad.service';
import {UsuarioService} from '../../../../shared/services/usuario.service';
import {CapturarErrores} from '../../../../shared/services/capturar-errores';

moment.locale('es');

@Component({
  selector: 'sura-novedad-datos-paciente',
  templateUrl: './datos-paciente-novedad.component.html',
  styleUrls: ['./datos-paciente-novedad.component.scss']
})
export class DatosPacienteNovedadComponent implements OnInit, OnDestroy {
  public configEspanolCalendario: any;
  public datosPacienteViewModel: DatosPacienteViewModel = this.iniciarViewModel();
  public formularioDatosPaciente: FormGroup;
  @Output()
  public regresarPrincipal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  public ciudad: EventEmitter<string> = new EventEmitter<string>();
  private ciudadesSubscripcion: Subscription = new Subscription();
  private municipiosSubscripcion: Subscription = new Subscription();
  private datosPacienteSubscripcion: Subscription = new Subscription();
  private remisionSubscription = new Subscription();
  public loading = true;

  constructor(
    private fb: FormBuilder,
    private datosPacienteService: DatosPacienteNovedadService,
    private creacionNovedadService: CreacionNovedadService,
    private dialog: MatDialog,
    private mensajesService: MensajesService,
    private infoRemisionNovedad: AgregadosNovedadService,
    private usuarioService: UsuarioService,
    private capturaDeErroresService: CapturarErrores
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.configurarCalendario();
    this.getDatos();
  }

  ngOnDestroy() {
    this.ciudadesSubscripcion.unsubscribe();
    this.municipiosSubscripcion.unsubscribe();
    this.datosPacienteSubscripcion.unsubscribe();
    this.remisionSubscription.unsubscribe();
  }

  guardarDatosPaciente(): void {
    if (this.formularioDatosPaciente.valid) {
      const CAMBIO_DATOS_PACIENTE = new DatosAtencionPacienteRequest(
        this.infoRemisionNovedad.datosRemision.idRemision,
        new DatosAtencionPaciente(
          this.formularioDatosPaciente.get('nombreCuidador').value,
          this.formularioDatosPaciente.get('nombreResponsable').value,
          this.formularioDatosPaciente.get('telefonoPaciente').value,
          this.formularioDatosPaciente.get('celularPaciente').value,
          this.formularioDatosPaciente.get('celularPaciente2').value,
          this.datosPacienteViewModel.respuestaUbicacion,
          this.infoRemisionNovedad.datosRemision.idRemision
        ),
        this.usuarioService.InfoUsuario
      );

      console.log(
        'REQUEST - Datos paciente ',
        JSON.stringify(CAMBIO_DATOS_PACIENTE)
      );
      this.cambiarDatosPaciente(CAMBIO_DATOS_PACIENTE);
    } else {
      this.validarTodosLosCamposDelFormulario(this.formularioDatosPaciente);
    }
  }

  /**
   * Limpia los campos de ubicacion traidos
   * del formularioDireccion los settea en limpio
   */
  public limpiarCamposMunicipio() {
    this.formularioDatosPaciente.get('barrio').setValue('');
    this.formularioDatosPaciente.get('direccion').setValue('');
    this.formularioDatosPaciente.get('municipio').setValue('');
    this.datosPacienteViewModel.respuestaUbicacion = null;
    this.datosPacienteViewModel.respuestaInfoPaciente = null;
  }

  /**
   * Emite la ciudad seleccionada
   * @param evento
   */
  public emitirCiudad(evento): void {
    if (evento) { // antes evento && evento.value ahora sole es evento
      this.ciudad.emit(evento.value);
    }
  }

  /**
   * Realiza llamado al servicio
   */
  public getCiudades(): void {
    this.ciudadesSubscripcion = this.datosPacienteService
      .getCiudades()
      .subscribe(
        response => {
          if (response) {
            this.datosPacienteViewModel.respuestaCiudades = response;
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
   * Obtiene el agregado de remisión
   */
  public getAgregadoRemision(): void {
    const CONSULTA = new ConsultaRemisionRequest(
      this.infoRemisionNovedad.datosNovedad.idRemision,
      this.infoRemisionNovedad.datosRemision.tipoIdentificacion.idTipo,
      this.infoRemisionNovedad.datosRemision.numeroIdentificacion
    );

    this.remisionSubscription = this.creacionNovedadService
      .getConsultaRemision(CONSULTA)
      .subscribe(
        response => {
          this.infoRemisionNovedad.datosRemision = response.remision;
          this.infoRemisionNovedad.datosNovedad = response.novedad;
          this.getInfoPaciente();
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
          this.remisionSubscription.unsubscribe();
        }
      );
  }

  /**
   * Abre el modal
   */
  public abrirModalDireccion(): void {
    if (
      this.formularioDatosPaciente.get('ciudad').value === '' ||
      this.formularioDatosPaciente.get('ciudad').value === undefined
    ) {
      this.mensajesService.mostrarMensajeError('Debes seleccionar una ciudad');
    } else {
      const ciudad = this.datosPacienteViewModel.respuestaCiudades.find(
        id => id.idCiudad === this.formularioDatosPaciente.get('ciudad').value
      );
      if (ciudad !== undefined) {

        const dialogRef = this.dialog.open(ModalDireccionComponent, {
          width: '99%',
          disableClose: true,
          data: {
            ciudad: ciudad,
            barrio: this.formularioDatosPaciente.get('barrio').value,
            direccion: this.formularioDatosPaciente.get('barrio').value,
            municipio: this.formularioDatosPaciente.get('municipio').value,
            ubicacion: this.datosPacienteViewModel.respuestaUbicacion,
            esNovedad: true,
            esDetalle: false
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.suscribirFormulario(result);
          if (result) {
            if (result.sinNomenclatura) {
              result.direccion = 'SIN NOMENCLATURA, ' + result.direccionComplementaria
                + ' - ' + result.informacionComplementaria;
              result.barrio = 'NO DISPONIBLE';
              this.formularioDatosPaciente.get('direccion').setValue('SIN NOMENCLATURA, ' + result.direccionComplementaria
                + ' - ' + result.informacionComplementaria);
              this.formularioDatosPaciente.get('barrio').setValue('NO DISPONIBLE');
            } else {
              this.formularioDatosPaciente.get('barrio').setValue(result.barrio);
              this.formularioDatosPaciente
                .get('direccion')
                .setValue(result.direccion);
            }
            this.datosPacienteViewModel.respuestaMunicipios.push(
              result.municipio
            );
            this.formularioDatosPaciente
              .get('municipio')
              .setValue(result.municipio);
            this.datosPacienteViewModel.respuestaUbicacion = result;
          }
        });
      }
    }
  }

  /**
   * Metodo que se ejecuta al cambiar alguno de los telefonos
   */
  public cambiarTelefono(): void {
    this.validarTelefonos();
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

  public validacionTelefono() {
    this.formularioDatosPaciente.controls['telefonoPaciente'].setValue('');
    this.validarTelefonos();
  }

  public validarCelular() {
    this.formularioDatosPaciente.controls['celularPaciente'].setValue('');
    this.formularioDatosPaciente.controls['celularPaciente2'].setValue('');
    this.validarTelefonos();
  }

  /**
   *
   * @param datosPaciente
   */
  private cambiarDatosPaciente(
    datosPaciente: DatosAtencionPacienteRequest
  ): void {
    this.datosPacienteSubscripcion = this.datosPacienteService
      .cambiarDatosAtencionPaciente(datosPaciente)
      .subscribe(
        response => {
          console.log('RESPONSE - Datos paciente ', response);
          this.mensajesService.mostrarMensajeExito(
            this.datosPacienteViewModel.mensajes.mensajesAlerta
              .exitoCambioDatosPaciente
          );
          this.regresarPrincipal.emit(true);
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
          this.regresarPrincipal.emit(false);
        },
        () => {
        }
      );
  }

  /**
   * Obtiene los datos de atencion
   */
  private getDatos(): void {
    this.datosPacienteViewModel.placeholderTelefono = this.datosPacienteViewModel.mensajes.campos.telefonoPacienteRequerido;
    this.datosPacienteViewModel.placeholderCelular = this.datosPacienteViewModel.mensajes.campos.celularPaciente;
    this.datosPacienteViewModel.placeholderCelular2 = this.datosPacienteViewModel.mensajes.campos.celularPaciente2;
    this.getCiudades();
    this.getAgregadoRemision();
  }

  /**
   * Suscribe los cambios del formulario
   */
  private suscribirFormulario(direccion?: any): void {
    this.formularioDatosPaciente.valueChanges.subscribe(formulario => {
      formulario.ubicacion = direccion;
    });
  }

  private getInfoPaciente(): void {
    if (this.infoRemisionNovedad.datosNovedad.idInformacionPacientePk != null) {
      this.datosPacienteSubscripcion = this.datosPacienteService
        .getAgregadoInformacionPaciente(
          this.infoRemisionNovedad.datosNovedad.idInformacionPacientePk
        )
        .subscribe(
          response => {
            console.log(
              'RESPONSE - Agregado Datos paciente ',
              response.datosAtencionPaciente
            );
            this.loading = false;
            this.datosPacienteViewModel.respuestaUbicacion = response.datosAtencionPaciente.ubicacion;
            this.datosPacienteViewModel.respuestaInfoPaciente =
              response.datosAtencionPaciente;
            this.cargarControlesInformacionPaciente(
              response.datosAtencionPaciente
            );
          },
          error => {
            this.capturaDeErroresService.mapearErrores(error.status, error.error);
          },
          () => {
          }
        );
    }
  }

  private cargarControlesInformacionPaciente(info: any): void {
    if (info != null) {
      this.formularioDatosPaciente
        .get('ciudad')
        .setValue(info['ubicacion'].ciudadPrincipal.idCiudad);
      this.datosPacienteViewModel.respuestaMunicipios.push(
        info['ubicacion'].municipio
      );
      this.formularioDatosPaciente
        .get('municipio')
        .setValue(info['ubicacion'].municipio);
      this.formularioDatosPaciente
        .get('barrio')
        .setValue(info['ubicacion'].barrio);
      this.formularioDatosPaciente
        .get('direccion')
        .setValue(info['ubicacion'].direccion);

      this.formularioDatosPaciente
        .get('nombreCuidador')
        .setValue(info.nombreCuidador);
      this.formularioDatosPaciente
        .get('nombreResponsable')
        .setValue(info.nombreResponsable);
      this.formularioDatosPaciente
        .get('telefonoPaciente')
        .setValue(info.telefonoPaciente);
      this.formularioDatosPaciente
        .get('celularPaciente')
        .setValue(info.celularPaciente);
      this.formularioDatosPaciente
        .get('celularPaciente2')
        .setValue(info.celularPaciente2);
      this.datosPacienteViewModel.respuestaUbicacion = info.ubicacion;
      this.validarTelefonos();
    }
  }

  /**
   * Desactiva el campo direccion
   */
  private desactivarDireccion(): void {
    const controlDireccion = this.formularioDatosPaciente.get('direccion');
    controlDireccion.disable();
  }

  /**
   * Asigna validaciones de los telefonos
   */
  private validarTelefonos(): void {
    if (
      this.formularioDatosPaciente.get('telefonoPaciente').value === '' &&
      this.formularioDatosPaciente.get('celularPaciente').value === ''
    ) {
      this.telefonoObligatorioCelularOpcional();
    }

    if (
      this.formularioDatosPaciente.get('telefonoPaciente').value !== '' &&
      this.formularioDatosPaciente.get('celularPaciente').value === ''
    ) {
      this.telefonoObligatorioCelularOpcional();
    }

    if (
      this.formularioDatosPaciente.get('telefonoPaciente').value !== '' &&
      this.formularioDatosPaciente.get('celularPaciente').value !== ''
    ) {
      this.telefonoObligatorioCelularOpcional();
    }

    if (
      this.formularioDatosPaciente.get('telefonoPaciente').value === '' &&
      this.formularioDatosPaciente.get('celularPaciente').value !== ''
    ) {
      this.telefonoOpcionalCelularObligatorio();
    }
  }

  /**
   * Convierte el campo telefono obligatorio y el campo celular opcional
   */
  private telefonoObligatorioCelularOpcional(): void {
    this.convertirTelefonoObligatorio(true);
    this.convertirCelularObligatorio(false);
  }

  /**
   * Convierte el campo telefono opcional y el campo celular obligatorio
   */
  private telefonoOpcionalCelularObligatorio(): void {
    this.convertirTelefonoObligatorio(false);
    this.convertirCelularObligatorio(true);
  }

  /**
   * Convierte el campo telefono en obligatorio u opcional
   * @param {boolean} obligatorio
   */
  private convertirTelefonoObligatorio(obligatorio: boolean): void {
    if (obligatorio) {
      this.datosPacienteViewModel.placeholderTelefono = this.datosPacienteViewModel.mensajes.campos.telefonoPacienteRequerido;
      this.cambiarValidadoresFormularioARequerido('telefonoPaciente', 7);
    } else {
      this.datosPacienteViewModel.placeholderTelefono = this.datosPacienteViewModel.mensajes.campos.telefonoPaciente;
      this.cambiarValidadoresFormularioAOpcional('telefonoPaciente', 7);
    }
    this.formularioDatosPaciente
      .get('telefonoPaciente')
      .updateValueAndValidity();
  }

  /**
   * Convierte el campo celular en obligatorio u opcional
   * @param {boolean} obligatorio
   */
  private convertirCelularObligatorio(obligatorio: boolean): void {
    if (obligatorio) {
      this.datosPacienteViewModel.placeholderCelular = this.datosPacienteViewModel.mensajes.campos.celularPacienteRequerido;
      this.cambiarValidadoresFormularioARequerido('celularPaciente', 10);
      this.cambiarValidadoresFormularioARequerido('celularPaciente2', 10);
    } else {
      this.datosPacienteViewModel.placeholderCelular = this.datosPacienteViewModel.mensajes.campos.celularPaciente;
      this.cambiarValidadoresFormularioAOpcional('celularPaciente', 10);
      this.cambiarValidadoresFormularioAOpcional('celularPaciente2', 10);
    }
    this.formularioDatosPaciente
      .get('celularPaciente')
      .updateValueAndValidity();
    this.formularioDatosPaciente
      .get('celularPaciente2')
      .updateValueAndValidity();
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): DatosPacienteViewModel {
    return new DatosPacienteViewModel(null, '', '', '', null, [], [], null, []);
  }

  /**
   * Cambia los validadores del formulario
   * @param {string} nombrecontrol
   * @param {number} numeroDigitos
   */
  private cambiarValidadoresFormularioARequerido(
    nombrecontrol: string,
    numeroDigitos: number
  ): void {
    this.formularioDatosPaciente.get(nombrecontrol).clearValidators();
    this.formularioDatosPaciente
      .get(nombrecontrol)
      .setValidators(
        Validators.compose([
          Validators.required,
          Validators.maxLength(numeroDigitos),
          Validators.pattern('[0-9]+')
        ])
      );
    this.formularioDatosPaciente.get(nombrecontrol).updateValueAndValidity();
  }

  /**
   * Cambia los validadores del formulario
   * @param {string} nombrecontrol
   * @param {number} numeroDigitos
   */
  private cambiarValidadoresFormularioAOpcional(
    nombrecontrol: string,
    numeroDigitos: number
  ): void {
    this.formularioDatosPaciente.get(nombrecontrol).clearValidators();
    this.formularioDatosPaciente
      .get(nombrecontrol)
      .setValidators(
        Validators.compose([
          Validators.maxLength(numeroDigitos),
          Validators.pattern('[0-9]+')
        ])
      );
    this.formularioDatosPaciente.get(nombrecontrol).updateValueAndValidity();
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formularioDatosPaciente = this.fb.group({
      ciudad: ['', Validators.compose([Validators.required])],
      municipio: [
        {value: '', disabled: true},
        Validators.compose([Validators.required])
      ],
      barrio: [
        {value: '', disabled: true},
        Validators.compose([Validators.required])
      ],
      direccion: [
        {value: '', disabled: true},
        Validators.compose([Validators.required, Validators.maxLength(64)])
      ],
      nombreCuidador: ['', Validators.compose([Validators.maxLength(50)])],
      nombreResponsable: ['', Validators.compose([Validators.maxLength(50)])],
      telefonoPaciente: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(7),
          Validators.pattern('[0-9]+')
        ])
      ],
      celularPaciente: [
        '',
        Validators.compose([
          Validators.maxLength(10),
          Validators.pattern('[0-9]+')
        ])
      ],
      celularPaciente2: [
        '',
        Validators.compose([
          Validators.maxLength(10),
          Validators.pattern('[0-9]+')
        ])
      ]
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
}
