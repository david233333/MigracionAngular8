import { mensajes as mensajesNovedad } from "../../../../shared/utils/mensajes";
import { Tratamiento } from "../../../../domain/model/novedad/entity/plan-manejo/tratamiento.model";
import { Cita } from "../../../../domain/model/novedad/entity/cita.model";
import { Curacion } from "../../../../domain/model/novedad/entity/plan-manejo/procedimientos/curacion.model";
import { Sondaje } from "../../../../domain/model/novedad/entity/plan-manejo/procedimientos/sondaje-model";
import { Fototerapia } from "../../../../domain/model/novedad/entity/plan-manejo/procedimientos/fototerapia.model";
import { TomaMuestra } from "../../../../domain/model/novedad/entity/plan-manejo/procedimientos/toma-muestra.model";
import { AspiracionSecrecion } from "../../../../domain/model/novedad/entity/plan-manejo/procedimientos/aspiracion-secrecion.model";
import { Canalizacion } from "../../../../domain/model/novedad/entity/plan-manejo/procedimientos/canalizacion.model";
import { SoporteNutricional } from "../../../../domain/model/novedad/entity/plan-manejo/procedimientos/soporte-nutricional.model";

export class DetalleGestionViewModel {
  constructor(
    public mensajesNovedades:any,
    public mensajesDetalleGestion: any,
    public mensajesPlanManejo: any,
    public mensajesDatosAtencion: any,
    public mensajesCitas: any,
    public mensajesCambioPiso: any,
    public mensajesEgreso: any,
    public cargando: boolean,
    public respuestaNovedades: Array<any>,
    public novedadSeleccionada: any,
    public esPlanManejoDetalle: boolean,
    public esDatosPacienteDetalle: boolean,
    public esCambioPisoDetalle: boolean,
    public esEgresoDetalle: boolean,
    public tratamientos: Tratamiento[],
    public esTratamientosDetalle: boolean,
    public esProcedimientosDetalle: boolean,
    public esAdicionReprogramarCitaDetalle: boolean,
    public detalleNovedad: any,
    public esPendienteGestionar: boolean,
    public informacionSolicitud: any,
    public esCitasDetalle: boolean,
    public esCuidador: boolean,
    public esDiagnostico: boolean,
    public esAlertaCita:boolean,
    public esEquiposBiomedicos:boolean,
    public esCancelacionCita:boolean,
    public esAplicacionCuidador:boolean,
    public esCitaFijada:boolean,
    public esCitaDesfijada:boolean,
    public esProfesionalAsignado:boolean,
    public esProfesionalDesAsiganado:boolean,
    public citasTabla: Cita[],
    public curaciones: Curacion[],
    public sondajes: Sondaje[],
    public fototerapias: Fototerapia[],
    public tomaMuestras: TomaMuestra[],
    public secreciones: AspiracionSecrecion[],
    public canalizaciones: Canalizacion[],
    public visitas: any[],
    public soporteNutricionales: SoporteNutricional[],
    public usuarioRegistra: string,
    public usuarioGestiona: string,
    public tituloAgregarReprogramarCita: string
  ) {
    this.mensajesDetalleGestion =mensajesNovedad.novedades.detalleGestionNovedad;
    this.mensajesPlanManejo = mensajesNovedad.novedades.planManejoNovedades;
    this.mensajesDatosAtencion =mensajesNovedad.novedades.informacionPaciente.datosPaciente;
    this.mensajesCitas = mensajesNovedad.novedades.citas;
    this.mensajesCambioPiso = mensajesNovedad.novedades.informacionPaciente.cambioPiso;
    this.mensajesEgreso = mensajesNovedad.novedades.egreso;
    this.mensajesNovedades = mensajesNovedad.novedades.detallesGestionNovedadesCampos

  }
}
