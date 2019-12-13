import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TabView } from 'primeng/primeng';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { PlanManejoService } from '../../../../domain/usecase/remision/plan-manejo.service';
import { MensajesService } from '../../../../shared/services/mensajes.service';
import { Guid } from 'guid-typescript';
import { BebeCanguro } from '../../../../domain/model/remision/entity/plan-manejo/valoraciones/bebe-canguro.model';
import { ModalBebeCanguroViewModel } from './modal-bebe-canguro.view-model';
import { DatosPacienteComponent } from '../datos-paciente.component';

moment.locale('es');


@Component({
    selector: 'sura-bebe-canguro',
    templateUrl: './modal-bebe-canguro.component.html',
    styleUrls: ['./modal-bebe-canguro.component.scss']
})
export class ModalBebeCanguroComponent implements OnInit, OnDestroy {

    public formularioBebeCanguro: FormGroup;
    public fechaNacimiento: Date;
    public configEspanolCalendario: any;
    public nombreFormulario: string;
    public modalBebeCanguroViewModel: ModalBebeCanguroViewModel = this.iniciarViewModel();
    @ViewChild(TabView, { static: true }) tabView: TabView;
    public seleccionBebeCanguro: boolean;
    public fechaMaximaCalendarioActual: Date;
    public tipoValoracion: string;

    constructor(public dialogRef: MatDialogRef<DatosPacienteComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private mensajesService: MensajesService,
        private planManejoService: PlanManejoService) {
        this.crearFormularioBebeCanguro();
        this.configurarMaximaFechaActual();
    }

    ngOnInit() {
        this.verDatos();
        this.configurarCalendario();
        this.verEdicion(this.data);
    }


    ngOnDestroy() {
    }

    verDatos() {
        this.verOpcionBebeCanguro();
    }

    private verOpcionBebeCanguro(): void {
        this.nombreFormulario = this.modalBebeCanguroViewModel.mensajes.opcionesMenu.bebeCanguro;
        this.modalBebeCanguroViewModel.tituloVentana = this.modalBebeCanguroViewModel.mensajes.titulos.agregarEditarBebeCanguro;
    }


    verEdicion(data: any) {
        if (data !== null) {

            if (data instanceof BebeCanguro) {
                this.tipoValoracion = 'BEBE_CANGURO';
            }

            switch (this.tipoValoracion) {
                case 'BEBE_CANGURO': {
                    this.nombreFormulario = this.modalBebeCanguroViewModel.mensajes.opcionesMenu.bebeCanguro;
                    this.modalBebeCanguroViewModel.tituloVentana = this.modalBebeCanguroViewModel.mensajes.titulos.agregarEditarBebeCanguro;
                    this.verTabSeleccionado(true);
                    this.formularioBebeCanguro.get('fechaNacimiento').setValue(new Date(data.fechaNacimiento));
                    this.fechaNacimiento = new Date(data.fechaNacimiento);
                    this.formularioBebeCanguro.get('pesoNacimiento').setValue(data.pesoNacimiento);
                    this.formularioBebeCanguro.get('edadGestacionalSemanas').setValue(data.edadGestacionalSemanas);
                    this.formularioBebeCanguro.get('edadGestacionalDias').setValue(data.edadGestacionalDias);
                    this.formularioBebeCanguro.get('pesoAlta').setValue(data.pesoAlta);
                    break;
                }
            }
        }
    }


    private verTabSeleccionado(esBebeCanguro: boolean): void {
        this.seleccionBebeCanguro = esBebeCanguro;
    }

    public seleccionarPlan($event) {
        this.configurarFormulario(this.tabView.tabs[$event.index].header);
    }


    private configurarFormulario(header: string): void {
        this.nombreFormulario = header;

        switch (header) {
            case this.modalBebeCanguroViewModel.mensajes.opcionesMenu.bebeCanguro: {
                this.modalBebeCanguroViewModel.tituloVentana = this.modalBebeCanguroViewModel.mensajes.titulos.agregarEditarBebeCanguro;
                break;
            }
        }
    }


    public guardarProcedimiento(): void {
        switch (this.nombreFormulario) {
            case this.modalBebeCanguroViewModel.mensajes.opcionesMenu.bebeCanguro: {

                if (this.formularioBebeCanguro.valid) {

                    const BEBE_CANGURO = new BebeCanguro(
                        Guid.create().toString(),
                        this.formularioBebeCanguro.controls['fechaNacimiento'].value,
                        this.formularioBebeCanguro.controls['pesoNacimiento'].value,
                        this.formularioBebeCanguro.controls['edadGestacionalSemanas'].value,
                        this.formularioBebeCanguro.controls['edadGestacionalDias'].value,
                        this.formularioBebeCanguro.controls['pesoAlta'].value,
                    );

                    this.dialogRef.close(BEBE_CANGURO);

                } else {
                    this.validarTodosLosCamposDelFormulario(this.formularioBebeCanguro);
                }

                break;
            }
        }
    }


    public cerrarModal() {
        this.dialogRef.close();
    }

    private configurarMaximaFechaActual(): void {
        let fechaHoy = new Date();
        this.fechaMaximaCalendarioActual = new Date();
        this.fechaMaximaCalendarioActual.setDate(fechaHoy.getDate());
        this.fechaMaximaCalendarioActual.setMonth(fechaHoy.getMonth());
        this.fechaMaximaCalendarioActual.setFullYear(fechaHoy.getFullYear());
    }


    /**
     * Válida todos los campos del formulario
     * @param formGroup
     */
    private validarTodosLosCamposDelFormulario(formGroup: FormGroup) {
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
* Crea los campos del formulario Bebé Cancuro con sus respectivas validaciones
*/
    private crearFormularioBebeCanguro(): void {
        this.formularioBebeCanguro = this.fb.group({
            fechaNacimiento: ['', Validators.compose([
                Validators.required
            ])],
            pesoNacimiento: ['',
                Validators.compose([
                    Validators.required,
                    Validators.pattern('^([0-9]{1,4})+([,][0-9]{1,3})?$'),
                    Validators.min(800)
                ])
            ],
            edadGestacionalSemanas: ['',
                Validators.compose([
                    Validators.required,
                    Validators.pattern('[0-9]+'),
                    Validators.min(28),
                    Validators.max(41)
                ])
            ],
            edadGestacionalDias: ['',
                Validators.compose([
                    Validators.required,
                    Validators.pattern('[0-9]+'),
                    Validators.min(0),
                    Validators.max(6)
                ])
            ],
            pesoAlta: ['',
                Validators.compose([
                    Validators.required,
                    Validators.pattern('^([0-9]{1,4})+([,][0-9]{1,3})?$'),
                    Validators.min(1000)
                ])
            ],
        });
    }


    /**
   * Inicializa variables del view entity
   */
    private iniciarViewModel(): ModalBebeCanguroViewModel {
        return new ModalBebeCanguroViewModel(
            null,
            false,
            '');
    }

    private configurarCalendario(): void {
        this.configEspanolCalendario = {
            firstDayOfWeek: 1,
            dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
            dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
            dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
            monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
            monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
            today: 'Hoy',
            clear: 'Borrar'
        };
    }
}
