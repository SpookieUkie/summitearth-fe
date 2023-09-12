export class DfrDailySalinityModel {
    constructor(
        public _id?: string,
        public name?: string,
       // Field Test Results
        public pH?: number,
        public Ca?: number,
        public EC?: number,
        public Mg?: number,
        public Na?: number,
        public N?: number,
        public S?: number,
        public Cl?: number,
        public waterBodyCrossing?: boolean,
        public dailyNTU?: number
    ){}
}
