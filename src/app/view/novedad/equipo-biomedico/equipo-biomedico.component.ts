import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import * as moment from 'moment';
import {MensajesService} from '../../../shared/services/mensajes.service';
import {AgregadosNovedadService} from '../../../shared/services/agregados-novedad.service';
import {EquipoBiomedicoViewModel} from './equipo-biomedico.view-model';
import {EquipoBiomedicoService} from '../../../domain/usecase/novedad/equipo-biomedico.service';
import {EquipoBiomedico} from '../../../domain/model/novedad/entity/equipo-biomedico.model';
import {Guid} from 'guid-typescript';
import {TipoIdentificacion} from '../../../domain/model/maestro/entity/tipo-identificacion.model';
import {Ciudad} from '../../../domain/model/maestro/entity/ciudad.model';
import {EstadosEquipoBiomedicoEnum} from '../../../shared/utils/enums/estados-equipo-biomedico.enum';
import {EstadoEquipoBiomedico} from '../../../domain/model/maestro/entity/estado-equipo-biomedico.model';
import {UsuarioService} from '../../../shared/services/usuario.service';
import {CapturarErrores} from '../../../shared/services/capturar-errores';
import {ModalEquiposBiomedicosCancelarComponent} from './modal-equipos-biomedicos-cancelar/modal-equipos-biomedicos-cancelar.component';
import {MatDialog} from '@angular/material';

moment.locale('es');

@Component({
  selector: 'sura-novedad-equipo-biomedico',
  templateUrl: './equipo-biomedico.component.html',
  styleUrls: ['./equipo-biomedico.component.scss']
})
export class EquipoBiomedicoComponent implements OnInit, OnDestroy {
  public columnasEquiposBiomedicos: any[];
  public equipoBiomedicoViewModel: EquipoBiomedicoViewModel = this.iniciarViewModel();
  public formularioEquipoBiomedico: FormGroup;
  public configEspanolCalendario: any;
  public fechaMinimaEquipo: Date;
  public fechaMaximaEquipo: Date;
  @Output()
  public regresarPrincipal: EventEmitter<boolean> = new EventEmitter<boolean>();
  private tipoEquiposBiomedicosSubscripcion = new Subscription();
  private equiposBiomedicosSubscripcion: Subscription = new Subscription();
  private solicitudEquipoBiomedicoSubscripcion: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private equipoBiomedicoService: EquipoBiomedicoService,
    private mensajesService: MensajesService,
    private infoRemisionNovedad: AgregadosNovedadService,
    private usuarioService: UsuarioService,
    private capturaDeErroresService: CapturarErrores,
    private dialog: MatDialog,
  ) {
    this.crearFormularioEquipoBiomedico();
    this.configurarMinimaFechaActual();
  }

  ngOnInit(): void {
    this.configurarCalendario();
    this.getDatos();
    this.generarColumnas();
  }

  ngOnDestroy() {
    this.tipoEquiposBiomedicosSubscripcion.unsubscribe();
    this.equiposBiomedicosSubscripcion.unsubscribe();
    this.solicitudEquipoBiomedicoSubscripcion.unsubscribe();
  }

  public habilitarGuardar(): boolean {
    return this.equipoBiomedicoViewModel.equiposBiomedicos.length > 0
      ? false
      : true;
  }

  public seleccionTipoEquipo(value: any) {
    if (
      value ===
      this.equipoBiomedicoViewModel.mensajes.equipos.idEquipoCilindroPortatil
    ) {
    }
    this.formularioEquipoBiomedico.controls['fechaInicio'].setValue(null);
    this.formularioEquipoBiomedico.controls['fechaFin'].setValue(null);
  }

  /**
   * Obtiene los tipos de equipos biomédicos
   */
  public getTiposEquipoBiomedico(): void {
    this.tipoEquiposBiomedicosSubscripcion = this.equipoBiomedicoService
      .getTiposEquiposBiomedicos()
      .subscribe(
        response => {
          this.equipoBiomedicoViewModel.respuestaTipoEquipos = response;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
        }
      );
  }

  public agregarProgramacion(esEdicion: boolean): void {
    this.findInvalidControls(this.formularioEquipoBiomedico);
    this.controlesRequeridosProgramacion();
    if (this.formularioEquipoBiomedico.valid) {
      const TIPO_EQUIPO_SELECCIONADO = this.equipoBiomedicoViewModel.respuestaTipoEquipos.find(
        s =>
          s.idEquipoBioMedico ===
          this.formularioEquipoBiomedico.controls['tipoEquipoBiomedico'].value
      );

      console.log(
        'this.infoRemisionNovedad.datosRemision ',
        this.infoRemisionNovedad.datosRemision
      );

      const PROGRAMACION = new EquipoBiomedico(
        Guid.create().toString(),
        this.infoRemisionNovedad.datosRemision.idRemision,
        new TipoIdentificacion(
          this.infoRemisionNovedad.datosRemision.tipoIdentificacion.id,
          this.infoRemisionNovedad.datosRemision.tipoIdentificacion.idTipo,
          this.infoRemisionNovedad.datosRemision.tipoIdentificacion.nombre,
          this.infoRemisionNovedad.datosRemision.tipoIdentificacion.codigoPos,
          this.infoRemisionNovedad.datosRemision.tipoIdentificacion.codigoSura
        ),
        this.infoRemisionNovedad.datosRemision.numeroIdentificacion,
        TIPO_EQUIPO_SELECCIONADO,
        this.formularioEquipoBiomedico.controls['fechaInicio'].value,
        this.formularioEquipoBiomedico.controls['fechaFin'].value,
        null,
        null,
        new EstadoEquipoBiomedico('1', 'Solicitado'),
        null,
        new Ciudad(
          this.infoRemisionNovedad.datosRemision.ciudad.id,
          this.infoRemisionNovedad.datosRemision.ciudad.idCiudad,
          this.infoRemisionNovedad.datosRemision.ciudad.nombre,
          this.infoRemisionNovedad.datosRemision.ciudad.codigoDANE,
          this.infoRemisionNovedad.datosRemision.ciudad.codigoIPS
        ),
        this.usuarioService.InfoUsuario,
        null,
        null,
        true,
        null,
        false,
        EstadosEquipoBiomedicoEnum.SOLICITADO
      );

      if (!esEdicion) {
        console.log(PROGRAMACION.tipoEquipo);
        const datoEquipos = this.equipoBiomedicoViewModel.equiposBiomedicos.findIndex(
          elemento => elemento.tipoEquipo.descripcion ===
            PROGRAMACION.tipoEquipo.descripcion && PROGRAMACION.estado.idEstado === elemento.estado.idEstado
        );
        console.log('datoEquipos ', datoEquipos);
        console.log('PROGRAMACION.estado.idEstado ', PROGRAMACION.estado.idEstado);

        const datoCilindro = this.equipoBiomedicoViewModel.equiposBiomedicos.findIndex(
          elemento => {
            console.log('elemento, ', elemento);
            return elemento.tipoEquipo.idEquipoBioMedico ===
              this.equipoBiomedicoViewModel.mensajes.equipos
                .idEquipoCilindroPortatil &&
              ((PROGRAMACION.fechaInicio >= elemento.fechaInicio &&
                PROGRAMACION.fechaFin <= elemento.fechaFin) ||
                (PROGRAMACION.fechaInicio <= elemento.fechaInicio &&
                  PROGRAMACION.fechaFin >= elemento.fechaInicio) ||
                (PROGRAMACION.fechaInicio >= elemento.fechaInicio &&
                  PROGRAMACION.fechaFin >= elemento.fechaFin));

          }
        );
        console.log('datoCilindro ', datoCilindro);

        if (datoEquipos === -1) {
          this.equipoBiomedicoViewModel.equiposBiomedicos.push(PROGRAMACION);
          this.equipoBiomedicoViewModel.equiposBiomedicosTabla.push(
            PROGRAMACION
          );
        } else if (
          PROGRAMACION.tipoEquipo.idEquipoBioMedico ===
          this.equipoBiomedicoViewModel.mensajes.equipos
            .idEquipoCilindroPortatil &&
          datoCilindro === -1
        ) {
          this.equipoBiomedicoViewModel.equiposBiomedicos.push(PROGRAMACION);
          this.equipoBiomedicoViewModel.equiposBiomedicosTabla.push(
            PROGRAMACION
          );
        } else {
          this.mensajesService.mostrarMensajeError(
            this.equipoBiomedicoViewModel.mensajes.mensajesAlerta.equipoExistente
          );
          return;
        }
      } else {
        PROGRAMACION.estado = this.equipoBiomedicoViewModel.equipoEdicion.estado;
        PROGRAMACION.esModificado =
          this.equipoBiomedicoViewModel.equipoEdicion.estado.idEstado ===
          this.equipoBiomedicoViewModel.mensajes.estados.solicitado
            ? this.equipoBiomedicoViewModel.esFechaFinModificado
            : false;
        PROGRAMACION.id = this.equipoBiomedicoViewModel.equipoEdicion.id;
        PROGRAMACION.fechaRegistro = this.equipoBiomedicoViewModel.equipoEdicion.fechaRegistro;
        const index = this.equipoBiomedicoViewModel.equiposBiomedicos.findIndex(
          elemento => elemento.id === PROGRAMACION.id
        );
        if (index !== null && index !== undefined && index !== -1) {
          this.equipoBiomedicoViewModel.equiposBiomedicos[index] = PROGRAMACION;
          this.equipoBiomedicoViewModel.equiposBiomedicosTabla[
            index
            ] = PROGRAMACION;
        }
      }

      if (this.equipoBiomedicoViewModel.equiposBiomedicos.length > 0) {
        this.cambiarValidadorFormularioAOpcional(
          this.formularioEquipoBiomedico,
          'tipoEquipoBiomedico'
        );
        this.cambiarValidadorFormularioAOpcional(
          this.formularioEquipoBiomedico,
          'fechaInicio'
        );
      } else {
        this.controlesRequeridosProgramacion();
      }
      this.limpiarControles();
    }
  }

  public esModificado() {
    this.equipoBiomedicoViewModel.esFechaFinModificado = true;
  }

  public editarSolicitud(data: any): void {
    if (data && data.id) {
      console.log(data);
      this.equipoBiomedicoViewModel.equipoEdicion = data;
      this.equipoBiomedicoViewModel.esEdicionEquipo = true;
      this.formularioEquipoBiomedico.get('tipoEquipoBiomedico').disable();
      this.formularioEquipoBiomedico.get('fechaInicio').disable();
      this.formularioEquipoBiomedico.controls['tipoEquipoBiomedico'].setValue(
        data.tipoEquipo.idEquipoBioMedico
      );
      this.formularioEquipoBiomedico.controls['fechaInicio'].setValue(
        new Date(data.fechaInicio)
      );
      this.formularioEquipoBiomedico.controls['fechaFin'].setValue(
        data.fechaFin != null ? new Date(data.fechaFin) : null
      );
    }
  }

  public eliminarSolicitud($evento: any): void {
    console.log($evento);
    if ($evento.fechaRegistro) {
      const dialogRef = this.dialog.open(ModalEquiposBiomedicosCancelarComponent, {
        width: '30%',
        disableClose: true,
        data: $evento
      });

      dialogRef.afterClosed().subscribe(result => {
        this.agregarEquipoBioMedico(result);
      });
    } else {
      this.agregarEquipoBioMedico($evento);
    }

  }

  public solicitarEquipos(): void {
    if (
      this.formularioEquipoBiomedico.valid &&
      this.equipoBiomedicoViewModel.equiposBiomedicos.length > 0
    ) {
      console.log(
        'REQUEST - Solicitud Equipo Biomédico: ',
        JSON.stringify(this.equipoBiomedicoViewModel.equiposBiomedicos)
      );

      this.solicitudEquipoBiomedicoSubscripcion = this.equipoBiomedicoService
        .solicitarEquipoBiomedico(
          this.equipoBiomedicoViewModel.equiposBiomedicos
        )
        .subscribe(
          response => {
            console.log('RESPONSE - Solicitud Equipo ', response);
            this.mensajesService.mostrarMensajeExito(
              this.equipoBiomedicoViewModel.mensajes.mensajesAlerta
                .exitoSolicitarEquipo
            );
            this.regresarPrincipal.emit(true);
          },
          error => {
            this.capturaDeErroresService.mapearErrores(
              error.status,
              error.error
            );
          },
          () => {
            this.solicitudEquipoBiomedicoSubscripcion.unsubscribe();
          }
        );
    } else {
      this.validarTodosLosCamposDelFormulario(this.formularioEquipoBiomedico);
    }
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

  private getDatos(): void {
    this.getTiposEquipoBiomedico();
    this.getEquiposBiomedicos();
  }

  private getEquiposBiomedicos(): void {
    this.equiposBiomedicosSubscripcion = this.equipoBiomedicoService
      .getAgregadoEquipoBiomedico(
        this.infoRemisionNovedad.datosRemision.idRemision
      )
      .subscribe(
        response => {
          this.equipoBiomedicoViewModel.equiposBiomedicos = [];
          this.equipoBiomedicoViewModel.equiposBiomedicosTabla = [];
          response.forEach(equipo => {
            this.equipoBiomedicoViewModel.equiposBiomedicos.push(
              new EquipoBiomedico(
                equipo.id,
                equipo.idRemision,
                equipo.tipoIdentificacion,
                equipo.numeroIdentificacion,
                equipo.tipoEquipo,
                equipo.fechaInicio,
                equipo.fechaFin,
                equipo.fechaRegistro,
                equipo.nota,
                equipo.estado,
                equipo.proveedor,
                equipo.ciudad,
                equipo.usuario,
                equipo.telefono,
                equipo.cobertura,
                equipo.esModificado,
                equipo.direccion,
                equipo.esEliminado
              )
            );

            this.equipoBiomedicoViewModel.equiposBiomedicosTabla.push(
              new EquipoBiomedico(
                equipo.id,
                equipo.idRemision,
                equipo.tipoIdentificacion,
                equipo.numeroIdentificacion,
                equipo.tipoEquipo,
                equipo.fechaInicio,
                equipo.fechaFin,
                equipo.fechaRegistro,
                equipo.nota,
                equipo.estado,
                equipo.proveedor,
                equipo.ciudad,
                equipo.usuario,
                equipo.telefono,
                equipo.cobertura,
                equipo.esModificado,
                equipo.direccion,
                equipo.esEliminado
              )
            );
          });
          console.log('response equiposBiomedicos ', response);
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
        }
      );
  }

  private limpiarControles(): void {
    this.formularioEquipoBiomedico.controls['tipoEquipoBiomedico'].reset();
    this.formularioEquipoBiomedico.controls['fechaInicio'].reset();
    this.formularioEquipoBiomedico.controls['fechaFin'].reset();
    this.equipoBiomedicoViewModel.esEdicionEquipo = false;
    this.formularioEquipoBiomedico.get('tipoEquipoBiomedico').enable();
    this.formularioEquipoBiomedico.get('fechaInicio').enable();
  }

  private agregarEquipoBioMedico($evento) {
    if ($evento && $evento.id) {
      const index = this.equipoBiomedicoViewModel.equiposBiomedicos.findIndex(
        elemento => elemento.id === $evento.id
      );
      if (index !== null && index !== undefined) {
        this.equipoBiomedicoViewModel.equiposBiomedicosTabla.splice(index, 1);

        $evento.esEliminado = true;
        console.log($evento);
        this.equipoBiomedicoViewModel.equiposBiomedicos[index] = $evento;
      }
    }
    if (this.equipoBiomedicoViewModel.equiposBiomedicos.length > 0) {
      this.cambiarValidadorFormularioAOpcional(
        this.formularioEquipoBiomedico,
        'tipoEquipoBiomedico'
      );
      this.cambiarValidadorFormularioAOpcional(
        this.formularioEquipoBiomedico,
        'fechaInicio'
      );
    } else {
      this.limpiarControles();
      this.controlesRequeridosProgramacion();
    }
  }

  private controlesRequeridosProgramacion(): void {
    this.cambiarValidadorFormularioARequerido(
      this.formularioEquipoBiomedico,
      'tipoEquipoBiomedico'
    );
    this.cambiarValidadorFormularioARequerido(
      this.formularioEquipoBiomedico,
      'fechaInicio'
    );
  }

  /**
   * Genera columnas para la tabla
   */
  private generarColumnas(): void {
    this.columnasEquiposBiomedicos = [
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
      false,
      false,
      null
    );
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormularioEquipoBiomedico(): void {
    this.formularioEquipoBiomedico = this.fb.group({
      tipoEquipoBiomedico: ['', Validators.compose([Validators.required])],
      fechaInicio: ['', Validators.compose([Validators.required])],
      fechaFin: ['']
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

  private configurarMinimaFechaActual(): void {
    const fechaHoy = new Date();
    this.fechaMinimaEquipo = new Date();
    this.fechaMinimaEquipo.setDate(fechaHoy.getDate());
    this.fechaMinimaEquipo.setMonth(fechaHoy.getMonth());
    this.fechaMinimaEquipo.setFullYear(fechaHoy.getFullYear());
  }
}
