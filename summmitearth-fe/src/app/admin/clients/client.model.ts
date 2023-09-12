export class ClientModel {
    constructor (
        public _id: string,
        public clientName: string,
        public address: string,
        public city: string,
        public provice: string,
        public postalCode: string,
        public emailAddress: string,
        public mainPhone: string,
        public cellPhone: string,
        public keyContact: string,
        public isActive: boolean,
        public clientGroup: string
    ) {}
}
