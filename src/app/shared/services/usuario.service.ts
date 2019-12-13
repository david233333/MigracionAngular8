import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';

@Injectable()
export class UsuarioService {
  private _usuario: Usuario;

  get InfoUsuario(): Usuario {
    return this._usuario;
  }

  set InfoUsuario(usuario: Usuario) {
    this._usuario = usuario;
  }
}
