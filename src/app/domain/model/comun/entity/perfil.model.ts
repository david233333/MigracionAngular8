export class Perfil {
  constructor(
    public perfil: string,
    public menus: Menu[]
  ) { }
}

export class Menu {
  constructor(
    public nombre: string,
    public funcionalidades: Funcionalidad[]
  ) { }
}

export class Funcionalidad {
  constructor(
    public nombre: string,
    public vista: Vista[]
  ) { }
}

export class Vista {
  constructor(
    public nombre: string,
    public permisos: Permiso
  ) { }
}

export class Permiso {
  constructor(
    public noFuncionalidad: string[],
    public noEdicion: string[]
  ) { }
}
