import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ComunGatewayAbstract} from '../../model/comun/gateway/comun-gateway.abstract';
import {PerfilService} from '../../../shared/services/perfil.service';
import {DatosAtencionPaciente} from '../../model/remision/entity/datos-atencion.model';
import {DatosRemision} from '../../model/remision/entity/datos-remision.model';
import {Admision} from '../../model/remision/entity/admision.model';
import {Paciente} from '../../model/remision/entity/paciente.model';
import {Remision} from '../../model/remision/entity/remision.model';
import {Ubicacion} from '../../model/remision/entity/ubicacion.model';
import {RemisionGatewayAbstract} from '../../model/remision/gateway/remision-gateway.abstract';
import {Tratamiento} from '../../model/remision/entity/plan-manejo/tratamiento.model';
import {Valoracion} from '../../model/remision/entity/plan-manejo/valoracion.model';
import {Procedimientos} from '../../model/remision/entity/plan-manejo/procedimiento.model';
import {TipoIdentificacion} from '../../model/maestro/entity/tipo-identificacion.model';
import {Diagnostico} from '../../model/remision/entity/diagnostico.model';
import {GuardarRemisionRequest} from '../../../infraestructure/request-model/GuardarRemisionRequest';
import {PlanManejo} from '../../model/remision/entity/plan-manejo/plan-manejo.model';
import {MensajesService} from '../../../shared/services/mensajes.service';
import {Router} from '@angular/router';
import {Municipio} from '../../model/maestro/entity/municipio.model';
import {Ciudad} from '../../model/maestro/entity/ciudad.model';
import {Usuario} from '../../../shared/models/usuario.model';
import {EstadosRemisionEnum} from '../../../shared/utils/enums/estados-remision.enum';
import {GuardarRemisionRequestDisponibilidad} from '../../../infraestructure/request-model/GuardarRemisionRequestDisponibilidad';
import {ProgramacionCitaService} from '../programacion/programacion-cita.service';
import {ProgramacionGatewayAbstract} from '../../model/programacion/gateway/programacion-gateway.abstract';
import {RemisionRequest} from '../../model/remision/entity/RemisionRequest';
import {datosPaciente} from '../../../view/remision/datos-paciente/paciente-datos';
import {MatDialog} from '@angular/material';
import {ModalHorarioDisponibleComponent} from '../../../view/remision/admision/modal-horario-disponible/modal-horario-disponible.component';
import {tick} from '@angular/core/testing';
import {SlotBooking} from '../../model/remision/entity/SlotBooking';
import {LoginUsecaseServices} from '../seguridad/loginUsecase-services';

@Injectable()
export class RemisionContenedorService {

  public remision: Remision = this.generarObjetoRemision(); //genera objeto Remision
  public datosPaciente: Paciente = this.generarObjetoDatosPaciente(); //genera objeto DatosPaciente
  public datosAtencionPaciente: DatosAtencionPaciente = this.generarObjetoDatosAtencion(); //genera objeto DatosPacienteAtencion
  public diagnosticos: Diagnostico[] = this.generarObjetoDiagnosticos(); //genera objeto Diagnosticos
  public datosRemision: DatosRemision = this.generarObjetoDatosRemision(); //genera objeto DatosRemision
  public tratamientosPlanManejo: Tratamiento[] = this.generarObjetoTratamientosPlanManejo();  //genera objeto TratamientosPlanManejo
  public procedimientosPlanManejo: Procedimientos = this.generarObjetoProcedimientosPlanManejo(); //genera objeto ProcedimientosPlanManejo
  public valoracionesPlanManejo: Valoracion = this.generarObjetoValoracionesPlanManejo();  //genera objeto ValoracionesPlanManejo
  public admision: Admision = this.generarObjetoAdmision(); //genera ObjetoAdmision

  public guardarRemisionRequest = this.iniciarModelRemisionGuardar();  //inicializa remision request Guardar
  public guardarRemisionRequestSecond: GuardarRemisionRequestDisponibilidad; //inicializa remision request Guardar2


  public pacienteAcepta: boolean;
  public edicion = false;
  public serviciosBasicos: boolean;
  public esOxigeno: boolean;
  private direccionCentroDeEstadi: any;
  estado: any;


  constructor(
    private comunService: ComunGatewayAbstract,
    private perfilService: PerfilService, private remisionGatewayAbstract: RemisionGatewayAbstract,
    private mensajesService: MensajesService, private router: Router,
    private programacionService: ProgramacionCitaService,
    private seguridadService: LoginUsecaseServices,
    private programacionGateway: ProgramacionGatewayAbstract,
    private dialog: MatDialog) {
  }

  /**
   * Obtiene los tipos de identificacion
   * @returns {Observable<Respuesta>}
   */
  public getTiposIdentificacion(): Observable<TipoIdentificacion[]> {
    return this.comunService.getTiposIdentificacion();
  }

  /**
   * Genera el objeto remision
   * @returns {Remision}
   */
  public generarObjetoRemision(remision?: any): Remision {
    if (remision) {
      this.remision.idRemisionPk = remision.idRemisionPK;
      this.remision.idRemision = remision.idRemision;
      this.remision.fechaCreacion = null;
      this.remision.estado = remision.estado;
      this.remision.aceptaIngresoVoluntario = false;
      this.remision.tieneServiciosBasicos = false;
      this.remision.motivoCancelacion = null;
      this.remision.observacionCancelacion = null;
      this.remision.usuario = remision.usuario;
      console.log('punto de partida vieja', this.remision);
    } else {
      this.remision = new Remision(
        null,
        '',
        null,
        '',
        null,
        null,
        null,
        null,
        null,
        new Usuario(null, null, null, null, null, null, null, null),
        null,
        null
      );
      console.log('punto de final vieja', this.remision);
    }
    return this.remision;
  }

  /**
   * Genera el objeto paciente
   * @param datos
   * @returns {PacienteRemision}
   */
  public generarObjetoDatosPaciente(paciente?: any): Paciente {
    console.log('este es el paciente david', paciente);
    if (paciente) {
      this.datosPaciente.nombre = paciente.nombre ? paciente.nombre : '';
      this.datosPaciente.apellido = paciente.apellido ? paciente.apellido : '';
      this.datosPaciente.tipoIdentificacion = paciente.tipoIdentificacion ? paciente.tipoIdentificacion : '';
      this.datosPaciente.numeroIdentificacion = paciente.numeroIdentificacion ? paciente.numeroIdentificacion : '';
      this.datosPaciente.fechaNacimiento = paciente.fechaNacimiento ? paciente.fechaNacimiento : '';
      this.datosPaciente.edad = paciente.edad ? paciente.edad : '';
      this.datosPaciente.sexo = paciente.sexo ? paciente.sexo : '';
      this.datosPaciente.estadoCivil = paciente.estadoCivil ? paciente.estadoCivil : '';
      this.datosPaciente.ocupacion = paciente.ocupacion ? paciente.ocupacion : '';
      this.datosPaciente.email = paciente.email ? paciente.email : '';
      this.datosPaciente.tipoAsegurador = paciente.tipoAsegurador ? paciente.tipoAsegurador : '';
      this.datosPaciente.estadoSuspension = paciente.estadoSuspension ? paciente.estadoSuspension : '';
      this.datosPaciente.coberturaDomiciliaria = paciente.coberturaDomiciliaria ? paciente.coberturaDomiciliaria : false;
      this.datosPaciente.fechaLimiteCobertura = paciente.fechaLimiteCobertura ? paciente.fechaLimiteCobertura : '';
      this.datosPaciente.tipoAfiliacion = paciente.tipoAfiliacion ? paciente.tipoAfiliacion : '';
      this.datosPaciente.nivelIngreso = paciente.nivelIngreso ? paciente.nivelIngreso : '';
      this.datosPaciente.ipsBasicaAsignada = paciente.ipsBasicaAsignada ? paciente.ipsBasicaAsignada : '';
      this.datosPaciente.lugarAtencion = paciente.lugarAtencion ? paciente.lugarAtencion : '';
      this.datosPaciente.unidadEdad = paciente.unidadEdad ? paciente.unidadEdad : '';
      this.datosPaciente.bebeCanguro = paciente.bebeCanguro ? paciente.bebeCanguro : [];
      this.datosPaciente.tipoPlanParticular = paciente.tipoPlanParticular ? paciente.tipoPlanParticular : null;
      this.datosPaciente.codigoARL = paciente.codigoARL ? paciente.codigoARL : null;
    } else {
      this.datosPaciente = new Paciente(
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        [],
        null,
        null,
        null
      );
    }
    return this.datosPaciente;
  }

  /**
   * Genera el objeto datos de atencion
   * @param datos
   * @returns {DatosAtencion}
   */
  public generarObjetoDatosAtencion(datosAtencionPaciente?: any): DatosAtencionPaciente {
    if (datosAtencionPaciente) {
      this.datosAtencionPaciente.nombreCuidador = datosAtencionPaciente.nombreCuidador ?
        datosAtencionPaciente.nombreCuidador : '';
      this.datosAtencionPaciente.nombreResponsable = datosAtencionPaciente.nombreResponsable ?
        datosAtencionPaciente.nombreResponsable : '';
      this.datosAtencionPaciente.telefonoPaciente = datosAtencionPaciente.telefonoPaciente ?
        datosAtencionPaciente.telefonoPaciente : '';
      this.datosAtencionPaciente.celularPaciente = datosAtencionPaciente.celularPaciente ?
        datosAtencionPaciente.celularPaciente : '';
      this.datosAtencionPaciente.celularPaciente2 = datosAtencionPaciente.celularPaciente2 ?
        datosAtencionPaciente.celularPaciente2 : '';
      this.datosAtencionPaciente.ubicacion.latitud = datosAtencionPaciente.latitud ?
        datosAtencionPaciente.latitud : '';
      this.datosAtencionPaciente.ubicacion.longitud = datosAtencionPaciente.longitud ?
        datosAtencionPaciente.longitud : '';
      this.datosAtencionPaciente.ubicacion.direccion = datosAtencionPaciente.ubicacion ?
        datosAtencionPaciente.ubicacion['direccion'] : '';
      this.datosAtencionPaciente.ubicacion.tipoVia = datosAtencionPaciente.ubicacion ?
        datosAtencionPaciente.ubicacion['tipoVia'] : '';
      this.datosAtencionPaciente.ubicacion.numero1 = datosAtencionPaciente.ubicacion ?
        datosAtencionPaciente.ubicacion['numero1'] : '';
      this.datosAtencionPaciente.ubicacion.longitud = datosAtencionPaciente.ubicacion ?
        datosAtencionPaciente.ubicacion['longitud'] : '';
      this.datosAtencionPaciente.ubicacion.latitud = datosAtencionPaciente.ubicacion ?
        datosAtencionPaciente.ubicacion['latitud'] : '';
      this.datosAtencionPaciente.ubicacion.letraCruce1 = datosAtencionPaciente.ubicacion ?
        datosAtencionPaciente.ubicacion['letraCruce1'] : '';
      this.datosAtencionPaciente.ubicacion.puntoCardinal1 = datosAtencionPaciente.ubicacion ?
        datosAtencionPaciente.ubicacion['puntoCardinal1'] : '';
      this.datosAtencionPaciente.ubicacion.nroInterseccion = datosAtencionPaciente.ubicacion ?
        datosAtencionPaciente.ubicacion['nroInterseccion'] : '';
      this.datosAtencionPaciente.ubicacion.letraCruce2 = datosAtencionPaciente.ubicacion ?
        datosAtencionPaciente.ubicacion['letraCruce2'] : '';
      this.datosAtencionPaciente.ubicacion.puntoCardinal2 = datosAtencionPaciente.ubicacion ?
        datosAtencionPaciente.ubicacion['puntoCardinal2'] : '';
      this.datosAtencionPaciente.ubicacion.numero2 = datosAtencionPaciente.ubicacion ?
        datosAtencionPaciente.ubicacion['numero2'] : '';
      this.datosAtencionPaciente.ubicacion.informacionComplementaria = datosAtencionPaciente.ubicacion ?
        datosAtencionPaciente.ubicacion['informacionComplementaria'] : '';
      this.datosAtencionPaciente.ubicacion.municipio =
        datosAtencionPaciente.ubicacion ? datosAtencionPaciente.ubicacion['municipio'] :
          new Municipio(null, null, null, null);
      this.datosAtencionPaciente.ubicacion.barrio = datosAtencionPaciente.ubicacion ?
        datosAtencionPaciente.ubicacion['barrio'] : '';
      this.datosAtencionPaciente.ubicacion.ciudadPrincipal = datosAtencionPaciente.ciudadPrincipal ?
        datosAtencionPaciente.ciudadPrincipal : new Ciudad(null, null, null, null, null);
      this.pacienteAcepta = datosAtencionPaciente.condicionPacienteAcepta ?
        datosAtencionPaciente.condicionPacienteAcepta : null;
      this.serviciosBasicos = datosAtencionPaciente.condicionServicios ? datosAtencionPaciente.condicionServicios : null;
      this.datosAtencionPaciente.ubicacion.sinNomenclatura =
        datosAtencionPaciente.ubicacion ? datosAtencionPaciente.ubicacion['sinNomenclatura'] : '';
      this.datosAtencionPaciente.ubicacion.sinNomenclatura = datosAtencionPaciente.ubicacion ?
        datosAtencionPaciente.ubicacion['sinNomenclatura'] : false;
      this.esOxigeno = datosAtencionPaciente.esOxigeno ? datosAtencionPaciente.esOxigeno : false;

    } else {
      this.datosAtencionPaciente = new DatosAtencionPaciente(
        null,
        null,
        null,
        null,
        null,
        null,
        new Ubicacion(
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          new Municipio(null, null, null, null),
          null,
          new Ciudad(null, null, null, null, null),
          null
        )
      );
    }

    return this.datosAtencionPaciente;
  }


  /**
   * Genera el objeto datos de diagnosticos
   * @param datos
   * @returns {Diagnostico[]}
   */
  public generarObjetoDiagnosticos(diagnosticos?: any): Diagnostico[] {
    if (diagnosticos) {
      this.diagnosticos = diagnosticos.map(
        elemento => {
          return new Diagnostico(elemento.idRemisionPK, elemento.id, elemento.codigo, elemento.nombre);
        }
      );
    } else {
      this.diagnosticos = [];
    }

    return this.diagnosticos;
  }

  /**
   * Genera el objeto datos de remision
   * @param datos
   * @returns {DatosRemision}
   */
  public generarObjetoDatosRemision(datosRemision?: any): DatosRemision {
    if (datosRemision) {
      this.datosRemision.institucionRemite = datosRemision.institucion ? datosRemision.institucion : '';
      this.datosRemision.telefonoInstitucionRemite = datosRemision.telefono ? datosRemision.telefono : '';
      this.datosRemision.resumenHistoriaClinica = datosRemision.resumenHistoriaClinica ? datosRemision.resumenHistoriaClinica : '';
      this.datosRemision.observaciones = datosRemision.observaciones ? datosRemision.observaciones : '';
      this.datosRemision.tipoIdentificacion = datosRemision.tipoDocumentoMedico ? datosRemision.tipoDocumentoMedico : '';
      this.datosRemision.numeroIdentificacionMedico = datosRemision.numeroDocumentoMedico ? datosRemision.numeroDocumentoMedico : '';
      this.datosRemision.nombreMedico = datosRemision.nombreMedico ? datosRemision.nombreMedico : '';
      this.datosRemision.especialidad = datosRemision.especialidadMedico ? datosRemision.especialidadMedico : '';
      this.datosRemision.emailContacto = datosRemision.emailContacto ? datosRemision.emailContacto : '';
      this.datosRemision.peso = datosRemision.peso ? datosRemision.peso : '';
      this.datosRemision.medidaDepeso = datosRemision.medidaDepeso ? datosRemision.medidaDepeso : '';
    } else {
      this.datosRemision = new DatosRemision(
        null,
        '',
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      );
    }

    return this.datosRemision;
  }

  /**

   * Genera el objeto datos de tratamientos
   * @param tratamientosPlanManejo
   * @returns {Tratamiento[]}
   */
  public generarObjetoTratamientosPlanManejo(tratamientosPlanManejo?: any): Tratamiento[] {
    if (tratamientosPlanManejo) {
      this.tratamientosPlanManejo = tratamientosPlanManejo.map(
        elemento => {
          return new Tratamiento(elemento.id, elemento.idTratamiento, elemento.idRemisionPK, elemento.tratamiento,
            elemento.medicamento, elemento.cantidadDosis, elemento.unidadDosis,
            elemento.viaAdministracion, elemento.diluyente, elemento.cantidadDiluyente, elemento.frecuencia,
            elemento.duracion, elemento.ultimaAplicacion, elemento.noPBS, elemento.dosisFaltantes);
        }
      );
    } else {
      this.tratamientosPlanManejo = [];
    }

    return this.tratamientosPlanManejo;
  }


  /**
   * Genera el objeto datos de procedimientos
   * @param procedimientosPlanManejo
   * @returns {Procedimiento}
   */
  public generarObjetoProcedimientosPlanManejo(procedimientosPlanManejo?: any): Procedimientos {

    if (procedimientosPlanManejo) {
      this.procedimientosPlanManejo =

        new Procedimientos(procedimientosPlanManejo.curaciones, procedimientosPlanManejo.fototerapias,
          procedimientosPlanManejo.sondajes, procedimientosPlanManejo.secreciones, procedimientosPlanManejo.soporteNutricionales);

    } else {
      this.procedimientosPlanManejo = new Procedimientos([],
        [],
        [],
        [],
        []);
    }

    return this.procedimientosPlanManejo;
  }

  /**
   * Genera el objeto datos de valoraciones
   * @param valoracionesPlanManejo
   * @returns {Valoracion}
   */
  public generarObjetoValoracionesPlanManejo(valoracionesPlanManejo?: any): Valoracion {
    if (valoracionesPlanManejo) {
      this.valoracionesPlanManejo = new Valoracion(valoracionesPlanManejo.valoraciones,
        valoracionesPlanManejo.valoracionesPoliza, valoracionesPlanManejo.fechaExamenMedico);
    } else {
      this.valoracionesPlanManejo = new Valoracion([], [], null);
    }

    return this.valoracionesPlanManejo;
  }


  /**
   * Genera el objeto datos de Admision
   * @param datos
   * @returns {Admision}
   */
  public generarObjetoAdmision(admision?: any): Admision {
    console.log('admision, David', admision);
    if (admision) {
      admision.pisoDomiciliario = admision ? admision.piso : null;
      admision.tipoAtencion = admision.esDomiciliario;
      // console.log(admision.tipoAtencion);
      // admision.programa = admision.programaValidador;
      // admision.pisoDomiciliario = admision.piso;
      this.direccionCentroDeEstadi = admision.ubicacionCentro;
      this.admision = admision;
      this.admision.fechaAdmision = admision.fechaAdmision;
      this.admision.usuarioResponsable = admision.usuarioResponsable ? admision.usuarioResponsable : this.remision.usuario;
      console.log('this.remision.usuario David ', this.remision.usuario);
      this.admision.empalme = admision.empalme ? admision.empalme : '';
      this.admision.fechaEmpalme = admision.fechaEmpalme ? admision.fechaEmpalme : '';
      this.admision.esDomiciliario = admision.tipoAtencion ? admision.tipoAtencion : false;
      this.admision.entregadoA = admision.entregadoA ? admision.entregadoA : '';
      this.admision.piso = admision.piso || null;
      this.admision.programa = admision.programa ? admision.programa : null;
      this.admision.gestionAdmision = admision.gestionAdmision ? admision.gestionAdmision : '';
      this.admision.requiereEstadiaTemporal = admision.estadiaTemporal ? admision.estadiaTemporal : '';
    } else {
      this.admision = new Admision(
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      );
    }

    return this.admision;
  }

  /**
   * Genera la remison
   * @returns {Observable<Maestro[]>}
   */
  generarRemision() {
    return this.remisionGatewayAbstract.generarRemision();
  }

  /**
   * Guarda la remision
   * @param {string} estado
   * @param mensaje
   * @param usuario
   * @param tipo
   */
  public obtenerRemision(estado?: string, mensaje?: string, usuario?: Usuario, tipo?: string) {

    //tipo = "dispo";
    console.log('Tipo: ', tipo);
    const estadoActual = this.remision.estado;
    this.guardarRemisionRequest.remision = this.remision;
    this.guardarRemisionRequest.remision.usuario = usuario;
    this.guardarRemisionRequest.remision.estado = estado;

    if (this.admision && this.admision.sede != null) {
      const datosAtencionModificado: any = {};
      datosAtencionModificado.idRemisionPK = null;
      datosAtencionModificado.nombreCuidador = this.datosAtencionPaciente.nombreCuidador;
      datosAtencionModificado.nombreResponsable = this.datosAtencionPaciente.nombreResponsable;
      datosAtencionModificado.telefonoPaciente = this.datosAtencionPaciente.telefonoPaciente;
      datosAtencionModificado.celularPaciente = this.datosAtencionPaciente.celularPaciente;
      datosAtencionModificado.celularPaciente2 = this.datosAtencionPaciente.celularPaciente2;
      datosAtencionModificado.ubicacion = {};
      datosAtencionModificado.ubicacion = this.admision.sede.ubicacion;
      this.guardarRemisionRequest.datosAtencionPaciente = datosAtencionModificado;
    } else if (this.admision && this.admision.requiereEstadiaTemporal) {
      this.guardarRemisionRequest.datosAtencionPaciente = this.datosAtencionPaciente;
      this.guardarRemisionRequest.datosAtencionPaciente.ubicacion = this.direccionCentroDeEstadi.ubicacion;
    } else {
      this.guardarRemisionRequest.datosAtencionPaciente = this.datosAtencionPaciente;
    }
    this.guardarRemisionRequest.datosRemision = this.datosRemision;
    this.guardarRemisionRequest.paciente = this.datosPaciente;
    this.guardarRemisionRequest.remision.aceptaIngresoVoluntario = this.pacienteAcepta;
    this.guardarRemisionRequest.remision.tieneServiciosBasicos = this.serviciosBasicos;
    this.guardarRemisionRequest.remision.esOxigeno = this.esOxigeno;
    this.guardarRemisionRequest.diagnosticos = this.diagnosticos;
    this.guardarRemisionRequest.admision = this.admision;
    console.log(this.admision);
    this.guardarRemisionRequest.planManejo = new PlanManejo('',
      this.tratamientosPlanManejo,
      this.procedimientosPlanManejo,
      this.valoracionesPlanManejo === null ?
        new Valoracion([], [], null) : this.valoracionesPlanManejo);

    let dataBooking: any = localStorage.getItem('rango');
    const ticket = localStorage.getItem('ticket');

    if (dataBooking != null && ticket !== null) {

      console.log('DataBook: ', JSON.parse(dataBooking));

      dataBooking = JSON.parse(dataBooking);

      const slotB: SlotBooking = {
        ticketID: ticket,
        slotStart: dataBooking.start,
        slotFinish: dataBooking.finish
      };

      console.log('Booking slot ', slotB);
      this.guardarRemisionRequest.remision.citaBooking = true;
      this.guardarRemisionRequest.remision.slotBooking = slotB;

      localStorage.removeItem('rango');
      localStorage.removeItem('ticket');

    } else {
      console.log('No se seleccionó rango');
    }

    console.log(JSON.stringify(this.guardarRemisionRequest));
    console.log('this.remision.estado ', this.remision.estado);
    console.log('EDICION');
    console.log(this.edicion);


    if (tipo === 'admitir') {
      console.log('1', this.guardarRemisionRequest);
      console.log('2', this.remision);

      this.remisionGatewayAbstract.admitir(this.guardarRemisionRequest).subscribe(() => {

        this.mensajesService.mostrarMensajeExito(mensaje);
        this.admision = null;
        if ((this.remision.estado === EstadosRemisionEnum.PENDIENTE_ADMITIR ||
          this.remision.estado === EstadosRemisionEnum.ADMITIDO || this.remision.estado === EstadosRemisionEnum.NO_ADMITIDO ||
          this.remision.estado === EstadosRemisionEnum.CANCELADO || this.remision.estado === EstadosRemisionEnum.EMPALME) &&
          this.edicion === false) {
          this.router.navigate(['/']);
        }
      }, err => {
        this.remision.estado = estadoActual;
        if (err.status !== 400) {

          this.mensajesService.mostrarMensajeError(err.error);
        } else if (err.status === 500) {
          this.mensajesService.mostrarMensajeError('Todos los campos deben estar llenos');
        } else {
          this.mensajesService.mostrarMensajeError('Ocurrio un error intente más tarde');
        }
        this.remision.estado = estadoActual;
      });
    } else if (tipo === 'dispo') {

      this.obtenerRemisionDisponibilidad(this.guardarRemisionRequest);
    }


  }


  public obtenerRemisionDisponibilidad(remisionActual: any) {


    const nuevaRemision: any = {
      remisionRequest: {
        idRemisionPk: remisionActual.remision.idRemisionPK,
        idRemision: remisionActual.remision.idRemision,
        aceptaIngresoVoluntario: remisionActual.remision.aceptaIngresoVoluntario,
        tieneServiciosBasicos: remisionActual.remision.tieneServiciosBasicos,
        tipoEstado: remisionActual.remision.tipoEstado,
        estado: remisionActual.remision.estado,
        motivoCancelacion: remisionActual.remision.motivoCancelacion,
        observacionCancelacion: remisionActual.remision.observacionCancelacion,
        fechaCreacion: remisionActual.remision.fechaCreacion,
        fechaCreacionRegistro: remisionActual.remision.fechaCreacionRegistro,
        fechaAdmision: remisionActual.admision.fechaAdmision,
        nombre: remisionActual.paciente.nombre,
        apellido: remisionActual.paciente.apellido,
        tipoIdentificacion: remisionActual.paciente.tipoIdentificacion,
        numeroIdentificacion: remisionActual.paciente.numeroIdentificacion,
        tipoAfiliacion: remisionActual.paciente.tipoAfiliacion,
        pisoHospitalario: remisionActual.admision.piso,
        motivoEgreso: remisionActual.remision.motivoEgreso,
        fechaEgreso: remisionActual.remision.fechaEgreso,
        esOxigeno: remisionActual.remision.esOxigeno,
        usuario: remisionActual.remision.usuario,
        observacionEgreso: remisionActual.remision.observacionEgreso
      },
      datosAtencionPacienteRequest: {
        idRemisionPk: remisionActual.datosAtencionPaciente.idRemisionPK,
        nombreCuidador: remisionActual.datosAtencionPaciente.nombreCuidador,
        nombreResponsable: remisionActual.datosAtencionPaciente.nombreResponsable,
        telefonoPaciente: remisionActual.datosAtencionPaciente.telefonoPaciente,
        celularPaciente: remisionActual.datosAtencionPaciente.celularPaciente,
        celularPaciente2: remisionActual.datosAtencionPaciente.celularPaciente2,
        ubicacion: remisionActual.datosAtencionPaciente.ubicacion,
      },
      diagnosticos: remisionActual.diagnosticos,
      planManejoRequest: {
        idRemision: remisionActual.planManejo.idRemision,
        tratamientos: remisionActual.planManejo.tratamientos,
        procedimientos: remisionActual.planManejo.procedimientos,
        valoraciones: remisionActual.planManejo.valoraciones,
      }
    };

    console.log(JSON.stringify(
      nuevaRemision));


    this.programacionService.getDisponibilidadCitas(nuevaRemision).subscribe(
      disponibilidad => {

        console.log(disponibilidad);

        if (disponibilidad.bookingID == null) {
          this.mensajesService.mostrarMensajeError('No hay disponibilidad');
        } else if (disponibilidad) {
          this.openDialogDisponibilidad(disponibilidad);
        }

      });
  }

  /**
   * Inicializa el modelo de guardar Remision Request
   *
   * @returns {GuardarRemisionRequest}
   */
  private iniciarModelRemisionGuardar(): GuardarRemisionRequest {
    return new GuardarRemisionRequest(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    );
  }

  public openDialogDisponibilidad(disponilidad: any): void {

    const dialogRef = this.dialog.open(ModalHorarioDisponibleComponent, {
      width: '900px'
    });
    dialogRef.componentInstance.disponibilidad = disponilidad;
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }


}
