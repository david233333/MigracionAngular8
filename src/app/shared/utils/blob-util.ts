export class BlobUtil {

  constructor() { }

  /**
   * Devuelve un blob con los datos descodificados
   * @param datosCodificados
   * @returns {Blob}
   */
  public blobDecodificadoPDF(datosCodificados: any): Blob {
    const byteCaracteres  = atob(datosCodificados);
    const byteNumeros = new Array(byteCaracteres.length);

    for (let i = 0; i < byteCaracteres.length; i++) {
      byteNumeros[i] = byteCaracteres.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumeros);

    return new Blob([byteArray], {type: 'application/pdf'});
  }

}
