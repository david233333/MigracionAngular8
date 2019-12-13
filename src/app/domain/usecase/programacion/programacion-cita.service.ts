import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ProgramacionGatewayAbstract } from '../../model/programacion/gateway/programacion-gateway.abstract';

@Injectable()
export class ProgramacionCitaService {

    constructor(
        private programacionService: ProgramacionGatewayAbstract) {
    }


    /**
     * Consultar citas por id Remision
     * @param idRemision
     */
    public getProgramacion(idRemision: string): Observable<any> {
        return this.programacionService.getProgramacion(idRemision);
    }

    /**
     * Consultar citas por idRemision y Especialidad
     * @param idRemision
     * @param especialidad
     */
    public getProgramacionEspecialidad(idRemision: string, especialidad: string): Observable<any> {
        return this.programacionService.getProgramacionEspecialidad(idRemision, especialidad);
    }

    /**
     * Consultar citas cuidador
     * @param idRemision 
     */
    public getProgramacionCuidador(idRemision: string): Observable<any> {
        return this.programacionService.getProgramacionCuidador(idRemision);
    }

    public getDisponibilidadCitas(data: any): Observable<any> {
        return this.programacionService.guardarRemision(data);
    }

    

}
