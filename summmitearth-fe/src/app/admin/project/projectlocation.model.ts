export class ProjectLocationModel {
    constructor (
        public _id: string,
        public locationName: string,
        public startDate: Date,
        public endDate: Date,
        public isActive: Boolean,
        public displayOrder: number
    ){}
}
