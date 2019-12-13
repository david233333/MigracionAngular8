export class AspiracionSecrecion {
    constructor(
        public id: string,
        public diasTratamiento: string,
        public envioAspirador: boolean,
        public visitaEnfermeria: boolean,
        public tipoSonda: string,
        public nasal: boolean,
        public traqueostomia: boolean
    ) { }
}