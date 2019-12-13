import {BebeCanguro} from './plan-manejo/valoraciones/bebe-canguro.model';
import {TipoPlanParticular} from '../../maestro/entity/tipo-plan-particular.model';
import {TipoIdentificacionModel} from './tipo-identificacion.model';

export class Paciente {

  constructor(
    public idRemisionPK: string,
    public nombre: string,
    public apellido: string,
    public tipoIdentificacion: TipoIdentificacionModel,
    public numeroIdentificacion: string,
    public fechaNacimiento: string,
    public edad: string,
    public sexo: string,
    public estadoCivil: string,
    public tipoPlanParticular: TipoPlanParticular,
    public ocupacion: string,
    public email: string,
    public tipoAsegurador: string,
    public estadoSuspension: string,
    public coberturaDomiciliaria: boolean,
    public fechaLimiteCobertura: string,
    public tipoAfiliacion: any,
    public nivelIngreso: string,
    public ipsBasicaAsignada: string,
    public lugarAtencion: string,
    public unidadEdad: string,
    public bebeCanguro: BebeCanguro[],
    public codigoARL: string,
    public medidaDepeso: string,
    public peso: string,
    public  nombrePersonaAutoriza?: string

  ) {
  }
}
