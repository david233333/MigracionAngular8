import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ComunGatewayAbstract } from '../../model/comun/gateway/comun-gateway.abstract';
import { NovedadGatewayAbstract } from '../../model/novedad/gateway/novedad-gateway.abstract';
import { Ciudad } from '../../model/maestro/entity/ciudad.model';
import { Municipio } from '../../model/maestro/entity/municipio.model';
import { DatosAtencionPacienteRequest } from '../../../infraestructure/request-model/novedad/datos-atencion-paciente.request';

@Injectable()
export class DatosPacienteNovedadService {
    public respuestaCiudades: Observable<Ciudad[]>;

    constructor(
        private comunService: ComunGatewayAbstract,
        private novedadService: NovedadGatewayAbstract) {
    }

    /**
    * Obtiene las ciudades de novedades
    * @returns {Observable<Ciudad[]>}
    */
    getCiudades(): Observable<Ciudad[]> {
        return this.comunService.getCiudadesNovedad().pipe();
    }

    /**
* Obtiene los municipios de una ciudad de novedades
* @returns {Observable<Municipio[]>}
*/
    getMunicipiosPorCiudad(idCiudad: string): Observable<Municipio[]> {
        return this.comunService.getMunicipiosNovedad(idCiudad).pipe();
    }


    /**
* cambiar diagnostico
* @returns {Observable<any>}
*/
    public cambiarDatosAtencionPaciente(datosPaciente: DatosAtencionPacienteRequest): Observable<any> {
        return this.novedadService.cambiarDatosAtencion(datosPaciente).pipe();
    }

    /**
    * consultar agregado de información paciente
    * @returns {Observable<any>}
    */
    public getAgregadoInformacionPaciente(idNovedad: string): Observable<any> {
        return this.novedadService.getAgregadoInformacionPaciente(idNovedad).pipe();
    }
}
