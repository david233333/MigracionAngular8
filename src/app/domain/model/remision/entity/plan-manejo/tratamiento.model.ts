import {Medicamento} from '../../../maestro/entity/medicamento.model';
import {Dosis} from '../../../maestro/entity/dosis.model';
import {ViaAdministracion} from '../../../maestro/entity/via-administracion.model';
import {Frecuencia} from '../../../maestro/entity/frecuencia.model';


export class Tratamiento {

  constructor(
    public id: string,
    public idTratamiento: string,
    public idRemisionPK: string,
    public tratamiento: string,
    public medicamento: Medicamento,
    public cantidadDosis: number,
    public unidadDosis: Dosis,
    public viaAdministracion: ViaAdministracion,
    public diluyente: string,
    public cantidadDiluyente: number,
    public frecuencia: Frecuencia,
    public duracion: number,
    public ultimaAplicacion: Date,
    public noPBS: boolean,
    public medicamentoDescripcion?: string,
    public frecuenciaDescripcion?: string
  ) {
    this.medicamentoDescripcion = `${this.medicamento.nombre} ${this.medicamento.presentacion}`;
    this.frecuenciaDescripcion = this.frecuencia.descripcion;
  }
}
