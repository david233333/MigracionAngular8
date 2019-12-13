import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MensajesService} from '../../../../../shared/services/mensajes.service';
import {PaliativosModel} from './paliativos-model';
import {InformesUsecase} from '../../../../../domain/usecase/informes/informes-usecase';
import {CapturarErrores} from '../../../../../shared/services/capturar-errores';

@Component({
  selector: 'sura-paliativos',
  templateUrl: './paliativos.component.html',
  styleUrls: ['./paliativos.component.scss']
})
export class PaliativosComponent implements OnInit {
  public configEspanolCalendario: any;
  public formulario: FormGroup;
  public informeModel: PaliativosModel = this.iniciarViewModel();
  public fechaMinimaInforme: Date;
  public fechaMaximaInforme: Date;
  public loading = false;

  constructor( private fb: FormBuilder,
                  private mensajesService: MensajesService,
                  private informeUseCase: InformesUsecase,
               private capturaDeErroresService: CapturarErrores) { this.crearFormulario(); }

  ngOnInit() {
    this.configurarCalendario();

  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formulario = this.fb.group({
      fechaInicio: ['', Validators.compose([Validators.required])],
      fechaFin: ['', Validators.compose([Validators.required])]
    });
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

  private iniciarViewModel(): PaliativosModel {
    return new PaliativosModel(null, null, null, null);
  }

  descargarInforme() {
    this.loading = true;
    const fechaInicio: Date = this.formulario.get('fechaInicio').value;
    const fechaFin: Date = this.formulario.get('fechaFin').value;
    this.informeUseCase.consultarInformesPaliativos(fechaInicio.getTime().toString(), fechaFin.getTime().toString())
      .subscribe(response => {
          console.log('response descargar maestro', response);
          const descargar = document.createElement('a');
          const nombreArchivo = `InformePaliativos.csv`;
          descargar.href = `data:application/csv;base64, ${response}`;
          descargar.download = nombreArchivo;
          descargar.click();
          this.loading = false;
      }, err => {
        this.capturaDeErroresService.mapearErrores(err.status, err.error);
        this.loading = false;
      });
  }
}
