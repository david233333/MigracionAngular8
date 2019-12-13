import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { LineaUnicaModalModel } from './lineaUnicaModal.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { DatosAtencionService } from '../../../../domain/usecase/remision/datos-atencion.service';
import { ModalDireccionComponent } from '../../../remision/datos-atencion/modal-direccion/modal-direccion.component';
import { MensajesService } from '../../../../shared/services/mensajes.service';
import { LineaUnicaModalNoExitosaComponent } from '../linea-unica-modal-no-exitosa/linea-unica-modal-no-exitosa.component';
import { DetalleVisitasComponent } from './detalle-visitas/detalle-visitas.component';
import { DatosPacienteNovedadService } from '../../../../domain/usecase/novedad/datos-paciente-novedad.service';
import { LineaUnicaUseCaseService } from '../../../../domain/usecase/lineaUnica/lineaUnicaUseCase-services';
import { ProgramacionCitaService } from '../../../../domain/usecase/programacion/programacion-cita.service';
import { DatosAtencionPacienteRequest } from '../../../../infraestructure/request-model/novedad/datos-atencion-paciente.request';
import { DatosAtencionPaciente } from '../../../../domain/model/novedad/entity/datos-atencion-paciente.model';
import { Usuario } from '../../../../shared/models/usuario.model';
import {CapturarErrores} from '../../../../shared/services/capturar-errores';

@Component({
  selector: 'sura-modal-linea-unica',
  templateUrl: './modal-linea-unica.component.html',
  styleUrls: ['./modal-linea-unica.component.scss']
})
export class ModalLineaUnicaComponent implements OnInit {
  public lineaModalUnicaModel: LineaUnicaModalModel = this.modelInit();
  public formularioDetalle: FormGroup;
  public ocultarInformacion = true;
  public formularioCambioDatos: FormGroup;
  readonly SELECCIONAR = 'SELECCIONAR';
  public ciudadesSubscripcion = new Subscription();
  public cols: any[];

  constructor(
    private fbVistaDetalle: FormBuilder,
    private fbActualizarDetalle: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public datos: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private datosAtencionService: DatosAtencionService,
    private mensajeServices: MensajesService,
    private datosAtencionPaciente: DatosPacienteNovedadService,
    private lineaUnicaServices: LineaUnicaUseCaseService,
    private programacionServices: ProgramacionCitaService,
    private capturaDeErroresService: CapturarErrores
  ) {
    this.generarColumnas();
    this.inicilializarFormularioActualizar();
  }

  ngOnInit() {
    this.bloqueoLineaUnica(this.datos.paciente);
    this.consultarDatosPaciente();
    this.inicializarFormularioDetalle();
    this.cargarDatosPaciente();
    this.obtenerProgramacion();
    this.getCiudades();
  }

  public cambiarDireccion() {
    console.log(
      'ciudad ',
      this.lineaModalUnicaModel.respuestaDatosPaciente.ubicacion.ciudadPrincipal
        .idCiudad
    );
    this.ocultarInformacion = !this.ocultarInformacion;
    this.formularioCambioDatos
      .get('municipio')
      .setValue(
        this.lineaModalUnicaModel.respuestaDatosPaciente.ubicacion.municipio
          .nombre
      );
    this.formularioCambioDatos
      .get('barrio')
      .setValue(
        this.lineaModalUnicaModel.respuestaDatosPaciente.ubicacion.barrio
      );
    this.formularioCambioDatos
      .get('direccion')
      .setValue(
        this.lineaModalUnicaModel.respuestaDatosPaciente.ubicacion.direccion
      );
    this.formularioCambioDatos
      .get('telefono1')
      .setValue(
        this.lineaModalUnicaModel.respuestaDatosPaciente.telefonoPaciente
      );
    this.formularioCambioDatos
      .get('celular')
      .setValue(
        this.lineaModalUnicaModel.respuestaDatosPaciente.celularPaciente
      );
    this.formularioCambioDatos
      .get('celular2')
      .setValue(
        this.lineaModalUnicaModel.respuestaDatosPaciente.celularPaciente
      );
    this.formularioCambioDatos
      .get('cuidador')
      .setValue(
        this.lineaModalUnicaModel.respuestaDatosPaciente.nombreCuidador
      );
    this.formularioCambioDatos
      .get('ciudad')
      .setValue(
        this.lineaModalUnicaModel.respuestaDatosPaciente.ubicacion
          .ciudadPrincipal.idCiudad
      );
  }

  /**
   * Abre detalle visita
   */
  public detalleVisita($event: any) {
    const dialogRef = this.dialog.open(DetalleVisitasComponent, {
      width: '70%',
      disableClose: true,
      data: { cita: $event }
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  /**
   * Limpia los datos del
   *formulario cuando se cambia la ciudad
   */
  public limpiarCamposMunicipio() {
    this.formularioCambioDatos.get('barrio').setValue('');
    this.formularioCambioDatos.get('direccion').setValue('');
    this.formularioCambioDatos.get('municipio').setValue('');
    this.lineaModalUnicaModel.respuestaUbicacion = null;
  }

  /**
   * abre el modal de direccion
   * y envia los datos de la ciudad
   */
  public abrirModalDireccion() {
    const ciudad = this.lineaModalUnicaModel.respuestaCiudades.find(
      id => id.idCiudad === this.formularioCambioDatos.get('ciudad').value
    );
    if (ciudad !== undefined) {
      const dialogRef = this.dialog.open(ModalDireccionComponent, {
        width: '99%',
        disableClose: true,
        data: {
          ciudad: ciudad,
          barrio: this.formularioCambioDatos.get('barrio').value,
          direccion: this.formularioCambioDatos.get('direccion').value,
          municipio: this.formularioCambioDatos.get('municipio').value,
          ubicacion: this.lineaModalUnicaModel.respuestaDatosPaciente.ubicacion,
          esNovedad: true
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log(result);
          this.lineaModalUnicaModel.respuestaUbicacion = result;
          this.formularioCambioDatos.get('barrio').setValue(result.barrio);
          this.formularioCambioDatos
            .get('direccion')
            .setValue(result.direccion);
          this.formularioCambioDatos
            .get('municipio')
            .setValue(result.municipio.nombre);
        }
      });
    }
  }

  /**
   * MArcar como exitoso
   */
  public marcarComoExitoso() {
    const paciente = this.datos.paciente;
    paciente.bloqueoUsuario = false;
    this.lineaUnicaServices.guardarComoExitoso(paciente).subscribe(
      value => {
        this.mensajeServices.mostrarMensajeExito('Se guardo correctamente');
        this.dialogRef.close(paciente);
      },
      error => {
        this.capturaDeErroresService.mapearErrores(error.status, error.error);
      },
      () => {}
    );
  }

  public gestionarContacto() {
    const paciente = this.datos.paciente;
    const contacto = paciente.contacto;
    const dialogRef = this.dialog.open(LineaUnicaModalNoExitosaComponent, {
      width: '50%',
      height: '38%',
      disableClose: true,
      data: paciente
    });
    dialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close(result);
    });
  }

  public guardarActualizacion() {
    /*const municipio = this.formularioCambioDatos.get('municipio').value;
    const barrio = this.formularioCambioDatos.get('barrio').value;
    const direccion = this.formularioCambioDatos.get('direccion').value;
    const celular = this.formularioCambioDatos.get('celular').value;
    const telefono = this.formularioCambioDatos.get('telefono1').value;
    const cuidador = this.formularioCambioDatos.get('cuidador').value;
    this.formularioDetalle.get('municipio').setValue(municipio);
    this.formularioDetalle.get('barrio').setValue(barrio);
    this.formularioDetalle.get('direccion').setValue(direccion);
    this.formularioDetalle.get('celular').setValue(celular);
    this.formularioDetalle.get('cuidador').setValue(cuidador);
    this.formularioDetalle.get('telefono1').setValue(telefono);
    this.ocultarInformacion = true;
    this.mensajeServices.mostrarMensajeExito('Se realizo el cambio correctamente');*/
    this.guardarDatosPaciente();
  }

  public onPageListaRemision(event: any): void {
    console.log('event paginador', event);
  }

  public cerrar() {
    const paciente = this.datos.paciente;
    paciente.bloqueoUsuario = false;
    paciente.estado = 'POR_GESTIONAR';
    console.log('bloqueo', paciente);
    this.bloqueoLineaUnica(paciente);
    this.dialogRef.close();
  }

  public cancelarActualizacion() {
    this.ocultarInformacion = true;
  }

  public modelInit(): LineaUnicaModalModel {
    return new LineaUnicaModalModel(null, null, [], [], null, null);
  }

  /**
   * Consulta las ciudades
   * */
  private getCiudades(): void {
    this.ciudadesSubscripcion = this.datosAtencionService
      .getCiudades()
      .subscribe(ciudades => {
        this.lineaModalUnicaModel.respuestaCiudades = ciudades;
      }, error => this.capturaDeErroresService.mapearErrores(error.status, error.error));
  }

  /**
   * Inicializa los formularios
   * de detalle y actualización
   */
  private inicializarFormularioDetalle() {
    this.formularioDetalle = this.fbVistaDetalle.group({
      identificacion: [{ value: '', disabled: true }],
      nombre: [{ value: '', disabled: true }],
      planSalud: [{ value: '', disabled: true }],
      municipio: [{ value: '', disabled: true }],
      barrio: [{ value: '', disabled: true }],
      direccion: [{ value: '', disabled: true }],
      telefono1: [{ value: '', disabled: true }],
      celular: [{ value: '', disabled: true }],
      celular2: [{ value: '', disabled: true }],
      cuidador: [{ value: '', disabled: true }],
      ips: [{ value: '', disabled: true }],
      fechaFin: [{ value: '', disabled: true }]
    });
  }

  private inicilializarFormularioActualizar() {
    this.formularioCambioDatos = this.fbActualizarDetalle.group({
      municipio: [{ value: '', disabled: true }],
      barrio: [{ value: '', disabled: true }],
      direccion: [{ value: '', disabled: true }],
      telefono1: [{ value: '', disabled: false }],
      celular: [{ value: '', disabled: false }],
      celular2: [{ value: '', disabled: false }],
      cuidador: [{ value: '', disabled: false }],
      nombreResponsable: [{ value: '', disabled: false }],
      ciudad: [{ value: '' }]
    });
  }

  /**
   * Genera columnas para la tabla
   */
  private generarColumnas(): void {
    this.cols = [
      {
        field: this.lineaModalUnicaModel.mensajes.tabla.fechaVisitaCampo,
        header: this.lineaModalUnicaModel.mensajes.tabla.fechaVisita
      },
      {
        field: this.lineaModalUnicaModel.mensajes.tabla.fechaPrimerCitaCampo,
        header: this.lineaModalUnicaModel.mensajes.tabla.fechaPrimercita
      },
      {
        field: this.lineaModalUnicaModel.mensajes.tabla.fechaFinCitaCampo,
        header: this.lineaModalUnicaModel.mensajes.tabla.fechaFinCita
      },
      {
        field: this.lineaModalUnicaModel.mensajes.tabla.horaFincampo,
        header: this.lineaModalUnicaModel.mensajes.tabla.fechaFinCita
      }
    ];
  }

  private cargarDatosPaciente() {
    this.formularioDetalle
      .get('identificacion')
      .setValue(this.datos.paciente.numeroIdentificacion);
    this.formularioDetalle
      .get('nombre')
      .setValue(this.datos.paciente.nombrePaciente);
  }

  private consultarDatosPaciente() {
    const idRemisionPK = this.datos.remisionPK;
    this.datosAtencionPaciente
      .getAgregadoInformacionPaciente(idRemisionPK)
      .subscribe(datosAtencionPaciente => {
        this.lineaModalUnicaModel.respuestaDatosPaciente =
          datosAtencionPaciente.datosAtencionPaciente;
        const municipio =
          datosAtencionPaciente.datosAtencionPaciente.ubicacion.municipio
            .nombre;
        const ciudad =
          datosAtencionPaciente.datosAtencionPaciente.ubicacion.ciudadPrincipal
            .nombre;
        this.formularioDetalle
          .get('cuidador')
          .setValue(datosAtencionPaciente.datosAtencionPaciente.nombreCuidador);
        this.formularioDetalle
          .get('celular')
          .setValue(
            datosAtencionPaciente.datosAtencionPaciente.celularPaciente
          );this.formularioDetalle
          .get('celular2')
          .setValue(
            datosAtencionPaciente.datosAtencionPaciente.celularPaciente2
          );
        this.formularioDetalle
          .get('direccion')
          .setValue(
            datosAtencionPaciente.datosAtencionPaciente.ubicacion.direccion
          );
        this.formularioDetalle
          .get('barrio')
          .setValue(
            datosAtencionPaciente.datosAtencionPaciente.ubicacion.barrio
          );
        this.formularioDetalle.get('municipio').setValue(municipio);
        this.formularioDetalle
          .get('telefono1')
          .setValue(
            datosAtencionPaciente.datosAtencionPaciente.telefonoPaciente
          );
      }, error => this.capturaDeErroresService.mapearErrores(error.status, error.error));
  }

  private bloqueoLineaUnica(lineaUnica: LineaUnicaModalModel) {
    this.lineaUnicaServices
      .bloquearUsuario(lineaUnica)
      .subscribe(respuesta => {}, error => {
        this.capturaDeErroresService.mapearErrores(error.status, error.error);
      }, () => {});
  }

  /**
   * OBtiene las programaciones por
   * idRemisión
   */
  private obtenerProgramacion() {
    const idRemision = this.datos.paciente.idRemision;
    console.log(this.datos.paciente.idRemision);
    this.programacionServices.getProgramacion(idRemision).subscribe(
      programacion => {
        this.lineaModalUnicaModel.respuestaCita = programacion;
        console.log(this.lineaModalUnicaModel.respuestaCita);
      },
      error => {
        this.capturaDeErroresService.mapearErrores(error.status, error.error);
      },
      () => {}
    );
  }

  /**
   * Guarda la novedad de cambio de direccion del paciente
   */
  private guardarDatosPaciente(): void {
    const CAMBIO_DATOS_PACIENTE = new DatosAtencionPacienteRequest(
      this.datos.paciente.idRemision,
      new DatosAtencionPaciente(
        this.formularioCambioDatos.get('cuidador').value,
        this.formularioCambioDatos.get('nombreResponsable').value,
        this.formularioCambioDatos.get('telefono1').value,
        this.formularioCambioDatos.get('celular').value,
        this.formularioCambioDatos.get('celular2').value,
        this.lineaModalUnicaModel.respuestaUbicacion,
        this.datos.paciente.idRemision
      ),
      new Usuario(null, null, null, null, null, null, null, null)
    );
    this.cambiarDatosPaciente(CAMBIO_DATOS_PACIENTE);
  }

  /**
   *
   * @param datosPaciente
   */
  private cambiarDatosPaciente(
    datosPaciente: DatosAtencionPacienteRequest
  ): void {
    this.datosAtencionPaciente
      .cambiarDatosAtencionPaciente(datosPaciente)
      .subscribe(
        response => {
          this.mensajeServices.mostrarMensajeExito(
            this.lineaModalUnicaModel.mensajes.mensajesAlerta
              .exitoCambioDatosPaciente
          );
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {}
      );
  }
}
