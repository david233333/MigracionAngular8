import { Component, OnInit } from '@angular/core';
import { DatosPacienteViewModel } from '../datos-paciente.view-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { PacienteViewModel } from './datos-paciente-model';
import { DatosPacienteService } from '../../../../domain/usecase/remision/datos-paciente.service';
import { MensajesService } from '../../../../shared/services/mensajes.service';
import { RemisionContenedorService } from '../../../../domain/usecase/remision/remision-contenedor.service';
import { Router } from '@angular/router';
import { TipoIdentificacion } from '../../../../domain/model/maestro/entity/tipo-identificacion.model';
import { Paciente } from '../../../../domain/model/remision/entity/paciente.model';

@Component({
  selector: 'sura-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss']
})
export class PacienteComponent implements OnInit {

  public tiposIdentificacion: TipoIdentificacion[];

  public tiposIdentificacionSubscripcion = new Subscription();

  public formulario: FormGroup;

  public datosPacienteViewModel: DatosPacienteViewModel = this.iniciarViewModel();

  public configEspanolCalendario: any;

  private datosPacienteSubscripcion = new Subscription();

  private planSaludSubscripcion = new Subscription();

  private tiposPlanesSaludSubscripcion = new Subscription();

  private tiposPlanSaludParticular = new Subscription();

  readonly  seleccion = 'SELECCIONAR';

  public fecha: Date;

  constructor(private fb: FormBuilder,
    private datosPacienteService: DatosPacienteService,
    private mensajesService: MensajesService,
    private remisionContenedorService: RemisionContenedorService,
    private router: Router) { }

  ngOnInit() {
    this.getDatos();
    this.crearFormulario();
  }

  private getDatos() {
    this.configurarCalendario();
    this.getTiposIdentificacion();
    this.getGenero();
  }


  /**
   * Hace la peticion al servidor si no hay datos al iniciar la aplicacion
   * con un evento
   *
   */
  public getTiposIdentificacion(): void {
    this.tiposIdentificacionSubscripcion =
      this.remisionContenedorService.getTiposIdentificacion()
        .subscribe(
          response => {
            if (response) {
              this.datosPacienteViewModel.respuestaTiposIdentificacion = response;
            }
          },
          error => {
            this.mensajesService.mostrarMensajeError('er');
          },
          () => { }
        );
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): DatosPacienteViewModel {
    return new DatosPacienteViewModel(
      null,
      null,
      null,
      null,
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
      true,
      false
    );
  }

  private getGenero() {
    this.datosPacienteService.getGenero().subscribe(genero => {
      this.datosPacienteViewModel.datosGenero = genero;
    }, error1 => this.mensajesService.mostrarMensajeError(error1));
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formulario = this.fb.group({
      tipoDocumento: ['', Validators.compose([Validators.required])],
      numeroDocumento: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern('([0-9]{1,11})')
        ])
      ],
      primerNombre: ['', Validators.compose([Validators.required])],
      primerApellido: ['', Validators.compose([Validators.required])],
      fechaNacimiento: ['', Validators.compose([Validators.required])],
      sexo: ['', Validators.compose([Validators.required])],
      edad: [''],
      ocupacion: [''],
      email: ['']

    });
  }

  private configurarCalendario(): void {
    this.configEspanolCalendario = {
      firstDayOfWeek: 1,
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

}
