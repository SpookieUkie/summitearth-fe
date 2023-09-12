import { DfrDailySalinityModel } from '../daily-salinity/daily-salinity.model';
import { DfrDailyDisposalModel } from './daily-disposal.model';

export class DfrDailyRigModel {
    constructor(
        public _id?: string,
        public dfrId?: string,
        public rigNameNumber?: string,
        public entryLocation?: string,
        public exitLocation?: string,
        public crossingLocation?: string,
        public crossingName?: string,
        public currentActivity?: string,
        public crossingLength?: number,

        public disposalMethod?: string,
        public disposalArea?: string,
        public dailyVolume?: number, 
        public totalCrossingVolume?: number,
        public mudTested?: boolean,
        public crossingProgress?: string,
        public rigComments?: string,

        public coords?: {
             latitude?: number,
             longitude?: number,
             altitude?: number,
             heading?: number,
             accuracy?: number,
             altitudeAccuracy?: number,
             speed: number
        },

        public disposalAreas?: DfrDailyDisposalModel[],

       /* public latitude?: number,
        public longitude?: number,
        public altitude?: number,*/


       // Field Test Results
        public salinities?: DfrDailySalinityModel[]
        
    ){}
}
