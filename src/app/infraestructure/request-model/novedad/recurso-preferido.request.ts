import {Usuario} from '../../../shared/models/usuario.model';
import {ProfesionalResponseModel} from '../../../domain/model/maestro/entity/ProfesionalResponse.model';

export class RecursoPreferidoRequest{
  constructor(
    public idRemision: string,
    public profesional: ProfesionalResponseModel,
    public usuario: Usuario
  ) { }
}
