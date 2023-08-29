export interface categoriesType {
    title: string;
    value: string;
    color: string;
}

export interface SupportServiceTypes {
    page: string | number;
    limit: string | number;
    searchString: string;
    status: string | number;
}


export interface SupportResponseAttachments {
    name: string;
    original_name: string;
    path: string;
    size: number;
    type: string;
    _id: string;
}

export interface SupportResponseConversations {
    attachments: Array<SupportResponseAttachments>;
    content: string;
    reply_to_message_id: string;
    type: string;
    _id: string;
}

export interface SupportResponseDataType {
    attachments: Array<SupportResponseAttachments>;
    categories: Array<string>;
    conversation_messages: Array<SupportResponseConversations>;
    createdAt: string;
    description: string;
    recent_response_at: string;
    recent_response_by: string;
    status: string;
    support_id: string;
    title: string;
    updatedAt: string;
    __v: number;
    _id: string
}



type DeleteSupportFunction = (supportId: string) => void;
type UpdateStatusFunction = (status: string, id: string) => void;

export interface SupportDataTableProps {
    data: SupportResponseDataType[] | null | undefined;
    loading: boolean;
    deleteSupport: DeleteSupportFunction;
    updateStatus: UpdateStatusFunction;
}

export interface AddSupportPayload {
    title: string;
    description: string;
    support_id: string; //unique id to trace
    categories: Array<string>
    attachments: Array<Partial<SupportResponseAttachments>>;
    status: string
}
