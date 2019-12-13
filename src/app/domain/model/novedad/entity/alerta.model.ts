import { Usuario } from '../../../../shared/models/usuario.model';

export class AlertaVisita {
  constructor(
    public _id: string,
    public idCita: string,
    public idRemision: string,
    public cita: Date,
    public textoAlerta: string,
    public cambiarDuracion: boolean,
    public duracion: number,
    public usuario: Usuario) {
  }

}
