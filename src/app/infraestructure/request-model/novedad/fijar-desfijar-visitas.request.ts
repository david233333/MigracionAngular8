import {Usuario} from '../../../shared/models/usuario.model';
import {MotivoFijarCita} from '../../../domain/model/maestro/entity/motivo-fijar-cita.model';
import {CitaFijarDesfijarRequest} from './cita-fijar-desfijar.request';

export class FijarDesfijarVisitasRequest {
  constructor(
    public idRemision: string,
    public horaFijadaInicio: string,
    public horaFijadaFin: string,
    public motivo: MotivoFijarCita,
    public citas: Array<CitaFijarDesfijarRequest>,
    public usuario: Usuario,
    public fijarCita: boolean
  ) {
  }
}
