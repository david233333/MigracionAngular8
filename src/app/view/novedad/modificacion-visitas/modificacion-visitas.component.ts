import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {MensajesService} from '../../../shared/services/mensajes.service';
import {ModificacionVisitasViewModel} from './modificacion-visitas.view-model';
import {FormBuilder, FormGroup} from '@angular/forms';


@Component({
  selector: 'sura-novedad-modificacion-visitas',
  templateUrl: './modificacion-visitas.component.html',
  styleUrls: ['./modificacion-visitas.component.scss']
})
export class ModificacionVisitasComponent implements OnInit, OnDestroy {

  public formularioPrincipal: FormGroup;
  public opcionPantalla: string;
  public tituloPantalla: string;
  public modificacionVisitasViewModel: ModificacionVisitasViewModel = this.iniciarViewModel();
  @Output()
  public regresarPrincipal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private mensajesService: MensajesService) {
    this.crearFormularioPrincipal();
    this.verFormularios();
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {

  }

  verFormulario(nombrePantalla: string) {
    this.opcionPantalla = nombrePantalla;
  }

  verFormularios(): void {
    this.modificacionVisitasViewModel.respuestaTiposFormularios = [
      {
        nombre: this.modificacionVisitasViewModel.mensajes.formularios.alertasVisitas
      },
      {
        nombre: this.modificacionVisitasViewModel.mensajes.formularios.aplicacionesCuidador
      },
      {
        nombre: this.modificacionVisitasViewModel.mensajes.formularios.cancelarVisitas
      },
      {
        nombre: this.modificacionVisitasViewModel.mensajes.formularios.fijarVisitas
      }
    ];
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormularioPrincipal(): void {
    this.formularioPrincipal = this.fb.group({
      formulario: [''],
    });
  }

  /**
   * Inicializa variables del view entity
   */
  private iniciarViewModel(): ModificacionVisitasViewModel {
    return new ModificacionVisitasViewModel(
      null,
      null,
      []
    );
  }

}
