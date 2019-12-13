import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MensajesService } from '../../../../shared/services/mensajes.service';
import { CambioPisoViewModel } from './cambio-piso.view-model';
import { CambioPiso } from '../../../../domain/model/novedad/entity/cambio-piso.model';
import { CambioPisoService } from '../../../../domain/usecase/novedad/cambio-piso.service';
import { AgregadosNovedadService } from '../../../../shared/services/agregados-novedad.service';
import { Piso } from '../../../../domain/model/maestro/entity/piso.model';
import { Utilidades } from '../../../../shared/utils/utilidades';
import { ConsultaRemisionRequest } from '../../../../infraestructure/request-model/novedad/consulta-remision.request';
import { CreacionNovedadService } from '../../../../domain/usecase/novedad/creacion-novedad.service';
import { UsuarioService } from '../../../../shared/services/usuario.service';
import {CapturarErrores} from '../../../../shared/services/capturar-errores';


@Component({
    selector: 'sura-novedad-cambio-piso',
    templateUrl: './cambio-piso.component.html',
    styleUrls: ['./cambio-piso.component.scss']
})
export class CambioPisoComponent implements OnInit {

    public cambioPisoViewModel: CambioPisoViewModel = this.iniciarViewModel();
    public formularioCambioPiso: FormGroup;
    private pisosSubscripcion = new Subscription();
    private cambioPisoSubscription = new Subscription();
    private remisionSubscription = new Subscription();

    @Output()
    public regresarPrincipal: EventEmitter<boolean> = new EventEmitter<boolean>();

    ngOnInit(): void {
        this.getDatos();
    }

    ngOnDestroy() {
        this.pisosSubscripcion.unsubscribe();
        this.cambioPisoSubscription.unsubscribe();
        this.remisionSubscription.unsubscribe();
    }

    constructor(
        private fb: FormBuilder,
        private cambioPisoService: CambioPisoService,
        private creacionNovedadService: CreacionNovedadService,
        private mensajesService: MensajesService,
        private infoRemisionNovedad: AgregadosNovedadService,
        private util: Utilidades,
        private usuarioService: UsuarioService,
        private capturaDeErroresService: CapturarErrores) {
        this.crearFormularioCambioPiso();
    }

    private getDatos(): void {
        this.getAgregadoRemision();
        this.getPisos();
    }


    /**
     * Obtiene los motivos de egreso
     */
    public getPisos(): void {
        this.pisosSubscripcion =
            this.cambioPisoService.getPisosCiudadTipoAdmision(this.infoRemisionNovedad.datosRemision.ciudad.idCiudad,
                this.infoRemisionNovedad.datosRemision.tipoAdmision, this.infoRemisionNovedad.datosRemision.programa.idPrograma)
                .subscribe(
                    response => {
                        this.cambioPisoViewModel.respuestaPisos = response;
                    },
                    error => {
                      this.capturaDeErroresService.mapearErrores(error.status, error.error);
                    },
                    () => {
                        this.pisosSubscripcion.unsubscribe();
                    }
                );
    }

    /**
     * Obtiene el agregado de remisión
     */
    public getAgregadoRemision(): void {

        const CONSULTA = new ConsultaRemisionRequest(this.infoRemisionNovedad.datosNovedad.idRemision,
            this.infoRemisionNovedad.datosRemision.tipoIdentificacion.idTipo,
            this.infoRemisionNovedad.datosRemision.numeroIdentificacion);

        this.remisionSubscription = this.creacionNovedadService.getConsultaRemision(CONSULTA)
            .subscribe(
                (response) => {
                    this.infoRemisionNovedad.datosRemision = response.remision;
                    this.infoRemisionNovedad.datosNovedad = response.novedad;
                    this.cargarControlesCambioPiso(this.infoRemisionNovedad.datosRemision.pisoHospitalario.idPiso);
                },
                (error) => {
                  this.capturaDeErroresService.mapearErrores(error.status, error.error);
                },
                () => {
                    this.remisionSubscription.unsubscribe();
                });
    }

    private cargarControlesCambioPiso(idPiso: string): void {
        this.formularioCambioPiso.get('piso').setValue(idPiso);
    }


    asignarPiso(): void {
        if (this.formularioCambioPiso.valid) {
            const PISO_SELECCIONADO = this.cambioPisoViewModel.respuestaPisos
                .find(s => s.idPiso === this.formularioCambioPiso.controls['piso'].value);
            const CAMBIO_PISO = new CambioPiso(
                this.infoRemisionNovedad.datosRemision.idRemision,
                new Piso(PISO_SELECCIONADO.idPiso,
                    PISO_SELECCIONADO.nombre,
                    PISO_SELECCIONADO.tipoPiso,
                    PISO_SELECCIONADO.idPrograma,
                    PISO_SELECCIONADO.idCiudad
                ),
                this.formularioCambioPiso.controls['observacion'].value,
                this.usuarioService.InfoUsuario
            );

            console.log('REQUEST - Piso ', JSON.stringify(CAMBIO_PISO));

            const ES_IGUAL = this.util.compararObjetos(this.infoRemisionNovedad.datosRemision.pisoHospitalario, CAMBIO_PISO.piso);

            if (ES_IGUAL) {
                this.mensajesService.mostrarMensajeError(this.cambioPisoViewModel.mensajes.mensajesAlerta.noCambioPiso);
            } else {
                this.cambiarPisoPaciente(CAMBIO_PISO);
            }
        } else {
            this.validarTodosLosCamposDelFormulario(this.formularioCambioPiso);
        }
    }


    /**
* cambiar de piso al paciente
*/
    private cambiarPisoPaciente(cambioPiso: CambioPiso): void {

        this.cambioPisoSubscription =
            this.cambioPisoService.cambiarPiso(cambioPiso)
                .subscribe(
                    (response) => {
                        console.log('RESPONSE - Piso ', response);
                        this.mensajesService.mostrarMensajeExito(this.cambioPisoViewModel.mensajes.mensajesAlerta.exitoCambioPiso);
                        this.regresarPrincipal.emit(true);
                    },
                    (error) => {
                      this.capturaDeErroresService.mapearErrores(error.status, error.error);
                        this.regresarPrincipal.emit(false);
                    },
                    () => {
                        this.cambioPisoSubscription.unsubscribe();
                    });

    }

    /**
    * Inicializa variables del view entity
    */
    private iniciarViewModel(): CambioPisoViewModel {
        return new CambioPisoViewModel(
            null,
            null,
            []
        );
    }

    /**
    * Crea los campos del formulario con sus respectivas validaciones
    */
    private crearFormularioCambioPiso(): void {
        this.formularioCambioPiso = this.fb.group({
            piso: ['', Validators.compose([Validators.required])],
            observacion: ['',
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(4000)
                ])
            ],
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
}
