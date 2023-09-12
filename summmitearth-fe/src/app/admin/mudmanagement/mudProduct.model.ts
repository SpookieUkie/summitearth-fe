export class MudProductModel {
    constructor (
        public _id: string,
        public mudProductName: string,
        public defaultUnitType: string,
        public defaultUnitSize: Number,
        public mtoxThreshold: Number,
        public isDisabled: boolean,
    ){}
}
