
export class FieldTicketOptionsModel {
    constructor (
        public _id: string,
        public chargeLabel: string,
        public unitType: string,
        public defaultQty: number,
        public clientCost: number,
        public qtyIncluded: number,
        public equipmentCost: number,
        public percentMarkup: number,
        public showByDefault: boolean,
        public linkedToTech: boolean,
        public group: string,
        public section: string,
        public isActive: boolean
    ){}
}
