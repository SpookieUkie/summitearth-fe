import { DailyAuditDwmSprayfieldModel } from './dailyauditdwmsprayfield.model';


export class DailyAuditDwmModel {

        public _id: string;
        public jobNumber: string;
        public province: string;
        public inspectionDate: Date;
        public environmentalTechnician: string;
        public clientName: string;
        public clientId: string;
        public wellLocation: string;
        public drillingRig: string;
        public uwi: string;
        public timeOfInspection: string;
        public sprayfieldLocations: DailyAuditDwmSprayfieldModel[];
        public regCompSeason: string;
        public regCompReceivingSoilEC: string;
        public regCompReceivingSoilSAR: string;
        public regCompSlope: string;
        public regCompProximityToWater: string;
        public regCompUpgradientBarrier: string;
        public tdlWaterPermit: string;
        public tdlPermitPostAtRig: string;
        public tdlCondtionsMetAndDocumented: string;
        public tdlPermitInWaterTruck: string;
        public trackingSheetsInUse: string;
        public labResultsPostedAtRig: string;
        public maxAllowablesPostedAtRig: string;
        public onsiteInfoWellType: string;
        public onsiteInfoSpills: string;
        public onsiteInfoDripTrays: string;
        public cementDisposalLocation: string;
        public cementStorageType: string;
        public drilloutFluidsDisposal: string;
        public preventativeCorrectiveActions: string;
        public comments: string;
        public auditorName: string;
        public auditorSignature: string;
        public documentSafetyMeeting: string;
        public documentLandUseAgreement: string;
        public documentWaterUseAgreement: string;
        public documentTDLWaterPermit: string;
        public documentOnsitePresprayMap: string;
        public documentWaterAccessOrientation: string;
        public documentAerialPhotoSubmission: string;
        public documentLandTitleSearch: string;
        public documentDWMP: string;
        public fieldTestTestKit: string;
        public fieldTestProperEquipment: string;
        public fieldTestProperTestingProcedures: string;
        //public assignedToFullName: string;
        public assignedToUserId: string;
        public reportStatus:  'Open';
        public dateOfSubmission: Date = null;
        public naNotes: [
                {key: string,
                value: string,
                label: string}
        ];

        constructor()
        {}

}