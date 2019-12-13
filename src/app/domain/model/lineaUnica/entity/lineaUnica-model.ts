import {CausasLlamadaNoContestada} from '../../maestro/entity/CausasLlamadaNoContestada';

export class LineaUnicaModel {

  constructor(estado: string,
              fechaUltimaGestion: Date,
              usuarioGestion: string,
              idRemision: string,
              intentos: number,
              bloqueoUsuario: boolean,
              ciudadPaciente: string,
              causasLlamadaNoContestada: CausasLlamadaNoContestada,
              nombrePaciente: string,
              numeroIdentificacion: string,
              tipoIdentificacion: string,
              fechaAdmision: Date) {
  }

}
