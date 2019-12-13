import {PlanSalud} from '../../../domain/model/maestro/entity/plan-salud.model';
import {TipoIdentificacion} from '../../../domain/model/maestro/entity/tipo-identificacion.model';


export const datosPaciente = {

  idRemisionPK: '',
  nombre: 'Ricardo Adolfo',
  apellido: 'Corral Ron',
  tipoIdentificacion: new TipoIdentificacion('5aea124187bdf784a56b781d', 'CC', 'Cédula de ciudadanía', '1', 'C'),
  numeroIdentificacion: Math.floor(Math.random() * 1000000000),
  fechaNacimiento: '1992-01-01T00:00:00-06:00',
  edad: '30',
  sexo: 'Masculino',
  estadoCivil: 'Soltero',
  ocupacion: 'Developer',
  email: 'danielita_2018@gmail.com',
  tipoAsegurador: 'POS',
  estadoSuspension: 'Salud en casa',
  coberturaDomiciliaria: true,
  fechaLimiteCobertura: null,
  tipoAfiliacion: new PlanSalud('5aea078387bdf784a56b781a', 'ARL', 'ARL SURA', '7'),
  nivelIngreso: 'Salud en casa',
  ipsBasicaAsignada: 'San diego',
  lugarAtencion: 'San diego',
  unidadEdad: 'Años',
  bebeCanguro: []

};
