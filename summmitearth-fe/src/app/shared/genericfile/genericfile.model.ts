export class GenericFileModel {
   
    constructor(
        public _id?: string,
        public genericId?: string,
        public genericIdType?: string,
        public genericSubId?: string,
        public genericSubIdType?: string,
        public displayName?: string,
        public fileName?: string,
        public fileComments?: string,
        public originalFileName?: string,
        public mimeType?: string,
        public fileSize?: number,
        public fileUrl?: string,
        public fileType?: string,
        public file?: File
        
    ){}
}