import { mensajes as mensajesHistorialPlan } from '../../../shared/utils/mensajes';
import { TipoIdentificacion } from '../../../domain/model/maestro/entity/tipo-identificacion.model';
import { Diagnostico } from '../../../domain/model/maestro/entity/diagnostico.model';
import { Tratamiento } from '../../../domain/model/novedad/entity/plan-manejo/tratamiento.model';
import { Procedimiento } from '../../../domain/model/novedad/entity/plan-manejo/procedimiento.model';
import { Curacion } from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/curacion.model';
import { Fototerapia } from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/fototerapia.model';
import { TomaMuestra } from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/toma-muestra.model';
import { AspiracionSecrecion } from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/aspiracion-secrecion.model';
import { Canalizacion } from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/canalizacion.model';
import { Sondaje } from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/sondaje-model';
import { Cita } from '../../../domain/model/novedad/entity/cita.model';
import { SoporteNutricional } from '../../../domain/model/novedad/entity/plan-manejo/procedimientos/soporte-nutricional.model';
import { ProcedimientoNovedadEnum } from '../../../shared/utils/enums/procedimiento-novedad.enum.';


export class HistorialPlanManejoViewModel {
    constructor(
        public mensajesHistorial: any,
        public mensajesDiagnosticos: any,
        public mensajesPlanManejo: any,
        public mensajesDatosAtencion: any,
        public mensajesCitas: any,
        public mensajesCambioPiso: any,
        public mensajesEgreso: any,
        public cargando: boolean,
        public identificacionPaciente: string,
        public respuestaTiposIdentificacion: TipoIdentificacion[],
        public infoRemision: any,
        public verFiltroPaciente: boolean,
        public respuestaRemisiones: any[],
        public respuestaNovedades: any[],
        public remisionSeleccionada: any,
        public novedadSeleccionada: any,
        public diagnosticos: Diagnostico[],
        public infoPaciente: any,
        public cambioPiso: boolean,
        public egreso: boolean,
        public tratamientos: Tratamiento[],
        public procedimientos: Procedimiento,
        public curaciones: Curacion[],
        public sondajes: Sondaje[],
        public fototerapias: Fototerapia[],
        public tomaMuestras: TomaMuestra[],
        public secreciones: AspiracionSecrecion[],
        public canalizaciones: Canalizacion[],
        public citas: Cita[],
        public soporteNutricionales: SoporteNutricional[],
        public procedimientoCuraciones: string,
        public procedimientoSondajes: string,
        public procedimientoFototerapias: string,
        public procedimientoTomaMuestras: string,
        public procedimientoSecreciones: string,
        public procedimientoCanalizaciones: string,
        public procedimientoSoporteNutricionales: string,
        public profesionalesRP : any[],
    ) {
        this.mensajesHistorial = mensajesHistorialPlan.novedades.historialPlanManejo;
        this.mensajesDiagnosticos = mensajesHistorialPlan.novedades.informacionPaciente.diagnosticos;
        this.mensajesPlanManejo = mensajesHistorialPlan.novedades.planManejoNovedades;
        this.mensajesDatosAtencion = mensajesHistorialPlan.novedades.informacionPaciente.datosPaciente;
        this.mensajesCitas = mensajesHistorialPlan.novedades.citas;
        this.mensajesCambioPiso = mensajesHistorialPlan.novedades.informacionPaciente.cambioPiso;
        this.mensajesEgreso = mensajesHistorialPlan.novedades.egreso;
        this.procedimientoCuraciones = ProcedimientoNovedadEnum.CURACIONES;
        this.procedimientoSondajes = ProcedimientoNovedadEnum.SONDAJES;
        this.procedimientoFototerapias = ProcedimientoNovedadEnum.FOTOTERAPIAS;
        this.procedimientoTomaMuestras = ProcedimientoNovedadEnum.TOMA_MUESTRAS;
        this.procedimientoSecreciones = ProcedimientoNovedadEnum.SECRECIONES;
        this.procedimientoCanalizaciones = ProcedimientoNovedadEnum.CANALIZACIONES;
        this.procedimientoSoporteNutricionales = ProcedimientoNovedadEnum.SOPORTE_NUTRICIONALES;
    
    }
}
