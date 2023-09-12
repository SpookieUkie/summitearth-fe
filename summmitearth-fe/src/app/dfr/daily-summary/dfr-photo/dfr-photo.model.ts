export class DfrPhotoModel {
    constructor(
        public _id: string,
        public dfrId?: string,
        public dfrRigId?: string,
        public photoComments?: string,
        public photoUrl?: string,
        public thumbnailUrl?: string,
        public photoGeoRefUrl?: string,
        public thumbnailGeoRefUrl?: string,
        public useGeoRef: boolean = false,
        public additionalGeoRefComments?: string,
        public image?: File, //used for local caching only
        public coords?: {
            latitude?: number,
            longitude?: number,
            altitude?: number,
            heading?: number,
            accuracy?: number,
            altitudeAccuracy?: number,
            speed?: number
       },
       public compassHeading?: {
            alpha?: number,
            beta?: number,
            gamma?: number,
            degrees?: number,
            direction?: string
        },
    ){}
}