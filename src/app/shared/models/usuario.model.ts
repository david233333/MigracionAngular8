export class Usuario {
    constructor(
        public isAuthenticated: boolean,
        public appTag: string,
        public username: string,
        public fullName: string,
        public dni: string,
        public repository: string,
        public email: string,
        public msg: string,
    ) {

    }
}
