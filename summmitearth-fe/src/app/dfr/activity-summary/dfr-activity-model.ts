export class DfrActivityModel {
    constructor(
        public _id: string,
        public dfrId: string, // reference to dfr header summary
        //public dailyActivitySummary: string,
        public numberOfActiveDrillsAndRigs: number,
        public sprayFieldConditions: number,
        public remainingVolumeInStorage: number,
        public dailyDisposalSummary: any[],
        public projectDisposalSummary: any[],
        public crossingSummary: any[],
        public projectToDateTotal: number

    ){}


}