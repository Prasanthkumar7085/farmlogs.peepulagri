export interface FarmCardTypes {
    id: number;
    farmShape: string;
    acresCount: number;
    farmName: string;
    totalLogs: number;
    barWidth: string;
    para: string
}

export interface FarmDataType {
    area: number;
    created_at: string;
    geometry: any;
    slug: string;
    status: string;
    title: string;
    updated_at: string;
    _id: string;
}

export interface FarmCardPropsType {
    _id: string;
    acresCount: number;
    farmName: string;
    createAt: string
}


export interface PaginationDetailsType {
    limit: number;
    page: number;
    total: number;
    total_pages: number;
}

export interface GetLogsByFarmIdPropsType {
    farmId: string | undefined | number;
    page: string | undefined | number;
    limit: string | undefined | number;
    search: string;
    order_by: string | undefined;
    order_type: string | undefined;
}

export interface QueryParamForFarmLogs {
    search_string: string;
    sort_by: string;
    sort_type: string;

}