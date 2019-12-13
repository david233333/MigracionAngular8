export class Fototerapia {
    constructor(
        public id: string,
        public diasTratamiento: string,
        public bilirrubinaTotal: string,
        public ultimaTomaMuestra: Date,
        public tipoFrecuencia: string
    ) { }
}