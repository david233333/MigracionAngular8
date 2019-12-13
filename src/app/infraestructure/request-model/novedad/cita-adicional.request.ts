import { TipoCita } from '../../../domain/model/maestro/entity/tipo-cita.model';

export class CitaAdicionalRequest {
  constructor(
    public tipoCambioCita: string,
    public tipoCita: TipoCita,
    public fechaCita: Date
  ) {}
}
