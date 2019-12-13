import {Component, OnInit, OnDestroy, ChangeDetectionStrategy,  AfterViewInit} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { CargandoEstado } from '../../utils/cargando-estado';
import {CargandoService} from '../../services/cargando.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sura-cargando',
  templateUrl: './cargando.component.html',
  styleUrls: ['./cargando.component.scss']
})
export class CargandoComponent implements OnInit, OnDestroy, AfterViewInit {
  public mostrar = false;
  private subscripcion: Subscription;

  constructor(private cargandoService: CargandoService) { }

  ngOnInit() {
    this.subscripcion = this.cargandoService.cargandoEstado
      .subscribe((estado: CargandoEstado) => {
        this.mostrar = estado.mostrar;
      });
  }
  ngAfterViewInit() {
    this.subscripcion = this.cargandoService.cargandoEstado
      .subscribe((estado: CargandoEstado) => {
        this.mostrar = estado.mostrar;
      });
  }

  ngOnDestroy() {
    this.subscripcion.unsubscribe();
  }

}
