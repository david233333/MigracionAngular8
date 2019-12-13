import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import * as moment from 'moment';
import {MensajesService} from '../../../../shared/services/mensajes.service';
import {AgregadosNovedadService} from '../../../../shared/services/agregados-novedad.service';
import {MatDialog} from '@angular/material';
import {UsuarioService} from '../../../../shared/services/usuario.service';
import {CapturarErrores} from '../../../../shared/services/capturar-errores';
import {FijarVisitasViewModel} from './fijar-visitas.view-model';
import {FijacionVisitaService} from '../../../../domain/usecase/novedad/fijacion-visita.service';
import {FijarDesfijarVisitasRequest} from '../../../../infraestructure/request-model/novedad/fijar-desfijar-visitas.request';
import {DetalleVisitasComponent} from '../../../lineaUnica/lista-linea-unica/modal-linea-unica/detalle-visitas/detalle-visitas.component';
import {CitaFijarDesfijarRequest} from '../../../../infraestructure/request-model/novedad/cita-fijar-desfijar.request';

moment.locale('es');

@Component({
  selector: 'sura-novedad-fijar-visitas',
  templateUrl: './fijar-visitas.component.html',
  styleUrls: ['./fijar-visitas.component.scss']
})
export class FijarVisitasComponent implements OnInit, OnDestroy {
  public columnas: any[];
  public columnasFiltro: any[];
  public fijarVisitasViewModel: FijarVisitasViewModel = this.iniciarViewModel();
  public formularioFijarVisitas: FormGroup;
  private motivosFijacionSubscripcion = new Subscription();
  private especialidadSubscripcion: Subscription = new Subscription();
  private visitasSubscripcion = new Subscription();
  private fijarVisitaSubscripcion = new Subscription();
  private desfijarVisitaSubscripcion = new Subscription();
  private citasRequest: CitaFijarDesfijarRequest[];


  @Output()
  public regresarPrincipal: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.getDatos();
    this.generarColumnas();
  }

  ngOnDestroy() {
    this.motivosFijacionSubscripcion.unsubscribe();
    this.especialidadSubscripcion.unsubscribe();
    this.visitasSubscripcion.unsubscribe();
    this.fijarVisitaSubscripcion.unsubscribe();
    this.desfijarVisitaSubscripcion.unsubscribe();
  }

  constructor(
    private fb: FormBuilder,
    private fijacionVisitaService: FijacionVisitaService,
    private mensajesService: MensajesService,
    private infoRemisionNovedad: AgregadosNovedadService,
    private usuarioService: UsuarioService,
    private capturaDeErroresService: CapturarErrores
  ) {
    this.crearFormularioFijacionVisitas();
  }

  public verValidacionVisita(): boolean {
    return this.fijarVisitasViewModel.visitasSeleccionadas.length <= 0;
  }

  public validarHoras(): void {
    console.log(this.formularioFijarVisitas.controls['horaFijada'].value);
    console.log(this.formularioFijarVisitas.controls['horaFijada2'].value);
  }

  private getDatos(): void {
    this.getMotivosFijacion();
    this.getEspecialidades(this.infoRemisionNovedad.datosRemision.programa.idPrograma);
  }

  private getVisitas(especialidad: string): void {
    this.visitasSubscripcion = this.fijacionVisitaService
      .getVisitas(
        this.infoRemisionNovedad.datosRemision.idRemision,
        especialidad
      )
      .subscribe(
        response => {
          console.log('response visitas ', response);
          this.fijarVisitasViewModel.respuestaVisitas = response;
          this.fijarVisitasViewModel.visitasSeleccionadas = [];
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
        }
      );
  }

  /**
   * Obtiene los motivos de fijacion de visita
   */
  public getMotivosFijacion(): void {
    this.motivosFijacionSubscripcion = this.fijacionVisitaService
      .getMotivosFijacionVisita()
      .subscribe(
        response => {
          this.fijarVisitasViewModel.respuestaMotivosFijacion = response;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
        }
      );
  }

  /**
   * Obtiene las especialidades de visita
   */
  public getEspecialidades(idPrograma: string): void {
    this.especialidadSubscripcion = this.fijacionVisitaService
      .getEspecialidades(idPrograma)
      .subscribe(
        response => {
          console.log('response respuestaEspecialidad ', response);
          this.fijarVisitasViewModel.respuestaEspecialidad = response;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
        }
      );
  }


  public FijarDesfijarCitas(esFijar: boolean): void {

    if (this.validarFijar(esFijar)) {
      const FIJAR_DESFIJAR_VISITAS = this.ObjetoFijarDesfijar(esFijar);
      if (FIJAR_DESFIJAR_VISITAS === 'mayor') {
        this.mensajesService.mostrarMensajeError(this.fijarVisitasViewModel.mensajes.errores.rangoHorasError);
      } else if (FIJAR_DESFIJAR_VISITAS === 'unaHora') {
        this.mensajesService.mostrarMensajeError(this.fijarVisitasViewModel.mensajes.errores.unaHora);
      } else {
        console.log(
          'REQUEST - FIJAR DESFIJAR_VISITAS: ',
          JSON.stringify(FIJAR_DESFIJAR_VISITAS)
        );
        this.desfijarVisitaSubscripcion = this.fijacionVisitaService
          .fijarDesfijarVisita(FIJAR_DESFIJAR_VISITAS)
          .subscribe(
            response => {
              console.log('RESPONSE - Desfijar visitas ', response);

              if (esFijar) {
                this.mensajesService.mostrarMensajeExito(
                  this.fijarVisitasViewModel.mensajes.mensajesAlerta
                    .exitoFijarVisita
                );
              } else {
                this.mensajesService.mostrarMensajeExito(
                  this.fijarVisitasViewModel.mensajes.mensajesAlerta
                    .exitoDesFijarVisita
                );
              }
              this.limpiarControles();
              this.getVisitas(
                this.formularioFijarVisitas.controls['especialidad'].value
                  .especialidad
              );
            },
            error => {
              if (error.status !== 400) {
                this.capturaDeErroresService.mapearErrores(
                  error.status,
                  error.error
                );
              } else {
                this.mensajesService.mostrarMensajeError(
                  this.fijarVisitasViewModel.mensajes.mensajesAlerta
                    .errorFijarDesfijarVisita
                );
              }
            },
            () => {
              this.desfijarVisitaSubscripcion.unsubscribe();
            }
          );
      }
    } else {
      this.validarTodosLosCamposDelFormulario(this.formularioFijarVisitas);
    }
  }

  public validarFijar(esFijar: boolean): boolean {
    if (esFijar) {
      this.cambiarValidadorFormularioARequerido(
        this.formularioFijarVisitas,
        'motivoFijacion',
        null,
        null
      );
      this.cambiarValidadorFormularioARequerido(
        this.formularioFijarVisitas,
        'horaFijada',
        null,
        null
      );
      this.cambiarValidadorFormularioARequerido(
        this.formularioFijarVisitas,
        'horaFijada2',
        null,
        null
      );
      return (
        this.formularioFijarVisitas.valid &&
        this.fijarVisitasViewModel.visitasSeleccionadas.length > 0
      );
    } else {
      return this.fijarVisitasViewModel.visitasSeleccionadas.length > 0;
    }
  }

  private ObjetoFijarDesfijar(esFijar: boolean) {
    let horaCompleta = null;
    let horaCompleta2 = null;
    let horas = null;
    const horaInicial = this.formularioFijarVisitas.controls['horaFijada'].value;
    const horaFinal = this.formularioFijarVisitas.controls['horaFijada2'].value;
    if (esFijar) {
      const horaNumero = horaInicial.getHours();

      const hora = (
        '0' +
        horaInicial.getHours()
      ).slice(-2);

      const min = (
        '0' +
        horaInicial.getMinutes()
      ).slice(-2);

      horaCompleta = `${hora}:${min}`;

      const horaNumero2 = horaFinal.getHours();

      const hora2 = (
        '0' +
        horaFinal.getHours()
      ).slice(-2);

      const min2 = (
        '0' +
        horaFinal.getMinutes()
      ).slice(-2);


      horaCompleta2 = `${hora2}:${min2}`;

      if (horaNumero > horaNumero2) {
        return 'mayor';
      }
      horas = Math.abs(horaFinal - horaInicial) / 36e5;
      if (horas < 1) {
        return 'unaHora';
      }

    }
    this.citasRequest = [];
    this.fijarVisitasViewModel.visitasSeleccionadas.forEach(element => {
      const CITA = new CitaFijarDesfijarRequest(
        element.idCitaNumber,
        element.especialidad,
        element.fechaInicioCita
      );
      this.citasRequest.push(CITA);
    });
    return new FijarDesfijarVisitasRequest(
      this.infoRemisionNovedad.datosRemision.idRemision,
      esFijar === true ? horaCompleta : null,
      esFijar === true ? horaCompleta2 : null,
      esFijar === true
        ? this.formularioFijarVisitas.controls['motivoFijacion'].value
        : null,
      this.citasRequest,
      this.usuarioService.InfoUsuario,
      esFijar
    );
  }


  public habilitarFijarDesfijar(): boolean {
    return this.fijarVisitasViewModel.visitasSeleccionadas.length > 0
      ? false
      : true;
  }

  public seleccionEspecialidad($especialidad: any): void {
    this.getVisitas($especialidad.especialidad);
    this.limpiarControles();
  }

  public limpiarControles(): void {
    this.formularioFijarVisitas.controls['motivoFijacion'].reset();
    this.formularioFijarVisitas.controls['horaFijada'].setValue(null);
    this.cambiarValidadorFormularioAOpcional(
      this.formularioFijarVisitas,
      'motivoFijacion',
      null,
      null
    );
    this.cambiarValidadorFormularioAOpcional(
      this.formularioFijarVisitas,
      'horaFijada',
      null,
      null
    );
  }

  /**
   * Genera columnas para la tabla
   */
  private generarColumnas(): void {
    this.columnas = [
      {
        field: this.fijarVisitasViewModel.mensajes.tabla.fechaVisitaCampo,
        header: this.fijarVisitasViewModel.mensajes.tabla.fechaVisita
      },
      {
        field: this.fijarVisitasViewModel.mensajes.tabla.motivoCampo,
        header: this.fijarVisitasViewModel.mensajes.tabla.motivo
      },
      {
        field: this.fijarVisitasViewModel.mensajes.tabla.horaFijadoCampo,
        header: this.fijarVisitasViewModel.mensajes.tabla.horaFijado
      }
    ];
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): FijarVisitasViewModel {
    return new FijarVisitasViewModel(null, null, [], [], [], [], [], null);
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormularioFijacionVisitas(): void {
    this.formularioFijarVisitas = this.fb.group({
      motivoFijacion: ['', Validators.compose([Validators.required])],
      especialidad: [],
      horaFijada: ['', Validators.compose([Validators.required])],
      horaFijada2: ['', Validators.compose([Validators.required])],
      opcionHoras: ['SI', Validators.compose([Validators.required])]
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

  /**
   * Cambia los validadores de un control del formulario
   * @param {FormGroup} formulario
   * @param {string} nombrecontrol
   * @param {number} numeroDigitos
   * @param {string} patronValidacion
   */
  private cambiarValidadorFormularioARequerido(
    formulario: FormGroup,
    nombrecontrol: string,
    numeroDigitos: number,
    patronValidacion: string
  ): void {
    formulario.get(nombrecontrol).clearValidators();
    formulario
      .get(nombrecontrol)
      .setValidators(
        Validators.compose([
          Validators.required,
          Validators.maxLength(numeroDigitos),
          Validators.pattern(patronValidacion)
        ])
      );
    formulario.get(nombrecontrol).updateValueAndValidity();
  }

  /**
   * Cambia los validadores de un control del formulario
   * @param {FormGroup} formulario
   * @param {string} nombrecontrol
   * @param {number} numeroDigitos
   * @param {string} patronValidacion
   */
  private cambiarValidadorFormularioAOpcional(
    formulario: FormGroup,
    nombrecontrol: string,
    numeroDigitos: number,
    patronValidacion: string
  ): void {
    formulario.get(nombrecontrol).clearValidators();
    formulario
      .get(nombrecontrol)
      .setValidators(
        Validators.compose([
          Validators.maxLength(numeroDigitos),
          Validators.pattern(patronValidacion)
        ])
      );
    formulario.get(nombrecontrol).updateValueAndValidity();
  }
}
