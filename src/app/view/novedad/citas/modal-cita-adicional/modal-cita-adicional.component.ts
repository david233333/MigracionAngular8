import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import * as moment from 'moment';
import {MensajesService} from '../../../../shared/services/mensajes.service';
import {CitasComponent} from '../citas.component';
import {Subscription} from 'rxjs/Subscription';
import {AgregadosComunService} from '../../../../shared/services/agregados-comun.service';
import {AgregadosNovedadService} from '../../../../shared/services/agregados-novedad.service';
import {ComunService} from '../../../../domain/usecase/comun/comun.service';
import {CapturarErrores} from '../../../../shared/services/capturar-errores';
import {ModalCitaAdicionalViewModel} from './modal-cita-adicional.view-model';
import {TipoNovedadEnum} from '../../../../shared/utils/enums/tipo-novedad.enum';
import {CitaAdicionalRequest} from '../../../../infraestructure/request-model/novedad/cita-adicional.request';
import {TipoCita} from '../../../../domain/model/maestro/entity/tipo-cita.model';
import {Cita} from '../../../../domain/model/novedad/entity/cita.model';
import {ProfesionalResponseModel} from '../../../../domain/model/maestro/entity/ProfesionalResponse.model';

moment.locale('es');

@Component({
  selector: 'sura-modal-cita-adicional',
  templateUrl: './modal-cita-adicional.component.html',
  styleUrls: ['./modal-cita-adicional.component.scss']
})
export class ModalCitaAdicionalComponent
  implements OnInit, OnDestroy, AfterViewInit {
  public formulario: FormGroup;
  public configEspanolCalendario: any;
  public modalCitaAdicionalViewModel: ModalCitaAdicionalViewModel = this.iniciarViewModel();
  private tiposCitaSubscripcion: Subscription = new Subscription();
  public fechaCita: any = null;
  public fechaMinimaCalendarioActual: Date;
  private profesionalEspecialidad = '';
  private CONTROL_TELEFONICO = '3';
  private REVISICON_EXAMENES = '21';
  private IDMEDICINACRONICOS = '3';
  private IDMEDICINAPALIATIVOS = '2';
  public verProfesionalPreferido = false;
  private profesional: ProfesionalResponseModel;
  public profesionalesList: ProfesionalResponseModel[] = [];
  public deshabilitarRecursoPreferidoInput = false;
  public deshabilitarTipoCita = false;

  constructor(
    public dialogRef: MatDialogRef<CitasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private mensajesService: MensajesService,
    private comunService: ComunService,
    public infoComunes: AgregadosComunService,
    private infoRemisionNovedad: AgregadosNovedadService,
    public cdRef: ChangeDetectorRef,
    private capturaDeErroresService: CapturarErrores
  ) {
    this.crearFormulario();
    this.verDatos();
    this.verEdicion(this.data.cita);
    this.configurarMinimaFechaActual();


  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.modalCitaAdicionalViewModel.botonAdicionarReprogramar = this.modalCitaAdicionalViewModel.mensajes.botones.agregar;
    this.configurarCalendario();
  }

  ngOnDestroy() {
    this.tiposCitaSubscripcion.unsubscribe();
  }

  private verEdicion(data: any) {
    this.modalCitaAdicionalViewModel.respuestaTiposCita = this.infoComunes.datosProfesionales.filter(
      s => s.profesion === data.profesional
    )[0].profesionalList;
    if (data.citaAdicional !== null && data.citaAdicional !== undefined) {
      this.modalCitaAdicionalViewModel.esDetalle = true;
      this.formulario
        .get('tipoCambioCita')
        .setValue(data.citaAdicional.tipoCambioCita);
      this.formulario
        .get('tipoCita')
        .setValue(data.citaAdicional.tipoCita.idCita);
      this.fechaCita = new Date(data.citaAdicional.fechaCita);
      this.formulario
        .get('fechaCita')
        .setValue(new Date(data.citaAdicional.fechaCita));
    }
    this.formulario.get('tipoCita').setValue(this.data.cita.tipoCita.idCita);
    this.formulario.get('tipoCita').updateValueAndValidity();
    this.deshabilitarTipoCita = true;
    this.tieneRecursoPreferido();
  }

  private verDatos(): void {
    this.modalCitaAdicionalViewModel.tituloVentana = this.modalCitaAdicionalViewModel.mensajes.tituloVentana.agregarReprogramarCita;
    this.verTiposCambioCita();
  }

  private verTiposCambioCita(): void {
    this.modalCitaAdicionalViewModel.respuestaTiposCambioCita = [
      TipoNovedadEnum.AGREGAR_CITA,
      TipoNovedadEnum.REPROGRAMAR_CITA
    ];
  }


  public crearCita(): void {
    this.buscarControlesInvalidos();
    if (this.formulario.valid) {
      const TIPO_CITA: TipoCita = this.modalCitaAdicionalViewModel.respuestaTiposCita.find(
        c => c.idCita === this.formulario.controls['tipoCita'].value
      );

      const CITA_ADICIONAL = new CitaAdicionalRequest(
        this.formulario.controls['tipoCambioCita'].value,
        TIPO_CITA,
        this.formulario.controls['fechaCita'].value
      );

      const CITA_DETALLE = this.data.cita;
      const CITA = new Cita(
        CITA_DETALLE.idCita,
        CITA_DETALLE.idRemision,
        CITA_DETALLE.profesional,
        CITA_DETALLE.especialidad,
        CITA_DETALLE.tipo,
        CITA_DETALLE.tipoCita,
        CITA_DETALLE.tipoFecha,
        CITA_DETALLE.fecha,
        CITA_DETALLE.semanas,
        CITA_DETALLE.programacionSemana,
        CITA_DETALLE.estado,
        CITA_DETALLE.totalVisitasPeriodica,
        CITA_DETALLE.sesionesFaltantes,
        CITA_DETALLE.usuario,
        CITA_ADICIONAL,
        this.profesional
      );

      this.dialogRef.close(CITA);
    } else {
      this.validarTodosLosCamposDelFormulario(this.formulario);
    }
  }

  seleccionTipoCambioCita(tipoCambio: any) {
    switch (tipoCambio) {
      case TipoNovedadEnum.AGREGAR_CITA:
        this.modalCitaAdicionalViewModel.botonAdicionarReprogramar = this.modalCitaAdicionalViewModel.mensajes.botones.agregar;
        break;
      case TipoNovedadEnum.REPROGRAMAR_CITA:
        this.modalCitaAdicionalViewModel.botonAdicionarReprogramar = this.modalCitaAdicionalViewModel.mensajes.botones.reprogramar;
        break;
    }
  }

  public cerrarModal() {
    this.dialogRef.close();
  }

  /**
   * Cambia los validadores de un control del formulario
   * @param {FormGroup} formulario
   * @param {string} nombrecontrol
   */
  private cambiarValidadorFormularioARequerido(
    formulario: FormGroup,
    nombrecontrol: string,
    expRegular: string,
    valMinimo: number,
    valMaximo: number
  ): void {
    formulario.get(nombrecontrol).clearValidators();
    formulario
      .get(nombrecontrol)
      .setValidators(
        Validators.compose([
          Validators.required,
          Validators.pattern(expRegular),
          Validators.min(valMinimo),
          Validators.max(valMaximo)
        ])
      );
    formulario.get(nombrecontrol).updateValueAndValidity();
  }

  /**
   * Cambia los validadores de un control del formulario
   * @param {FormGroup} formulario
   * @param {string} nombrecontrol
   */
  private cambiarValidadorFormularioAOpcional(
    formulario: FormGroup,
    nombrecontrol: string
  ): void {
    formulario.get(nombrecontrol).clearValidators();
    formulario.get(nombrecontrol).setValidators(Validators.compose([]));
    formulario.get(nombrecontrol).updateValueAndValidity();
  }

  /**
   * Válida todos los campos del formulario
   * @param formGroup
   */
  private validarTodosLosCamposDelFormulario(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validarTodosLosCamposDelFormulario(control);
      }
    });
  }

  /**
   * Busca cuales controles son inválidos en el formulario al hacer la petición
   */
  public buscarControlesInvalidos() {
    const invalid = [];
    const controls = this.formulario.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log('controles invalidos ', invalid);
    return invalid;
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formulario = this.fb.group({
      tipoCambioCita: [
        {
          value: '',
          disabled:
            this.data.cita.citaAdicional !== null &&
            this.data.cita.citaAdicional !== undefined
        },
        Validators.compose([Validators.required])
      ],
      recursoPreferido: [
        {value: null, disabled: this.data.esDetalle},
        Validators.compose([Validators.required])
      ],
      tipoCita: [
        {
          value: '',
          disabled:
            this.data.cita.citaAdicional !== null &&
            this.data.cita.citaAdicional !== undefined
        },
        Validators.compose([Validators.required])
      ],
      fechaCita: [
        {
          value: '',
          disabled:
            this.data.cita.citaAdicional !== null &&
            this.data.cita.citaAdicional !== undefined
        },
        Validators.compose([Validators.required])
      ]
    });
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): ModalCitaAdicionalViewModel {
    return new ModalCitaAdicionalViewModel(null, false, null, [], [], '', false);
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
      dayNames: [
        'domingo',
        'lunes',
        'martes',
        'miércoles',
        'jueves',
        'viernes',
        'sábado'
      ],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: [
        'enero',
        'febrero',
        'marzo',
        'abril',
        'mayo',
        'junio',
        'julio',
        'agosto',
        'septiembre',
        'octubre',
        'noviembre',
        'diciembre'
      ],
      monthNamesShort: [
        'ene',
        'feb',
        'mar',
        'abr',
        'may',
        'jun',
        'jul',
        'ago',
        'sep',
        'oct',
        'nov',
        'dic'
      ],
      today: 'Hoy',
      clear: 'Borrar'
    };
  }

  private tieneRecursoPreferido() {
    if (this.data.cita.profesionalAsignado !== null || this.data.cita.profesionalAsignado !== undefined) {

      this.profesionalesList.push(this.data.cita.profesionalAsignado);
      this.validarMotrarRecursoPreferido(this.data.cita.tipoCita.idCita);
    }
  }

  private validarMotrarRecursoPreferido(tipo: any): void {

    if ((this.data.idPrograma === '545' || this.data.idPrograma === '546' || this.data.idPrograma === '547') &&
      (tipo === this.CONTROL_TELEFONICO || tipo === this.REVISICON_EXAMENES)) {
      this.initProfesionalesDisponibles();
    } else {
      this.formulario.get('recursoPreferido').setValidators([]);
      this.formulario.get('recursoPreferido').updateValueAndValidity();
      this.verProfesionalPreferido = false;
    }
  }

  private initProfesionalesDisponibles(): void {

    this.verProfesionalPreferido = true;
    this.formulario.get('recursoPreferido').setValue(this.data.cita.profesionalAsignado.idProfesional);
    this.profesional = this.data.cita.profesionalAsignado;
    this.deshabilitarRecursoPreferidoInput = true;

  }


}
