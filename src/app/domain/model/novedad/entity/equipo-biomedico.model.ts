import { TipoEquipoBiomedico } from "../../maestro/entity/tipo-equipo-biomedico.model";
import { Proveedor } from "../../maestro/entity/proveedor.model";
import { TipoIdentificacion } from "../../maestro/entity/tipo-identificacion.model";
import { Ciudad } from "../../maestro/entity/ciudad.model";
import { EstadoEquipoBiomedico } from "../../maestro/entity/estado-equipo-biomedico.model";
import { Usuario } from "../../../../shared/models/usuario.model";

export class EquipoBiomedico {
  constructor(
    public id: string,
    public idRemision: string,
    public tipoIdentificacion: TipoIdentificacion,
    public numeroIdentificacion: string,
    public tipoEquipo: TipoEquipoBiomedico,
    public fechaInicio: Date,
    public fechaFin: Date,
    public fechaRegistro: Date,
    public nota: string,
    public estado: EstadoEquipoBiomedico,
    public proveedor: Proveedor,
    public ciudad: Ciudad,
    public usuario: Usuario,
    public telefono: string,
    public cobertura: string,
    public esModificado: boolean,
    public direccion: string,
    public esEliminado: boolean,
    public estadoDefecto?: string,
    public equipoBiomedicoDescripcion?: string,
    public estadoDescripcion?: string,
    public estadoProveedorDescripcion?: string
  ) {
    this.equipoBiomedicoDescripcion =  estadoProveedorDescripcion; //this.tipoEquipo.descripcion;
    this.estadoDescripcion = this.estado.descripcion;
  }
}
