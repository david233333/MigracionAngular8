import { Injectable } from '@angular/core';
import { ComunGatewayAbstract } from '../../model/comun/gateway/comun-gateway.abstract';
import { Observable } from 'rxjs/Observable';
import { Profesion } from '../../model/maestro/entity/profesion.model';
import { mensajes } from '../../../shared/utils/mensajes';
import { ProgramacionSemana } from '../../../shared/models/programacion-semana.model';

@Injectable()
export class ComunService {

  constructor(private comunService: ComunGatewayAbstract) {}

  /**
   * Obtiene las profesiones
   * @returns {Observable<Profesion[]>}
   */
  public getProfesiones(): Observable<Profesion[]> {
    return this.comunService.getProfesionesNovedad().pipe();
  }

  /**
   * Obtiene las profesiones
   * @returns {Observable<Profesion[]>}
   */
  public getProfesionesIdPrograma(idPrograma: string): Observable<Profesion[]> {
    return this.comunService.getProfesionesNovedadIdPrograma(idPrograma).pipe();
  }

  public getDiasSemanas(): ProgramacionSemana[] {
    return [
      {
        id: mensajes.comunes.diasSemana.idLunes,
        dia: mensajes.comunes.diasSemana.lunes
      },
      {
        id: mensajes.comunes.diasSemana.idMartes,
        dia: mensajes.comunes.diasSemana.martes
      },
      {
        id: mensajes.comunes.diasSemana.idMiercoles,
        dia: mensajes.comunes.diasSemana.miercoles
      },
      {
        id: mensajes.comunes.diasSemana.idJueves,
        dia: mensajes.comunes.diasSemana.jueves
      },
      {
        id: mensajes.comunes.diasSemana.idViernes,
        dia: mensajes.comunes.diasSemana.viernes
      },
      {
        id: mensajes.comunes.diasSemana.idSabado,
        dia: mensajes.comunes.diasSemana.sabado
      },
      {
        id: mensajes.comunes.diasSemana.idDomingo,
        dia: mensajes.comunes.diasSemana.domingo
      }
    ];
  }

  /**
   * Obtiene las especialidades
   * @returns {Observable<amy[]>}
   */
  public getEspecialidades(): Observable<any[]> {
    return this.comunService.getProfesionesNovedad().pipe();
  }
}
