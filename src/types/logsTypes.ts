export interface GetLogByIdResponseDataType {
    additional_resources: Array<AdditionalResourcesType>;
    attachments: any;
    categories: Array<string>;
    createdAt: string;
    description: string;
    farm_id: string;
    from_date_time: string;
    resources: Array<ResourcesType>;
    status: string;
    tags: Array<string>;
    title: string;
    to_date_time: string;
    total_machinary_hours: number;
    total_manual_hours: number;
    updatedAt: string;
    work_type: string;
    __v: number;
    _id: string;
}

export interface ResourcesType {
    title: string;
    quantity: string
    total_hours: string
    type: string
}
export interface ResourcesTypeInResponse {
    title: string;
    quantity: string
    total_hours: string
    type: string;
    _id: string;
}

export interface ResourcesTypeInResponseWithLogo {
    title: string;
    quantity: string
    total_hours: string
    type: string;
    _id: string;
    logo: string;
}

export interface AdditionalResourcesType {
    title: string;
    quantity: string;
    units: string;
    type: string;
}