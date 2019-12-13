import { Component, EventEmitter, OnInit, Output, OnDestroy, SimpleChange, OnChanges, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';

import { DiagnosticosViewModel } from './diagnosticos.view-model';
import { DiagnosticosService } from '../../../domain/usecase/remision/diagnosticos.service';
import { MensajesService } from '../../../shared/services/mensajes.service';
import {RemisionServices} from '../../../domain/usecase/remision/remision.service';
import {AgregadosRemisionService} from '../../../shared/services/agregados-remision.service';
import {Router} from '@angular/router';
import { Diagnostico } from '../../../domain/model/maestro/entity/diagnostico.model';
import {EstadosRemisionEnum} from '../../../shared/utils/enums/estados-remision.enum';
import {RemisionContenedorService} from '../../../domain/usecase/remision/remision-contenedor.service';
import {CapturarErrores} from '../../../shared/services/capturar-errores';


@Component({
  selector: 'sura-diagnosticos',
  templateUrl: './diagnosticos.component.html',
  styleUrls: ['./diagnosticos.component.scss']
})
export class DiagnosticosComponent implements OnInit, OnDestroy, OnChanges {
  @Input('edadPaciente')
  public edadPaciente = 0;

  @Output()
  public continuar: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  public cargando: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()

  public diagnosticos: EventEmitter<Diagnostico[]> = new EventEmitter<Diagnostico[]>();


  public formulario: FormGroup;

  public diagnosticosViewModel: DiagnosticosViewModel = this.iniciarViewModel();

  public opcionesFiltradas: Observable<Diagnostico[]>;

  public columnas: any[];

  private diagnosticosSubscripcion: Subscription = new Subscription();

  public textoDiagnostico = new Subject<string>();

  public  disableButton: boolean;

  public mostrarElminar = false;

  constructor(private fb: FormBuilder,
              private diagnosticosService: DiagnosticosService,
              private mensajesService: MensajesService,
              private remisionServices: RemisionServices,
              private agregadoRemision: AgregadosRemisionService,
              private router: Router, private remisionService: RemisionContenedorService,
              private capturaDeErroresService: CapturarErrores) {
    this.generarColumnas();
    this.crearFormulario();
    this.suscribirFormulario();

  }

  ngOnInit() {
    this.getDatos();
  }

  ngOnDestroy() {
    this.diagnosticosSubscripcion.unsubscribe();

  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {}


  public traerDiagnosticos() {
    const valor: string = this.formulario.get('diagnosticoSeleccionado').value;
    const valorConsulta: string = valor.split(' ').join('_');
    if ( valorConsulta.length > 2) {
      this.diagnosticosService.getDiagnosticos(valorConsulta.toUpperCase()).subscribe(diagnostico => {
        this.diagnosticosViewModel.respuestaDiagnosticos = diagnostico;
        this.suscribirCampoTextoDiagnosticos();
      }, error => {
        this.capturaDeErroresService.mapearErrores(error.status, error.error);
      });
    }
  }



  /**
   * Suscribe los cambios cuando se cambia el diagnostico
   */
  private suscribirCampoTextoDiagnosticos(): void {
    this.opcionesFiltradas = this.textoDiagnostico
      .map(valor => ( <HTMLInputElement>event.target).value )
      .debounceTime(1000)
      .distinctUntilChanged()
      .flatMap((textoABuscar) => {
        let diagnosticos = new Array<Diagnostico>();
        if (textoABuscar && textoABuscar !== '') {
          if (this.diagnosticosViewModel.respuestaDiagnosticos) {
            typeof textoABuscar === 'string' ?
              diagnosticos = this.filtrar(textoABuscar) :
              diagnosticos = this.filtrarObjeto(textoABuscar);
          }
        }
        return Observable.of(diagnosticos);
      });
  }


  /**
   * Elimina el diagnostico de la lista y tabla
   * @param {Diagnostico} diagnostico
   */
  public eliminarDiagnostico(diagnostico: Diagnostico) {
    if (diagnostico && diagnostico.id) {
      const index = this.diagnosticosViewModel.diagnosticosAGuardar.findIndex(elemento =>
        elemento.id === diagnostico.id
      );
      if (index !== null && index !== undefined) {
        this.diagnosticosViewModel.diagnosticosAGuardar.splice(index, 1);
      }
      this.actualizarDiagnosticos();
    }
    this.mostrarElminar = false;
  }

  /**
   * Actualiza los diagnosticos del formulario
   */
  public actualizarDiagnosticos(): void {
    this.formulario.get('diagnosticos').setValue(this.diagnosticosViewModel.diagnosticosAGuardar);
  }

  /**
   * Filtra un objeto de tipo Diagnostico por codigo y nombre
   * @param {Diagnostico} valor
   * @returns {Diagnostico[]}
   */
  public filtrarObjeto(valor: Diagnostico): Diagnostico[] {
    return this.diagnosticosViewModel.respuestaDiagnosticos
      ? this.diagnosticosViewModel.respuestaDiagnosticos.filter(
        option =>
          option.codigo.toLowerCase().indexOf(valor.codigo.toLowerCase()) !== -1 &&
          option.nombre.toLowerCase().indexOf(valor.nombre.toLowerCase()) !==
          -1
      )
      : new Array<Diagnostico>();
  }

  /**
   * Filtra por codigo y nombre
   * @param {string} valor
   * @returns {string[]}
   */
  private filtrar(valor: string): Diagnostico[] {
    return this.diagnosticosViewModel.respuestaDiagnosticos ?
      this.diagnosticosViewModel.respuestaDiagnosticos.filter(option =>
        option.codigo.toLowerCase().indexOf(valor.toLowerCase()) !== -1 ||
        option.nombre.toLowerCase().indexOf(valor.toLowerCase()) !== -1
      ) :
      new Array<Diagnostico>();
  }

  /**
   * Genera columnas para la tabla
   */
  private generarColumnas(): void {
    this.columnas = [

      { field: this.diagnosticosViewModel.mensajes.tabla.codigoCampo, header: this.diagnosticosViewModel.mensajes.tabla.codigo },
      { field: this.diagnosticosViewModel.mensajes.tabla.accion, header: this.diagnosticosViewModel.mensajes.tabla.accion },
      { field: this.diagnosticosViewModel.mensajes.tabla.nombreCampo, header: this.diagnosticosViewModel.mensajes.tabla.nombre }
    ];
  }

  /**
   * Controla la accion a realizar cuando se seleccione una opcion
   */
  public opcionSeleccionada(event): void {
    if (event && event.option && event.option.value) {
      this.agregarOpcionATabla(event.option.value);
    }
  }

  /**
   * Agrega el diagnostico a la tabla
   * @param {Diagnostico} diagnostico
   */
  private agregarOpcionATabla(diagnostico: any): void {
    if (diagnostico && diagnostico.id) {
      if (!this.diagnosticoEstaAgregado(diagnostico)) {
        this.mostrarElminar = true;
        this.diagnosticosViewModel.diagnosticosAGuardar.push(diagnostico);
      }
    }
    this.limpiarFiltros();
    this.actualizarDiagnosticos();
  }

  /**
   * Limpia los filtros de busqueda y campos
   */
  private limpiarFiltros(): void {

    this.formulario.get('diagnosticoSeleccionado').setValue(null);

  }

  /**
   * Indica si el diagnostico ya esta agregado en la lista
   * @param {Diagnostico} diagnostico
   * @returns {boolean}
   */
  private diagnosticoEstaAgregado(diagnostico: Diagnostico): boolean {
    return this.diagnosticosViewModel.diagnosticosAGuardar.some(elemento =>
      elemento.id === diagnostico.id
    );
  }

  /**
   * Muestra la informacion seleccionada como texto en el input
   * @param {Diagnostico} diagnostico
   * @returns {string | undefined}
   */
  public mostrarInformacion(diagnostico?: Diagnostico): string | undefined {
    return diagnostico && diagnostico.codigo && diagnostico.nombre ?
      diagnostico.codigo + ' ' + diagnostico.nombre :
      undefined;
  }

  /**
   * Inicializa variables del view model
   */
  private iniciarViewModel(): DiagnosticosViewModel {
    return new DiagnosticosViewModel(
      null,
      [],
      [],
      '',
      false,
      false,
      [],
    );
  }

  /**
   * Obtiene los datos del paciente
   */
  private getDatos(tipoDiganostico?: string): void {
    if (this.router.url === '/remision/nueva') {

    } else if (this.router.url === '/remision/editar') {
      this.bloquearCampos();
      if (this.agregadoRemision.datosRemision !== undefined && this.agregadoRemision.datosRemision !== null) {
        const idRemisionPk = this.agregadoRemision.datosRemision.idRemisionPK;
        this.remisionServices.getAgregadoDiagnostico(idRemisionPk).subscribe(
          diagnostico => {
              diagnostico.forEach((diagnosticosData) => {
                this.agregarOpcionATabla(diagnosticosData);
              });
          }, error =>   this.capturaDeErroresService.mapearErrores(error.status, error.error));
      }
    }

  }

  /** Suscribe los cambios del
   * formulario                                                                                                                                                                                 rio
   */
  private suscribirFormulario(): void {
    this.formulario.valueChanges.subscribe(
      formulario => {
        this.continuar.emit(this.formulario.valid);
        this.diagnosticos.emit(formulario);
      }
    );
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formulario = this.fb.group({
      diagnosticoSeleccionado: [ [] ],
      diagnosticos: [ null , Validators.compose([
        Validators.required
      ])]
    });
  }

  private bloquearCampos() {
    if (this.remisionService.remision) {
      if (this.remisionService.remision.estado === EstadosRemisionEnum.ADMITIDO ||
        this.remisionService.remision.estado === EstadosRemisionEnum.CANCELADO ||
        this.remisionService.remision.estado === EstadosRemisionEnum.EGRESADO ||
        this.remisionService.remision.estado === EstadosRemisionEnum.NO_ADMITIDO) {
        this.formulario.controls['diagnosticoSeleccionado'].disable();
        this.disableButton = true;

      }
    }
  }

}
