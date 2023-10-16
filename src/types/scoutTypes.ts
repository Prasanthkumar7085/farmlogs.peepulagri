export interface ScoutAttachmentDetails {
    name: string;
    original_name: string;
    type: string;
    size: number;
    _id: string;
    url: string;
}




export interface CreatedByDetails {
    _id: string;
    full_name: string;
    email: string;
    phone: string;
}

export interface SingleScoutResponse {
    _id: string;
    farm_id: { _id: string; title: string }
    crop_id: string;
    description: string;
    attachments: Array<ScoutAttachmentDetails>;
    created_by: CreatedByDetails;
    comments: string;
    createdAt: string;
    updatedAt: string;
    findings: string;
}


export interface AttachmentsForPreview {
    src: string;
    width: number;
    height: number;
}