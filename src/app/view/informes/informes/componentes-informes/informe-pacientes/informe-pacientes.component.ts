import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {InformeEgresoModel} from '../informe-egresos/informe-egreso-model';
import {Subscription} from 'rxjs/Subscription';
import {DatosAtencionService} from '../../../../../domain/usecase/remision/datos-atencion.service';
import {MensajesService} from '../../../../../shared/services/mensajes.service';
import {InformesUsecase} from '../../../../../domain/usecase/informes/informes-usecase';
import {CapturarErrores} from '../../../../../shared/services/capturar-errores';
import {AdmisionService} from '../../../../../domain/usecase/remision/admision.service';
import {InformePacientesModel} from './informe-pacientes.model';
import {GestionPacienteService} from '../../../../../domain/usecase/novedad/gestion-paciente.service';
import {log} from 'util';

@Component({
  selector: 'sura-informe-pacientes',
  templateUrl: './informe-pacientes.component.html',
  styleUrls: ['./informe-pacientes.component.scss']
})
export class InformePacientesComponent implements OnInit {

  public configEspanolCalendario: any;
  public formulario: FormGroup;
  public informePacienteModel: InformePacientesModel = this.iniciarViewModel();
  public fechaMaximaInforme: Date;
  public loading = false;
  public ciudad: EventEmitter<any> = new EventEmitter<any>();
  public programa: EventEmitter<any> = new EventEmitter<any>();
  public hoy: Date = new Date();
  private ciudadesSubscripcion: Subscription = new Subscription();
  public estados = ['Nuevo', 'Activo', 'Alta', 'PreAlta'];

  constructor(private fb: FormBuilder,
              private datosAtencionService: DatosAtencionService,
              private mensajesService: MensajesService,
              private informeUseCase: InformesUsecase,
              private capturaDeErroresService: CapturarErrores,
              private gestionPacienteService: GestionPacienteService) {
    this.crearFormulario();
  }

  ngOnInit() {
    this.getCiudades();
  }

  private getCiudades(): void {
    this.ciudadesSubscripcion = this.datosAtencionService
      .getCiudades()
      .subscribe(
        response => {
          this.informePacienteModel.listaCiudades = response;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
        }
      );

  }

  private getPisos(): void {
    this.gestionPacienteService.getPisosCiudad(this.formulario.controls['ciudad'].value)
      .subscribe(
        response => {
          this.informePacienteModel.listaPisos = response;
        },
        error => {
          this.mensajesService.mostrarMensajeError(error.message);
        },
        () => {
        }
      );
  }

  private crearFormulario(): void {
    this.formulario = this.fb.group({
      ciudad: ['', Validators.compose([Validators.required])],
      piso: [{value: '', disabled: true}, Validators.compose([])],
      estados: [{value: '', disabled: true}, Validators.compose([])]
    });
  }

  emitirCiudad(event) {
    let ciudadPrincipal = null;
    if (event && event.value) {
      ciudadPrincipal = this.informePacienteModel.listaCiudades.find(
        id => id.idCiudad === event.value
      );
      this.ciudad.emit(ciudadPrincipal.idCiudad);
      this.formulario.controls['piso'].enable();
      this.formulario.controls['estados'].enable();
      this.getPisos();
    }
  }

  descargarInforme() {
    const ID_CIUDAD = this.formulario.controls['ciudad'].value;
    const piso = this.formulario.controls['piso'].value ? this.formulario.controls['piso'].value : 0;
    const estados = this.formulario.controls['estados'].value ? this.formulario.controls['estados'].value : 0;

    console.log('Ciudad: ' + ID_CIUDAD);
    console.log('Pisos: ' + piso);
    console.log('Estados: ' + estados);

   this.informeUseCase.consultarInformePacientes(ID_CIUDAD, piso, estados).subscribe(respons => {
    //console.log('response descargar maestro', respons);
    this.download(respons);
    this.loading = false;
    }, err => {
      this.capturaDeErroresService.mapearErrores(err.status, err.error);
      this.loading = false;
    });

  }
  private download(data: Response) {
    const a = document.createElement('a');
    ///const blob = new Blob([data], {type: 'text/csv' });
   // const url = window.URL.createObjectURL(blob);

    //a.href = url;
    a.download = 'informePacientes.csv';
    a.click();
    //window.URL.revokeObjectURL(url);
    a.remove();
  }

  private iniciarViewModel(): InformePacientesModel {
    return new InformePacientesModel(null, null, null, null);
  }
}
