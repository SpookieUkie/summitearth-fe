export class Documents {

    documentName: string;
    documentUrl: string;
    comments: string;
    fileType: string; //Field Ticket, DFR
    refTemplate: string;
    dfrFilesId: string;
    dfrIds: [{
        dfrId: {
            type: String,
            trim: true
        }
    }]

}