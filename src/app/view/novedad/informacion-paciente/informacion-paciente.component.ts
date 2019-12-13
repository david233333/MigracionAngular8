import {Component, OnInit, Output, EventEmitter, OnDestroy, Input} from '@angular/core';
import {InformacionPacienteViewModel} from './informacion-paciente.view-model';
import {MensajesService} from '../../../shared/services/mensajes.service';


@Component({
  selector: 'sura-informacion-paciente',
  templateUrl: './informacion-paciente.component.html',
  styleUrls: ['./informacion-paciente.component.scss']
})
export class InformacionPacienteComponent implements OnInit, OnDestroy {

  public opcionPantalla: string;
  public informacionPacienteViewModel: InformacionPacienteViewModel = this.iniciarViewModel();
  @Output()
  public regresarPrincipal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input()
  public especialidad;
  @Input()
  public nombreCiudad;
  @Input()
  public idProgramaAsignarInfoPaciente;
  @Input()
  public codigoCiudad;

  ngOnInit(): void {
    this.opcionPantalla = this.informacionPacienteViewModel.mensajes.opcionesMenu.principal;
    console.log(this.especialidad);

  }

  ngOnDestroy() {

  }

  constructor(
    private mensajesService: MensajesService) {
  }

  seleccionarMenu(nombrePantalla: string) {
    switch (nombrePantalla) {
      case this.informacionPacienteViewModel.mensajes.opcionesMenu.asignarProfesional: {
        this.opcionPantalla = nombrePantalla;
        break;
      }
      case this.informacionPacienteViewModel.mensajes.opcionesMenu.datosPaciente: {
        this.opcionPantalla = nombrePantalla;
        break;
      }
      case this.informacionPacienteViewModel.mensajes.opcionesMenu.direccion: {
        this.opcionPantalla = nombrePantalla;
        break;
      }
      case this.informacionPacienteViewModel.mensajes.opcionesMenu.glucomer: {
        this.opcionPantalla = nombrePantalla;
        break;
      }
      case this.informacionPacienteViewModel.mensajes.opcionesMenu.diagnostico: {
        this.opcionPantalla = nombrePantalla;
        break;
      }
      case this.informacionPacienteViewModel.mensajes.opcionesMenu.estadoClinico: {
        this.opcionPantalla = nombrePantalla;
        break;
      }
      case this.informacionPacienteViewModel.mensajes.opcionesMenu.cambioPiso: {
        this.opcionPantalla = nombrePantalla;
        break;
      }
      case this.informacionPacienteViewModel.mensajes.opcionesMenu.principal: {
        this.opcionPantalla = nombrePantalla;
        break;
      }
    }
  }

  public pantallaPrincipal(retornar: boolean): void {
    this.regresarPrincipal.emit(retornar);
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): InformacionPacienteViewModel {
    return new InformacionPacienteViewModel(
      null,
      null
    );
  }

}
