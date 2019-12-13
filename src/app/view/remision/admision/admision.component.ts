import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ɵConsole } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdmisionViewModel} from './admision.view-model';
import {Admision} from '../../../domain/model/remision/entity/admision.model';
import {AdmisionService} from '../../../domain/usecase/remision/admision.service';

import {MensajesService} from '../../../shared/services/mensajes.service';

import {ModalComponent} from './modal/modal.component';
import {MatDialog, /*getMatIconFailedToSanitizeError*/} from '@angular/material';
import {GuardarRemisionRequest} from '../../../infraestructure/request-model/GuardarRemisionRequest';
import {RemisionContenedorService} from '../../../domain/usecase/remision/remision-contenedor.service';
import {EstadosRemisionEnum} from '../../../shared/utils/enums/estados-remision.enum';
import {Router} from '@angular/router';
import {AgregadosRemisionService} from '../../../shared/services/agregados-remision.service';
import {RemisionServices} from '../../../domain/usecase/remision/remision.service';
import {Calendar} from 'primeng/primeng';
import {UsuarioService} from '../../../shared/services/usuario.service';
import {LoginUsecaseServices} from '../../../domain/usecase/seguridad/loginUsecase-services';
import {CapturarErrores} from '../../../shared/services/capturar-errores';
import {PlanManejoService} from '../../../domain/usecase/remision/plan-manejo.service';
import {ModalHorarioDisponibleComponent} from './modal-horario-disponible/modal-horario-disponible.component';
import {getLocaleDayPeriods} from '@angular/common';
import {ProgramacionCitaService} from '../../../domain/usecase/programacion/programacion-cita.service';


@Component({
  selector: 'sura-admision',
  templateUrl: './admision.component.html',
  styleUrls: ['./admision.component.scss']
})
export class AdmisionComponent implements OnInit, OnChanges {
  readonly esDomiciliario: any;
  @ViewChild('esEmpalme', { static: true }) esEmpalme: any;
  
  @Output()
  public continuar: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  public cargando: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  public admision: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  @Input('ciudad') ciudad: string;

  public formulario: FormGroup;
  public fechaMinimaCalendarioActual: Date = new Date();
  public isMedicamentos = true;
  public activeAmbulatorio = false;
  public configEspanolCalendario: any;
  public activeDomiciliario = false;
  public activeEmpalme = false;
  public activeButton = false;
  public admisionViewModel: AdmisionViewModel = this.iniciarViewModel();
  public fechaEmpalme: Date;
  public usuarioResponsable = '';
  public loading = false;
  public esEditar = false;
  private tipoAtencion = null;
  private guardarRemisionRequest = this.iniciarModelRemisionGuardar();
  public ocultarAdmision = false;

  constructor(private fb: FormBuilder,
              private admisionService: AdmisionService,
              private mensajesService: MensajesService,
              private dialog: MatDialog,
              private remisionService: RemisionContenedorService,
              private agregadoRemision: AgregadosRemisionService,
              private router: Router,
              private remisionServices: RemisionServices,
              private seguridadService: LoginUsecaseServices,
              private usuarioService: UsuarioService,
              private cdRef: ChangeDetectorRef,
              private capturaDeErroresService: CapturarErrores,
              private planManejoService: PlanManejoService,
              private programacionService: ProgramacionCitaService) {
    this.usuarioResponsable = this.usuarioService.InfoUsuario.username !== (undefined || null) ?
      this.usuarioService.InfoUsuario.username : this.admisionViewModel.admision.usuarioResponsable;
    this.getDatos();
    this.bloquearCampos();
    this.crearFormulario();
    this.configurarCalendario();
    this.admisionViewModel.admision.requiereEstadiaTemporal = false;
    this.getProgramas();
  }

  ngOnInit() {
    const recurso = 'api_ingreso/admitir';
    this.seguridadService.elUsuariotieneAcceso(recurso, 'POST').subscribe(
      valor => {
        if (valor === null || valor === false) {
          this.formulario.disable();
        }
        this.findInvalidControls(this.formulario);
        this.isDisponible();
      }
    );
  }

  public updateCalendarUI(calendar: Calendar) {
    calendar.updateUI();
  }

  public activarValidador(activar: any): void {
    const controlesRequeridosAmbulatorio = ['tipoAtencion', 'pisoAmbulatorio', 'fechaAdmision'];
    const controlesOpcionalesAmbulatorio = ['pisoDomiciliario', 'programa', 'fechaEmpalme'];
    const controlesRequeridosDomiciliario = ['pisoDomiciliario', 'programa', 'tipoAtencion', 'fechaAdmision'];
    const controlesOpcionalesDomiciliario = ['fechaEmpalme', 'pisoAmbulatorio'];
    if (activar) {
      this.cambiarValidadoresFormularioARequerido(controlesRequeridosDomiciliario);
      this.cambiarValidadoresFormularioAOpcional(controlesOpcionalesDomiciliario);
    } else {
      this.cambiarValidadoresFormularioARequerido(controlesRequeridosAmbulatorio);
      this.cambiarValidadoresFormularioAOpcional(controlesOpcionalesAmbulatorio);
    }
    this.findInvalidControls(this.formulario);
    this.getPisos(activar);
  }

  public activarValidadores(activar: any): void {
    const controlesEmpalmeRequerido = ['fechaEmpalme'];
    const controlesOpcionalesEmpalme = ['pisoDomiciliario', 'programa', 'fechaEmpalme', 'programa', 'pisoDomiciliario'];
    const controlesRequeridosNoEmpalme = ['pisoDomiciliario', 'pisoAmbulatorio',
      'programa', 'tipoAtencion', 'fechaAdmision'];
    const controlesEmpalme = ['fechaEmpalme'];
    /*   const controlesEmpalme = ['fechaEmpalme'];
       const controlesAdmision = ['tipoAtencion', 'pisoDomiciliario', 'pisoAmbulatorio', 'programa'];*/
    if (activar.checked) {
      this.cambiarValidadoresFormularioARequerido(controlesEmpalmeRequerido);
      this.cambiarValidadoresFormularioAOpcional(controlesOpcionalesEmpalme);
    } else {
      this.cambiarValidadoresFormularioARequerido(controlesRequeridosNoEmpalme);
      this.cambiarValidadoresFormularioAOpcional(controlesEmpalme);
    }
    this.findInvalidControls(this.formulario);
    this.getPisos(activar);
  }

  public findInvalidControls(formulario: FormGroup) {
    const invalid = [];
    const controls = formulario.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
  }

  /**
   * Convierte el campo celular en obligatorio u opcional
   * @param {boolean} obligatorio
   */
  public activarValidadoresTipoAtencion(activar: any): void {
    this.tipoAtencion = activar.value;
    const controlesRequeridosAmbulatorio = ['tipoAtencion', 'pisoAmbulatorio', 'fechaAdmision'];
    const controlesOpcionalesAmbulatorio = ['pisoDomiciliario', 'programa', 'fechaEmpalme'];
    const controlesRequeridosDomiciliario = ['pisoDomiciliario', 'programa', 'tipoAtencion', 'fechaAdmision'];
    const controlesOpcionalesDomiciliario = ['fechaEmpalme', 'pisoAmbulatorio'];
    if (activar.value) {
      this.cambiarValidadoresFormularioARequerido(controlesRequeridosDomiciliario);
      this.cambiarValidadoresFormularioAOpcional(controlesOpcionalesDomiciliario);
    } else {
      this.cambiarValidadoresFormularioARequerido(controlesRequeridosAmbulatorio);
      this.cambiarValidadoresFormularioAOpcional(controlesOpcionalesAmbulatorio);
    }
    this.findInvalidControls(this.formulario);
    this.getPisos(activar.value);
  }

  public verSedes(): boolean {
    return this.formulario.get('pisoAmbulatorio').value === this.admisionViewModel.mensajes.campos.idSedeClinicaHeridas;
  }

  public modificarInfoUbicacionPaciente(info: any): void {
    this.formulario.get('sede').setValue(info);
  }

  /**
   * Abre el modal
   */
  public abrirModalCentroEstadia(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '80%',
      disableClose: true,
      data: {ciudad: this.ciudad}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.admisionViewModel.admision.requiereEstadiaTemporal = result.marcar;
      this.formulario.get('ubicacionCentro').setValue(result.ubicacion);
      this.formulario.get('estadiaTemporal').setValue(result.marcar);
    });
  }

  /**
   * Realiza llamado al servicio
   */
  public getPisos(ambulatorio: boolean): void {
    this.cargando.emit(true);
    let TIPO_ATENCION;
    if (!ambulatorio) {
      TIPO_ATENCION = this.admisionViewModel.mensajes.campos.tipoAtencionAmbulatoria;
      this.admisionViewModel.idPrograma = this.admisionViewModel.mensajes.campos.tipoAtencionAmbulatoria;
    } else {
      TIPO_ATENCION = this.admisionViewModel.mensajes.campos.tipoAtencionDomiciliario;
    }
    this.admisionService.getPisosAdmision(this.ciudad, TIPO_ATENCION, this.admisionViewModel.idPrograma)
      .subscribe(
        response => {
          this.admisionViewModel.respuestaPisos = response;
        },
        error => {
          this.mensajesService.mostrarMensajeError(error.message);
        },
        () => {
          this.cargando.emit(false);
        }
      );
  }

  public seleccionPrograma(idPrograma) {
    const pisoDomiciliario = true;
    this.admisionViewModel.idPrograma = idPrograma;
    this.getPisos(pisoDomiciliario);
  }

  public enviarEmpalme() {
    if (this.remisionService.remision.estado === EstadosRemisionEnum.PENDIENTE_ADMITIR) {
      const estado = EstadosRemisionEnum.EMPALME;
      this.formulario.value.empalme = this.esEmpalme.checked;
      this.continuar.emit(this.formulario.valid);
      this.admision.emit(this.formulario.value);
      this.remisionService.obtenerRemision(estado);
    }
  }

  public admitir(tipo: any) {
    console.log('tipo', tipo);
    this.ocultarAdmision = false;
    const validarFecha: Date = this.formulario.get('fechaAdmision').value;
    const fechaActual = new Date();
    if (Date.parse(validarFecha.toLocaleDateString()) < Date.parse(fechaActual.toLocaleDateString())) {
      this.mensajesService.mostrarMensajeError('Debes ingresar una fecha a partir del día de hoy');
    } else {
      if (this.remisionService.remision.estado === EstadosRemisionEnum.PENDIENTE_ADMITIR
        || this.remisionService.remision.estado === EstadosRemisionEnum.EMPALME) {
        if (this.formulario.controls['tipoAtencion'].value) {
          this.guardarDomiciliario(tipo);
        } else {
          this.guardarAmbulatorio();
        }
      }
    }
  }

  private guardarDomiciliario(tipo: string) {

    const mensaje = 'Se admitió la remisión correctamente';
    const estado = tipo === 'admitir' ? EstadosRemisionEnum.ADMITIDO : EstadosRemisionEnum.PENDIENTE_ADMITIR;
    this.validarUsuarioObtenerRemision(estado, mensaje, tipo);
  }

  private validarUsuarioObtenerRemision(estado: string, mensaje: any, tipo: any) {
    const usuario = this.usuarioService.InfoUsuario;

    if (
      usuario !== null &&
      usuario !== undefined &&
      usuario.isAuthenticated !== null &&
      usuario.username !== null &&
      usuario.fullName !== null
    ) {
      this.remisionService.obtenerRemision(estado, mensaje, usuario, tipo);
    } else {
      this.seguridadService.datosUsuarioLogueado().subscribe(
        infoUsuario => {
          this.remisionService.obtenerRemision(estado, mensaje, infoUsuario, tipo);
        },
        error => {
          this.mensajesService.mostrarMensajeError(
            this.admisionViewModel.mensajes.errores.mensajeErrorCargarUsuario
          );
        },
        () => {
        }
      );
    }
  }

  /* public verificar_Disponibilidad(){
     console.log("disponibilidad de citas")
     this.programacionService.getDisponibilidadCitas(data).subscribe(
       disponibilidad => {
         console.log(disponibilidad)

       }
     )
     console.log("disponibilidad")
     this.remisionService.obtenerRemisionDisponibilidad();
     }


   }*/

  public cargarSedes(piso: any): void {
    if (piso === this.admisionViewModel.mensajes.campos.idSedeClinicaHeridas) {
      this.cambiarValidadoresFormularioARequerido(['sede']);
      this.getSedes(this.ciudad);
    } else {
      this.cambiarValidadoresFormularioAOpcional(['sede']);
      this.formulario.get('sede').setValue(null);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes ', changes);
    this.cdRef.detectChanges();
    this.formulario.valueChanges.subscribe(
      formulario => {
        console.log(formulario);
        if (this.tipoAtencion) {
          const piso = this.admisionViewModel.respuestaPisos.find(value =>
            value.idPiso === this.formulario.controls['pisoDomiciliario'].value
          );
          const programa = this.admisionViewModel.respuestaProgramas.find(value =>
            value.idPrograma === this.formulario.controls['programa'].value);
          const usuarioResponsable = this.admisionViewModel.admision.usuarioResponsable;
          if (piso) {
            formulario.pisoDomiciliario = piso;
            formulario.piso = piso;
          }
          if (programa) {
            formulario.programaValidador = programa;
            formulario.programa = programa;
          }
          if (this.formulario.controls['tipoAtencion'].value) {
            this.tipoAtencion = this.formulario.controls['tipoAtencion'].value;
            formulario.esDomiciliario = this.formulario.controls['tipoAtencion'].value;
          }
          if (usuarioResponsable) {
            formulario.usuarioResponsable = this.formulario.controls['usuarioResponsable'].value;
          }
          formulario.pisoAmbulatorio = null;
          this.admisionViewModel.tipoAtencionSeleccionado = this.formulario.controls['tipoAtencion'].value;
          this.admisionViewModel.admision.usuarioResponsable = this.formulario.controls['usuarioResponsable'].value;
          console.log('this.admisionViewModel.admision.usuarioResponsable ', this.admisionViewModel.admision.usuarioResponsable);
          this.continuar.emit(this.formulario.valid);
          this.admision.emit(formulario);
          console.log(this.admision);
        } else if (this.tipoAtencion !== null && !this.tipoAtencion) {
          this.tipoAtencion = this.formulario.controls['tipoAtencion'].value;
          this.admisionViewModel.tipoAtencionSeleccionado = this.formulario.controls['tipoAtencion'].value;
          const piso = this.admisionViewModel.respuestaPisos.filter(value =>
            value.idPiso === this.formulario.controls['pisoAmbulatorio'].value
          );
          if (piso) {
            formulario.pisoAmbulatorio = piso['0'];
            formulario.piso = piso['0'];
          }
          const usuarioResponsable = this.admisionViewModel.admision.usuarioResponsable;
          formulario.programa = null;
          formulario.pisoDomiciliario = null;
          if (this.formulario.controls['pisoAmbulatorio'].value ===
            this.admisionViewModel.mensajes.campos.idSedeClinicaHeridas) {
            const sede = this.admisionViewModel.respuestaSedes.find(value =>
              value.id === this.formulario.controls['sede'].value
            );
            formulario.sede = sede;
          }
          if (usuarioResponsable) {
            formulario.usuarioResponsable = this.formulario.controls['usuarioResponsable'].value;
          }
          this.admisionViewModel.admision.usuarioResponsable = this.formulario.controls['usuarioResponsable'].value;
          this.continuar.emit(this.formulario.valid);
          this.admision.emit(formulario);
        }
      }
    );
  }

  public openDialogDisponibilidad(): void {

    let dialogRef = this.dialog.open(ModalHorarioDisponibleComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }


  /**
   * Inicializa el modelo de guardar Remision Request
   *
   * @returns {GuardarRemisionRequest}
   */
  private iniciarModelRemisionGuardar(): GuardarRemisionRequest {
    return new GuardarRemisionRequest(
      null,
      null,
      null,
      null,
      null,
      null,
      null);
  }

  /**
   * Obtiene los datos Maestros
   */
  private getDatos(): void {
    if (this.router.url === '/remision/nueva') {

    } else if (this.router.url === '/remision/editar') {
      if (this.agregadoRemision.datosRemision !== undefined && this.agregadoRemision.datosRemision !== null) {
        if (this.agregadoRemision.datosRemision.idRemisionPK !== undefined
          && this.agregadoRemision.datosRemision.idRemisionPK !== null) {
          //const idRemisionPk = this.agregadoRemision.datosRemision.idRemisionPK;
          const idRemisionPK = this.remisionService.remision['idRemisionPK'];
          console.log('remision en la parte de arriba',idRemisionPK);
          this.consultarAgregadoAdmision(idRemisionPK);
        } else {
          this.router.navigate(['/']);
        }
      }
    }
  }

  private consultarAgregadoAdmision(idRemisionPk: string) {
    console.log('la remision para hoy',idRemisionPk)
    this.loading = true;
    if (this.remisionService.remision) {
      if (this.remisionService.remision.estado === EstadosRemisionEnum.EMPALME) {
        this.activeEmpalme = true;
      }
      if (this.remisionService.remision.estado === EstadosRemisionEnum.ADMITIDO ||
        this.remisionService.remision.estado === EstadosRemisionEnum.PENDIENTE_ADMITIR ||
        this.remisionService.remision.estado === EstadosRemisionEnum.EGRESADO ||
        this.remisionService.remision.estado === EstadosRemisionEnum.EMPALME) {
        this.remisionServices.getAgregadoAdmision(idRemisionPk)
          .subscribe(admision => {
            console.log('admision ', admision);
            this.loading = false;
            this.tipoAtencion = admision.esDomiciliario;
            if (admision.programa !== null) {
              this.admisionViewModel.idPrograma = admision.programa.idPrograma ? admision.programa.idPrograma : '';
            }
            this.cargarAgregados(admision);
            this.getSedes(this.ciudad);
            this.usuarioResponsable = admision.usuarioResponsable;
          }, error => {
            this.loading = false;
            this.capturaDeErroresService.mapearErrores(error.status, error.error);
          });
      }
    }

  }

  /**
   * Cambia los validadores del formulario
   * @param {string} nombrecontrol
   * @param {number} numeroDigitos
   */
  private cambiarValidadoresFormularioARequerido(controles: string[]): void {
    for (let i = 0; i < controles.length; i++) {
      this.formulario.get(controles[i]).clearValidators();
      this.formulario.get(controles[i]).setValidators(
        Validators.compose([
          Validators.required
        ])
      );
      this.formulario.get(controles[i]).updateValueAndValidity();
    }
  }

  /**
   * Cambia los validadores del formulario
   * @param {string} nombrecontrol
   * @param {number} numeroDigitos
   */
  private cambiarValidadoresFormularioAOpcional(controles: string[]): void {
    for (let i = 0; i < controles.length; i++) {
      this.formulario.get(controles[i]).clearValidators();
      this.formulario.get(controles[i]).setValidators(
        Validators.compose([])
      );
      this.formulario.get(controles[i]).updateValueAndValidity();
    }
  }


  private guardarAmbulatorio() {
    const mensaje = 'Se admitió la remisión correctamente';
    const estado = EstadosRemisionEnum.ADMITIDO;
    // this.remisionService.obtenerRemision(estado);
    this.validarUsuarioObtenerRemision(estado, mensaje, null);
  }


  /**
   * Realiza llamado al servicio
   */
  private getSedes(ciudad: string): void {
    this.cargando.emit(true);
    this.admisionService.getSedes(ciudad)
      .subscribe(
        response => {
          this.admisionViewModel.respuestaSedes = response;
        },
        error => {
          this.mensajesService.mostrarMensajeError(error.message);
        },
        () => {
          this.cargando.emit(false);
        }
      );
  }

  /**
   * Realiza llamado al servicio
   */
  private getProgramas(): void {
    this.cargando.emit(true);
    this.admisionService.getProgramas()
      .subscribe(
        response => {
          this.admisionViewModel.respuestaProgramas = response;
        },
        error => {
          this.mensajesService.mostrarMensajeError(error.message);
        },
        () => {
          this.cargando.emit(false);
        }
      );
  }

  private cargarAgregados(admision: any) {
    if (admision.esDomiciliario) {
      console.log('admision.esDomiciliario ', admision);
      this.tipoAtencion = admision.esDomiciliario;
      this.getPisos(admision.esDomiciliario);
      this.activarValidador(admision.esDomiciliario);
      this.formulario.patchValue({
        programa: admision && admision.programa ? admision.programa.idPrograma : null,
        programaValidador: admision ? admision.programa : null,
        pisoDomiciliario: admision && admision.piso ? admision.piso.idPiso : null,
        piso: admision.piso,
        tipoAtencion: admision.esDomiciliario,
        gestionAdmision: admision.gestionAdmision,
        fechaAdmision: admision && admision.fechaAdmision ? new Date(admision.fechaAdmision) : null,
        usuarioResponsable: admision.usarioResponsable
      });
      this.admisionViewModel.idPrograma = admision ? admision.programa.idPrograma : null;

      this.admision.emit(admision);
      this.continuar.emit(this.formulario.valid);
    } else if (admision && !admision.esDomiciliario) {
      this.getPisos(admision.esDomiciliario);
      if (admision.piso) {
        this.formulario.get('pisoAmbulatorio').setValue(admision.piso.idPiso);
        if (admision.piso.idPiso === this.admisionViewModel.mensajes.campos.idSedeClinicaHeridas) {
          this.formulario.get('sede').setValue(admision.sede.id);
          this.verSedes();
        }
      }
      this.activarValidador(admision.esDomiciliario);
      this.formulario.get('gestionAdmision').setValue(admision.gestionAdmision);
      this.formulario.get('fechaAdmision').setValue(new Date(admision.fechaAdmision));
      this.formulario.controls['tipoAtencion'].setValue(admision.esDomiciliario);
      this.tipoAtencion = admision.esDomiciliario;
      this.admision.emit(admision);
      this.continuar.emit(this.formulario.valid);
    }
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formulario = this.fb.group({
      fechaEmpalme: ['', Validators.compose([
        Validators.required
      ])],
      empalme: [],
      fechaAdmision: [{value: '', disabled: this.activeDomiciliario}, Validators.compose([
        Validators.required
      ])],
      estadiaTemporal: [false],
      tipoAtencion: ['', Validators.compose([
        Validators.required])],
      pisoDomiciliario: [{value: '', disabled: this.activeDomiciliario}, Validators.compose([
        Validators.required])],
      pisoAmbulatorio: [{value: '', disabled: this.activeAmbulatorio}, Validators.compose([])],
      sede: [{value: null, disabled: this.activeAmbulatorio}, Validators.compose([])],
      programa: [{value: '', disabled: this.activeDomiciliario}, Validators.compose([
        Validators.required])],
      gestionAdmision: [{value: '', disabled: this.activeDomiciliario}],
      esDomiciliario: [],
      ubicacionCentro: [],
      piso: [],
      programaValidador: [],
      usuarioResponsable: [{value: this.usuarioResponsable, disabled: true}, Validators.compose([
        Validators.required])]
    });
  }

  private bloquearCampos() {
    if (this.remisionService.remision) {
      if (this.remisionService.remision.estado === 'ADMITIDO' ||
        this.remisionService.remision.estado === 'EGRESADO') {
        this.activeAmbulatorio = true;
        this.activeDomiciliario = true;
        this.activeEmpalme = true;
        this.activeButton = true;
      }
    }
  }

  private configurarCalendario(): void {
    this.configEspanolCalendario = {
      firstDayOfWeek: 0,
      dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre',
        'octubre', 'noviembre', 'diciembre'],
      monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      today: 'Hoy',
      clear: 'Borrar'
    };
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): AdmisionViewModel {
    const fechaInicial: Date = new Date();
    fechaInicial.setDate(fechaInicial.getDate() + 1);
    const fechaFinal: Date = new Date();
    fechaFinal.setDate(fechaFinal.getDate() + 8);
    // @ts-ignore
    return new AdmisionViewModel(
      null,
      true,
      [],
      null,
      [],
      [],
      false,
      fechaInicial,
      fechaFinal,
      null,
      new Admision(
        null,
        new Date(),
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        false),
      null,
    );
  }

  private isDisponible() {
    this.isMedicamentos = true;
    this.ocultarAdmision = false;

    const idRemision = this.remisionService.remision['idRemisionPK'];
    console.log('este es el id', idRemision);
    const estado = this.remisionService.remision['estado'];
    this.planManejoService.getPlanManejoAgregado(idRemision).subscribe(
      planManejo => {
        console.log('este es le plan de manejo', planManejo);
        for (const i in planManejo.tratamientos) {
          if (planManejo.tratamientos[i].tratamiento == 'MEDICAMENTOS' && estado == 'PENDIENTE_ADMITIR') {
            this.isMedicamentos = false;
            this.ocultarAdmision = true;
          } else {
            this.ocultarAdmision = false;
          }
        }
      }, err => {
        this.capturaDeErroresService.mapearErrores(err.status, err.error);
        console.log('ERROR1');
      }
    );
    console.log('disable ', this.isMedicamentos);
  }

}


