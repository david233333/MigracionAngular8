import {Component, OnInit, EventEmitter, Output, OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { MensajesService } from '../../../../shared/services/mensajes.service';
import { ProgramacionCitaService } from '../../../../domain/usecase/programacion/programacion-cita.service';
import { AgregadosNovedadService } from '../../../../shared/services/agregados-novedad.service';
import { AplicacionCuidadorViewModel } from './aplicacion-cuidador.view-model';
import { AplicacionCuidadorService } from '../../../../domain/usecase/novedad/aplicacion-cuidador.service';
import { AplicacionCuidador } from '../../../../domain/model/novedad/entity/aplicacion-cuidador.model';
import * as lodash from 'lodash';
import { DetalleVisitasComponent } from '../../../lineaUnica/lista-linea-unica/modal-linea-unica/detalle-visitas/detalle-visitas.component';
import { MatDialog } from '@angular/material';
import { UsuarioService } from '../../../../shared/services/usuario.service';
import {CapturarErrores} from '../../../../shared/services/capturar-errores';

moment.locale('es');


@Component({
    selector: 'sura-novedad-aplicacion-cuidador',
    templateUrl: './aplicacion-cuidador.component.html',
    styleUrls: ['./aplicacion-cuidador.component.scss']
})
export class AplicacionCuidadorComponent implements OnInit, OnDestroy  {

    public columnas: any[];
    public columnasFiltro: any[];
    public aplicacionCuidadorViewModel: AplicacionCuidadorViewModel = this.iniciarViewModel();
    public formularioAplicacionCuidador: FormGroup;
    private motivosNovedadSubscripcion = new Subscription();
    private citasSubscripcion: Subscription = new Subscription();
    private aplicarVisitaSubscripcion = new Subscription();
    @Output()
    public regresarPrincipal: EventEmitter<boolean> = new EventEmitter<boolean>();

    ngOnInit(): void {
        this.getDatos();
        this.generarColumnas();
    }

    ngOnDestroy() {
        this.motivosNovedadSubscripcion.unsubscribe();
        this.citasSubscripcion.unsubscribe();
        this.aplicarVisitaSubscripcion.unsubscribe();
    }

    constructor(
        private fb: FormBuilder,
        private aplicacionCuidadorService: AplicacionCuidadorService,
        private mensajesService: MensajesService,
        private programacionCitaService: ProgramacionCitaService,
        private infoRemisionNovedad: AgregadosNovedadService,
        private dialog: MatDialog,
        private usuarioService: UsuarioService,
        private capturaDeErroresService: CapturarErrores) {
        this.crearFormularioAplicacionCuidador();
    }

    public verValidacionCita(): boolean {
        return this.aplicacionCuidadorViewModel.citasSeleccionadas.length > 0 ? false : true;
    }


    private getDatos(): void {
        this.getMotivosNovedad();
        this.getCitas();
    }

    private getCitas(): void {

        this.citasSubscripcion =
            this.programacionCitaService.getProgramacionCuidador(this.infoRemisionNovedad.datosRemision.idRemision)
                .subscribe(
                    response => {
                        console.log('response programacion aplicaciones ', response);
                        this.aplicacionCuidadorViewModel.respuestaCitas = response.citas;
                        this.aplicacionCuidadorViewModel.citasDatos = response.citas;
                        this.aplicacionCuidadorViewModel.citasSeleccionadas = lodash.filter
                            (response.citas, function (s) { return s.cuidador; });
                        this.aplicacionCuidadorViewModel.respuestaCitasFiltro = response.horas;
                    },
                    error => {
                        this.capturaDeErroresService.mapearErrores(error.status, error.error);
                    },
                    () => { }
                );
    }

    /**
     * Obtiene los motivos de novedad
     */
    public getMotivosNovedad(): void {

        this.motivosNovedadSubscripcion =
            this.aplicacionCuidadorService.getMotivosAplicacionCuidador()
                .subscribe(
                    response => {
                        this.aplicacionCuidadorViewModel.respuestaMotivosNovedad = response;
                    },
                    error => {
                        this.capturaDeErroresService.mapearErrores(error.status, error.error);
                    },
                    () => { }
                );
    }


    public aplicarAplicacionCuidador(): void {

        if (this.formularioAplicacionCuidador.valid) {

            let listaCitas = [];
            listaCitas = lodash.concat(this.aplicacionCuidadorViewModel.citasSeleccionadas,
                this.aplicacionCuidadorViewModel.citasNoSeleccionadas);

            let listaUnica = [];
            listaUnica = lodash.uniqBy(listaCitas, 'idCitaNumber');

            console.log('listaUnica ', listaUnica);

            const APLICACION_CUIDADOR = new AplicacionCuidador(
                this.infoRemisionNovedad.datosRemision.idRemision,
                this.formularioAplicacionCuidador.controls['motivoNovedad'].value,
                listaUnica,
                this.usuarioService.InfoUsuario
            );

            console.log('REQUEST - Aplicacion cuidador: ', JSON.stringify(APLICACION_CUIDADOR));

            this.aplicarVisitaSubscripcion =
                this.aplicacionCuidadorService.aplicarAplicacionCuidador(APLICACION_CUIDADOR)
                    .subscribe(
                        (response) => {
                            console.log('RESPONSE - Aplicacion cuidador ', response);
                            this.mensajesService.mostrarMensajeExito
                                (this.aplicacionCuidadorViewModel.mensajes.mensajesAlerta.exitoAplicarAplicacion);
                            this.regresarPrincipal.emit(true);
                        },
                        (error) => {
                            if (error.status !== 400) {
                                this.capturaDeErroresService.mapearErrores(error.status, error.error);
                            } else {
                                this.mensajesService.mostrarMensajeError
                                    (this.aplicacionCuidadorViewModel.mensajes.mensajesAlerta.errorAplicarAplicacion);
                            }
                            console.log('ERROR - Aplicacion cuidador ', error);
                            this.regresarPrincipal.emit(false);
                        },
                        () => {
                            this.aplicarVisitaSubscripcion.unsubscribe();
                        });
        } else {
            this.validarTodosLosCamposDelFormulario(this.formularioAplicacionCuidador);
        }
    }

    public seleccionaCita($event: any): void {
        this.aplicacionCuidadorViewModel.habilitarAplicar = true;
        $event.data.cuidador = true;
        const index = this.aplicacionCuidadorViewModel.citasSeleccionadas.findIndex
            (elemento => elemento.idCitaNumber === $event.data.idCitaNumber);
        this.aplicacionCuidadorViewModel.citasSeleccionadas[index] = $event.data;
    }

    public deseleccionaCita($event: any): void {
        this.aplicacionCuidadorViewModel.habilitarAplicar = true;
        $event.data.cuidador = false;
        this.aplicacionCuidadorViewModel.citasNoSeleccionadas.push($event.data);
    }

    public seleccionHoras($hora: any): void {
        if ($hora.length > 0) {
            this.aplicacionCuidadorViewModel.respuestaCitas = lodash.filter
                (this.aplicacionCuidadorViewModel.citasDatos, (s) => lodash.includes($hora, s.horaInicioCita));
        } else {
            this.aplicacionCuidadorViewModel.respuestaCitas = this.aplicacionCuidadorViewModel.citasDatos;
        }

    }

    /**
    * Genera columnas para la tabla
    */
    private generarColumnas(): void {
        this.columnas = [
            {
                field: this.aplicacionCuidadorViewModel.mensajes.tabla.fechaVisitaCampo,
                header: this.aplicacionCuidadorViewModel.mensajes.tabla.fechaVisita
            },
            {
                field: this.aplicacionCuidadorViewModel.mensajes.tabla.horaVisitaCampo,
                header: this.aplicacionCuidadorViewModel.mensajes.tabla.horaVisitaTabla
            },
            {
                field: this.aplicacionCuidadorViewModel.mensajes.tabla.especialidadCampo,
                header: this.aplicacionCuidadorViewModel.mensajes.tabla.especialidad
            },
            {
                field: this.aplicacionCuidadorViewModel.mensajes.tabla.motivoCampo,
                header: this.aplicacionCuidadorViewModel.mensajes.tabla.motivo
            },
        ];
    }

    /**
    * Inicializa variables del view entity
    */
    private iniciarViewModel(): AplicacionCuidadorViewModel {
        return new AplicacionCuidadorViewModel(
            null,
            null,
            [],
            [],
            [],
            [],
            [],
            [],
            false
        );
    }

    /**
    * Crea los campos del formulario con sus respectivas validaciones
    */
    private crearFormularioAplicacionCuidador(): void {
        this.formularioAplicacionCuidador = this.fb.group({
            motivoNovedad: ['', Validators.compose([Validators.required])],
            hora: []
        });
    }

    /**
 * Válida todos los campos del formulario
 * @param formGroup
 */
    validarTodosLosCamposDelFormulario(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validarTodosLosCamposDelFormulario(control);
            }
        });
    }

    /**
     * Detalle de la cita
     * @param rowData
     */
    public detalleCita(rowData) {
        const dialogRef = this.dialog.open(DetalleVisitasComponent, {
            width: '70%',
            disableClose: true,
            data: { cita: rowData }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
}
