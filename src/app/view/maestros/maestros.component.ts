import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MensajesService} from '../../shared/services/mensajes.service';
import {MaestrosViewModel} from './maestros.viewModel';
import {Ciudad} from '../../domain/model/maestro/entity/ciudad.model';

@Component({
  selector: 'sura-maestros',
  templateUrl: './maestros.component.html',
  styleUrls: ['./maestros.component.scss']
})
export class MaestrosComponent implements OnInit {
  public formulario: FormGroup;
  public maestrosViewModel: MaestrosViewModel = this.iniciarViewModel();
  public maestroSelecc: number;

  constructor(
    private fb: FormBuilder,
    private mensajesService: MensajesService) {
    this.crearFormulario();
  }

  ngOnInit() {
    this.cargarListaInformes();
  }

  public mostrarMenuInforme($event) {
    console.log($event);
    this.maestroSelecc = $event.value;
    console.log(this.maestroSelecc);
  }

  /**
   * Inicializa variables del view model
   */
  private iniciarViewModel(): MaestrosViewModel {
    return new MaestrosViewModel(null, false, [], 0);
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formulario = this.fb.group({
      maestro: ['', Validators.compose([Validators.required])]
    });
  }

  private cargarListaInformes() {
    this.maestrosViewModel.listaMaestros = [
      {nombre: this.maestrosViewModel.mensajes.lista.causasLlamadaNoContestada, codigo: 1},
      {nombre: this.maestrosViewModel.mensajes.lista.diagnostico, codigo: 2},
      {nombre: this.maestrosViewModel.mensajes.lista.ciudad, codigo: 3},
      {nombre: this.maestrosViewModel.mensajes.lista.tipoSondajeIngreso, codigo: 4},
      {nombre: this.maestrosViewModel.mensajes.lista.dosis, codigo: 5},
      {nombre: this.maestrosViewModel.mensajes.lista.estadoPaciente, codigo: 6},
      {nombre: this.maestrosViewModel.mensajes.lista.motivoAplicacionCuidador, codigo: 7},
      {nombre: this.maestrosViewModel.mensajes.lista.motivoFijarCita, codigo: 8},
      {nombre: this.maestrosViewModel.mensajes.lista.novedadesPorTipoAdmision, codigo: 9}, ////Faltan
      {nombre: this.maestrosViewModel.mensajes.lista.permisosTerceros, codigo: 10}, /////Faltan
      {nombre: this.maestrosViewModel.mensajes.lista.proveedor, codigo: 11},
      {nombre: this.maestrosViewModel.mensajes.lista.tipoCuracion, codigo: 12},
      {nombre: this.maestrosViewModel.mensajes.lista.tipoEquipoBiomedico, codigo: 13},
      {nombre: this.maestrosViewModel.mensajes.lista.tipoMuestra, codigo: 14},
      {nombre: this.maestrosViewModel.mensajes.lista.tipoTerapia, codigo: 15},
      {nombre: this.maestrosViewModel.mensajes.lista.frecuencia, codigo: 16},
      {nombre: this.maestrosViewModel.mensajes.lista.institucion, codigo: 17},
      {nombre: this.maestrosViewModel.mensajes.lista.medicamento, codigo: 18},
      {nombre: this.maestrosViewModel.mensajes.lista.motivoCancelacion, codigo: 19},
      {nombre: this.maestrosViewModel.mensajes.lista.municipio, codigo: 20},
      {nombre: this.maestrosViewModel.mensajes.lista.piso, codigo: 21},
      {nombre: this.maestrosViewModel.mensajes.lista.planSalud, codigo: 22},
      {nombre: this.maestrosViewModel.mensajes.lista.tipoNutricion, codigo: 23},
      {nombre: this.maestrosViewModel.mensajes.lista.tiposIdentificacion, codigo: 24},
      {nombre: this.maestrosViewModel.mensajes.lista.tipoSoporteNutricional, codigo: 25},
      {nombre: this.maestrosViewModel.mensajes.lista.viaAdministracion, codigo: 26},
      {nombre: this.maestrosViewModel.mensajes.lista.tiposPlanParticular, codigo: 27}, ////Faltan
      {nombre: this.maestrosViewModel.mensajes.lista.programa, codigo: 28},
      {nombre: this.maestrosViewModel.mensajes.lista.valoraciones, codigo: 29},

    ];
  }

  cambioTabla($event) {
    console.log('this' + $event);
    this.maestroSelecc = $event;
  }
}
