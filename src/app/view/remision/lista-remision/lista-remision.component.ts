import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MensajesService} from '../../../shared/services/mensajes.service';
import {DatosRemisionService} from '../../../domain/usecase/remision/datos-remision.service';
import {ListaRemisionViewModel} from './lista-remision.view-model';
import {Subscription} from 'rxjs/Subscription';
import {Router} from '@angular/router';
import {RemisionServices} from '../../../domain/usecase/remision/remision.service';
import {AgregadosRemisionService} from '../../../shared/services/agregados-remision.service';
import {DatosPacienteService} from '../../../domain/usecase/remision/datos-paciente.service';
import {DatosAtencionService} from '../../../domain/usecase/remision/datos-atencion.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {EstadosRemisionEnum} from '../../../shared/utils/enums/estados-remision.enum';
import {TipoAtencionEnum} from '../../../shared/utils/enums/tipo-atencion.enum';
import {FiltrosRemisionesRequest} from '../../../infraestructure/request-model/remision/filtros-remisiones.request';
import {CapturarErrores} from '../../../shared/services/capturar-errores';

@Component({
  selector: 'sura-lista-remision',
  templateUrl: './lista-remision.component.html',
  styleUrls: ['./lista-remision.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(-100%)'}),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({transform: 'translateX(100%)'}))
      ])
    ])
  ]
})
export class ListaRemisionComponent implements OnInit, OnDestroy {
  public formulario: FormGroup;
  public listaRemisionViewModel: ListaRemisionViewModel = this.iniciarViewModel();
  public cols: any[];
  readonly SELECCIONAR = 'SELECCIONAR';
  public tiposIdentificacionSubscripcion = new Subscription();
  public ciudadesSubscripcion = new Subscription();
  public planSaludSubscripcion = new Subscription();
  public institucionRemitenteSubscripcion = new Subscription();
  public show = false;
  public states = 'inactive';
  public disabled: boolean;
  public totalRegistros = 0;
  public loading: boolean;
  private listaRemisionSubscripcion = new Subscription();
  private agregadoRemisionSubscribe = new Subscription();
  private remisionServicesSubscribe = new Subscription();

  constructor(
    private fb: FormBuilder,
    private datosRemisionService: DatosRemisionService,
    private mensajesService: MensajesService,
    private route: Router,
    private remisionServices: RemisionServices,
    private agregadoRemision: AgregadosRemisionService,
    private datosPacienteService: DatosPacienteService,
    private datosAtencionService: DatosAtencionService,
    private capturaDeErroresService: CapturarErrores
  ) {
    this.crearFormulario();
    this.generarColumnas();
  }

  ngOnInit() {
    this.getEstadosRemision();
    this.getDatos();
  }

  ngOnDestroy() {
    this.listaRemisionSubscripcion.unsubscribe();
    this.agregadoRemisionSubscribe.unsubscribe();
    this.remisionServicesSubscribe.unsubscribe();
  }

  refresh() {
    this.getDatos();
  }

  public ahSide() {
    this.show = !this.show;
    this.states = this.states === 'active' ? 'inactive' : 'active';
  }

  /**
   * Edita la remisión de la lista y tabla
   * @param {Remision} remision
   */
  public editarRemision(remision: any) {
    const idRemision: string = remision.idRemision;
    this.remisionServices.getAgregadoRemision(idRemision).subscribe(
      resultado => {
        this.agregadoRemision.remision = resultado;
        this.agregadoRemision.datosRemision = resultado;
        this.route.navigate(['remision/editar']);
        console.log(resultado);
      },
      error => this.capturaDeErroresService.mapearErrores(error.status, error.error),
      () => {
      }
    );
  }

  /**
   * Limpia los controles de los filtros
   */
  public limpiar(): void {
    this.formulario.reset();
  }

  /**
   *
   */
  public buscar(): void {
    this.busqueda(0, 10);
  }

  public onPageListaRemisiones(event: any): void {
    this.busqueda(event.first, event.rows);
  }

  public institucionRemitente(idCiudad: any): void {
    this.institucionRemitenteSubscripcion = this.datosRemisionService
      .getInstituciones(idCiudad) // ANTES idCiudad.value ahora idCiudad
      .subscribe(institucion => {
          this.listaRemisionViewModel.respuestaInstituciones = institucion;
        }, error => this.capturaDeErroresService.mapearErrores(error.status, error.error),
      );
  }

  /*loadCarsLazy(event: LazyLoadEvent) {
    this.loading = true;

    //in a real application, make a remote request to load data using state metadata from event
    event.sortField = 'idRemision';
    event.sortField = 'estadoRemision';
    event.sortOrder = -1; //Sort order as number, 1 for asc and -1 for dec
    //filters: FilterMetadata object having field as key and filter value, filter matchMode as value

    //imitate db connection over a network
    this.busqueda(event.first, event.rows);
  }*/

  /**
   * Genera columnas para la tabla
   */
  private generarColumnas(): void {
    this.cols = [
      {
        field: this.listaRemisionViewModel.mensajes.tabla.numeroRemisionCampo,
        header: this.listaRemisionViewModel.mensajes.tabla.numeroRemision
      },
      {
        field: this.listaRemisionViewModel.mensajes.tabla.fechaRemisionCampo,
        header: this.listaRemisionViewModel.mensajes.tabla.fechaRemision
      },
      {
        field: this.listaRemisionViewModel.mensajes.tabla.nombrePacienteCampo,
        header: this.listaRemisionViewModel.mensajes.tabla.nombrePaciente
      },
      {
        field: this.listaRemisionViewModel.mensajes.tabla.planSaludCampo,
        header: this.listaRemisionViewModel.mensajes.tabla.planSalud
      },
      {
        field: this.listaRemisionViewModel.mensajes.tabla.estadoRemisionCampo,
        header: this.listaRemisionViewModel.mensajes.tabla.estadoRemision
      },
      {
        field: this.listaRemisionViewModel.mensajes.tabla.usuarioModificaCampo,
        header: this.listaRemisionViewModel.mensajes.tabla.usuarioModifica
      }
    ];
  }

  private busqueda(pagina: number, tamano: number): void {
    const paginaTabla = pagina / tamano;
    const CONSULTA = new FiltrosRemisionesRequest(
      this.formulario.controls['tipoDocumento'].value,
      this.formulario.controls['numeroDocumento'].value === ''
        ? null
        : this.formulario.controls['numeroDocumento'].value,
      this.formulario.controls['ciudad'].value,
      this.formulario.controls['institucion'].value,
      this.formulario.controls['estado'].value,
      this.formulario.controls['planSalud'].value,
      this.formulario.controls['remision'].value === ''
        ? null
        : this.formulario.controls['remision'].value,
      this.formulario.controls['tipoAtencion'].value,
      paginaTabla,
      tamano
    );
    this.listaRemisionViewModel.cargando = true;
    this.listaRemisionSubscripcion = this.datosRemisionService
      .getRemisiones(CONSULTA)
      .subscribe(
        response => {
          this.listaRemisionViewModel.respuestaRemisiones = response.content;
          this.totalRegistros = response.totalElements;
          this.loading = false;
        },
        error => {
          console.log(error.status);
          this.capturaDeErroresService.mapearErrores(error.status, error.error);

        },
        () => {
          this.listaRemisionViewModel.cargando = false;
        }
      );
  }

  /**
   * Obtiene los datos para las listas de los filtros
   */
  private getDatos(): void {
    this.getTiposIdentificacion();
    this.getCiudades();
    this.planesSalud();
    this.getTiposAtencion();
    this.busqueda(0, 10);
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): ListaRemisionViewModel {
    return new ListaRemisionViewModel(
      null,
      null,
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [1],
      []
    );
  }

  private planesSalud(): void {
    this.planSaludSubscripcion = this.datosPacienteService
      .getPlanesSalud()
      .subscribe(
        planes => {
          this.listaRemisionViewModel.respuestaPlanesSalud = planes;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);

        }
      );
  }

  private getCiudades(): void {
    this.ciudadesSubscripcion = this.datosAtencionService
      .getCiudades()
      .subscribe(ciudades => {
        this.listaRemisionViewModel.respuestaCiudades = ciudades;
      }, error => this.capturaDeErroresService.mapearErrores(error.status, error.error));
  }

  /**
   * Hace la peticion al servidor si no hay datos al iniciar la aplicacion
   * con un evento
   *
   */
  private getTiposIdentificacion(): void {
    this.tiposIdentificacionSubscripcion = this.datosPacienteService
      .getTiposIdentificacion()
      .subscribe(tiposDocumentos => {
          this.listaRemisionViewModel.respuestaTiposIdentificacion = tiposDocumentos;
        }, error => {
          console.log(error);
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
      );
  }

  /**
   * Obtiene los estados de la remision
   */
  private getEstadosRemision(): void {
    this.listaRemisionViewModel.estado = [
      EstadosRemisionEnum.NO_ADMITIDO,
      EstadosRemisionEnum.CANCELADO,
      EstadosRemisionEnum.ADMITIDO,
      EstadosRemisionEnum.EMPALME,
      EstadosRemisionEnum.NUEVO,
      EstadosRemisionEnum.PENDIENTE_ADMITIR,
      EstadosRemisionEnum.EGRESADO
    ];
  }

  /**
   * Obtiene los tipos de atención
   */
  private getTiposAtencion(): void {
    this.listaRemisionViewModel.tiposAtencion = [
      TipoAtencionEnum.AMBULATORIO,
      TipoAtencionEnum.DOMICILIARIO
    ];
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {

    this.formulario = this.fb.group({
      tipoDocumento: [null, Validators.compose([])],
      numeroDocumento: [
        null,
        Validators.compose([
          Validators.maxLength(20),
          Validators.pattern('[0-9]+')
        ])
      ],
      institucion: [null, Validators.compose([])],
      planSalud: [null, Validators.compose([])],
      estado: [null, Validators.compose([])],
      ciudad: [null, Validators.compose([])],
      remision: [null, Validators.compose([Validators.maxLength(20)])],
      tipoAtencion: [null, Validators.compose([])]
    });
  }
}
