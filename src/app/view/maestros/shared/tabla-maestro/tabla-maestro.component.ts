import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TablaMaestroViewModel} from './tabla-maestro.view-model';
import {ToasterService} from 'angular2-toaster';
import {CapturarErrores} from '../../../../shared/services/capturar-errores';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Ciudad} from '../../../../domain/model/maestro/entity/ciudad.model';
import {RequestMaestro} from '../../RequestMaestro.model';
import {DatosAtencionService} from '../../../../domain/usecase/remision/datos-atencion.service';
import {Diagnostico} from '../../../../domain/model/maestro/entity/diagnostico.model';
import {MatDialog} from '@angular/material';
import {ModalMaestroComponent} from '../modal-maestro/modal-maestro.component';
import {TipoSondajeIngreso} from '../../../../domain/model/maestro/entity/tipo-sondaje-ingreso.model';
import {PlanManejoService} from '../../../../domain/usecase/remision/plan-manejo.service';
import {CausasLlamadaNoContestada} from '../../../../domain/model/maestro/entity/CausasLlamadaNoContestada';
import {Dosis} from '../../../../domain/model/maestro/entity/dosis.model';
import {EstadoPaciente} from '../../../../domain/model/maestro/entity/estado-paciente.model';
import {MotivoAplicacionCuidador} from '../../../../domain/model/maestro/entity/motivo-aplicacion-cuidador.model';
import {MotivoFijarCita} from '../../../../domain/model/maestro/entity/motivo-fijar-cita.model';
import {Proveedor} from '../../../../domain/model/maestro/entity/proveedor.model';
import {TipoCuracion} from '../../../../domain/model/maestro/entity/tipo-curacion.model';
import {TipoEquipoBiomedico} from '../../../../domain/model/maestro/entity/tipo-equipo-biomedico.model';
import {TipoMuestra} from '../../../../domain/model/maestro/entity/tipo-muestra.model';
import {TipoTerapia} from '../../../../domain/model/maestro/entity/tipo-terapia.model';
import {Frecuencia} from '../../../../domain/model/maestro/entity/frecuencia.model';
import {Institucion} from '../../../../domain/model/maestro/entity/institucion.model';
import {Medicamento} from '../../../../domain/model/maestro/entity/medicamento.model';
import {MotivoCancelacion} from '../../../../domain/model/maestro/entity/motivo-cancelacion.model';
import {Municipio} from '../../../../domain/model/maestro/entity/municipio.model';
import {Piso} from '../../../../domain/model/maestro/entity/piso.model';
import {PlanSalud} from '../../../../domain/model/maestro/entity/plan-salud.model';
import {TipoNutricion} from '../../../../domain/model/maestro/entity/tipo-nutricion.model';
import {TipoIdentificacion} from '../../../../domain/model/maestro/entity/tipo-identificacion.model';
import {TiposSoporteNutricional} from '../../../../domain/model/maestro/entity/tipos-soporte-nutricional.model';
import {ViaAdministracion} from '../../../../domain/model/maestro/entity/via-administracion.model';
import {Programa} from '../../../../domain/model/maestro/entity/programa.model';
import {Valoracion} from '../../../../domain/model/maestro/entity/valoracion.model';

@Component({
  selector: 'sura-tabla-maestro',
  templateUrl: './tabla-maestro.component.html',
  styleUrls: ['./tabla-maestro.component.scss']
})
export class TablaMaestroComponent implements OnInit, OnChanges {

  public tablaViewModel: TablaMaestroViewModel = this.iniciarViewModel();
  public formulario: FormGroup;
  public totalRegistros = 0;
  public requestMaestro: RequestMaestro = this.iniciarRequestMaestro();
  public cols: any[];
  public fields: string[];

  @Input() value: number;


  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToasterService,
    private capturaErrores: CapturarErrores,
    private datosAtencionService: DatosAtencionService,
    private planManejoService: PlanManejoService
  ) {
    console.log(this.value);
  }

  ngOnInit() {
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.setMaestro(this.value);

  }

  crearMaestro() {
    console.log(this.tablaViewModel.listaMaestro);


  }

  editarMaestro(maestro) {
    console.log(maestro);
    this.requestMaestro.maestro = maestro;
    this.requestMaestro.actualizar = true;
    this.requestMaestro.eliminar = false;
    this.requestMaestro.crear = false;
    console.log(this.requestMaestro);
    const dialogRef = this.dialog.open(ModalMaestroComponent, {
      width: '90%',
      disableClose: false,
      data: {
        requestMaestro: this.requestMaestro,
        columns: this.cols
      }
    });
  }

  eliminarMaestro(rowData) {
    console.log(rowData);
  }

  private iniciarViewModel(): TablaMaestroViewModel {
    return new TablaMaestroViewModel(null, null, true);
  }

  private iniciarRequestMaestro(): RequestMaestro {
    return new RequestMaestro(null, null, null, null, null, null);
  }

  private setMaestro(value: number) {
    this.cols = null;
    this.tablaViewModel = this.iniciarViewModel();
    this.requestMaestro = this.iniciarRequestMaestro();

    switch (value) {
      case 1:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.causasLlamadaNoContestada;
        this.requestMaestro.maestro = new CausasLlamadaNoContestada(null, null, null);

        break;
      case 2:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.diagnostico;
        this.requestMaestro.maestro = new Diagnostico(null, null, null);

        this.planManejoService.consultarDiagnostico().subscribe(
          ciudades => {
            this.tablaViewModel.listaMaestro = ciudades;
            this.totalRegistros = ciudades.length;
          }
        );
        this.cols = [

          {field: 'codigo', header: 'Codigo'},
          {field: 'nombre', header: 'Nombre'}

        ];
        this.tablaViewModel.cargando = false;
        break;
      case 3:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.ciudad;
        this.requestMaestro.maestro = new Ciudad(null, null, null, null, null);

        this.planManejoService.consultarCiudad().subscribe(
          ciudades => {
            this.tablaViewModel.listaMaestro = ciudades;
            this.totalRegistros = ciudades.length;
          }
        );
        this.cols = [
          {field: 'idCiudad', header: 'Id'},
          {field: 'nombre', header: 'Nombre'},
          {field: 'codigoDANE', header: 'Código DANE'},
          {field: 'codigoIPS', header: 'Código IPS'}
        ];
        this.tablaViewModel.cargando = false;
        break;
      case 4:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.tipoSondajeIngreso;
        this.requestMaestro.maestro = new TipoSondajeIngreso(null, null, null, null);
        this.requestMaestro.nombreMicroservicio = 'Ingreso';
        this.planManejoService.consultarTipoSondajeIngreso().subscribe(
          tipoSondajes => {
            this.tablaViewModel.listaMaestro = tipoSondajes;
            this.totalRegistros = tipoSondajes.length;

          }
        );
        this.cols = [
          {field: 'idTipoSondaje', header: 'Tipo Sondaje'},
          {field: 'idSondaje', header: 'Id'},
          {field: 'sondaje', header: 'Sondaje'},
        ];
        this.tablaViewModel.cargando = false;
        break;
      case 5:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.dosis;
        this.requestMaestro.maestro = new Dosis(null, null, null, null);
        this.planManejoService.consultarDosis().subscribe(
          ciudades => {
            this.tablaViewModel.listaMaestro = ciudades;
            this.totalRegistros = ciudades.length;
          }
        );
        this.cols = [

          {field: 'idDosis', header: 'idDosis'},
          {field: 'tipo', header: 'Tipo'},
          {field: 'descripcion', header: 'Descripcion'}

        ];
        this.tablaViewModel.cargando = false;
        break;
      case 6:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.estadoPaciente;
        this.requestMaestro.maestro = new EstadoPaciente(null, null);
        this.requestMaestro.nombreMicroservicio = 'Novedades';
        this.planManejoService.consultarEstadoPaciente().subscribe(
          ciudades => {
            this.tablaViewModel.listaMaestro = ciudades;
            this.totalRegistros = ciudades.length;
          }
        );
        this.cols = [

          {field: 'id', header: 'id'},
          {field: 'nombre', header: 'Nombre'},


        ];
        this.tablaViewModel.cargando = false;
        break;
      case 7:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.motivoAplicacionCuidador;
        this.requestMaestro.maestro = new MotivoAplicacionCuidador(null, null);
        this.requestMaestro.nombreMicroservicio = 'Novedades';
        this.planManejoService.consultarMotivoAplicacionCuidador().subscribe(
          ciudades => {
            this.tablaViewModel.listaMaestro = ciudades;
            this.totalRegistros = ciudades.length;
          }
        );
        this.cols = [

          {field: 'id', header: 'Id'},
          {field: 'descripcion', header: 'Descripcion'},


        ];
        this.tablaViewModel.cargando = false;
        break;
      case 8:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.motivoFijarCita;
        this.requestMaestro.maestro = new MotivoFijarCita(null, null, null);
        this.requestMaestro.nombreMicroservicio = 'Novedades';
        this.planManejoService.consultarMotivoFijarCita().subscribe(
          ciudades => {
            this.tablaViewModel.listaMaestro = ciudades;
            this.totalRegistros = ciudades.length;
          }
        );
        this.cols = [

          {field: 'idMotivo', header: 'Id'},
          {field: 'descripcion', header: 'Descripcion'},


        ];
        this.tablaViewModel.cargando = false;
        break;
      case 9:

        break;
      case 10:

        break;
      case 11:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.proveedor;
        this.requestMaestro.maestro = new Proveedor(null, null);
        this.requestMaestro.nombreMicroservicio = 'Novedades';
        this.planManejoService.consultarProveedor().subscribe(
          ciudades => {
            this.tablaViewModel.listaMaestro = ciudades;
            this.totalRegistros = ciudades.length;
          }
        );
        this.cols = [

          {field: 'idProveedor', header: 'Id'},
          {field: 'descripcion', header: 'Descripcion'},


        ];
        this.tablaViewModel.cargando = false;
        break;
      case 12:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.tipoCuracion;
        this.requestMaestro.maestro = new TipoCuracion(null, null, null);
        this.requestMaestro.nombreMicroservicio = 'Novedades';
        this.planManejoService.consultarTipoCuracion().subscribe(
          ciudades => {
            this.tablaViewModel.listaMaestro = ciudades;
            this.totalRegistros = ciudades.length;
          }
        );
        this.cols = [

          {field: 'idProveedor', header: 'Id'},
          {field: 'descripcion', header: 'Descripcion'},


        ];
        this.tablaViewModel.cargando = false;
        break;
      case 13:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.tipoEquipoBiomedico;
        this.requestMaestro.maestro = new TipoEquipoBiomedico(null, null, null);
        this.requestMaestro.nombreMicroservicio = 'Novedades';
        this.planManejoService.consultarTipoEquipoMedico().subscribe(
          ciudades => {
            this.tablaViewModel.listaMaestro = ciudades;
            this.totalRegistros = ciudades.length;
          }
        );
        this.cols = [

          {field: 'idEquipoBiomedico', header: 'Id'},
          {field: 'descripcion', header: 'Descripcion'},


        ];
        this.tablaViewModel.cargando = false;
        break;
      case 14:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.tipoMuestra;
        this.requestMaestro.maestro = new TipoMuestra(null, null);
        this.requestMaestro.nombreMicroservicio = 'Novedades';
        this.planManejoService.consultarTipoMuestra().subscribe(
          ciudades => {
            this.tablaViewModel.listaMaestro = ciudades;
            this.totalRegistros = ciudades.length;
          }
        );
        this.cols = [

          {field: 'idTomaMuestra', header: 'Id'},
          {field: 'descripcion', header: 'Descripcion'},


        ];
        this.tablaViewModel.cargando = false;
        break;
      case 15:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.tipoTerapia;
        this.requestMaestro.maestro = new TipoTerapia(null, null, null);
        this.requestMaestro.nombreMicroservicio = 'Novedades';
        this.planManejoService.consultarTipoTerapia().subscribe(
          ciudades => {
            this.tablaViewModel.listaMaestro = ciudades;
            this.totalRegistros = ciudades.length;
          }
        );
        this.cols = [

          {field: 'idTipoTerapia', header: 'Id'},
          {field: 'descripcion', header: 'Descripcion'},


        ];
        this.tablaViewModel.cargando = false;
        break;
      case 16:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.frecuencia;
        this.requestMaestro.maestro = new Frecuencia(null, null, null, null);
        this.planManejoService.consultarFrecuencia().subscribe(
          ciudades => {
            this.tablaViewModel.listaMaestro = ciudades;
            this.totalRegistros = ciudades.length;
          }
        );
        this.cols = [

          {field: 'idFrecuencia', header: 'Id'},
          {field: 'tipo', header: 'Tipo'},
          {field: 'descripcion', header: 'Descripcion'},


        ];
        this.tablaViewModel.cargando = false;
        break;
      case 17:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.institucion;
        this.requestMaestro.maestro = new Institucion(null, null, null, null);
        this.planManejoService.consultarInstitucion().subscribe(
          ciudades => {
            this.tablaViewModel.listaMaestro = ciudades;
            this.totalRegistros = ciudades.length;
          }
        );
        this.cols = [

          {field: 'idCiudad', header: 'IdCiudad'},
          {field: 'idInstitucion', header: 'IdInstitucion'},
          {field: 'nombre', header: 'Nombre'},

        ];
        this.tablaViewModel.cargando = false;
        break;
      case 18:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.medicamento;
        this.requestMaestro.maestro = new Medicamento(null, null, null, null, null);
        this.planManejoService.consultarMedicamento().subscribe(
          ciudades => {
            this.tablaViewModel.listaMaestro = ciudades;
            this.totalRegistros = ciudades.length;
          }
        );
        this.cols = [

          {field: 'idMedicamento', header: 'IdMedicamento'},
          {field: 'codigoMedicamento', header: 'Codigo Medicamento'},
          {field: 'nombre', header: 'Nombre'},
          {field: 'presentacion', header: 'Presentacion'},


        ];
        this.tablaViewModel.cargando = false;
        break;
      case 19:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.motivoCancelacion;
        this.requestMaestro.maestro = new MotivoCancelacion(null, null, null);
        this.planManejoService.consultarMotivoCancelacion().subscribe(
          ciudades => {
            this.tablaViewModel.listaMaestro = ciudades;
            this.totalRegistros = ciudades.length;
          }
        );
        this.cols = [

          {field: 'idMotivo', header: 'IdMotivo'},
          {field: 'descripcion', header: 'Descripcion'}

        ];
        this.tablaViewModel.cargando = false;
        break;
      case 20:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.municipio;
        this.requestMaestro.maestro = new Municipio(null, null, null, null);
        this.planManejoService.consultarMunicipio().subscribe(
          ciudades => {
            this.tablaViewModel.listaMaestro = ciudades;
            this.totalRegistros = ciudades.length;
          }
        );
        this.cols = [

          {field: 'idCiudad', header: 'IdCiudad'},
          {field: 'idMunicipio', header: 'IdMunicipio'},
          {field: 'nombre', header: 'Nombre'},
          {field: 'longitud', header: 'Longitud'},
          {field: 'latitud', header: 'Latitud'}

        ];
        this.tablaViewModel.cargando = false;
        break;
      case 21:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.piso;
        this.requestMaestro.maestro = new Piso(null, null, null, null, null);
        this.planManejoService.consultarPiso().subscribe(
          ciudades => {
            this.tablaViewModel.listaMaestro = ciudades;
            this.totalRegistros = ciudades.length;
          }
        );
        this.cols = [

          {field: 'nombre', header: 'Nombre'},
          {field: 'tipoPiso', header: 'Tipo Piso'},
          {field: 'idCiudad', header: 'Id Ciudad'},
          {field: 'idPrograma', header: 'Id Programa'},


        ];
        this.tablaViewModel.cargando = false;
        break;
      case 22:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.planSalud;
        this.requestMaestro.maestro = new PlanSalud(null, null, null, null);
        this.planManejoService.consultarPlanSalud().subscribe(
          ciudades => {
            this.tablaViewModel.listaMaestro = ciudades;
            this.totalRegistros = ciudades.length;
          }
        );
        this.cols = [

          {field: 'id', header: 'Id'},
          {field: 'nombre', header: 'Nombre'},
          {field: 'nombreAseguradora', header: 'Nombre Aseguradora'},
          {field: 'idPlan', header: 'Id Plan'},


        ];
        this.tablaViewModel.cargando = false;
        break;
      case 23:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.tipoNutricion;
        this.requestMaestro.maestro = new TipoNutricion(null, null, null, null);
        this.planManejoService.consultarTipoNutricion().subscribe(
          ciudades => {
            this.tablaViewModel.listaMaestro = ciudades;
            this.totalRegistros = ciudades.length;
          }
        );
        this.cols = [

          {field: 'idTipo', header: 'Id Tipo'},
          {field: 'tipo', header: 'Tipo'},
          {field: 'idNutricion', header: 'Id Nutricion'},
          {field: 'descripcion', header: 'Descripcion'},


        ];
        this.tablaViewModel.cargando = false;
        break;
      case 24:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.tiposIdentificacion;
        this.requestMaestro.maestro = new TipoIdentificacion(null, null, null, null, null);
        this.planManejoService.consultarTipoIdentificacion().subscribe(
          ciudades => {
            this.tablaViewModel.listaMaestro = ciudades;
            this.totalRegistros = ciudades.length;
          }
        );
        this.cols = [

          {field: 'idTipo', header: 'Id Tipo'},
          {field: 'nombre', header: 'Nombre'},
          {field: 'codigoPos', header: 'Codigo Pos'},
          {field: 'codigoSura', header: 'Codigo Sura'},


        ];
        this.tablaViewModel.cargando = false;
        break;
      case 25:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.tipoSoporteNutricional;
        this.requestMaestro.maestro = new TiposSoporteNutricional(null, null);
        this.planManejoService.consultarTipoSoporteNutricional().subscribe(
          ciudades => {
            this.tablaViewModel.listaMaestro = ciudades;
            this.totalRegistros = ciudades.length;
          }
        );
        this.cols = [

          {field: 'idTipo', header: 'Id Tipo'},
          {field: 'descripcion', header: 'Descripcion'},


        ];
        this.tablaViewModel.cargando = false;

        break;
      case 26:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.viaAdministracion;
        this.requestMaestro.maestro = new ViaAdministracion(null, null, null, null);
        this.planManejoService.consultarViaAdministracion().subscribe(
          ciudades => {
            this.tablaViewModel.listaMaestro = ciudades;
            this.totalRegistros = ciudades.length;
          }
        );
        this.cols = [

          {field: 'idViaAdministracion', header: 'Id Via Administracion'},
          {field: 'descripcion', header: 'Descripcion'},
          {field: 'tipo', header: 'Tipo'}

        ];
        this.tablaViewModel.cargando = false;
        break;
      case 27:

        this.tablaViewModel.cargando = false;
        break;
      case 28:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.programa;
        this.requestMaestro.maestro = new Programa(null, null, null, null, null, null);
        this.requestMaestro.nombreMicroservicio = 'Ingreso';
        this.planManejoService.consultarPrograma().subscribe(
          ciudades => {
            this.tablaViewModel.listaMaestro = ciudades;
            this.totalRegistros = ciudades.length;
          }
        );
        this.cols = [

          {field: 'idPrograma', header: 'Id Programa'},
          {field: 'nombre', header: 'Nombre'},
          {field: 'especialidad', header: 'Especialidad'},
          {field: 'profesional', header: 'Profesional'}

        ];
        this.tablaViewModel.cargando = false;
        break;
      case 29:
        this.requestMaestro.nombreMaestro = this.tablaViewModel.mensajes.listaMaestros.valoraciones;
        this.requestMaestro.maestro = new Valoracion(null, null, null, null, null, null, null);
        this.requestMaestro.nombreMicroservicio = 'Ingreso';
        this.planManejoService.consultarValoraciones().subscribe(
          ciudades => {
            this.tablaViewModel.listaMaestro = ciudades;
            this.totalRegistros = ciudades.length;
          }
        );
        this.cols = [

          {field: 'idValoracion', header: 'Id Valoracion'},
          {field: 'nombre', header: 'Nombre'},
          {field: 'idTipo', header: 'Id Tipo'},
          {field: 'especialidad', header: 'Especialidad'},
          {field: 'profesional', header: 'Profesional'},

        ];
        this.tablaViewModel.cargando = false;
        break;
      default:
        break;
    }

  }


}
