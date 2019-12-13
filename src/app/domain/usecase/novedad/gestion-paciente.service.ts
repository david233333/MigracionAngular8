import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ComunGatewayAbstract } from '../../model/comun/gateway/comun-gateway.abstract';
import { NovedadGatewayAbstract } from '../../model/novedad/gateway/novedad-gateway.abstract';
import { TipoIdentificacion } from '../../model/maestro/entity/tipo-identificacion.model';
import { Ciudad } from '../../model/maestro/entity/ciudad.model';
import { Piso } from '../../model/maestro/entity/piso.model';
import { FiltrosGestionNovedadesRequest } from '../../../infraestructure/request-model/novedad/filtros-gestion-novedad.request';
import { EstadoPaciente } from '../../model/maestro/entity/estado-paciente.model';

@Injectable()
export class GestionPacienteService {

    constructor(
        private novedadService: NovedadGatewayAbstract,
        private comunService: ComunGatewayAbstract) {
    }


    /**
    * Obtiene los tipos de identificaciones
    * @returns {Observable<any[]>}
    */
    public getTiposIdentificacion(): Observable<TipoIdentificacion[]> {
        return this.comunService.getTiposIdentificacionNovedad().pipe();
    }

    /**
    * Obtiene las ciudades
    * @returns {Observable<Ciudad[]>}
    */
    public getCiudades(): Observable<Ciudad[]> {
        return this.comunService.getCiudadesNovedad().pipe();
    }


    /**
    * Obtiene los pisos
    * @returns {Observable<Piso[]>}
    */
    public getPisosCiudad(ciudad: string): Observable<Piso[]> {
        return this.comunService.getPisosCiudadNovedad(ciudad).pipe();
    }

    /**
    * Obtiene los estados del paciente
    * @returns {Observable<EstadoPaciente[]>}
    */
    public getEstadosPaciente(): Observable<EstadoPaciente[]> {
        return this.comunService.getEstadosPacienteNovedad().pipe();
    }

    /**
     * Consulta los pacientes a gestionar de acuerdo a los filtros seleccionados
     * @param filtrosGestionNovedad
     */
    public getPacientesGestionar(filtrosGestionNovedad: FiltrosGestionNovedadesRequest): Observable<any> {
        return this.novedadService.getPacientesGestionar(filtrosGestionNovedad).pipe();
    }


    /**
     * Consulta el total de registros de pacientes por estado
     * @param estado Nuevo, PreAlta, Alta, Activo
     */
    public getTotalRegistrosPaciente(): Observable<any> {
        return this.novedadService.getTotalRegistrosPaciente().pipe();
    }

    public getUltimaCita(idRemision: string): Observable<any> {
      return this.novedadService.consultarUltimaCitaRemision(idRemision).pipe();
    }

}
