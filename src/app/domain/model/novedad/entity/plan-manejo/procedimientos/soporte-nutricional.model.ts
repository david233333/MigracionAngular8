import { Medicamento } from '../../../../maestro/entity/medicamento.model';
import { Dosis } from '../../../../maestro/entity/dosis.model';
import { EventoSoporteNutricional } from '../../../../comun/entity/evento-soporte-nutricional.model';
import { TipoNutricion } from '../../../../maestro/entity/tipo-nutricion.model';


export class SoporteNutricional {

  constructor(
    public id: string,
    public medicamento: Medicamento,
    public cantidadDosis: number,
    public unidadDosis: Dosis,
    public tipoNutricion: TipoNutricion,
    public duracion: number,
    public volumen: number,
    public noPBS: boolean,
    public eventos: Array<EventoSoporteNutricional>,
    public medicamentoDescripcion?: string,
    public tipoNutricionDescripcion?: string,
    public nutricionDescripcion?: string,
  ) {
    this.medicamentoDescripcion = `${this.medicamento.nombre} ${this.medicamento.presentacion}`;
    this.tipoNutricionDescripcion = this.tipoNutricion.tipo;
    this.nutricionDescripcion = this.tipoNutricion.descripcion;
  }
}
