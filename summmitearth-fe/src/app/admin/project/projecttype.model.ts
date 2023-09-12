import { ProjectLocationModel } from './projectlocation.model';
import { FieldTicketOptionsModel } from '../fieldticketoptions/fieldticketoptions.model';

export class ProjectTypeModel {
    constructor (
        public _id: string,
        public projectType: string, //key
        public projectTypeLabel: string,
        public projectNumber: Number,
        public jobNumber: Number,
        public startDate: Date,
        public endDate: Date,
        public isActive: Boolean,
        public locations: Array<ProjectLocationModel>,
        public clientName: String,
        public lsd: String,
        public landType: String,
        public dispositions: String,
        public disposalMethods: [{
            disposalMethod: string,
            isActive: boolean
        }],
        public fieldTicketOptions: FieldTicketOptionsModel[]
    ){}
}
