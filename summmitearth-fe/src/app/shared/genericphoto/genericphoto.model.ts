export class GenericPhotoModel {
    constructor(
        public _id?: string,
        public genericId?: string,
        public genericIdType?: string,
        public genericSubId?: string,
        public genericSubIdType?: string,
        public photoComments?: string,
        public photoUrl?: string,
        public thumbnailUrl?: string,
        public photoGeoRefUrl?: string,
        public mimeType?: string,
        public originalFileName?: string,
        public fileName?: string,
        public fileSize?: number,
        public thumbnail?: string,
        public thumbnailGeoRefUrl?: string,
        public useGeoRef: boolean = false,
        public photoType?: string,
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