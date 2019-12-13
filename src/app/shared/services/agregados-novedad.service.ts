import { Injectable } from '@angular/core';
import { SolicitudNovedadesResponse } from '../../infraestructure/response-model/novedad/solicitud-novedad.response';


@Injectable()
export class AgregadosNovedadService {
    constructor() { }

    public static _datosRemision: any;
    public static _datosNovedad: any;
    public static _datosGestionNovedad: any;
    public static _datosGestionNovedadSeleccionada: any;
    public static _datosPacienteNovedad: any;
    public static _datosCitasAgregadoNovedad: any;


    /**
     * Asigna los datos de remisión usados en la creación de la novedad
     */
    set datosRemision(datosRemision: any) {
        AgregadosNovedadService._datosRemision = datosRemision;
    }

    /**
     * Obtiene los datos de remisión usados en la creación de la novedad
     */
    get datosRemision(): any {
        return AgregadosNovedadService._datosRemision;
    }

    /**
     * Asigna los datos de la novedad
     */
    set datosNovedad(datosGestionNovedad: any) {
        AgregadosNovedadService._datosNovedad = datosGestionNovedad;
    }

    /**
     * Obtiene los datos de la novedad
     */
    get datosNovedad(): any {
        return AgregadosNovedadService._datosNovedad;
    }

    /**
     * Asigna los datos de las solicitudes de novedades para su gestión
     */
    set datosGestionNovedad(datosGestionNovedad: Array<SolicitudNovedadesResponse>) {
        AgregadosNovedadService._datosGestionNovedad = datosGestionNovedad;
    }

    /**
     * Obtiene los datos de las solicitudes de novedades para su gestión
     */
    get datosGestionNovedad(): Array<SolicitudNovedadesResponse> {
        return AgregadosNovedadService._datosGestionNovedad;
    }

    /**
     * Asigna los datos de la novedad seleccionada para su gestión
     */
    set datosGestionNovedadSeleccionada(datosGestionNovedadSeleccionada: SolicitudNovedadesResponse) {
        AgregadosNovedadService._datosGestionNovedadSeleccionada = datosGestionNovedadSeleccionada;
    }

    /**
     * Obtiene los datos de la novedad seleccionada para su gestión
     */
    get datosGestionNovedadSeleccionada(): SolicitudNovedadesResponse {
        return AgregadosNovedadService._datosGestionNovedadSeleccionada;
    }

    /**
     * Asigna los datos de los pacientes para su gestión
     */
    set datosPacienteNovedad(datosPacienteNovedad: any) {
        AgregadosNovedadService._datosPacienteNovedad = datosPacienteNovedad;
    }

    /**
     * Obtiene los datos de los pacientes para su gestión
     */
    get datosPacienteNovedad(): any {
        return AgregadosNovedadService._datosPacienteNovedad;
    }

    /**
     * Asigna los datos de las citas consultadas en el agregado
     */
    set datosCitasAgregadoNovedad(datosCitasAgregadoNovedad: any) {
        AgregadosNovedadService._datosCitasAgregadoNovedad = datosCitasAgregadoNovedad;
    }

    /**
     * Obtiene los datos de las citas consultadas en el agregado
     */
    get datosCitasAgregadoNovedad(): any {
        return AgregadosNovedadService._datosCitasAgregadoNovedad;
    }

}
