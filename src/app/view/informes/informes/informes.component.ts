import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MensajesService} from '../../../shared/services/mensajes.service';
import {InformesModel} from './informes-model';

@Component({
  selector: 'sura-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.scss']
})
export class InformesComponent implements OnInit {
  public formulario: FormGroup;
  public informeModel: InformesModel = this.iniciarViewModel();

  constructor(
    private fb: FormBuilder,
    private mensajesService: MensajesService) { this.crearFormulario();}

  ngOnInit() {
    this.cargarListaInformes();
  }

  /**
   * Inicializa variables del view model
   */
  private iniciarViewModel(): InformesModel {
    return new InformesModel(null, false, [], null);
  }

  /**
   * Crea los campos del formulario con sus respectivas validaciones
   */
  private crearFormulario(): void {
    this.formulario = this.fb.group({
      informe: ['', Validators.compose([Validators.required])]
    });
  }

  private cargarListaInformes() {
    this.informeModel.listaInformes =
      [{nombre: 'Informe Paliativos', codigo: 1},
        {nombre: 'Informe Remisiones', codigo: 2},
        {nombre: 'Información Seguridad', codigo: 3},
        {nombre: 'Transporte', codigo: 4},
        {nombre: 'Informe Egreso', codigo: 5},
        {nombre: 'Informe Curaciones', codigo: 6},
        {nombre: 'Informe Equipos Biomedicos', codigo: 7},
        {nombre: 'Informe Pacientes', codigo: 8},
      ];
  }

  public mostrarMenuInforme($event) { //hubo cambio y quedo solo en $event
    console.log('informes',$event)
    this.informeModel.informe = $event;
  }
}
