import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ComunGatewayAbstract } from '../../model/comun/gateway/comun-gateway.abstract';
import { NovedadGatewayAbstract } from '../../model/novedad/gateway/novedad-gateway.abstract';
import { PlanManejo } from '../../model/novedad/entity/plan-manejo/plan-manejo.model';
import { Dosis } from '../../model/maestro/entity/dosis.model';
import { Frecuencia } from '../../model/maestro/entity/frecuencia.model';
import { ViaAdministracion } from '../../model/maestro/entity/via-administracion.model';
import { PlanManejoRequest } from '../../../infraestructure/request-model/novedad/plan-manejo.request';
import { TipoNutricion } from '../../model/maestro/entity/tipo-nutricion.model';
import { TipoCuracion } from '../../model/maestro/entity/tipo-curacion.model';
import { TipoTerapia } from '../../model/maestro/entity/tipo-terapia.model';
import { TipoSondajeIngreso } from '../../model/maestro/entity/tipo-sondaje-ingreso.model';
import { TipoMuestra } from '../../model/maestro/entity/tipo-muestra.model';
import { Medicamento } from '../../model/maestro/entity/medicamento.model';
import { TiposSoporteNutricional } from '../../model/maestro/entity/tipos-soporte-nutricional.model';


@Injectable()
export class PlanManejoService {

    constructor(
        private novedadService: NovedadGatewayAbstract,
        private comunService: ComunGatewayAbstract) {
    }

    /**
    * Obtiene las dosis
    * @param {string} tipo
    * @returns {Observable<Dosis[]>}
    */
    public getDosis(tipo: string): Observable<Dosis[]> {
        return this.comunService.getDosisNovedad(tipo).pipe();
    }

    /**
    * Obtiene las frecuencias
    * @param {string} tipo
    * @returns {Observable<Frecuencia[]>}
    */
    public getFrecuencias(tipo: string): Observable<Frecuencia[]> {
        return this.comunService.getFrecuenciasNovedad(tipo).pipe();
    }

    /**
    * Obtiene las dosis
    * @param {string} tipo
    * @returns {Observable<ViaAdministracion[]>}
    */
    public getViasAdministracion(tipo: string): Observable<ViaAdministracion[]> {
        return this.comunService.getViasAdministracionNovedad(tipo).pipe();
    }

    /**
     * Obtiene los medicamentos
     * @returns {Observable<Medicamento>}
     */
    public getMedicamentos(filtro: string): Observable<Medicamento[]> {
        return this.comunService.getMedicamentosNovedad(filtro);
    }


    /**
    * Obtiene los tipos de nutrición
    * @returns {Observable<TipoNutricion[]}
    */
    public getTiposNutricion(): Observable<TipoNutricion[]> {
        return this.comunService.getTiposNutricionNovedad().pipe();
    }

    /**
    * Obtiene los tipos de curación
    * @returns {Observable<TipoCuracion[]}
    */
    public getTiposCuracion(): Observable<TipoCuracion[]> {
        return this.comunService.getTiposCuracionesNovedad().pipe();
    }

    public getTiposSondaje(): Observable<TipoSondajeIngreso[]> {
        return this.comunService.getTiposSondaje().pipe();
    }

    /**
    * Obtiene los tipos de terapia
    * @returns {Observable<TipoTerapia[]}
    */
    public getTiposTerapia(): Observable<TipoTerapia[]> {
        return this.comunService.getTiposTerapiasNovedad().pipe();
    }

    /**
    * Obtiene los tipos de muestra para procedimiento Toma de muestra en novedad
    * @returns {Observable<TipoMuestra[]}
    */
    public getTomasMuestra(): Observable<TipoMuestra[]> {
        return this.comunService.getTomasMuestraNovedad().pipe();
    }

    /**
    * Obtiene los tipos de sondajes para el procedimiento Sondajes
    * @returns {Observable<TipoSondajeIngreso[]}
    */
    public getTiposSondajeNovedad(): Observable<TipoSondajeIngreso[]> {
        return this.comunService.getTiposSondajeNovedad().pipe();
    }

    /**
    * Guarda el plan de manejo
    * @returns {Observable<any}
    */
    public cambiarPlanManejo(planManejo: PlanManejoRequest): Observable<any> {
        return this.novedadService.cambiarPlanManejo(planManejo).pipe();
    }

    /**
    * Consultar agregado de plan de manejo
    * @returns {Observable<any>}
    */
    public getAgregadoPlanManejo(idNovedad: string): Observable<PlanManejo> {
        return this.novedadService.getAgregadoPlanManejo(idNovedad);
    }

    /**
    * Consultar agregado de plan de manejo
    * @returns {Observable<any>}
    */
    public getAgregadoPlanManejoHistorial(idNovedad: string): Observable<PlanManejo> {
        return this.novedadService.getAgregadoPlanManejoHistorial(idNovedad);
    }


    /**
    * Obtiene los tipos de soporte nutricional
    * @returns {Observable<TiposSoporteNutricional[]}
    */
    public getTiposSoporteNutricionalNovedad(): Observable<TiposSoporteNutricional[]> {
        return this.comunService.getTiposSoporteNutricionalNovedad();
    }
}
