import { SupportResponseAttachments } from "./supportTypes";



export interface SupportMessageType {
    attachments: Array<Partial<SupportResponseAttachments>>;
    content: string;
    reply_to_message_id: string;
    support_id: string;
    type: string;
    __v: number;
    _id: string;
}