import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnDestroy,
  SimpleChange,
  Input
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

import 'rxjs/add/operator/map';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';

import {DiagnosticosNovedadViewModel} from './diagnosticos-novedad.view-model';
import {MensajesService} from '../../../../shared/services/mensajes.service';
import {Diagnostico} from '../../../../domain/model/maestro/entity/diagnostico.model';
import {AgregadosNovedadService} from '../../../../shared/services/agregados-novedad.service';
import {DiagnosticosService} from '../../../../domain/usecase/novedad/diagnosticos.service';
import {DiagnosticoRequest} from '../../../../infraestructure/request-model/novedad/diagnostico.request';
import {Utilidades} from '../../../../shared/utils/utilidades';
import {ConsultaRemisionRequest} from '../../../../infraestructure/request-model/novedad/consulta-remision.request';
import {CreacionNovedadService} from '../../../../domain/usecase/novedad/creacion-novedad.service';
import {UsuarioService} from '../../../../shared/services/usuario.service';
import {CapturarErrores} from '../../../../shared/services/capturar-errores';

@Component({
  selector: 'sura-novedad-diagnosticos',
  templateUrl: './diagnosticos-novedad.component.html',
  styleUrls: ['./diagnosticos-novedad.component.scss']
})
export class DiagnosticosNovedadComponent implements OnInit, OnDestroy {
  @Output()
  public cargando: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  public diagnosticos: EventEmitter<Diagnostico[]> = new EventEmitter<Diagnostico[]>();

  public formulario: FormGroup;
  public diagnosticosViewModel: DiagnosticosNovedadViewModel = this.iniciarViewModel();
  public opcionesFiltradas: Observable<Diagnostico[]>;
  public columnas: any[];
  private diagnosticosSubscripcion: Subscription = new Subscription();
  private guardarDiagnosticoSubscripcion: Subscription = new Subscription();
  private datosDiagnosticosSubscripcion: Subscription = new Subscription();
  private remisionSubscription = new Subscription();
  public textoDiagnostico = new Subject<string>();
  public pruebaDiagnosticos: any[] = [];
  @Output()
  public regresarPrincipal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private diagnosticosService: DiagnosticosService,
    private mensajesService: MensajesService,
    private infoRemisionNovedad: AgregadosNovedadService,
    private creacionNovedadService: CreacionNovedadService,
    private util: Utilidades,
    private usuarioService: UsuarioService,
    private capturaDeErroresService: CapturarErrores
  ) {
    this.generarColumnas();
    this.crearFormulario();
    this.suscribirCampoTextoDiagnosticos();
  }

  ngOnInit() {
    this.getDatos();
  }

  ngOnDestroy() {
    this.diagnosticosSubscripcion.unsubscribe();
    this.guardarDiagnosticoSubscripcion.unsubscribe();
    this.datosDiagnosticosSubscripcion.unsubscribe();
    this.remisionSubscription.unsubscribe();
  }

  public habilitarGuardar(): boolean {
    return this.diagnosticosViewModel.diagnosticosAGuardar.length > 0
      ? false
      : true;
  }

  /**
   * guarda los diagnosticos
   */
  public cambiarDiagnosticos(): void {
    const CAMBIO_DIAGNOSTICO = new DiagnosticoRequest(
      this.infoRemisionNovedad.datosRemision.idRemision,
      this.diagnosticosViewModel.diagnosticosAGuardar,
      this.usuarioService.InfoUsuario
    );

    console.log('REQUEST - Diagnostico ', JSON.stringify(CAMBIO_DIAGNOSTICO));

    const ES_IGUAL = this.util.compararObjetos(
      this.diagnosticosViewModel.diagnosticosDeAgregados,
      this.diagnosticosViewModel.diagnosticosAGuardar
    );

    if (ES_IGUAL) {
      this.mensajesService.mostrarMensajeError(
        this.diagnosticosViewModel.mensajes.mensajesAlerta.noCambioDiagnostico
      );
    } else {
      this.guardarDiagnosticos(CAMBIO_DIAGNOSTICO);
    }
  }

  private guardarDiagnosticos(diagnostico: DiagnosticoRequest): void {
    this.guardarDiagnosticoSubscripcion = this.diagnosticosService
      .cambiarDiagnostico(diagnostico)
      .subscribe(
        response => {
          console.log('RESPONSE - Diagnostico ', response);
          this.mensajesService.mostrarMensajeExito(
            this.diagnosticosViewModel.mensajes.mensajesAlerta
              .exitoCambioDiagnostico
          );
          this.formulario.reset();
          this.regresarPrincipal.emit(true);
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
          this.regresarPrincipal.emit(false);
        },
        () => {
          this.guardarDiagnosticoSubscripcion.unsubscribe();
        }
      );
  }

  public traerDiagnosticos() {
    const valor: string = this.formulario.get('diagnosticoSeleccionado').value;
    const valorConsulta: string = valor.split(' ').join('_');
    if (valorConsulta.length > 2) {
      this.diagnosticosService
        .getDiagnosticos(valorConsulta.toUpperCase())
        .subscribe(
          diagnostico => {
            console.log(diagnostico);
            this.diagnosticosViewModel.respuestaDiagnosticos = diagnostico;
            this.suscribirCampoTextoDiagnosticos();
          },
          error => {
            this.capturaDeErroresService.mapearErrores(
              error.status,
              error.error
            );
          }
        );
    }
  }

  /**
   * Suscribe los cambios cuando se cambia el diagnostico
   */
  private suscribirCampoTextoDiagnosticos(): void {
    this.opcionesFiltradas = this.textoDiagnostico
      .map(valor => (<HTMLInputElement>event.target).value)
      .debounceTime(1000)
      .distinctUntilChanged()
      .flatMap(textoABuscar => {
        let diagnosticos = new Array<Diagnostico>();
        if (textoABuscar && textoABuscar !== '') {
          if (this.diagnosticosViewModel.respuestaDiagnosticos) {
            typeof textoABuscar === 'string'
              ? (diagnosticos = this.filtrar(textoABuscar))
              : (diagnosticos = this.filtrarObjeto(textoABuscar));
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
    if (diagnostico && diagnostico.codigo) {
      const index = this.diagnosticosViewModel.diagnosticosAGuardar.findIndex(
        elemento => elemento.codigo === diagnostico.codigo
      );
      if (index !== null && index !== undefined) {
        this.diagnosticosViewModel.diagnosticosAGuardar.splice(index, 1);
      }
      this.actualizarDiagnosticos();
    }
  }

  /**
   * Actualiza los diagnosticos del formulario
   */
  public actualizarDiagnosticos(): void {
    this.formulario
      .get('diagnosticos')
      .setValue(this.diagnosticosViewModel.diagnosticosAGuardar);
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
          option.codigo.toLowerCase().indexOf(valor.codigo.toLowerCase()) !==
          -1 &&
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
    return this.diagnosticosViewModel.respuestaDiagnosticos
      ? this.diagnosticosViewModel.respuestaDiagnosticos.filter(
        option =>
          option.codigo.toLowerCase().indexOf(valor.toLowerCase()) !== -1 ||
          option.nombre.toLowerCase().indexOf(valor.toLowerCase()) !== -1
      )
      : new Array<Diagnostico>();
  }

  /**
   * Genera columnas para la tabla
   */
  private generarColumnas(): void {
    this.columnas = [
      {
        field: this.diagnosticosViewModel.mensajes.tabla.codigoCampo,
        header: this.diagnosticosViewModel.mensajes.tabla.codigo
      },
      {
        field: this.diagnosticosViewModel.mensajes.tabla.nombreCampo,
        header: this.diagnosticosViewModel.mensajes.tabla.nombre
      }
    ];
  }

  /**
   * Controla la accion a realizar cuando se seleccione una opción
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
    if (diagnostico && diagnostico.codigo) {
      if (!this.diagnosticoEstaAgregado(diagnostico)) {
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
    return this.diagnosticosViewModel.diagnosticosAGuardar.some(
      elemento => elemento.codigo === diagnostico.codigo
    );
  }

  /**
   * Muestra la informacion seleccionada como texto en el input
   * @param {Diagnostico} diagnostico
   * @returns {string | undefined}
   */
  public mostrarInformacion(diagnostico?: Diagnostico): string | undefined {
    return diagnostico && diagnostico.codigo && diagnostico.nombre
      ? diagnostico.codigo + ' ' + diagnostico.nombre
      : undefined;
  }

  /**
   * Obtiene el agregado de remisión
   */
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
          this.getInfoDiagnosticos();
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
          this.remisionSubscription.unsubscribe();
        }
      );
  }

  private getInfoDiagnosticos(): void {
    if (this.infoRemisionNovedad.datosNovedad.idDiagnosticoPaciente !== null) {
      this.datosDiagnosticosSubscripcion = this.diagnosticosService
        .getAgregadoDiagnostico(
          this.infoRemisionNovedad.datosNovedad.idDiagnosticoPaciente
        )
        .subscribe(
          response => {

            this.diagnosticosViewModel.diagnosticosDeAgregados =
              response.diagnostico;

            response.diagnostico.forEach(diagnostico => {
              console.log('diagnostico a agregar ', diagnostico);
              this.agregarOpcionATabla(diagnostico);
            });
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
    }
  }

  /**
   * Inicializa variables del view model
   */
  private iniciarViewModel(): DiagnosticosNovedadViewModel {
    return new DiagnosticosNovedadViewModel(
      null,
      [],
      [],
      [],
      '',
      false,
      false,
      []
    );
  }

  /**
   * Obtiene los datos del paciente
   */
  private getDatos(): void {
    this.getAgregadoRemision();
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formulario = this.fb.group({
      diagnosticoSeleccionado: [[]],
      diagnosticos: [null, Validators.compose([Validators.required])]
    });
  }
}
