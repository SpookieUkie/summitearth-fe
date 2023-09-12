export class LandModel {
    constructor (
        public _id?: string,
        public jobId?: string,
        public jobNumber?: Number,
        public landNumber?: Number, 
        public landOwnerId?: string,
        public landOwnerName?: string,
        public landOwnerPhone?: string,
        public landLocation?: string,
        public consentDate?: Date,
        public agreementNumber?: string,
        public landUse?: string,
        public groundCondition?: string,
        public costOfLand?: Number,
    ) {}
}
