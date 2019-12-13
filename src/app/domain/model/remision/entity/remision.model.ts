import { Usuario } from '../../../../shared/models/usuario.model';
import { SlotBooking } from './SlotBooking';

export class Remision {

         constructor(
          public idRemisionPk: string,
          public idRemision: string,
          public fechaCreacion: Date,
          public estado: string,
          public aceptaIngresoVoluntario: boolean,
          public tieneServiciosBasicos: boolean,
          public esOxigeno: boolean,
          public motivoCancelacion: string,
          public observacionCancelacion: string,
          public usuario: Usuario,
          public citaBooking: boolean,
          public slotBooking: SlotBooking) {}
}
