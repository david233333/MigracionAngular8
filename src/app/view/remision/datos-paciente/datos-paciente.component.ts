import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChange} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';

import {DatosPacienteService} from '../../../domain/usecase/remision/datos-paciente.service';
import {DatosPacienteViewModel} from './datos-paciente.view-model';
import {MensajesService} from '../../../shared/services/mensajes.service';
import {Paciente} from '../../../domain/model/remision/entity/paciente.model';
import {RemisionContenedorService} from '../../../domain/usecase/remision/remision-contenedor.service';
import {Router} from '@angular/router';
import {AgregadosRemisionService} from '../../../shared/services/agregados-remision.service';
import {MatDialog} from '@angular/material';
import {PacModalComponent} from './pac-modal/pac-modal.component';
import {TipoIdentificacion} from '../../../domain/model/maestro/entity/tipo-identificacion.model';
import {ModalBebeCanguroComponent} from './modal-bebe-canguro/modal-bebe-canguro.component';
import {BebeCanguro} from '../../../domain/model/remision/entity/plan-manejo/valoraciones/bebe-canguro.model';
import {ModalConfirmacionComponent} from '../../../shared/components/modal-confirmacion/modal-confirmacion.component';
import {ModalConfirmacion} from '../../../shared/models/modal-confirmacion.model';
import {EstadosRemisionEnum} from '../../../shared/utils/enums/estados-remision.enum';
import {RemisionServices} from '../../../domain/usecase/remision/remision.service';
import {CapturarErrores} from '../../../shared/services/capturar-errores';
import {TipoIdentificacionModel} from '../../../domain/model/remision/entity/tipo-identificacion.model';

@Component({
  selector: 'sura-datos-paciente',
  templateUrl: './datos-paciente.component.html',
  styleUrls: ['./datos-paciente.component.scss']
})
export class DatosPacienteComponent implements OnInit, OnDestroy, OnChanges {
  @Input('tiposIdentificacion')
  public tiposIdentificacion: TipoIdentificacion[];

  @Output()
  public hide: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  public continuar: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  public datosPaciente: EventEmitter<Paciente> = new EventEmitter<Paciente>();

  @Output()
  public edadPaciente: EventEmitter<number> = new EventEmitter<number>();

  public tiposIdentificacionSubscripcion = new Subscription();

  public configEspanolCalendario: any;

  public fechaNacimiento: Date = new Date();

  public formulario: FormGroup;

  public formulario2: FormGroup;

  public sexo: string[] = ['Ambos', 'Desconocido', 'Femenino', 'Masculino'];
  public estadoCivil: string[] = ['Ninguno', 'Soltero (a)', 'Casado (a)', 'Viudo (a)', 'Separado (a)', 'Union Libre', 'Religioso (a)', 'Sin informacion', 'Desconocido'];

  public first: any;

  public datosPacienteViewModel: DatosPacienteViewModel = this.iniciarViewModel();
  public disableButton: boolean;
  public mostrarTablaPacientes = false;
  public mostrarTablaPacienteManual = false;
  public columnasBebeCanguro: any[];
  public loading = false;
  private datosPacienteSubscripcion = new Subscription();
  private planSaludSubscripcion = new Subscription();
  private tiposPlanesSaludSubscripcion = new Subscription();
  private tiposPlanSaludParticular = new Subscription();
  private remisionServicesSubscribe = new Subscription();
  private disableTipoDocumento: boolean;
  private disableNumeroDocumento: boolean;
  private disablePlanSalud: boolean;
  private tipoPlanParticular;
  private codigoARL;
  private planSaludObject;


  constructor(private fb: FormBuilder,
              private datosPacienteService: DatosPacienteService,
              private mensajesService: MensajesService,
              private remisionContenedorService: RemisionContenedorService,
              private router: Router,
              private dialog: MatDialog,
              private remisionServices: RemisionServices,
              private agregadoRemision: AgregadosRemisionService,
              private capturaDeErroresService: CapturarErrores) {
    this.crearFormulario();
    this.generarColumnasBebeCanguro();
    this.suscribirFormulario();

  }

  ngOnInit() {
    this.getDatos();
    this.initDatos();
    this.configurarCalendario();
  }

  ngOnDestroy() {
    this.datosPacienteSubscripcion.unsubscribe();
    this.planSaludSubscripcion.unsubscribe();
    this.tiposPlanesSaludSubscripcion.unsubscribe();
    this.tiposIdentificacionSubscripcion.unsubscribe();
    this.remisionServicesSubscribe.unsubscribe();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

    this.formulario.valueChanges.subscribe(
      () => {
        /* this.datosPaciente.emit(this.datosPacienteViewModel.respuestaDatosPaciente);*/
      }
    );
  }

  public planParticularSelected($event) {//hubo cambios, y quedo solo event
    this.tipoPlanParticular = this.datosPacienteViewModel.respuestaSaludParticular
      .filter(value => value.idTipoPlanParticular === $event);
  }

  public mostrarCamposPlan($event) { //hubo cambios, y quedo solo event
    console.log($event);
    if ($event === '3') {
      this.datosPacienteViewModel.mostrarTipoPlanSalud = true;
    } else {
      this.datosPacienteViewModel.mostrarTipoPlanSalud = false;
    }
    this.planSaludObject = this.datosPacienteViewModel.respuestaPlanesSalud
      .filter(value => value.idPlan === $event);

    console.log(this.planSaludObject);

    this.datosPacienteViewModel.respuestaDatosPaciente = new Paciente(null, null, null, null,
      null, null, null, null, null, null, null,
      null, null, null, null, null, null,
      null, null, null, null, null, null, null, null);
    this.datosPaciente.emit(this.datosPacienteViewModel.respuestaDatosPaciente);
    this.tipoPlanParticular = null;
    this.limpiarCampo('codigoARL');
    this.limpiarCampo('tipoPlanSalud');
  }

  /**
   * Busca la informacion del paciente
   */
  public buscar(): void {
    /* this.datosPaciente.emit(this.datosPacienteViewModel.datosPacientes);*/
    const tipoDocumento = this.formulario.get('tipoDocumento').value;

    const documento = this.formulario.get('numeroDocumento').value;
    const planSalud = this.formulario.get('planSalud').value;
    if (tipoDocumento !== '' && documento !== '' && planSalud !== '') {
      this.getDatosPaciente(planSalud, tipoDocumento, documento);
    } else {
      this.mensajesService.mostrarMensajeError('Debes ingresar los campos requeridos');
    }

  }

  public crearPacienteManual(): void {
    this.actulaizarValidadoresFormulario2(1);
    console.log(this.formulario2.get('fechaNacimientoPaciente').value.getTime());
    if (this.formulario2.valid) {

      let unidadesEdad = 'Años';
      let edad;
      const fechaActual = new Date();
      const fechaNacimiento = this.formulario2.get('fechaNacimientoPaciente').value;
      const fechaDeNacimientoTimeStamp = this.formulario2.get('fechaNacimientoPaciente').value.getTime();
      const mesesEntreFechas = this.mesesEntreFechas(fechaNacimiento);
      let codigoArl = null;


      if (this.planSaludObject[0].idPlan === '7') {

        codigoArl = this.formulario.get('codigoARL').value;
      }

      edad = mesesEntreFechas;

      if (mesesEntreFechas === 0) {
        edad = (fechaActual.getMonth() - fechaNacimiento.getMonth());
        if (edad < 0) {
          edad *= -1;
        }
        unidadesEdad = 'Meses';
      }


      const paciente = new Paciente(null,
        this.formulario2.get('nombrePacienteManual').value,
        this.formulario2.get('apellidoPacienteManual').value,
        new TipoIdentificacionModel('', '', '',
          this.formulario.get('tipoDocumento').value, ''),
        this.formulario.get('numeroDocumento').value,
        '' + fechaDeNacimientoTimeStamp,
        '' + edad,
        this.formulario2.get('sexoPacienteManual').value,
        this.formulario2.get('estadoCivilManual').value,
        this.tipoPlanParticular ? this.tipoPlanParticular[0] : null,
        null,
        this.formulario2.get('emailPacienteManual').value,
        null,
        null, false, null,
        this.planSaludObject[0], null, null,
        null, unidadesEdad, null, codigoArl, null, null,
        this.formulario2.get('nombreQuienAutoriza').value
      );


      this.continuar.emit(this.formulario2.valid);
      this.datosPaciente.emit(paciente);
      this.actulaizarValidadoresFormulario2(2);
      console.log(paciente);
    } else {
      this.capturaDeErroresService.mapearErrores(500, 'Ingrese todos los campos requeridos');
    }
  }

  public mesesEntreFechas(fechaNacimiento: Date): number {

    const diff_ms = Date.now() - fechaNacimiento.getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);

  }

  public verBebeCanguro(): void {
    this.abrirModalBebeCanguro();
  }

  public verBotonBebeCanguro(): void {

    if (this.remisionContenedorService.remision) {

      const ESTADO_NO_PERMITIDO = this.remisionContenedorService.remision.estado === EstadosRemisionEnum.ADMITIDO ||
        this.remisionContenedorService.remision.estado === EstadosRemisionEnum.CANCELADO ||
        this.remisionContenedorService.remision.estado === EstadosRemisionEnum.EGRESADO ||
        this.remisionContenedorService.remision.estado === EstadosRemisionEnum.NO_ADMITIDO;

      if (ESTADO_NO_PERMITIDO && this.datosPacienteViewModel.bebeCanguro.length > 0) {
        this.datosPacienteViewModel.verBotonBebeCanguro = false;
        this.datosPacienteViewModel.verTablaBebeCanguro = true;
        return;
      } else if (ESTADO_NO_PERMITIDO && this.datosPacienteViewModel.bebeCanguro.length === 0) {
        this.datosPacienteViewModel.verBotonBebeCanguro = false;
        this.datosPacienteViewModel.verTablaBebeCanguro = false;
        return;
      } else if (!ESTADO_NO_PERMITIDO && this.datosPacienteViewModel.bebeCanguro.length > 0) {
        this.datosPacienteViewModel.verBotonBebeCanguro = false;
        this.datosPacienteViewModel.verTablaBebeCanguro = true;
        return;
      } else {
        this.datosPacienteViewModel.verBotonBebeCanguro = true;
        this.datosPacienteViewModel.verTablaBebeCanguro = false;
      }
    }
  }

  /**
   * Elimina la valoración bebé canguro de la lista y tabla
   * @param {BebeCanguro} bebeCanguro
   */
  public eliminarBebeCanguro(bebeCanguro: BebeCanguro): void {

    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      width: '30%',
      disableClose: false,
      data: new ModalConfirmacion(this.datosPacienteViewModel.mensajes.bebeCanguro.titulos.tituloEliminarBebeCanguro,
        this.datosPacienteViewModel.mensajes.bebeCanguro.titulos.contenidoEliminarBebeCanguro)
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data === true) {
        this.datosPacienteViewModel.bebeCanguro.splice(0, 1);
        this.actualizarBebeCanguro();
        this.verBotonBebeCanguro();
      }
    });
  }

  /**
   * Edita la valoración bebé canguro de la lista y tabla
   * @param {BebeCanguro} bebeCanguro
   */
  public editarBebeCanguro(bebeCanguro: BebeCanguro): void {

    const BEBE_CANGURO = new BebeCanguro(bebeCanguro.id, bebeCanguro.fechaNacimiento, bebeCanguro.pesoNacimiento,
      bebeCanguro.edadGestacionalSemanas, bebeCanguro.edadGestacionalDias, bebeCanguro.pesoAlta);

    const dialogRef = this.dialog.open(ModalBebeCanguroComponent, {
      width: '90%',
      disableClose: false,
      data: BEBE_CANGURO
    });

    dialogRef.afterClosed().subscribe(data => {

      if (data && data.id) {
        data.id = bebeCanguro.id;
        const index = this.datosPacienteViewModel.bebeCanguro.findIndex(elemento =>
          elemento.id === data.id
        );
        if (index !== null && index !== undefined && index !== -1) {
          this.datosPacienteViewModel.bebeCanguro[index] = data;
        }
        this.actualizarBebeCanguro();
      }
    });
  }

  /**
   * Realiza llamado al servicio
   * @param {string} planSalud
   * @param {string} tipoDocumento
   * @param {string} documento
   */

  public getDatosPaciente(planSalud: string, tipoDocumento: string, documento: string): void {
    this.loading = true;
    this.datosPacienteSubscripcion =
      this.datosPacienteService.getDatosPaciente(planSalud, tipoDocumento, documento)
        .subscribe(
          (response) => {
            this.mostrarTablaPacienteManual = false;
            this.datosPacienteViewModel.respuestaDatosPaciente = response;
            console.log(response);
            this.mostrarColumnas();
            response ? this.datosPaciente.emit(response) : this.datosPaciente.emit(null);
            this.consultarPac();
            this.validarEdadPaciente(response);
            this.mostrarTablaPacientes = true;
            if (this.datosPacienteViewModel.mostrarCodigoARL) {
              this.datosPacienteViewModel.respuestaDatosPaciente.codigoARL = this.formulario.get('codigoARL').value;
            }
            if (this.tipoPlanParticular) {
              if (this.tipoPlanParticular[0]) {
                this.datosPacienteViewModel.respuestaDatosPaciente.tipoPlanParticular = this.tipoPlanParticular[0];
              }
            }
            console.log('aleluya', this.datosPacienteViewModel);
            this.continuar.emit(this.formulario.valid);
            this.datosPaciente.emit(this.datosPacienteViewModel.respuestaDatosPaciente);
            this.verBotonBebeCanguro();
            this.loading = false;
          },
          error => {

            if ((error.error !== 'El Paciente no tiene cobertura' && error.error !== 'El Paciente ya tiene una remisión activa') || (
              error.error === 'El Paciente no tiene cobertura' && this.tipoPlanParticular[0].idTipoPlanParticular === '1'
            )) {

              this.mostrarTablaPacienteManual = true;
              this.loading = false;
            } else {
              this.mostrarTablaPacienteManual = false;
              this.loading = false;
              this.capturaDeErroresService.mapearErrores(error.status, error.error);
            }

          },

          () => {
          }
        );
  }

  private actulaizarValidadoresFormulario2(opc: number): void {

    if (opc === 1) {
      this.formulario2.get('nombrePacienteManual').setValidators([Validators.required]);
      this.formulario2.get('apellidoPacienteManual').setValidators([Validators.required]);
      this.formulario2.get('sexoPacienteManual').setValidators([Validators.required]);
      this.formulario2.get('estadoCivilManual').setValidators([Validators.required]);
      this.formulario2.get('emailPacienteManual').setValidators([Validators.required, Validators.email]);
      this.formulario2.get('nombreQuienAutoriza').setValidators([Validators.required]);
    } else {
      this.formulario2.get('nombrePacienteManual').setValidators([]);
      this.formulario2.get('apellidoPacienteManual').setValidators([]);
      this.formulario2.get('sexoPacienteManual').setValidators([]);
      this.formulario2.get('estadoCivilManual').setValidators([]);
      this.formulario2.get('emailPacienteManual').setValidators([]);
      this.formulario2.get('nombreQuienAutoriza').setValidators([]);
    }

    this.formulario2.get('nombrePacienteManual').updateValueAndValidity();
    this.formulario2.get('apellidoPacienteManual').updateValueAndValidity();
    this.formulario2.get('sexoPacienteManual').updateValueAndValidity();
    this.formulario2.get('estadoCivilManual').updateValueAndValidity();
    this.formulario2.get('emailPacienteManual').updateValueAndValidity();
    this.formulario2.get('nombreQuienAutoriza').updateValueAndValidity();

  }

  /**
   * Hace la peticion al servidor si no hay datos al iniciar la aplicacion
   * con un evento
   *
   */
  public getTiposIdentificacion(): void {
    if (this.datosPacienteViewModel.respuestaTiposIdentificacion === null ||
      this.datosPacienteViewModel.respuestaTiposIdentificacion) {
      this.tiposIdentificacionSubscripcion =
        this.remisionContenedorService.getTiposIdentificacion()
          .subscribe(
            response => {
              this.datosPacienteViewModel.respuestaTiposIdentificacion = response;
            },
            error => {
              this.capturaDeErroresService.mapearErrores(error.status, error.error);
            },
            () => {
            }
          );
    }

  }

  /**
   * Realiza llamado al servicio
   */
  public getPlanesSalud(): void {
    if (this.datosPacienteViewModel.respuestaPlanesSalud === null ||
      this.datosPacienteViewModel.respuestaPlanesSalud.length < 0) {
      this.initPlanesDeSalud();
    }
  }

  /**
   *Pone vacio el campo pasado
   *
   */

  private limpiarCampo(nombreCampo: string) {
    this.formulario.get(nombreCampo).setValue('');
  }

  /**
   * Inicializa la aplicacion dependiendo del end point
   *
   */
  private initDatos() {
    this.bloquearCampos();
    if (this.router.url === '/remision/nueva') {
      // this.datosPaciente.emit(this.datosPacienteViewModel.datosPacientes);
      /*this.datosPacienteService.getPac(this.formulario.get('tipoDocumento').value.idTipo,
        this.formulario.get('numeroDocumento').value)
        .subscribe(datos => { });*/
      /* this.mostrarColumnas();*/
      /*this.consultarPac();*/
    } else if (this.router.url === '/remision/editar') {
      if (this.agregadoRemision.datosRemision !== undefined && this.agregadoRemision.datosRemision !== null) {
        const idRemisionPk = this.agregadoRemision.datosRemision.idRemisionPK;
        this.remisionServicesSubscribe = this.remisionServices.getagregadoPaciente(idRemisionPk)
          .subscribe(paciente => {
            this.mostrarTablaPacientes = true;
            this.datosPacienteViewModel.mostrarTipoPlanSalud = paciente.tipoAfiliacion.idPlan === '3';
            this.formulario.controls['tipoDocumento'].disable();
            this.formulario.controls['numeroDocumento'].disable();
            this.formulario.controls['planSalud'].disable();
            this.formulario.controls['tipoPlanSalud'].disable();
            this.formulario.controls['codigoARL'].disable();
            this.disableButton = true;
            this.datosPacienteViewModel.bebeCanguro = paciente.bebeCanguro;
            this.formulario.get('tipoDocumento').setValue
            (paciente.tipoIdentificacion.idTipo || '');
            this.formulario.get('numeroDocumento').setValue
            (paciente.numeroIdentificacion || '');
            this.formulario.get('planSalud').setValue
            (paciente.tipoAfiliacion.idPlan || '');
            if (paciente.tipoPlanParticular) {
              this.formulario.get('tipoPlanSalud').setValue
              (paciente.tipoPlanParticular.idTipoPlanParticular || '');
            }
            this.formulario.get('codigoARL').setValue
            (paciente.codigoARL || '');
            this.agregadoRemision.datosPaciente = paciente;
            this.datosPacienteViewModel.respuestaDatosPaciente = paciente;
            this.datosPaciente.emit(paciente);
            this.mostrarColumnas();
            this.continuar.emit(this.formulario.valid);
          }, error => {
            this.capturaDeErroresService.mapearErrores(error.status, error.error);
          });
      }
    }
  }

  /**
   * Obtiene los datos del paciente
   */
  private getDatos(): void {
    this.gettipoPlanSaludParticular();
    this.getTiposIdentificacion();
    this.initPlanesDeSalud();
  }

  /**
   *Suscribe los cambios del formulario
   */
  private suscribirFormulario(): void {
    this.formulario.valueChanges.subscribe(
      formulario => {

        this.mostrarCampos(formulario);
        this.limpiarDatosPaciente();
        if (this.router.url === '/remision/nueva') {
          this.mostrarTablaPacientes = false;
        }
        this.datosPaciente.emit(null);
      }
    );
    this.formulario.get('planSalud').valueChanges.subscribe(
      valor => {
        this.cambiarValidezCampoTipoPlanSaludCodigoARL(this.datosPacienteViewModel.mostrarTipoPlanSalud, 'tipoPlanSalud');
        this.cambiarValidezCampoTipoPlanSaludCodigoARL(this.datosPacienteViewModel.mostrarCodigoARL, 'codigoARL');
      }
    );
  }

  /**
   * Muestra u oculta los campos ARL y Particular
   */
  private mostrarCampos(formulario: any): void {
    this.datosPacienteViewModel.mostrarCodigoARL =
      this.formulario.get('planSalud').value === this.datosPacienteViewModel.mensajes.campos.idTipoPlanSaludArl;
    // this.datosPacienteViewModel.mostrarTipoPlanSalud = formulario.planSalud === '3';
  }

  /**
   * Cambia los validadores del tipo de plan de salud o código de autorización para ARL
   */

  private cambiarValidezCampoTipoPlanSaludCodigoARL(mostrarCampo: boolean, campoFormulario: string): void {
    if (mostrarCampo === true) {
      this.formulario.get(campoFormulario).setValidators(
        Validators.compose([Validators.required])
      );
    } else {
      this.formulario.get(campoFormulario).clearValidators();
    }
    this.formulario.get(campoFormulario).updateValueAndValidity();
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): DatosPacienteViewModel {
    return new DatosPacienteViewModel(
      null,
      false,
      null,
      new Paciente(null, null, null, null, null,
        null, null, null, null, null, null, null,
        null, null, null, null,
        null, null, null, null, null, null,
        null, null, null
      ),
      [],
      [],
      [],
      null,
      null,
      null,
      [],
      '',
      [],
      true,
      false,
      false);
  }

  /**
   * Limpia los datos del paciente al cambiar datos del formulario
   */
  private limpiarDatosPaciente(): void {
    this.datosPacienteViewModel.respuestaDatosPaciente = new Paciente(null,
      null, null, null, null, null,
      null, null, null, null, null, null,
      null, null, null, null,
      null, null, null, null, null, null,
      null, null, null
    );
  }

  /**
   * Abre el modal de valoraciones
   */
  private abrirModalBebeCanguro(): void {
    const dialogRef = this.dialog.open(ModalBebeCanguroComponent, {
      width: '90%',
      disableClose: false,
      data: null
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data !== undefined) {
        this.agregarBebeCanguro(data);
      }
    });
  }

  /**
   * Agrega la valoración tipo bebé canguro a la tabla
   * @param {BebeCanguro} bebeCanguro
   */
  private agregarBebeCanguro(bebeCanguro: BebeCanguro): void {
    if (bebeCanguro) {
      this.datosPacienteViewModel.bebeCanguro.push(bebeCanguro);
    }
    this.actualizarBebeCanguro();
    this.verBotonBebeCanguro();
  }

  /**
   * Actualiza la valoración tipo bebé canguro del formulario
   */
  private actualizarBebeCanguro(): void {
    this.datosPacienteViewModel.respuestaDatosPaciente.bebeCanguro = this.datosPacienteViewModel.bebeCanguro;
    this.formulario.get('bebeCanguro').setValue(this.datosPacienteViewModel.bebeCanguro);
  }

  /**
   * Genera columnas para la tabla de valoraciones - Bebé canguro
   */
  private generarColumnasBebeCanguro(): void {
    this.columnasBebeCanguro = [
      {
        field: this.datosPacienteViewModel.mensajes.bebeCanguro.tabla.fechaNacimientoCampo,
        header: this.datosPacienteViewModel.mensajes.bebeCanguro.tabla.fechaNacimiento
      },
      {
        field: this.datosPacienteViewModel.mensajes.bebeCanguro.tabla.pesoNacimientoCampo,
        header: this.datosPacienteViewModel.mensajes.bebeCanguro.tabla.pesoNacimiento
      },
      {
        field: this.datosPacienteViewModel.mensajes.bebeCanguro.tabla.edadGestacionalSemanasCampo,
        header: this.datosPacienteViewModel.mensajes.bebeCanguro.tabla.edadGestacionalSemanas
      },
      {
        field: this.datosPacienteViewModel.mensajes.bebeCanguro.tabla.edadGestacionalDiasCampo,
        header: this.datosPacienteViewModel.mensajes.bebeCanguro.tabla.edadGestacionalDias
      },
      {
        field: this.datosPacienteViewModel.mensajes.bebeCanguro.tabla.pesoAltaCampo,
        header: this.datosPacienteViewModel.mensajes.bebeCanguro.tabla.pesoAlta
      },
    ];
  }

  /**
   * Valida la edad del paciente
   * @param {Paciente} datos
   */
  private validarEdadPaciente(datos: Paciente): void {
    if (datos && datos.edad) {
      this.edadPaciente.emit(+datos.edad);
    }
  }

  private gettipoPlanSaludParticular(): void {
    this.tiposPlanSaludParticular = this.datosPacienteService.getTipoPlanParticular()
      .subscribe(planParticular => {
        this.datosPacienteViewModel.respuestaSaludParticular = planParticular;
      });

  }

  /**
   * Inicializar plan de salud
   */
  private initPlanesDeSalud() {
    this.planSaludSubscripcion =
      this.datosPacienteService.getPlanesSalud()
        .subscribe(
          response => {
            this.datosPacienteViewModel.respuestaPlanesSalud = response;
          },
          error => {
            this.capturaDeErroresService.mapearErrores(error.status, error.error);
          },
          () => {

          }
        );
  }

  /**
   * Muestra u oculta las columnas
   */
  private mostrarColumnas(): void {
    this.datosPacienteViewModel.mostrarColumnaAfiliacion = this.mostrarColumnasAfiliacion();
    this.datosPacienteViewModel.mostrarColumnaAsegurador = this.mostrarColumnasAsegurador();
  }

  /**
   * Indica si se muestra o no la columna
   * @returns {boolean}
   */
  private mostrarColumnasAsegurador(): boolean {
    const datos = this.datosPacienteViewModel.respuestaDatosPaciente;
    let mostrar = false;

    if (datos) {
      mostrar =

        datos.tipoAsegurador && datos.tipoAsegurador !== '' ||
        datos.estadoSuspension && datos.estadoSuspension !== '' ||
        datos.coberturaDomiciliaria && datos.coberturaDomiciliaria !== null ||
        datos.fechaLimiteCobertura && datos.fechaLimiteCobertura !== '';
    }

    return mostrar;
  }

  /**
   * Indica si se muestra o no la columna
   * @returns {boolean}
   */
  private mostrarColumnasAfiliacion(): boolean {
    const datos = this.datosPacienteViewModel.respuestaDatosPaciente;
    let mostrar = false;

    if (datos) {
      mostrar =
        datos.tipoAfiliacion && datos.tipoAfiliacion !== '' ||
        datos.nivelIngreso && datos.nivelIngreso !== '' ||
        datos.ipsBasicaAsignada && datos.ipsBasicaAsignada !== '' ||
        datos.lugarAtencion && datos.lugarAtencion !== '';

    }

    return mostrar;
  }


  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formulario = this.fb.group({
      tipoDocumento: [{value: '', disabled: this.disableTipoDocumento}, Validators.required],
      numeroDocumento: [{value: '', disabled: this.disableNumeroDocumento},
        Validators.compose([
          Validators.required,
          Validators.maxLength(20),
         Validators.pattern('([0-9a-zA-Z]{1,20})')
         // Validators.pattern('([0-9]{1,20})')
        ])
      ],
      planSalud: [{value: '', disabled: this.disablePlanSalud}, Validators.compose([Validators.required])],
      codigoARL: ['', Validators.compose([])],
      tipoPlanSalud: ['', Validators.compose([])],
      bebeCanguro: [null, Validators.compose([])],
    });

    this.formulario2 = this.fb.group({
      nombrePacienteManual: [''],
      fechaNacimientoPaciente: [''],
      sexoPacienteManual: [''],
      estadoCivilManual: [''],
      emailPacienteManual: [''],
      nombreQuienAutoriza: [''],
      apellidoPacienteManual: ['']
    });


  }

  private consultarPac() {
    this.datosPacienteService.getPac(this.formulario.get('tipoDocumento').value,
      this.formulario.get('numeroDocumento').value)
      .subscribe(pac => {
        const hide = false;
        pac.hide = hide;
        this.datosPacienteService.pact = pac;
        const dialogRef = this.dialog.open(PacModalComponent, {
          width: '50%',
          height: '98%',
          disableClose: true,
          data: pac
        });
        dialogRef.afterClosed().subscribe(result => {
          this.datosPacienteService.pact.hide = result;
          console.log('resultado oac', result);
          this.hide.emit(result);
        });
      }, error1 => {
      });
  }

  private bloquearCampos() {
    if (this.remisionContenedorService.remision) {
      if (this.remisionContenedorService.remision.estado === EstadosRemisionEnum.ADMITIDO ||
        this.remisionContenedorService.remision.estado === EstadosRemisionEnum.CANCELADO ||
        this.remisionContenedorService.remision.estado === EstadosRemisionEnum.EGRESADO ||
        this.remisionContenedorService.remision.estado === EstadosRemisionEnum.NO_ADMITIDO) {
        this.datosPacienteViewModel.verColumnaAccionCanguro = !this.datosPacienteViewModel.verColumnaAccionCanguro;
        this.disableButton = true;
      }
    }
  }

  private configurarCalendario(): void {
    this.configEspanolCalendario = {
      firstDayOfWeek: 1,
      dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      today: 'Hoy',
      clear: 'Borrar'
    };
  }

}
