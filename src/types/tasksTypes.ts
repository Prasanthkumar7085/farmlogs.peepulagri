import { AttachmentsForPreview } from "./scoutTypes";

export interface TaskResponseTypes{
            _id:string;
            farm_id:string;
            title:string;
            description:string;
            categories:Array<string>;
            deadline:string;
    status: string;
    comments: any;
            created_by:{
                _id:string;
                email:string;
                full_name:string;
            },
            attchments:string;
            createdAt:string;
            updatedAt:string;
            attachments:Array<AttachmentsForPreview>;
       
}