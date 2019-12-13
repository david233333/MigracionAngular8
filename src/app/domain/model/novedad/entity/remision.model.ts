import {MotivoEgreso} from '../../maestro/entity/motivo-egreso.model';
import {Piso} from '../../maestro/entity/piso.model';
import {Programa} from '../../maestro/entity/programa.model';
import {Usuario} from '../../../../shared/models/usuario.model';

export class Remision {
  constructor(
    public id: string,
    public idNovedadPk: string,
    public idRemision: string,
    public estado: string,
    public fechaCreacion: Date,
    public tipoIdentificacion: string,
    public numeroIdentificacion: string,
    public nombre: string,
    public apellido: string,
    public fechaNacimiento: Date,
    public edad: string,
    public sexo: string,
    public peso: string,
    public tipoAfiliacion: string,
    public motivoEgreso: MotivoEgreso,
    public observacionEgreso: string,
    public fechaEgreso: Date,
    public pisoHospitalario: Piso,
    public programa: Programa,
    public ciudad: string,
    public usuario: Usuario) {
  }
}
