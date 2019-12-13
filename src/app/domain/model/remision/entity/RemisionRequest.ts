import { Usuario } from "../../../../shared/models/usuario.model";
import { Piso } from "../../maestro/entity/piso.model";
import { MotivoEgreso } from '../../maestro/entity/motivo-egreso.model';

export class RemisionRequest {

    constructor(
     public idRemisionPk: string,
     public idRemision: string,
     public fechaCreacion: Date,
     public fechaCreacionRegistro: Date,
     public tipoEstado: string,
     public estado: string,
     public aceptaIngresoVoluntario: boolean,
     public tieneServiciosBasicos: boolean,
     public esOxigeno: boolean,
     public motivoCancelacion: string,
     public observacionCancelacion: string,
     public usuario: Usuario,
     public fechaAdmision : Date,
     public nombre: string,
     public apellido: string,
     public tipoIdentificacion: string,
     public numeroIdentificacion: string,
     public tipoAfiliacion: {},
     public motivoEgreso: MotivoEgreso,
     public pisoHospitalario: Piso,
     public observacionEgreso: string,
     public fechaEgreso: Date) {}
}
