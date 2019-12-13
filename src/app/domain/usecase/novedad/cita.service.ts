import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ComunGatewayAbstract } from '../../model/comun/gateway/comun-gateway.abstract';
import { NovedadGatewayAbstract } from '../../model/novedad/gateway/novedad-gateway.abstract';
import { Profesion } from '../../model/maestro/entity/profesion.model';
import { CitasPacienteRequest } from '../../../infraestructure/request-model/novedad/citas-paciente.request';

@Injectable()
export class CitaService {

    constructor(
        private novedadService: NovedadGatewayAbstract,
        private comunService: ComunGatewayAbstract) {
    }


    /**
    * Consultar agregado de citas
    * @returns {Observable<any>}
    */
    public getAgregadoCitas(idNovedad: string): Observable<any> {
        return this.novedadService.getAgregadoCitas(idNovedad).pipe();
    }

    /**
    * Consultar agregado de citas
    * @returns {Observable<any>}
    */
    public getAgregadoCitasHistorial(idNovedad: string): Observable<any> {
        return this.novedadService.getAgregadoCitasHistorial(idNovedad).pipe();
    }

    /**
    * Guardar citas
    * @returns {Observable<any>}
    */
    public guardarCitas(cita: CitasPacienteRequest): Observable<any> {
        return this.novedadService.guardarCita(cita).pipe();
    }

}
