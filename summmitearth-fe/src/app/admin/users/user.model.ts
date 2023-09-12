export class UserModel {
    constructor (
        public _id: string,
        public firstName: string,
        public lastName: string,
        public emailAddress: string,
        public username: string,
        public password: string,
        public cellPhone: string,
        public otherPhone: string,
        public isTech: string,
        public isAdmin: string,
        public isConsultant: boolean,
        public permissions: {
            dwmChecklists?: boolean,
            dfrPipelines?: boolean,
            dwmCalculators?: boolean,
            dwmMapsTech?: boolean,
            dwmMapsAdmin?: boolean,
            dfrRRRTech?: boolean,
            dfrRRRAdmin?: boolean
        },
        public isActive: boolean,
        public devices:[]
        

    ) {}
}
