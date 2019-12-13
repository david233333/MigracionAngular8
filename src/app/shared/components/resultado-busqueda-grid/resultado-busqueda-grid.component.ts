import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { mensajes } from '../../utils/mensajes';

@Component({
  selector: 'sura-resultado-busqueda-grid',
  templateUrl: './resultado-busqueda-grid.component.html',
  styleUrls: ['./resultado-busqueda-grid.component.scss']
})
export class ResultadoBusquedaGridComponent implements OnInit {

  @Input() columnDefs: any[];

  @Input() inputData: any[];

  @ViewChild('table', { static: false }) table;

  public cols: any[];
  public data: any[];

  public mensajes = mensajes;

  constructor() {

  }

  ngOnInit() {
    this.cols = this.columnDefs;
    this.data = this.inputData;
  }


}
