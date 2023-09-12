export class WaterModel {
    constructor (
        public _id?: string,
        public jobId?: string,
        public jobNumber?: Number,
        public waterNumber?: Number,
        public waterOwnerId?: string,
        public waterOwnerName?: string,
        public waterOwnerPhone?: string,
        public waterLocation?: string,
        public consentDate?: Date,
        public agreementNumber?: string,
        public costOfWater?: Number,
        public waypointLat?: Number,
        public waypointLng?: Number,
        public isTDLRequired?: Number,


        // Salinities
        public pH?: Number,
        public ec?: Number,
        public so4?: Number,
        public cl?: Number,
        public mg?: Number,
        public na?: Number,
        public ca?: Number,
        public sar?: Number,
        public n?: Number,
        public sg?: Number,


        // Water Permit Information
        public permitNumber?: string,
        public diversionPoint?: string,
        public purposeOfWaterDiversion?: string,
        public sourceOfWater?: string,
        public sourceType?: string,
        public pointOfDiversion?: string,
        public pointOfUse?: string,
        public maxRateOfDiversion?: Number,
        public maxVolumeAllowed?: Number,
        public maxDropdown?: Number,
        public licenseEffectiveDate?: Date,
        public licenseExpiryDate?: Date,



    ) {}
}
