import {ProgramacionSemana} from '../../../../shared/models/programacion-semana.model';
import {TipoCita} from '../../maestro/entity/tipo-cita.model';
import {Usuario} from '../../../../shared/models/usuario.model';
import {CitaAdicionalRequest} from '../../../../infraestructure/request-model/novedad/cita-adicional.request';
import {ProfesionalResponseModel} from '../../maestro/entity/ProfesionalResponse.model';

export class Cita {
  constructor(
    public idCita: string,
    public idRemision: string,
    public profesional: string,
    public especialidad: string,
    public tipo: string,
    public tipoCita: TipoCita,
    public tipoFecha: string,
    public fecha: Date,
    public semanas: string,
    public programacionSemana: Array<ProgramacionSemana>,
    public estado: string,
    public totalVisitasPeriodica: number,
    public sesionesFaltantes: number,
    public usuario: Usuario,
    public citaAdicional: CitaAdicionalRequest,
    public profesionalAsignado?: ProfesionalResponseModel
  ) {
  }
}
