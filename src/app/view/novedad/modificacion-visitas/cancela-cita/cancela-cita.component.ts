import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { MensajesService } from '../../../../shared/services/mensajes.service';
import { CancelaCitaViewModel } from './cancela-cita.view-model';
import { CancelaVisitaService } from '../../../../domain/usecase/novedad/cancela-visita.service';
import { CancelaCita } from '../../../../domain/model/novedad/entity/cancela-cita.model';
import { ProgramacionCitaService } from '../../../../domain/usecase/programacion/programacion-cita.service';
import { AgregadosNovedadService } from '../../../../shared/services/agregados-novedad.service';
import { DetalleVisitasComponent } from '../../../lineaUnica/lista-linea-unica/modal-linea-unica/detalle-visitas/detalle-visitas.component';
import { MatDialog } from '@angular/material';
import { UsuarioService } from '../../../../shared/services/usuario.service';
import { CapturarErrores } from '../../../../shared/services/capturar-errores';

moment.locale('es');

@Component({
  selector: 'sura-novedad-cancela-cita',
  templateUrl: './cancela-cita.component.html',
  styleUrls: ['./cancela-cita.component.scss']
})
export class CancelaCitaComponent implements OnInit, OnDestroy {
  public columnas: any[];
  public cancelaCitaViewModel: CancelaCitaViewModel = this.iniciarViewModel();
  public formularioCancelaCita: FormGroup;
  private motivosCancelaCitaSubscripcion = new Subscription();
  private citasSubscripcion: Subscription = new Subscription();
  private cancelaVisitaSubscripcion = new Subscription();
  @Output()
  public regresarPrincipal: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.getDatos();
    this.generarColumnas();
  }

  ngOnDestroy() {
    this.motivosCancelaCitaSubscripcion.unsubscribe();
    this.citasSubscripcion.unsubscribe();
    this.cancelaVisitaSubscripcion.unsubscribe();
  }

  constructor(
    private fb: FormBuilder,
    private cancelaVisitaService: CancelaVisitaService,
    private mensajesService: MensajesService,
    private programacionCitaService: ProgramacionCitaService,
    private infoRemisionNovedad: AgregadosNovedadService,
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private capturaDeErroresService: CapturarErrores
  ) {
    this.crearFormularioCancelaCita();
  }

  public verValidacionCita(): boolean {
    return this.cancelaCitaViewModel.citasSeleccionadas === (null && undefined);
  }

  public habilitarGuardar(): boolean {
    return this.cancelaCitaViewModel.citasSeleccionadas === (null && undefined);
  }

  private getDatos(): void {
    this.getMotivosCancelacionCita();
    this.getCitas();
  }

  private getCitas(): void {
    this.citasSubscripcion = this.programacionCitaService
      .getProgramacion(this.infoRemisionNovedad.datosRemision.idRemision)
      .subscribe(
        response => {
          this.cancelaCitaViewModel.respuestaCitas = response;
          console.log(
            'this.cancelaCitaViewModel.respuestaCitas ',
            this.cancelaCitaViewModel.respuestaCitas
          );
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {}
      );
  }

  /**
   * Obtiene los motivos de cancelacion de visita
   */
  public getMotivosCancelacionCita(): void {
    this.motivosCancelaCitaSubscripcion = this.cancelaVisitaService
      .getMotivosCancelacion()
      .subscribe(
        response => {
          this.cancelaCitaViewModel.respuestaMotivosCancelaCita = response;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {}
      );
  }

  public cancelarCitas(): void {
    if (
      this.formularioCancelaCita.valid &&
      this.cancelaCitaViewModel.citasSeleccionadas !== (null && undefined)
    ) {
      const LISTA_CITAS: string[] = [];
      LISTA_CITAS.push(
        this.cancelaCitaViewModel.citasSeleccionadas.idCitaNumber
      );

      const CANCELA_CITA = new CancelaCita(
        '',
        this.infoRemisionNovedad.datosRemision.idRemision,
        this.formularioCancelaCita.controls['motivoCancelaCita'].value,
        LISTA_CITAS,
        this.formularioCancelaCita.controls['observacion'].value,
        this.usuarioService.InfoUsuario,
        this.cancelaCitaViewModel.citasSeleccionadas.especialidad
      );

      console.log('REQUEST - Cancela cita: ', JSON.stringify(CANCELA_CITA));

      this.cancelaVisitaSubscripcion = this.cancelaVisitaService
        .cancelarVisita(CANCELA_CITA)
        .subscribe(
          response => {
            console.log('RESPONSE - Cancela Visita ', response);
            this.mensajesService.mostrarMensajeExito(
              this.cancelaCitaViewModel.mensajes.mensajesAlerta
                .exitoCancelarCita
            );
            const index = this.cancelaCitaViewModel.respuestaCitas.indexOf(this.cancelaCitaViewModel.citasSeleccionadas);
            this.formularioCancelaCita.get('motivoCancelaCita').setValue('');
            this.formularioCancelaCita.get('observacion').setValue('');
            if (index > -1) {
              this.cancelaCitaViewModel.respuestaCitas.splice(index, 1);
            }
           // this.regresarPrincipal.emit(true);
          },
          error => {
            this.capturaDeErroresService.mapearErrores(
              error.status,
              error.error
            );
          },
          () => {
            this.cancelaVisitaSubscripcion.unsubscribe();
          }
        );
    } else {
      this.validarTodosLosCamposDelFormulario(this.formularioCancelaCita);
    }
  }

  /**
   * Genera columnas para la tabla
   */
  private generarColumnas(): void {
    this.columnas = [
      {
        field: this.cancelaCitaViewModel.mensajes.tabla.tipoCitaCampo,
        header: this.cancelaCitaViewModel.mensajes.tabla.tipoCita
      },
      {
        field: this.cancelaCitaViewModel.mensajes.tabla.fechaVisitaCampo,
        header: this.cancelaCitaViewModel.mensajes.tabla.fechaVisita
      },
      {
        field: this.cancelaCitaViewModel.mensajes.tabla.especialidadCampo,
        header: this.cancelaCitaViewModel.mensajes.tabla.especialidad
      }
    ];
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): CancelaCitaViewModel {
    return new CancelaCitaViewModel(null, null, [], [], null);
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormularioCancelaCita(): void {
    this.formularioCancelaCita = this.fb.group({
      motivoCancelaCita: ['', Validators.compose([Validators.required])],
      observacion: ['', Validators.compose([Validators.maxLength(4000)])]
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

  public detalleCita(rowData) {
    const dialogRef = this.dialog.open(DetalleVisitasComponent, {
      width: '70%',
      disableClose: true,
      data: { cita: rowData }
    });
    dialogRef.afterClosed().subscribe(result => {});
  }
}
