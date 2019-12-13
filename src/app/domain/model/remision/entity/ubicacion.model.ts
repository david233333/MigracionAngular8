import { Municipio } from '../../maestro/entity/municipio.model';
import { Ciudad } from '../../maestro/entity/ciudad.model';

export class Ubicacion {

  constructor (
    public latitud: number,
    public longitud: number,
    public direccion: string,
    public tipoVia: string,
    public numero1: string,
    public letraCruce1: string,
    public puntoCardinal1: string,
    public nroInterseccion: string,
    public letraCruce2: string,
    public puntoCardinal2: string,
    public numero2: string,
    public informacionComplementaria: string,
    public municipio: Municipio,
    public barrio: string,
    public ciudadPrincipal: Ciudad,
    public sinNomenclatura: boolean
  ) { }
}
