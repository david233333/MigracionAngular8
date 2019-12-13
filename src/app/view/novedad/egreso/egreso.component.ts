import {Component, OnInit, ViewChild, Inject, Output, EventEmitter, OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { MensajesService } from '../../../shared/services/mensajes.service';
import { EgresoViewModel } from './egreso.view-model';
import { Egreso } from '../../../domain/model/novedad/entity/egreso.model';
import { EgresoService } from '../../../domain/usecase/novedad/egreso.service';
import { AgregadosNovedadService } from '../../../shared/services/agregados-novedad.service';
import { MotivoEgreso } from '../../../domain/model/maestro/entity/motivo-egreso.model';
import { UsuarioService } from '../../../shared/services/usuario.service';
import {CapturarErrores} from '../../../shared/services/capturar-errores';
moment.locale('es');


@Component({
    selector: 'sura-novedad-egreso',
    templateUrl: './egreso.component.html',
    styleUrls: ['./egreso.component.scss']
})
export class EgresoComponent implements OnInit, OnDestroy {

    public opcionPantalla: string;
    public tituloPantalla: string;
    public configEspanolCalendario: any;
    public egresoViewModel: EgresoViewModel = this.iniciarViewModel();
    public formularioEgreso: FormGroup;
    private motivosEgresoSubscripcion = new Subscription();
    private egresoSubscripcion = new Subscription();
    @Output()
    public regresarPrincipal: EventEmitter<boolean> = new EventEmitter<boolean>();
    public fechaMinimaCalendarioActual: Date;


    ngOnInit(): void {
        this.configurarCalendario();
        this.getDatos();
    }

    ngOnDestroy() {
        this.motivosEgresoSubscripcion.unsubscribe();
        this.egresoSubscripcion.unsubscribe();
    }

    constructor(
        private fb: FormBuilder,
        private egresoService: EgresoService,
        private mensajesService: MensajesService,
        private infoRemisionNovedad: AgregadosNovedadService,
        private usuarioService: UsuarioService,
        private capturaDeErroresService: CapturarErrores) {
        this.crearFormularioEgreso();
        this.configurarMinimaFechaActual();
    }

    private getDatos(): void {
        this.getMotivosEgreso();
    }


    public egresarNovedad(): void {
        if (this.formularioEgreso.valid) {

            const EGRESO = new Egreso(
                this.infoRemisionNovedad.datosRemision.idRemision,
                new MotivoEgreso('', this.formularioEgreso.controls['motivoEgreso'].value.idMotivo,
                    this.formularioEgreso.controls['motivoEgreso'].value.descripcion),
                this.formularioEgreso.controls['fechaAlta'].value,
                this.formularioEgreso.controls['observacion'].value,
                this.usuarioService.InfoUsuario
            );

            console.log('REQUEST - EGRESO ', JSON.stringify(EGRESO));

            this.egresarPaciente(EGRESO);

        } else {
            this.validarTodosLosCamposDelFormulario(this.formularioEgreso);
        }
    }

    /**
 * egresa al paciente
 */
    private egresarPaciente(egreso: Egreso): void {

        this.egresoSubscripcion =
            this.egresoService.egresarPaciente(egreso)
                .subscribe(
                    (response) => {
                        console.log('RESPONSE - Egreso ', response);
                        this.mensajesService.mostrarMensajeExito(this.egresoViewModel.mensajes.mensajesAlerta.exitoEgreso);
                        this.regresarPrincipal.emit(true);
                    },
                    (error) => {
                      this.capturaDeErroresService.mapearErrores(error.status, error.error);
                    },
                    () => {
                        this.egresoSubscripcion.unsubscribe();
                    });

    }

    /**
 * Obtiene los motivos de egreso
 */
    private getMotivosEgreso(): void {
        if (this.egresoViewModel.respuestaMotivosEgreso === null ||
            this.egresoViewModel.respuestaMotivosEgreso.length === 0) {
            this.motivosEgresoSubscripcion =
                this.egresoService.getMotivosEgreso()
                    .subscribe(
                        response => {
                                this.egresoViewModel.respuestaMotivosEgreso = response;
                        },
                        error => {
                          this.capturaDeErroresService.mapearErrores(error.status, error.error);
                        },
                        () => { }
                    );
        }
    }

    public seleccionEgreso($event: any): void {
        console.log('$event.value ', $event.value);
        if ($event.value.idMotivo === '5') {
            this.formularioEgreso.controls['fechaAlta'].setValue(new Date(Date.now()));
            this.cambiarValidadorFormularioARequerido(this.formularioEgreso, 'observacion');
        } else {
            this.formularioEgreso.controls['fechaAlta'].setValue(null);
            this.cambiarValidadorFormularioAOpcional(this.formularioEgreso, 'observacion');
        }
    }

    /**
    * Inicializa variables del view entity
    */
    private iniciarViewModel(): EgresoViewModel {
        return new EgresoViewModel(
            null,
            null,
            '',
            []
        );
    }

    /**
    * Crea los campos del formulario con sus respectivas validaciones
    */
    private crearFormularioEgreso(): void {
        this.formularioEgreso = this.fb.group({
            motivoEgreso: ['', Validators.compose([Validators.required])],
            fechaAlta: ['',
                Validators.compose([Validators.required, Validators.maxLength(100)])
            ],
            observacion: ['',
                Validators.compose([
                    Validators.maxLength(4000)
                ])
            ],
        });
    }

    private configurarMinimaFechaActual(): void {
        const fechaHoy = new Date();
        this.fechaMinimaCalendarioActual = new Date();
        this.fechaMinimaCalendarioActual.setDate(fechaHoy.getDate());
        this.fechaMinimaCalendarioActual.setMonth(fechaHoy.getMonth());
        this.fechaMinimaCalendarioActual.setFullYear(fechaHoy.getFullYear());
    }

    private configurarCalendario(): void {
        this.configEspanolCalendario = {
            firstDayOfWeek: 1,
            dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
            dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
            dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
            monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre',
                'octubre', 'noviembre', 'diciembre'],
            monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
            today: 'Hoy',
            clear: 'Borrar'
        };
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
* Cambia los validadores de un control del formulario
* @param {FormGroup} formulario
* @param {string} nombrecontrol
*/
    private cambiarValidadorFormularioARequerido(formulario: FormGroup, nombrecontrol: string): void {
        formulario.get(nombrecontrol).clearValidators();
        formulario.get(nombrecontrol).setValidators(
            Validators.compose([
                Validators.required
            ])
        );
        formulario.get(nombrecontrol).updateValueAndValidity();
    }


    /**
    * Cambia los validadores de un control del formulario
    * @param {FormGroup} formulario
    * @param {string} nombrecontrol
    */
    private cambiarValidadorFormularioAOpcional(formulario: FormGroup, nombrecontrol: string): void {
        formulario.get(nombrecontrol).clearValidators();
        formulario.get(nombrecontrol).setValidators(
            Validators.compose([])
        );
        formulario.get(nombrecontrol).updateValueAndValidity();
    }

}
