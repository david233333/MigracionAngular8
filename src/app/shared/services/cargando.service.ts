import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { CargandoEstado } from '../utils/cargando-estado';

@Injectable()
export class CargandoService {

  private cargandoSubject = new Subject<CargandoEstado>();
  cargandoEstado = this.cargandoSubject.asObservable();

  constructor() { }

  mostrar() {
    this.cargandoSubject.next(<CargandoEstado>{mostrar: true});
  }

  ocultar() {
    this.cargandoSubject.next(<CargandoEstado>{mostrar: false});
  }
}
