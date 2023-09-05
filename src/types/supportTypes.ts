export interface categoriesType {
    title: string;
    value: string;
    color: string;
    textColor: string;
}

export interface SupportQueryDataDDetailsType {
    query: string,
    categories: Array<string> | undefined,
    description: string,
    setQuery: React.Dispatch<React.SetStateAction<string>>,
    setCategories: React.Dispatch<React.SetStateAction<Array<string> | undefined>>,
    setDescription: React.Dispatch<React.SetStateAction<string>>

}
export interface SupportServiceTypes {
    page: undefined | string | number;
    limit: string | number | undefined;
    search: string;
    status: string | number;
    accessToken: string;
    orderBy: string;
    orderType: string;

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



type DeleteSupportFunction = (supportId: SupportResponseDataType) => void;
type UpdateStatusFunction = (sortKey: string) => void;

export interface SupportDataTableProps {
    data: SupportResponseDataType[] | null | undefined;
    loading: boolean;
    deleteSupport: DeleteSupportFunction;
    appliedSort: UpdateStatusFunction;
}

export interface AddSupportPayload {
    title: string;
    description: string;
    support_id: string; //unique id to trace
    categories: Array<string>
    attachments: Array<Partial<SupportResponseAttachments>>;
    status: string
}
