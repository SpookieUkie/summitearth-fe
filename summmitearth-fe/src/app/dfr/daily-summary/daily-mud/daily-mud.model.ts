import { DailyMudLocationModel } from './daily-mud-location.model';

export class DailyMudModel {
   constructor (
        public _id?: string,
        public localId?: string,
        public dfrId?: string,
        public productName?: string,
        public size?: string,
        public toxicity?: string,
        public locations?: Array<DailyMudLocationModel>
    ) {}
}