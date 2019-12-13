import {AfterContentChecked, Component, EventEmitter, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';

import {MatDialog} from '@angular/material';

import {ModalDireccionComponent} from './modal-direccion/modal-direccion.component';
import {ModalCondicionPacienteAceptaComponent} from './modal-condicion-paciente-acepta/modal-condicion-paciente-acepta.component';

import {DatosAtencionViewModel} from './datos-atencion.view-model';

import {DatosAtencionService} from '../../../domain/usecase/remision/datos-atencion.service';
import {MensajesService} from '../../../shared/services/mensajes.service';
import {RemisionServices} from '../../../domain/usecase/remision/remision.service';
import {AgregadosRemisionService} from '../../../shared/services/agregados-remision.service';
import {Router} from '@angular/router';
import {RemisionContenedorService} from '../../../domain/usecase/remision/remision-contenedor.service';
import {EstadosRemisionEnum} from '../../../shared/utils/enums/estados-remision.enum';
import {Ubicacion} from '../../../domain/model/remision/entity/ubicacion.model';
import {CapturarErrores} from '../../../shared/services/capturar-errores';
import {Municipio} from '../../../domain/model/maestro/entity/municipio.model';
import {NovedadService} from '../../../infraestructure/novedad/novedad.service';
import {InformesUsecase} from '../../../domain/usecase/informes/informes-usecase';

@Component({
  selector: 'sura-datos-atencion',
  templateUrl: './datos-atencion.component.html',
  styleUrls: ['./datos-atencion.component.scss']
})
export class DatosAtencionComponent
  implements OnInit, AfterContentChecked, OnDestroy, OnChanges {
  @Output()
  public continuar: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  public datosAtencion: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  @Output()
  public ciudad: EventEmitter<any> = new EventEmitter<any>();

  public formulario: FormGroup;

  public datosAtencionViewModel: DatosAtencionViewModel = this.iniciarViewModel();

  readonly SELECCIONAR = 'SELECCIONAR';
  public disableButton: boolean;
  public esDetalle = false;
  public bloquearServicios: boolean;
  public validacionOxigeno = false;
  public bloquearCondiciones = false;
  private ciudadesSubscripcion: Subscription = new Subscription();
  private disableCiudad: boolean;
  private disableNombreCiudador: boolean;
  private disablePacienteAcepta: boolean;
  private disableNombreResponsable: boolean;

  constructor(
    private fb: FormBuilder,
    private datosAtencionService: DatosAtencionService,
    private dialog: MatDialog,
    private mensajesService: MensajesService,
    private remisionServices: RemisionServices,
    private remisionService: RemisionContenedorService,
    private agregadoRemision: AgregadosRemisionService,
    private capturaDeErroresService: CapturarErrores,
    private router: Router,
    private informeUseCase: InformesUsecase,
  ) {
    this.getCiudades();
    this.crearFormulario();
    this.suscribirFormulario();
  }

  ngOnInit() {
    this.initDatos();
    this.getDatos();
    // this.findInvalidControls(this.formulario);
  }

  ngAfterContentChecked() {
    this.desactivarDireccion();
  }

  ngOnDestroy() {
    this.ciudadesSubscripcion.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.formulario.valueChanges.subscribe(formulario => {
      if (this.agregadoRemision.remision.aceptaIngresoVoluntario) {
        this.mensajesService.mostrarMensajeExito(
          'Debe llenar todos los campos requeridos'
        );
      } else {
        this.continuar.emit(formulario.valid);
        // const ciudadPrincipal = this.datosAtencionViewModel.respuestaCiudades.filter(
        //   id => id.idCiudad === this.formulario.get("ciudad").value
        // );
        // if (formulario.ubicacion !== (undefined && null)) {
        //   formulario.ubicacion.ciudadPrincipal = ciudadPrincipal;
        // }
        this.datosAtencion.emit(formulario);
      }
    });
  }

  public activarOxigenoAmbulatorio($event) {
    if ($event.checked) {
      this.bloquearServicios = true;
      this.bloquearCondiciones = true;
      this.activarValidadorOxigeno();
    } else {
      this.bloquearServicios = false;
      this.bloquearCondiciones = false;
      this.quitarValidadorOxigeno();
    }
  }

  public limpiarCamposMunicipio() {
    this.formulario.get('barrio').setValue('');
    this.formulario.get('direccion').setValue('');
    this.formulario.get('municipio').setValue('');
    this.datosAtencionViewModel.respuestaUbicacion = null;
  }

  /**
   * Emite la ciudad seleccionada
   * @param evento
   */
  public emitirCiudad(evento): void {
    let ciudadPrincipal = null;
    if (evento) { //hubo cambio, quedo solo evento
      ciudadPrincipal = this.datosAtencionViewModel.respuestaCiudades.find(
        id => id.idCiudad === evento
      );

      console.log('ciudadPrincipal ', ciudadPrincipal);
      this.ciudad.emit(ciudadPrincipal.idCiudad);
    }
    const MUNICIPIO = new Municipio(null, null, null, null);
    const UBICACION = new Ubicacion(null, null, null, null,
      null, null, null, null, null, null, null,
      null, MUNICIPIO, null, ciudadPrincipal, null);
    this.suscribirFormulario(UBICACION);
  }

  /**
   * Realiza llamado al servicio
   */
  public getCiudades(): void {
    this.ciudadesSubscripcion = this.datosAtencionService
      .getCiudades()
      .subscribe(
        response => {
          this.datosAtencionViewModel.respuestaCiudades = response;
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
  public abrirModalDireccion(): void {
    if (
      this.formulario.get('ciudad').value === '' ||
      this.formulario.get('ciudad').value === undefined
    ) {
      this.mensajesService.mostrarMensajeError('Debes seleccionar una ciudad');
    } else {
      const ciudad = this.datosAtencionViewModel.respuestaCiudades.find(
        id => id.idCiudad === this.formulario.get('ciudad').value
      );
      if (ciudad !== undefined) {
        const dialogRef = this.dialog.open(ModalDireccionComponent, {
          width: '99%',
          disableClose: true,
          data: {
            ciudad: ciudad,
            barrio: this.formulario.get('barrio').value,
            direccion: this.formulario.get('direccion').value,
            municipio: this.formulario.get('municipio').value,
            ubicacion: this.datosAtencionViewModel.respuestaUbicacion,
            esDetalle: this.esDetalle,
            esNovedad: false
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            console.log('RESULT DIRECCION ', result);
            if (result.sinNomenclatura) {
              result.direccion = 'SIN NOMENCLATURA, ' + result.direccionComplementaria
              + ' - ' + result.informacionComplementaria;
              result.barrio = 'NO DISPONIBLE';
              this.formulario.get('direccion').setValue('SIN NOMENCLATURA, ' + result.direccionComplementaria
              + ' - ' + result.informacionComplementaria);
              this.formulario.get('barrio').setValue('NO DISPONIBLE');
            } else {
              console.log(result.direccion);
              this.formulario.get('barrio').setValue(result.barrio);
              this.formulario.get('direccion').setValue(result.direccion);
            }
            console.log(result.sinNomenclatura);
            result.ciudad = ciudad;
            this.suscribirFormulario(result);
            this.datosAtencionViewModel.respuestaUbicacion = result;
            this.datosAtencionViewModel.respuestaMunicipios.push(
              result.municipio
            );
            this.formulario.get('municipio').setValue(result.municipio);

          }
        });
      }
    }
  }

  /**
   * Cambia el campo del formulario
   * @param event
   */
  public cambiarCondicionPacienteAcepta(event): void {
    const valor = event.value;
    console.log(valor);
    if (valor) {
      this.formulario.get('condicionPacienteAcepta').setValue(valor);
      this.activarValidadorAcepta();
      this.formulario.controls['esOxigeno'].disable();
    } else {
      this.abrirModalCondicionPacienteAcepta();
      this.formulario.controls['esOxigeno'].enable();
      this.quitarValidadorOxigeno();
    }
  }

  /**
   * Cambia el campo del formulario
   * @param event
   */
  public cambiarCondicionServicios(event): void {
    const valor = event.value;
    this.formulario.get('condicionServicios').setValue(valor);
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

  private initDatos() {
    if (this.router.url === '/remision/nueva') {
    } else if (this.router.url === '/remision/editar') {
      this.getDatos();
      this.bloquearCampos();
      if (
        this.agregadoRemision.datosRemision !== undefined &&
        this.agregadoRemision.datosRemision !== null
      ) {
        console.log(this.agregadoRemision.remision.aceptaIngresoVoluntario);
        const idRemisionPk = this.agregadoRemision.datosRemision.idRemisionPK;
        this.datosPacienteRemision(idRemisionPk);
        if (
          !this.agregadoRemision.remision.esOxigeno &&
          !this.agregadoRemision.remision.aceptaIngresoVoluntario
        ) {
        } else if (this.agregadoRemision.remision.aceptaIngresoVoluntario) {
          this.datosAgregadosDatosAtencion();
        } else {
          this.datosAgregadoOxigeno();
        }
      }
    }
  }

  private datosPacienteRemision(idRemisionPk: string) {
    this.remisionServices.getagregadoDatosAtencion(idRemisionPk).subscribe(
      response => {
        this.datosAtencionViewModel.respuestaMunicipios.push(
          response['ubicacion'].municipio
        );
        this.formulario
          .get('municipio')
          .setValue(response['ubicacion'].municipio);
        this.formulario
          .get('direccion')
          .setValue(response['ubicacion'].direccion);

        // console.log("response[ubicacion]", response["ubicacion"]);

        this.formulario
          .get('ciudad')
          .setValue(response['ubicacion'].ciudadPrincipal.idCiudad);
        this.formulario
          .get('nombreCuidador')
          .setValue(response['nombreCuidador']);
        this.formulario
          .get('nombreResponsable')
          .setValue(response['nombreResponsable']);
        this.formulario
          .get('telefonoPaciente')
          .setValue(response['telefonoPaciente']);

        this.formulario
          .get('celularPaciente')
          .setValue(response['celularPaciente']);

        this.formulario
          .get('celularPaciente2')
          .setValue(response['celularPaciente2']);

        this.formulario.get('barrio').setValue(response['ubicacion'].barrio);
        if (this.agregadoRemision.remision) {
          if (
            this.remisionService.remision.estado ===
            EstadosRemisionEnum.ADMITIDO ||
            this.remisionService.remision.estado ===
            EstadosRemisionEnum.CANCELADO ||
            this.remisionService.remision.estado ===
            EstadosRemisionEnum.EGRESADO ||
            this.remisionService.remision.estado ===
            EstadosRemisionEnum.NO_ADMITIDO
          ) {
            this.esDetalle = true;
          } else {
            this.esDetalle = false;
          }
        }
        this.datosAtencionViewModel.respuestaUbicacion = response['ubicacion'];
        this.suscribirFormulario(
          this.datosAtencionViewModel.respuestaUbicacion
        );
        this.ciudad.emit(response['ubicacion'].ciudadPrincipal.idCiudad);
      },
      error => {
        this.capturaDeErroresService.mapearErrores(error.status, error.error);
      }
    );
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): DatosAtencionViewModel {
    return new DatosAtencionViewModel(
      null,
      '',
      '',
      '',
      null,
      null,
      [],
      [],
      new Ubicacion(
        0,
        0,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        null,
        '',
        null,
        null
      )
    );
  }

  /**
   * Obtiene los datos de atencion
   */
  private getDatos(): void {
    this.datosAtencionViewModel.placeholderTelefono = this.datosAtencionViewModel.mensajes.campos.telefonoPacienteRequerido;
    this.datosAtencionViewModel.placeholderCelular = this.datosAtencionViewModel.mensajes.campos.celularPaciente;
    this.datosAtencionViewModel.placeholderCelular2 = this.datosAtencionViewModel.mensajes.campos.celularPaciente2;
  }

  /**
   * Suscribe los cambios del
   * formulario
   */
  private suscribirFormulario(direccion?: any): void {
    this.formulario.valueChanges.subscribe(formulario => {
      this.continuar.emit(this.formulario.valid);
      formulario.ubicacion = direccion;
      const ciudadPrincipal = this.datosAtencionViewModel.respuestaCiudades.find(
        id => id.idCiudad === this.formulario.get('ciudad').value
      );
      formulario.ciudadPrincipal = ciudadPrincipal;
      this.datosAtencion.emit(formulario);
    });
  }

  /**
   * Desactiva el campo direccion
   */
  private desactivarDireccion(): void {
    const controlDireccion = this.formulario.get('direccion');
    controlDireccion.disable();
  }

  /**
   * Abre el modal
   */
  private abrirModalCondicionPacienteAcepta(): void {
    const dialogRef = this.dialog.open(ModalCondicionPacienteAceptaComponent, {
      width: '30%',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      result ? this.cerrarRemision() : this.reiniciarCondicionPacienteAcepta();
    });
  }

  /**
   * Reinicia el campo del formulario
   */
  private reiniciarCondicionPacienteAcepta(): void {
    this.formulario.get('condicionPacienteAcepta').reset();
    this.datosAtencionViewModel.condicionPacienteAcepta = null;
  }

  /**
   * Cierra la remision
   */
  private cerrarRemision(): void {
  }

  /**
   * Retorna valor de campo del formulario indicado
   * @param {string} nombreControl
   * @returns {string}
   */
  private obtenerValorFormulario(nombreControl: string): string {
    return this.formulario.get(nombreControl).value;
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formulario = this.fb.group({
      condicionPacienteAcepta: [
        {value: null, disabled: this.disablePacienteAcepta},
        Validators.compose([Validators.required])
      ],
      condicionServicios: [null, Validators.compose([Validators.required])],
      ciudad: [
        {value: '', disabled: this.disableCiudad},
        Validators.compose([Validators.required])
      ],
      barrio: [
        {value: '', disabled: true},
        Validators.compose([Validators.required])
      ],
      direccion: [{value: '', disabled: true}, Validators.compose([Validators.maxLength(64)])],
      nombreCuidador: [
        {value: '', disabled: this.disableNombreCiudador},
        Validators.compose([Validators.maxLength(100), Validators.required])
      ],
      nombreResponsable: [
        {value: '', disabled: this.disableNombreResponsable},
        Validators.compose([Validators.maxLength(100), Validators.required])
      ],
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
          Validators.required,
          Validators.minLength(10),
          Validators.pattern('[0-9]+')
        ])
      ],
      celularPaciente2: [
        '',
        Validators.compose([
          Validators.minLength(10),
          Validators.pattern('[0-9]+')
        ])
      ],
      municipio: [
        {value: '', disabled: true},
        Validators.compose([Validators.required])
      ],
      esOxigeno: [
        {value: '', disabled: this.validacionOxigeno},
        Validators.compose([Validators.required])
      ]
    });
  }

  private datosAgregadosDatosAtencion() {
    this.activarValidadorAcepta();
    this.formulario.controls['esOxigeno'].disable();
    if (
      !this.agregadoRemision.remision.aceptaIngresoVoluntario &&
      this.remisionService.remision.estado === EstadosRemisionEnum.NUEVO
    ) {
      this.formulario.get('condicionPacienteAcepta').setValue(null);
      this.datosAtencionViewModel.condicionPacienteAcepta = null;
    } else {
      this.formulario
        .get('condicionPacienteAcepta')
        .setValue(this.agregadoRemision.remision.aceptaIngresoVoluntario);
      this.datosAtencionViewModel.condicionPacienteAcepta = this.agregadoRemision.remision.aceptaIngresoVoluntario;
      this.formulario.get('condicionPacienteAcepta').clearValidators();
    }
    this.datosAtencionViewModel.condicionServicios = this.agregadoRemision.remision.tieneServiciosBasicos;
    this.formulario.get('condicionServicios').clearValidators();
    this.formulario
      .get('condicionServicios')
      .setValue(this.agregadoRemision.remision.tieneServiciosBasicos);
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
        this.formulario.controls['ciudad'].disable();
        this.formulario.controls['nombreCuidador'].disable();
        this.formulario.controls['nombreCuidador'].disable();
        this.formulario.controls['nombreResponsable'].disable();
        this.formulario.controls['condicionPacienteAcepta'].disable();
        this.formulario.controls['celularPaciente'].disable();
        this.formulario.controls['celularPaciente2'].disable();
        this.formulario.controls['telefonoPaciente'].disable();
        this.disableButton = true;
        this.bloquearServicios = true;
        this.validacionOxigeno = true;
      }
    }
  }

  private activarValidadorOxigeno() {
    this.formulario.get('condicionPacienteAcepta').clearValidators();
    this.formulario
      .get('condicionPacienteAcepta')
      .setValidators(Validators.compose([]));
    this.formulario.get('condicionPacienteAcepta').updateValueAndValidity();

    this.formulario.get('condicionServicios').clearValidators();
    this.formulario
      .get('condicionServicios')
      .setValidators(Validators.compose([]));
    this.formulario.get('condicionServicios').updateValueAndValidity();
    this.findInvalidControls(this.formulario);
  }

  private quitarValidadorOxigeno() {
    this.formulario.get('esOxigeno').setValue(null);
    this.formulario.get('esOxigeno').clearValidators();
    this.formulario
      .get('esOxigeno')
      .setValidators(Validators.compose([Validators.required]));
    this.formulario.get('esOxigeno').updateValueAndValidity();

    this.formulario.get('condicionPacienteAcepta').clearValidators();
    this.formulario
      .get('condicionPacienteAcepta')
      .setValidators(Validators.compose([Validators.required]));
    this.formulario.get('condicionPacienteAcepta').updateValueAndValidity();

    this.formulario.get('condicionServicios').clearValidators();
    this.formulario
      .get('condicionServicios')
      .setValidators(Validators.compose([Validators.required]));
    this.formulario.get('condicionServicios').updateValueAndValidity();
    this.formulario.get('condicionPacienteAcepta').setValue(null);
    this.findInvalidControls(this.formulario);
  }

  private activarValidadorAcepta() {
    this.formulario.get('esOxigeno').clearValidators();
    this.formulario.get('esOxigeno').setValidators(Validators.compose([]));
    this.formulario.get('esOxigeno').updateValueAndValidity();
    this.findInvalidControls(this.formulario);
  }

  private datosAgregadoOxigeno() {
    this.bloquearServicios = true;
    this.bloquearCondiciones = true;
    this.activarValidadorOxigeno();
    if (
      !this.agregadoRemision.remision.aceptaIngresoVoluntario &&
      this.remisionService.remision.estado === EstadosRemisionEnum.NUEVO
    ) {
      this.formulario.get('esOxigeno').setValue(null);
      this.datosAtencionViewModel.condicionPacienteAcepta = null;
    } else {
      this.formulario
        .get('esOxigeno')
        .setValue(this.agregadoRemision.remision.esOxigeno);
      this.datosAtencionViewModel.condicionPacienteAcepta = null;
      this.formulario.get('esOxigeno').clearValidators();
    }
    /* this.formulario.get('esOxigeno').clearValidators();
     this.formulario.get('esOxigeno')
       .setValue(this.agregadoRemision.remision.esOxigeno);
     this.formulario.get('condicionPacienteAcepta')
       .setValue(null);
     this.datosAtencionViewModel.condicionPacienteAcepta = null;*/
  }
}
