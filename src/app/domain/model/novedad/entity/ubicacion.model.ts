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
      public municipio: string,
      public barrio: string,
      public ciudadPrincipal: string
    ) { }
  }
