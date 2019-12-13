import {AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import * as moment from 'moment';
import {ModalGestionEquipoBiomedicoViewModel} from './modal-gestion-equipo-biomedico.view-model';
import {MensajesService} from '../../../../shared/services/mensajes.service';
import {GestionEquipoBiomedicoService} from '../../../../domain/usecase/equipoBiomedico/gestion-equipo-biomedico.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {GestionEquipoBiomedicoComponent} from '../gestion-equipo-biomedico.component';
import {EquipoBiomedico} from '../../../../domain/model/novedad/entity/equipo-biomedico.model';
import {EquipoBiomedicoService} from '../../../../domain/usecase/novedad/equipo-biomedico.service';
import {ModalConfirmacionComponent} from '../../../../shared/components/modal-confirmacion/modal-confirmacion.component';
import {ModalConfirmacion} from '../../../../shared/models/modal-confirmacion.model';
import {CapturarErrores} from '../../../../shared/services/capturar-errores';
import {UsuarioService} from '../../../../shared/services/usuario.service';

moment.locale('es');

@Component({
  selector: 'sura-modal-gestion-equipo-biomedico',
  templateUrl: './modal-gestion-equipo-biomedico.component.html',
  styleUrls: ['./modal-gestion-equipo-biomedico.component.scss']
})
export class ModalGestionEquipoBiomedicoComponent implements OnInit, OnDestroy, AfterViewInit {
  public configEspanolCalendario: any;
  public modalGestionEquipoBiomedicoViewModel: ModalGestionEquipoBiomedicoViewModel = this.iniciarViewModel();
  public formulario: FormGroup;
  public fechaInicio: any;
  public equiposBiomedicos: Array<any>;
  private proveedoresSubscripcion = new Subscription();
  private estadosSubscripcion = new Subscription();
  private solicitudEquipoBiomedicoSubscripcion = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<GestionEquipoBiomedicoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private mensajesService: MensajesService,
    private gestionEquipoBiomedicoService: GestionEquipoBiomedicoService,
    private equipoBiomedicoService: EquipoBiomedicoService,
    public cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private capturaDeErroresService: CapturarErrores,
    private usuarioService: UsuarioService,
  ) {
    this.crearFormulario();
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {
    this.configurarCalendario();
    this.getDatos();
    console.log('data biomedico ', this.data);
    this.verEdicion(this.data.equipoBiomedico);
  }

  ngOnDestroy() {
    this.proveedoresSubscripcion.unsubscribe();
    this.estadosSubscripcion.unsubscribe();
  }

  verEdicion(data: EquipoBiomedico) {
    console.log('data.tipoEquipo ', data.tipoEquipo);
    console.log('data.proveedor ', data.proveedor);
    console.log('this.data.esDetalle ', this.data.esDetalle);
    this.formulario.get('remision').setValue(data.idRemision);
    this.formulario.get('tipoDocumento').setValue(data.tipoIdentificacion.idTipo);
    this.formulario.get('numeroDocumento').setValue(data.numeroIdentificacion);
    this.formulario.get('fechaRegistro').setValue(moment(data.fechaRegistro).format('DD-MMMM-YYYY, hh:mm A'));
    this.formulario.get('nivelIngreso').setValue(data.cobertura);
    this.formulario.get('direccion').setValue(data.direccion);
    this.formulario.get('telefono').setValue(data.telefono);
    this.formulario.get('equipoBiomedico').setValue(data.tipoEquipo.descripcion);
    this.formulario.get('fechaInicio').setValue(data.fechaInicio != null ? new Date(data.fechaInicio)
      : new Date(data.fechaRegistro));
    this.formulario.controls['fechaFin'].setValue(data.fechaFin != null ? new Date(data.fechaFin) : null);
    this.formulario.get('usuario').setValue(data.usuario.username);
    if (data.proveedor != null) {
      this.formulario.get('proveedor').setValue(data.proveedor.idProveedor);
      this.formulario.get('proveedor').disable();
      this.formulario.get('fechaInicio').disable();
      this.formulario.get('fechaFin').disable();
      this.formulario.get('equipoBiomedico').setValue(data.tipoEquipo.descripcion);
    }
    if (data.fechaInicio != null) {
      this.formulario.get('equipoBiomedico').disable();
    }
    if (this.data.esDetalle) {
      this.getEstados('0');
      this.formulario.get('nota').setValue(data.nota);
      this.formulario.get('estado').setValue(data.estado.idEstado);
      this.formulario.get('proveedor').setValue(data.proveedor ? data.proveedor.idProveedor : '');
      this.formulario.get('equipoBiomedico').setValue(data.tipoEquipo.descripcion);
    }
  }

  public guardar(): void {
    console.log('GUARDAR ');
    if (this.formulario.valid) {
      console.log('this.data ', this.data.equipoBiomedico);

      const TIPO_EQUIPO_SELECCIONADO = this.data.equipoBiomedico.tipoEquipo.id !== '' ? this.data.equipoBiomedico.tipoEquipo
        : this.equiposBiomedicos.find(eq => eq.idEquipoBioMedico === this.formulario.controls['equipoBiomedico'].value);
      console.log('TIPO_EQUIPO_SELECCIONADO ', TIPO_EQUIPO_SELECCIONADO);

      const ESTADO = this.modalGestionEquipoBiomedicoViewModel.respuestaEstados.find(
        s => s.idEstado === this.formulario.controls['estado'].value
      );
      const PROVEEDOR = this.modalGestionEquipoBiomedicoViewModel.respuestaProveedores.find(
        s => s.idProveedor === this.formulario.controls['proveedor'].value
      );
      const DESCRIPCION = this.data.equipoBiomedico.tipoEquipo.descripcion;
      const EQUIPO_BIOMEDICO = new EquipoBiomedico(
        this.data.equipoBiomedico.id,
        this.data.equipoBiomedico.idRemision,
        this.data.equipoBiomedico.tipoIdentificacion,
        this.data.equipoBiomedico.numeroIdentificacion,
        TIPO_EQUIPO_SELECCIONADO,
        this.formulario.get('fechaInicio').value,
        this.formulario.get('fechaFin').value,
        this.data.equipoBiomedico.fechaRegistro,
        this.formulario.get('nota').value,
        ESTADO,
        PROVEEDOR,
        this.data.equipoBiomedico.ciudad,
        this.usuarioService.InfoUsuario,
        this.data.equipoBiomedico.telefono,
        this.data.equipoBiomedico.cobertura,
        true,
        this.data.equipoBiomedico.direccion,
        this.data.equipoBiomedico.esEliminado,
        DESCRIPCION,
      );

      console.log(EQUIPO_BIOMEDICO);

      console.log('REQUEST - Solicitud Equipo Biomédico: ', JSON.stringify(EQUIPO_BIOMEDICO));
      this.confirmarCambioEstadoEquipoBiomedico(EQUIPO_BIOMEDICO);
    } else {
      this.validarTodosLosCamposDelFormulario(this.formulario);
    }
  }

  public solicitarEquipos(equipoBiomedico: EquipoBiomedico): void {
    const LISTA_EQUIPO_BIOMEDICO: EquipoBiomedico[] = [];
    LISTA_EQUIPO_BIOMEDICO.push(equipoBiomedico);

    this.solicitudEquipoBiomedicoSubscripcion = this.equipoBiomedicoService
      .solicitarEquipoBiomedico(LISTA_EQUIPO_BIOMEDICO)
      .subscribe(
        response => {
          console.log('RESPONSE - Solicitud Equipo ', response);
          this.mensajesService.mostrarMensajeExito(
            this.modalGestionEquipoBiomedicoViewModel.mensajes.mensajesAlerta
              .exitoGestionarEquipo
          );
          this.cerrarModal(this.data.esDetalle);
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
          this.solicitudEquipoBiomedicoSubscripcion.unsubscribe();
        }
      );
  }

  public cerrarModal(esDetalle: boolean): void {
    esDetalle = esDetalle === undefined ? true : false;
    this.dialogRef.close(esDetalle);
  }

  /**
   *
   */
  public confirmarCambioEstadoEquipoBiomedico(equipoBiomedico: EquipoBiomedico): void {
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      width: '30%',
      disableClose: false,
      data: new ModalConfirmacion(
        this.modalGestionEquipoBiomedicoViewModel.mensajes.mensajesAlerta.tituloConfirmarCambioEstado,
        this.modalGestionEquipoBiomedicoViewModel.mensajes.mensajesAlerta.contenidoConfirmarCambioEstado
      )
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data === true) {
        this.solicitarEquipos(equipoBiomedico);
      }
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

  public cambioEstado($event) {
    console.log($event);
    const estadoCancelado = '5';
    this.cambiarProveedorValidator($event === estadoCancelado);
  }

  private getDatos(): void {
    this.getEquipos();
    this.getProveedores();
    this.getEstados(
      this.data.esDetalle ? '0' : this.data.equipoBiomedico.estado.idEstado
    );
  }

  /**
   * Obtiene los proveedores
   */
  private getProveedores(): void {
    this.proveedoresSubscripcion = this.gestionEquipoBiomedicoService
      .getProveedores()
      .subscribe(
        response => {
          this.modalGestionEquipoBiomedicoViewModel.respuestaProveedores = response;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
        }
      );
  }

  /**
   * Obtiene los estados de los equipos biomédicos
   */
  private getEstados(idEstado: string): void {
    console.log(this.usuarioService.InfoUsuario.username);
    this.estadosSubscripcion = this.gestionEquipoBiomedicoService
      .getEstados(idEstado, this.usuarioService.InfoUsuario.username)
      .subscribe(
        response => {
          this.modalGestionEquipoBiomedicoViewModel.respuestaEstados = response;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
        }
      );
  }

  /**
   * Obtiene los equipos biomédicos
   */
  private getEquipos(): void {
    this.estadosSubscripcion = this.gestionEquipoBiomedicoService.getTipoEquiposBiomedicos()
      .subscribe(
        response => {
          this.equiposBiomedicos = response;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
        }
      );
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): ModalGestionEquipoBiomedicoViewModel {
    return new ModalGestionEquipoBiomedicoViewModel(null, null, [], []);
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formulario = this.fb.group({
      remision: [
        {value: null, disabled: true},
        Validators.compose([Validators.maxLength(20)])
      ],
      tipoDocumento: [
        {value: null, disabled: true},
        Validators.compose([Validators.maxLength(20)])
      ],
      numeroDocumento: [
        {value: null, disabled: true},
        Validators.compose([
          Validators.maxLength(15),
          Validators.pattern('[0-9]+')
        ])
      ],
      equipoBiomedico: [
        {value: null, disabled: this.data.esDetalle},
        Validators.compose([Validators.required])
      ],
      fechaRegistro: [{value: null, disabled: true}],
      nivelIngreso: [
        {value: null, disabled: true},
        Validators.compose([Validators.maxLength(20)])
      ],
      direccion: [
        {value: null, disabled: true},
        Validators.compose([Validators.maxLength(200)])
      ],
      telefono: [
        {value: null, disabled: true},
        Validators.compose([Validators.maxLength(60)])
      ],
      fechaInicio: [{value: null, disabled: this.data.esDetalle}],
      fechaFin: [{value: null, disabled: this.data.esDetalle}],
      usuario: [
        {value: null, disabled: true},
        Validators.compose([Validators.maxLength(15)])
      ],
      nota: [
        {value: null, disabled: this.data.esDetalle},
        Validators.compose([Validators.required, Validators.maxLength(4000)])
      ],
      estado: [
        {value: null, disabled: this.data.esDetalle},
        Validators.compose([Validators.required])
      ],
      proveedor: [
        {value: null, disabled: this.data.esDetalle},
        Validators.compose([Validators.required])
      ]
    });
  }

  /**
   * Cambia required del campo proveedor
   */
  private cambiarProveedorValidator(cancelado: boolean) {
    console.log('cancelado ', cancelado);
    console.log('proveedor ', this.formulario.get('proveedor'));
    if (!cancelado) {
      this.formulario.get('proveedor').setValidators(Validators.required);
    } else {
      this.formulario.get('proveedor').clearValidators();
    }
    this.formulario.get('proveedor').updateValueAndValidity();
    console.log('proveedor ', this.formulario.get('proveedor'));
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
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
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
