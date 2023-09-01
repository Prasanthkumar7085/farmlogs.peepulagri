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
    createdAt: string;
    geometry: any;
    logCount: number;
    slug: string;
    status: string;
    title: string;
    updatedAt: string;
    user_id: string;
    __v: number;
    _id: string;
}

export interface FarmCardPropsType {
    _id: string;
    progress: number;
    acresCount: number;
    farmName: string;
    createAt: string;
    logCount: number;
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
    paramString: string;
    search: string;
    orderBy: string;
    orderType: string;

}

export interface QueryParamForFarmLogs {
    search_string: string;
    sort_by: string;
    sort_type: string;

}