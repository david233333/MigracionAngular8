export class Novedad {
  constructor(
    public idNovedadPk: string,
    public idRemisionPk: string,
    public idInformacionPacientePk: string,
    public idPlanManejoPk: string,
    public idProgramacionPk: string,
    public recursoPreferidoPk: string,
    public tipoNovedad: string,
    public idSolicitudNovedad: string,
    public idDiagnosticoPaciente: string
  ) {
  }
}
