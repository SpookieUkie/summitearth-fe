export class SoilModel {
    constructor (
        public _id?: string,
        public jobId?: string,
        public jobNumber?: Number,
        public landId?: Number,
        public landLocation?: string,
        public sampleId?: string,

        public sampleDate?: Date,
        public horizon?: string,
        public soilType?: string,
        public horizonDepth?: Number, // sask only
        public texture?: string,

        public soilDensity?: string,
        public pH?: Number,
        public ec?: Number,
        public cl?: Number,
        public so4?: Number,
        public totalHardness?: Number,
        public ca?: Number,
        public mg?: Number,
        public na?: Number,
        public sar?: Number,
        public n?: Number,
        public k?: Number, //Potassium
        public so?: Number, // Sulphase
        public soilCategory?: string,

        //public sg?: Number,
        // Location Information
        public southOfNE?: Number,
        public westOfNE?: Number,
        public latitude?: Number,
        public longitude?: Number

    ) {}
}
