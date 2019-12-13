import { Injectable } from '@angular/core';

@Injectable()
export class PerfilService {

  private perfil: any;

   get Perfil() {
    return this.perfil;
  }

  set Perfil(perfil: any) {
    this.perfil = perfil;
  }
}
