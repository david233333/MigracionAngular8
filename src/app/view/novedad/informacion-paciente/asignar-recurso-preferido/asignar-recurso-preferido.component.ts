import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AsignarRecursoPreferidoViewModel} from './asignar-recurso-preferido.view-model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MaestrosService} from '../../../../domain/usecase/comun/maestros.service';
import {ProfesionalResponseModel} from '../../../../domain/model/maestro/entity/ProfesionalResponse.model';
import {UsuarioService} from '../../../../shared/services/usuario.service';
import {ConsultaRemisionRequest} from '../../../../infraestructure/request-model/novedad/consulta-remision.request';
import {AgregadosNovedadService} from '../../../../shared/services/agregados-novedad.service';
import {Subscription} from 'rxjs/Subscription';
import {CreacionNovedadService} from '../../../../domain/usecase/novedad/creacion-novedad.service';
import {CapturarErrores} from '../../../../shared/services/capturar-errores';
import {RecursoPreferidoRequest} from '../../../../infraestructure/request-model/novedad/recurso-preferido.request';
import {MensajesService} from '../../../../shared/services/mensajes.service';
import {RecursoPreferidoService} from '../../../../domain/usecase/novedad/RecursoPreferido.service';


@Component({
  selector: 'sura-asignar-paciente',
  templateUrl: './asignar-recurso-preferido.component.html',
  styleUrls: ['./asignar-recurso-preferido.component.scss']
})
export class AsignarRecursoPreferidoComponent implements OnInit {

  @Output()
  public regresarPrincipal: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  public especialidad;
  @Input()
  public codigoCiudad;
  @Input()
  public nombreCiudad;
  @Input()
  public idProgramaAsignarInfoPaciente;

  public profesional: ProfesionalResponseModel;
  private recursoPreferidoSubscription: Subscription = new Subscription();
  private guardarRecursoPreferido: Subscription = new Subscription();
  public profesionalesList: ProfesionalResponseModel[] = [];
  public formAsignarProfesional: FormGroup;
  public sinProfesional = 'Sin recurso preferido';
  public deshabilitarBotones = true;
  public especialidadMedicina = false;
  public asignarPacienteViewModel: AsignarRecursoPreferidoViewModel = this.iniciarViewModel();
  private remisionSubscription = new Subscription();
  public especialidadPorDefecto = 'Psicologia';
  private especialidadSeleccionada = this.especialidadPorDefecto;
  public loading = false;

  constructor(private fb: FormBuilder,
              private maestrosService: MaestrosService,
              private usuarioService: UsuarioService,
              private infoRemisionNovedad: AgregadosNovedadService,
              private creacionNovedadService: CreacionNovedadService,
              private capturaDeErroresService: CapturarErrores,
              private mensajesService: MensajesService,
              private recursoPreferido: RecursoPreferidoService
  ) {
  }

  ngOnInit() {
    console.log(this.codigoCiudad);
    this.formAsignarProfesional = this.fb.group({
      profesionalForm: []
    });
    this.getDatos();
    this.initProfesionalesDisponibles(this.especialidadPorDefecto, false);
    this.validarCheckMedicinaCronicosOPaliativos();
  }


  private getDatos(): void {
    this.getAgregadoRemision();
  }


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
          this.getInfoRecursoPreferido();
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
          this.remisionSubscription.unsubscribe();
        }
      );
  }

  private getInfoRecursoPreferido(): void {

    if (this.infoRemisionNovedad.datosNovedad.recursoPreferidoPk !== null) {

      this.recursoPreferidoSubscription = this.recursoPreferido
        .getAgregadoRecursoPreferido(
          this.infoRemisionNovedad.datosNovedad.recursoPreferidoPk
        )
        .subscribe(
          response => {

            const profesional = response.profesionalList.filter(elem => {
              console.log(elem);
              return elem.especialidad === this.especialidadSeleccionada;
            })[0];


            if (response.profesionalList !== null && profesional !== undefined) {
              this.formAsignarProfesional.get('profesionalForm').setValue(profesional.idProfesional);
              this.formAsignarProfesional.get('profesionalForm').updateValueAndValidity();
              this.filtrarProfesional({value: this.formAsignarProfesional.get('profesionalForm').value});
            } else {
              this.formAsignarProfesional.get('profesionalForm').setValue(this.sinProfesional);
              this.formAsignarProfesional.get('profesionalForm').updateValueAndValidity();
            }
          },
          error => {
            this.capturaDeErroresService.mapearErrores(
              error.status,
              error.error
            );
          },
          () => {
          }
        );
    } else {
      this.formAsignarProfesional.get('profesionalForm').setValue(this.sinProfesional);
      this.formAsignarProfesional.get('profesionalForm').updateValueAndValidity();
    }

  }

  public traerProfesionalesPorEspecialidad(evento: string) {
    this.loading = true;
    if (evento === 'medicina') {
      this.especialidadSeleccionada = this.especialidad;
      if (this.codigoCiudad === '5608') {
        this.especialidadSeleccionada = 'Medicina';
      }
      this.initProfesionalesDisponibles(this.especialidad, true);
    } else {
      this.especialidadSeleccionada = evento;
      this.initProfesionalesDisponibles(evento, true);
    }
  }

  private initProfesionalesDisponibles(especialidad: string, consultarRecursoPreferido: boolean): void {


    this.maestrosService.consultarProfesionalesActivos(especialidad, this.nombreCiudad).subscribe(
      profesionales => {

        this.profesionalesList = profesionales;

        if (consultarRecursoPreferido) {
          this.getInfoRecursoPreferido();
        }
        this.loading = false;
      },

      error => {
        this.mensajesService.mostrarMensajeError(
          error.error
        );
        this.profesionalesList = [];
        this.loading = false;
      }
    );

  }

  private validarCheckMedicinaCronicosOPaliativos(): void {
    if (this.idProgramaAsignarInfoPaciente === '545' || this.idProgramaAsignarInfoPaciente === '547') {
      this.especialidadMedicina = true;
    }
  }

  public asignar(): void {

    if (this.profesional != null) {
      const ASIGNACION_PROFESIONAL = new RecursoPreferidoRequest(
        this.infoRemisionNovedad.datosRemision.idRemision,
        this.profesional,
        this.usuarioService.InfoUsuario
      );
      this.asignarProfesional(ASIGNACION_PROFESIONAL);
    } else {
      this.mensajesService.mostrarMensajeError(
        'Ha ocurrido un problema'
      );
    }
  }

  public asignarProfesional(profesionalRequest: RecursoPreferidoRequest): void {


    this.guardarRecursoPreferido = this.recursoPreferido
      .guardarRecursoPreferido(profesionalRequest)
      .subscribe(
        response => {
          console.log(response);
          this.mensajesService.mostrarMensajeExito(
            'Profesional Asignado'
          );

          this.regresarPrincipal.emit(true);
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
          this.regresarPrincipal.emit(false);
        },
        () => {
          this.guardarRecursoPreferido.unsubscribe();
        }
      );


  }

  public anularAsignacion(): void {
    if (this.formAsignarProfesional.get('profesionalForm').value != null) {
      this.filtrarProfesional({value: this.formAsignarProfesional.get('profesionalForm').value});
      const ASIGNACION_PROFESIONAL = new RecursoPreferidoRequest(
        this.infoRemisionNovedad.datosRemision.idRemision,
        this.profesional,
        this.usuarioService.InfoUsuario
      );
      this.quitarAsignacion(ASIGNACION_PROFESIONAL);
    } else {
      this.mensajesService.mostrarMensajeError(
        'Ha ocurrido un problema'
      );
    }

  }

  public quitarAsignacion(profesionalRequest: RecursoPreferidoRequest): void {

    this.guardarRecursoPreferido = this.recursoPreferido
      .quitarRecursoPreferido(profesionalRequest)
      .subscribe(
        response => {

          this.mensajesService.mostrarMensajeExito(
            'Se ha eliminado la asignación'
          );


          this.regresarPrincipal.emit(true);
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
          this.regresarPrincipal.emit(false);
        },
        () => {
          this.guardarRecursoPreferido.unsubscribe();
        }
      );


  }


  public filtrarProfesional(event): void {

    this.profesional = this.profesionalesList.filter(pro => pro.idProfesional === event.value)[0];


    if (this.profesional !== null && this.profesional !== undefined) {
      this.deshabilitarBotones = false;
    } else {
      this.deshabilitarBotones = true;
    }


  }


  private iniciarViewModel(): AsignarRecursoPreferidoViewModel {
    return new AsignarRecursoPreferidoViewModel(
      null,
      null,
      []
    );
  }
}
