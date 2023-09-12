export class DfrRRRModel {
    constructor (
        public _id?: string,
        public client?: string,
        public jobType?: string,
        public projectNumber?: Number,
        public projectType?: string,
        public lsd?: string,
        public landType?: string,
        public dispositions?: string,
        public dfrDate?: Date,
        public dfrStatus?: string,
        public isSummitTech?: boolean,
        public fieldTechName?: string,
        public fieldTechLicense?: string,
        public projectSupervisor?: string,
        public landownerName?: string,
        public landownerPhoneNumber?: string,
        public landUse?: string,
        public typography?: string,
        public wellsitePadded?: boolean,
        public onsiteVegetation?: [],
        public offsiteVegetation?: [],
        public weatherTemperature?: string,
        public weatherConditions?: string,
        public groundConditions?: string,

        //Vegitation Only - next 5
        public windSpeed?: string,
        public windDirection?: string,
        public herbicideType?: string,
        public herbicideSprayRate?: string,
        public herbicideSprayUnits?: string,


        public dailySummary?: string,
        public nextPlannedAction?: string,
        public costs?: string,


        public dfrStatusSubmitDate?: Date,

        public createdByUserId?: string,
        public createdByFullName?: string,

        public assignedToUserId?: string,
        public assignedToFullName?: string,

        public sharedWithUserIds?: []
        
    ) {}
}
