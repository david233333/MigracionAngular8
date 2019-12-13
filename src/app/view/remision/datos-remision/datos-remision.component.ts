import { Component, OnInit, Output, EventEmitter, OnDestroy, Input, SimpleChange, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { ToasterConfig } from 'angular2-toaster';
import { DatosRemisionViewModel } from './datos-remision.view-model';
import { MensajesService } from '../../../shared/services/mensajes.service';
import { DatosRemisionService } from '../../../domain/usecase/remision/datos-remision.service';
import { AgregadosRemisionService } from '../../../shared/services/agregados-remision.service';
import { Router } from '@angular/router';
import { RemisionServices } from '../../../domain/usecase/remision/remision.service';
import { TipoIdentificacion } from '../../../domain/model/maestro/entity/tipo-identificacion.model';
import { EstadosRemisionEnum } from '../../../shared/utils/enums/estados-remision.enum';
import { RemisionContenedorService } from '../../../domain/usecase/remision/remision-contenedor.service';
import {CapturarErrores} from '../../../shared/services/capturar-errores';

@Component({
  selector: 'sura-datos-remision',
  templateUrl: './datos-remision.component.html',
  styleUrls: ['./datos-remision.component.scss']
})
export class DatosRemisionComponent implements OnInit, OnDestroy, OnChanges {
  constructor(private fb: FormBuilder,
    private datosRemisionService: DatosRemisionService,
    private mensajesService: MensajesService,
    private remisionServices: RemisionServices,
    private agregadoRemision: AgregadosRemisionService,
    private router: Router, private remisionService: RemisionContenedorService,
              private capturaDeErroresService: CapturarErrores) {
    this.crearFormulario();
    this.suscribirFormulario();
  }


  @Input('edadPaciente')
  public edadPaciente: number;

  @Input('tiposIdentificacion')
  public tiposIdentificacion: TipoIdentificacion[];

  @Input('ciudad') private ciudad: any;

  @Output()
  public continuar: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  public datosRemision: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  public formulario: FormGroup;

  public datosRemisionViewModel: DatosRemisionViewModel = this.iniciarViewModel();

  public disableButton: boolean;

  public configuracionToaster: ToasterConfig = this.mensajesService.configuracion;

  private institucionesSubscripcion: Subscription = new Subscription();
  private profesionalSubscripcion: Subscription = new Subscription();
  private pesoSubscripcion: Subscription = new Subscription();



  ngOnInit() {
    this.getDatos();
  }

  ngOnDestroy() {
    this.institucionesSubscripcion.unsubscribe();
    this.profesionalSubscripcion.unsubscribe();
    this.pesoSubscripcion.unsubscribe();
    this.edadPaciente = null;
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes && changes.tiposIdentificacion) {
      this.getTiposIdentificacion();
    }

    if (changes && changes.ciudad && changes.ciudad.currentValue) {
      this.getInstituciones(changes.ciudad.currentValue);
    }

    if (changes && changes.edadPaciente && changes.edadPaciente.currentValue) {
      this.validarEdadPaciente(changes.edadPaciente.currentValue);
    }
  }

  /**
   * Cambia el valor ingresado de peso
   * @param $event
   */
  private cambiarPeso(evento): void {
  }

  /**
   * Valida la edad del paciente
   * @param {number} edad
   */
  private validarEdadPaciente(edad: number): void {
    if (edad) {
      const esMenor = edad <= 14;
      this.datosRemisionViewModel.mostrarPeso = esMenor;
    } else {
      this.datosRemisionViewModel.mostrarPeso = false;
    }
  }

  /**
   * Cambia los validadores del peso
   * @param {boolean} esMenor
   */
  public cambiarPesoRequerido(esMenor: boolean): void {
    this.formulario.get('peso').clearValidators();
    if (esMenor) {
    } else {
    }
    this.formulario.get('peso').updateValueAndValidity();
  }

  /**
   * Obtiene los datos de la remisión
   */
  private getDatos(): void {
    this.getPeso();
    if (this.router.url === '/remision/nueva') {
      this.getTiposIdentificacion();
    } else if (this.router.url === '/remision/editar') {
      this.bloquearCampos();
      if (this.agregadoRemision.datosRemision !== undefined && this.agregadoRemision.datosRemision !== null) {
        const idRemisionPk = this.agregadoRemision.datosRemision.idRemisionPK;
        this.remisionServices.getAgregadoDatosRemision(idRemisionPk).subscribe((datosRemision) => {
          if (datosRemision) {
            this.formulario.get('institucion').setValue(datosRemision['institucionRemite']);
            this.formulario.get('telefono').setValue(datosRemision['telefonoInstitucionRemite']);
            this.formulario.get('tipoDocumentoMedico').setValue(datosRemision['tipoIdentificacion']);
            this.formulario.get('numeroDocumentoMedico').setValue(datosRemision['numeroIdentificacionMedico']);
            this.formulario.get('nombreMedico').setValue(datosRemision['nombreMedico']);
            this.formulario.get('especialidadMedico').setValue(datosRemision['especialidad']);
            this.formulario.get('emailContacto').setValue(datosRemision['emailContacto']);
            this.formulario.get('resumenHistoriaClinica').setValue(datosRemision['resumenHistoriaClinica']);
            this.formulario.get('observaciones').setValue(datosRemision['observaciones']);
            this.formulario.get('peso').setValue(datosRemision['peso']);
            this.formulario.get('medidaDepeso').setValue(datosRemision['medidaDepeso']);
          }
        }, error =>  this.capturaDeErroresService.mapearErrores(error.status, error.error));
      }

    }
  }

  /**
   * Suscribe los cambios del formulario                                                                                                                                                                                 rio
   */
  private suscribirFormulario(): void {
    this.formulario.valueChanges.subscribe(formulario => {
      this.continuar.emit(this.formulario.valid);
      this.datosRemision.emit(formulario);
    });
  }

  /**
   * Busca el profesional indicado
   */
  public buscarProfesional(): void {
    const tipoDocumento = this.formulario.get('tipoDocumentoMedico').value;
    const numeroDocumento = this.formulario.get('numeroDocumentoMedico').value;
    if (tipoDocumento && numeroDocumento) {
      this.profesionalSubscripcion = this.datosRemisionService.getProfesional(tipoDocumento, numeroDocumento)
        .subscribe(response => {
              this.cargarDatosProfesional(response);
        },
          error => {
            this.capturaDeErroresService.mapearErrores(error.status, error.error);
          },
          () => {

          });
    }
  }


  /**
   * Carga los datos del profesional en el formulario
   */
  private cargarDatosProfesional(datos: any): void {
    if (datos) {
      this.formulario.get('nombreMedico').setValue(datos.nombreProfesional);
      this.formulario.get('especialidadMedico').setValue(datos.nombreEspecialidad);
    }
  }

  /**
   * Obtiene los tipos de identificacion
   */
  private getTiposIdentificacion(): void {
    if (this.datosRemisionViewModel.respuestaTiposIdentificacion) {
      this.datosRemisionViewModel.respuestaTiposIdentificacion = this.tiposIdentificacion;
    }
  }

  /**
   * Obtiene las intituciones por ciudad seleccionada
   * @param {string} idCiudad
   */

  private getInstituciones(nombreCiudad: string): void {
    console.log('nombre ciudad angular 6',nombreCiudad)
    this.institucionesSubscripcion = this.datosRemisionService
      .getInstituciones(nombreCiudad)
      .subscribe(
        response => {
             console.log('las instituciones son angular 6',response)
            this.datosRemisionViewModel.respuestaInstituciones = response;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => { }
      );
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): DatosRemisionViewModel {
    return new DatosRemisionViewModel(
      null,
      [],
      [],
      null,
      []
    );
  }

  /**
   * Se obtienen los datos de medidas de peso
   *
   */
  private getPeso() {
    this.pesoSubscripcion = this.datosRemisionService.getPeso().subscribe(
      response => {
          this.datosRemisionViewModel.pesos = response;
          console.log('medida de pesos ', response);
      },
      error => {
        this.capturaDeErroresService.mapearErrores(error.status, error.error);
      },
      () => {
        this.pesoSubscripcion.unsubscribe();
      });
  }


  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formulario = this.fb.group({
      institucion: ['', Validators.compose([Validators.required])],
      telefono: ['',
        Validators.compose([
          Validators.required,
          Validators.maxLength(30)
        ])
      ],
      tipoDocumentoMedico: ['', Validators.compose([Validators.required])],
      numeroDocumentoMedico: ['',
        Validators.compose([
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern('[0-9]+')
        ])
      ],
      nombreMedico: ['',
        Validators.compose([Validators.required, Validators.maxLength(100)])
      ],
      especialidadMedico: ['', Validators.compose([Validators.maxLength(50)])],
      emailContacto: ['',
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.email
        ])
      ],
      resumenHistoriaClinica: ['',
        Validators.compose(
          [Validators.required, Validators.maxLength(4000)
          ])
      ],
      observaciones: ['', Validators.compose([Validators.maxLength(4000)])],
      peso: ['',
        Validators.compose([
          Validators.maxLength(8),
          Validators.pattern('^([0-9]{1,4})+([,][0-9]{1,3})?$')
        ])
      ],
      medidaDepeso: ['']
    });
  }



  private bloquearCampos() {
    if (this.remisionService.remision) {
      if (this.remisionService.remision.estado === EstadosRemisionEnum.ADMITIDO ||
        this.remisionService.remision.estado === EstadosRemisionEnum.CANCELADO ||
        this.remisionService.remision.estado === EstadosRemisionEnum.EGRESADO ||
        this.remisionService.remision.estado === EstadosRemisionEnum.NO_ADMITIDO) {
        this.formulario.controls['institucion'].disable();
        this.formulario.controls['telefono'].disable();
        this.formulario.get('tipoDocumentoMedico').disable();
        this.formulario.get('numeroDocumentoMedico').disable();
        this.formulario.get('nombreMedico').disable();
        this.formulario.get('especialidadMedico').disable();
        this.formulario.get('emailContacto').disable();
        this.formulario.get('resumenHistoriaClinica').disable();
        this.formulario.get('observaciones').disable();
        this.disableButton = true;

      }
    }
  }
}
