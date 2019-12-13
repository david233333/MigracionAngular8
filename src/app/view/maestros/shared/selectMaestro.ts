import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Injectable} from '@angular/core';
import {RequestMaestro} from '../RequestMaestro.model';
import {Ciudad} from '../../../domain/model/maestro/entity/ciudad.model';
import {MaestrosService} from '../../../domain/usecase/comun/maestros.service';
import {MensajesService} from '../../../shared/services/mensajes.service';
import {CapturarErrores} from '../../../shared/services/capturar-errores';
import {TipoSondajeIngreso} from '../../../domain/model/maestro/entity/tipo-sondaje-ingreso.model';

@Injectable()
export class SelectMaestro {
  private maestrosService: MaestrosService;
  private mensajesService: MensajesService;
  private capturaErroresService: CapturarErrores;

  constructor(
    public form: FormGroup,
    public fb: FormBuilder,
  ) {
  }

  createForm(maestro: string): FormGroup {
    switch (maestro) {
      case 'Ciudad':
        this.form = this.fb.group({
          idCiudad: ['', Validators.compose([Validators.required])],
          nombre: ['', Validators.compose([Validators.required])],
          codigoDANE: ['', Validators.compose([Validators.required])],
          codigoIPS: ['', Validators.compose([Validators.required])]
        });
        break;
      case 'TipoSondajeIngreso':
        this.form = this.fb.group({
          idTipoSondaje: ['', Validators.compose([Validators.required])],
          idSondaje: ['', Validators.compose([Validators.required])],
          sondaje: ['', Validators.compose([Validators.required])]
        });
        break;
      default:
        break;
    }
    return this.form;
  }

  fillForm(requestMaestro: RequestMaestro) {
    switch (requestMaestro.nombreMaestro) {
      case 'Ciudad':
        this.form.controls['idCiudad'].setValue(requestMaestro.maestro['idCiudad']);
        this.form.controls['nombre'].setValue(requestMaestro.maestro['nombre']);
        this.form.controls['codigoDANE'].setValue(requestMaestro.maestro['codigoDANE']);
        this.form.controls['codigoIPS'].setValue(requestMaestro.maestro['codigoIPS']);
        break;
      case 'TipoSondajeIngreso':
        this.form.controls['idTipoSondaje'].setValue(requestMaestro.maestro['idTipoSondaje']);
        this.form.controls['idSondaje'].setValue(requestMaestro.maestro['idSondaje']);
        this.form.controls['sondaje'].setValue(requestMaestro.maestro['sondaje']);
        break;
    }
  }

  saveMaestro(requestMaestro: RequestMaestro) {
    switch (requestMaestro.nombreMaestro) {
      case 'Ciudad':
        requestMaestro.maestro = new Ciudad(
          null,
          this.form.controls['idCiudad'].value,
          this.form.controls['nombre'].value,
          this.form.controls['codigoDANE'].value,
          this.form.controls['codigoIPS'].value
        );
        this.maestrosService.newCiudad(requestMaestro).subscribe(
          complete => {
            this.mensajesService.mostrarMensajeExito('Creado con éxito');
          },
          error => {
            this.capturaErroresService.mapearErrores(error.status, error.error);
          }
        );
        break;
      case 'TipoSondajeIngreso':
        requestMaestro.maestro = new TipoSondajeIngreso(
          null,
          this.form.controls['idTipoSondaje'].value,
          this.form.controls['idSondaje'].value,
          this.form.controls['sondaje'].value,
        );
        this.maestrosService.newCiudad(requestMaestro).subscribe(
          complete => {
            this.mensajesService.mostrarMensajeExito('Creado con éxito');
          },
          error => {
            this.capturaErroresService.mapearErrores(error.status, error.error);
          }
        );
        break;
    }
  }
}
