export class FormlistModel {
    constructor (
        public _id: string,
        public formName: string,
        public formLink: string,
        public version: number,
        public comments: string,
        public password: string,
        public dateAdded: Date,
        public lastModified: Date,
        public isActive: boolean,
    ) {}
}
