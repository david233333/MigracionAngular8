import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ListaLineaUnicaModel} from './listaLineaUnica.model';
import {MensajesService} from '../../../shared/services/mensajes.service';
import {RemisionServices} from '../../../domain/usecase/remision/remision.service';
import {DatosRemisionService} from '../../../domain/usecase/remision/datos-remision.service';
import {DatosAtencionService} from '../../../domain/usecase/remision/datos-atencion.service';
import {Subscription} from 'rxjs/Subscription';
import {MatDialog} from '@angular/material';
import {ModalLineaUnicaComponent} from './modal-linea-unica/modal-linea-unica.component';
import {LineaUnicaUseCaseService} from '../../../domain/usecase/lineaUnica/lineaUnicaUseCase-services';
import {ConsultaRemisionRequest} from '../../../infraestructure/request-model/novedad/consulta-remision.request';
import {CreacionNovedadService} from '../../../domain/usecase/novedad/creacion-novedad.service';
import {CapturarErrores} from '../../../shared/services/capturar-errores';

@Component({
  selector: 'sura-lista-linea-unica',
  templateUrl: './lista-linea-unica.component.html',
  styleUrls: ['./lista-linea-unica.component.scss']
})
export class ListaLineaUnicaComponent implements OnInit {

  public formulario: FormGroup;
  public show = false;
  readonly SELECCIONAR = 'SELECCIONAR';
  public listaLineaUnica: ListaLineaUnicaModel = this.iniciarViewModel();
  public cols: any[];
  public ciudadesSubscripcion = new Subscription();
  public first = 0;
  public row = 10;
  public totalRecords = 0;

  constructor(private fb: FormBuilder,
              private datosRemisionService: DatosRemisionService,
              private mensajesService: MensajesService,
              private remisionServices: RemisionServices,
              private datosAtencionService: DatosAtencionService,
              private dialog: MatDialog,
              private lineaUnicaServices: LineaUnicaUseCaseService,
              private consultarNovedad: CreacionNovedadService,
              private capturaDeErroresService: CapturarErrores) {
    this.generarColumnas();

  }

  ngOnInit() {
    this.consultarListaLineaUnica(this.listaLineaUnica.parametroLineaUnica);
    this.getDatos();
  }


  /**
   * consultar por ciudad
   *
   */
  public consultarCiudad($event) {
    console.log($event.value);
    this.consultarListaLineaUnica($event.value.idCiudad);
  }

  /**
   * Abre el modal
   */
  public abrirModalLineaUnica(rowData: any): void {
    const id = rowData.idRemision;
    this.lineaUnicaServices.buscarByIdLineaUnica(id).subscribe(lineaUnica => {
      if (!lineaUnica['bloqueoUsuario']) {
        rowData.bloqueoUsuario = true;
        rowData.estado = 'EN_GESTION';
        this.detalleLineaUnica(rowData);
      } else {
        this.mensajesService.mostrarMensajeError('Ya se encuentra en gestion');
      }
    }, error => {
      this.capturaDeErroresService.mapearErrores(error.status, error.error);
    }, () => {
    });

  }

  public onPageListaRemision(event: any): void {
    this.first = event.first;
    this.row = event.rows;
    console.log(event);
  }

  private getDatos() {
    this.crearFormulario();
    this.getCiudades();

  }


  private getDatosLista() {
    this.listaLineaUnica.respuestaRemisiones =
      [{
        nombrePaciente: 'Steve', identificacion: '3333333366', numeroRemision: '2d706c032173',
        fechaAdmision: '03-16-1991', contacto: 0, estadoRemision: 'Admitido', usuario: 'lopo'
      },
        {
          nombrePaciente: 'Johan Sebastian Salazar Muñoz',
          identificacion: '98989898', numeroRemision: '965eee141', fechaAdmision: '08-12-1996',
          usuario: 'jssm1',
          contacto: 4, estadoRemision: 'Rechazado'
        }];
  }

  /**
   * Genera columnas para la tabla
   */
  private generarColumnas(): void {
    this.cols = [
      {
        field: this.listaLineaUnica.mensajes.tabla.tipoDocumento,
        header: this.listaLineaUnica.mensajes.tabla.tipoDocumentoCampo
      }, {
        field: this.listaLineaUnica.mensajes.tabla.fechaAdmisionCampo,
        header: this.listaLineaUnica.mensajes.tabla.fechaAdmision
      },
      {
        field: this.listaLineaUnica.mensajes.tabla.usuarioCampo,
        header: this.listaLineaUnica.mensajes.tabla.usuario
      },
      {
        field: this.listaLineaUnica.mensajes.tabla.nombrePacienteCampo,
        header: this.listaLineaUnica.mensajes.tabla.nombrePaciente
      },
      {
        field: this.listaLineaUnica.mensajes.tabla.planSaludCampo,
        header: this.listaLineaUnica.mensajes.tabla.planSalud
      },
      {
        field: this.listaLineaUnica.mensajes.tabla.contactoCampo,
        header: this.listaLineaUnica.mensajes.tabla.contacto
      },
      {
        field: this.listaLineaUnica.mensajes.tabla.estadoRemisionCampo,
        header: this.listaLineaUnica.mensajes.tabla.estadoRemision
      },
      {
        field: this.listaLineaUnica.mensajes.tabla.identificacionCampo,
        header: this.listaLineaUnica.mensajes.tabla.identificacion
      }
    ];
  }

  private getCiudades(): void {
    this.ciudadesSubscripcion = this.datosAtencionService.getCiudades().subscribe((ciudades) => {
      this.listaLineaUnica.respuestaCiudades = ciudades;
    }, error => this.capturaDeErroresService.mapearErrores(error.status, error.error));
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formulario = this.fb.group({
      ciudad: ['', Validators.compose([])
      ]
    });
  }

  private iniciarViewModel(): ListaLineaUnicaModel {
    return new ListaLineaUnicaModel(null, null, null, [], '');
  }

  private consultarListaLineaUnica(parametro: string) {
    const paginaTabla = this.first / this.row;
    console.log(paginaTabla);
    console.log(this.first);
    console.log(parametro);
    this.lineaUnicaServices.consultarLineaUnica(parametro, paginaTabla, this.row)
      .subscribe(lista => {
        console.log(lista);
        this.listaLineaUnica.respuestaRemisiones = lista.content;
        this.totalRecords = lista.totalElements;
      }, error => this.capturaDeErroresService.mapearErrores(error.status, error.error));
  }

  private detalleLineaUnica(rowData: any) {
    const consultarRemision: ConsultaRemisionRequest = new ConsultaRemisionRequest
    (rowData.idRemision, rowData.numeroIdentificacion, rowData.tipoIdentificacion.idTipo);
    this.consultarNovedad.getConsultaRemisionLineaUnica(consultarRemision).subscribe(remisionPK => {
      const dialogRef = this.dialog.open(ModalLineaUnicaComponent, {
        width: '50%',
        disableClose: true,
        data: {paciente: rowData, remisionPK: remisionPK.novedad.idInformacionPacientePk}
      });
      dialogRef.afterClosed().subscribe(result => {
        this.consultarListaLineaUnica(this.listaLineaUnica.parametroLineaUnica);
      });
    }, error => {
      this.capturaDeErroresService.mapearErrores(error.status, error.error);
    });
  }
}
