import { SupportResponseAttachments } from "./supportTypes";




interface SupportReplyToMessageId {
    email: string;
    full_name: string;
    _id: string
}
export interface SupportMessageType {
    attachments: Array<Partial<SupportResponseAttachments>>;
    content: string;
    createdAt: string;
    updatedAt: string;
    recent_response_at: string;
    reply_to_message_id: SupportReplyToMessageId;
    support_id: string;
    type: string;
    __v: number;
    _id: string;
}

export interface AttachmentDownloadUrlsResponse {
    attachment_id: string
    downloadUrl: string;
    file_name: string;
    file_type: string;
    path: string;
}