import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ComunGatewayAbstract } from '../../model/comun/gateway/comun-gateway.abstract';
import { MotivoFijarCita } from '../../model/maestro/entity/motivo-fijar-cita.model';
import { Profesion } from '../../model/maestro/entity/profesion.model';
import { ProgramacionGatewayAbstract } from '../../model/programacion/gateway/programacion-gateway.abstract';
import { NovedadGatewayAbstract } from '../../model/novedad/gateway/novedad-gateway.abstract';

@Injectable()
export class FijacionVisitaService {

    constructor(
        private programacionService: ProgramacionGatewayAbstract,
        private comunService: ComunGatewayAbstract,
        private novedadService: NovedadGatewayAbstract) {
    }

    /**
    * Obtiene los motivos de fijación de visitas
    * @returns {Observable<MotivoFijarCita[]>}
    */
    public getMotivosFijacionVisita(): Observable<MotivoFijarCita[]> {
        return this.comunService.getMotivosFijacionCita().pipe();
    }

    /**
    * Obtiene las especialidades
    * @returns {Observable<Profesion[]>}
    */
    public getEspecialidades(idPrograma: string): Observable<Profesion[]> {
        return this.comunService.getProfesionesNovedadIdPrograma(idPrograma).pipe();
    }

    /**
    * Obtiene las visitas a fijar o desfijar
    * @returns {Observable<any>}
    */
    public getVisitas(idRemision: string, especialidad: string): Observable<any> {
        return this.programacionService.getProgramacionEspecialidad(idRemision, especialidad).pipe();
    }

    /**
    * Fija y desfija las visitas
    * @returns {Observable<any>}
    */
    public fijarDesfijarVisita(request: any): Observable<any> {
        return this.novedadService.fijarDesfijarVisita(request).pipe();
    }
}
