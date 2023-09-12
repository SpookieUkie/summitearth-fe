export class GeneralModel {
    constructor (
        public _id?: string,
        public jobNumber?: Number,
        public superJobNumber?: Number,
        public jobType?: String,
        public jobDivison?: string,
        public jobCategory?: string,
        public jobStatus?: string,
        public provinceStateCountry?: string,
        public samplingCompany?: string,
        public companyContactName?: string,
        public companyContactId?: string,
        //public phoneNumber?: string,
        public tech1Name?: string,
        public tech1Id?: Number,
        public tech2Name?: string,
        public tech2Id?: Number,
        public tech3Name?: string,
        public tech3Id?: Number,
        public tech4Name?: string,
        public tech4Id?: Number,
        public complianceAdminName?: string,
        public complainceAdminId?: Number,

        public qaqcLocation?: boolean,
        public postSamplingRequired?: boolean,
        public multiWellDisposal?: boolean,

        // Well Information
        public licensee?: string,
        public licenseNumber?: string,
        public mslogc?: string,
        public uniqueWellId?: string,
        public wellName?: string,
        public surfaceLocation?: string,
        public drillingRig?: string,
        public spudDate?: Date,
        public releaseDate?: Date,
        public wellType?: string,
        public navVersion?: Number,

        // Regulatory Information
        public regOffice1Name?: string,
        public regOffice1Id?: Number,
        public regOffice2Name?: string,
        public regOffice2Id?: Number,
        public submissionDate?: string,
        public notificationDate?: string,

        // WellContacts
        public licenseeContactName?: string, // list
        public licenseeContactId?: Number,

        public drillingSupervisorName?: string,
        public drillingSupervisorPhone?: Number,

        public contstructionName?: string,
        public contstructionPhone?: Number,

    ) {}

    public setDefaults() {
        for (const i in this) {    
              this[i] = null;     
        }
    }
}
