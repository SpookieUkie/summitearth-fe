import { DfrDailySalinityModel } from '../daily-salinity/daily-salinity.model';

export class DfrDailyDisposalModel {
    constructor(
        public _id?: string,
        public disposalArea?: string,
        public disposalMethod?: string,
        public dailyVolume?: number
    ){}
}
