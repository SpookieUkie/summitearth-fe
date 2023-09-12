export class DfrModel {
    constructor (
        public _id: string,
        public projectName: string,
        public projectNumber: string,
        public projectType: string,
        public dfrDate: Date,
        public projectLocation: string,
        public superIntendent: string,
        public enviroLead: string,
        public summitProjectManager: string,
        public client: string,
        public clientId: string,
        public solidsDisposalMethod: string,
        public liquidsDisposalMethod: string,
        public contactInformation: string,
        public installedPipeSize: string,
        public reamingProgression: string,
        public currentWeather: string,
        public forecastWeather: string,
        public summitFieldRepresentative: string,
        public summitFieldContactInformation: string,
        public hoursOfWork: string,
        public dfrStatus: string,
        public dailyActivitySummary: string,

        public dfrStatusSubmitDate: Date,

        public createdByUserId: string,
        public createdByFullName: string,

        public assignedToUserId: string,
        public assignedToFullName: string,
        
        public sharedWithUserIds: []
        
    ) {}
}
