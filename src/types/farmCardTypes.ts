import { Pagination } from '@mui/material';
import { CropTypeInFarms } from "./cropTypes";

export interface FarmCardTypes {
    id: number;
    farmShape: string;
    acresCount: number;
    farmName: string;
    totalLogs: number;
    barWidth: string;
    para: string
}


interface Geometrytype {
    type: string;
    coordinates: Array<Array<Array<Array<number>>>>;
    _id: string
}

export interface FarmDataType {
    area: number;
    created_at: string;
    crops: Array<CropTypeInFarms>
    geometry: Geometrytype;
    logCount: number;
    slug: string;
    location_id: {
        name: string;
        _id: string;
    };
    status: string;
    title: string;
    updatedAt: string;
    crops_count: number;
    user_id: {
        _id: string;
        full_name: string;
        user_type: string;
        email: string;
        phone: string;
    };

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

export interface PaginationInFarmResponse {
    has_more: boolean;
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    success: boolean;
    message: string;
    search_string: string | null,


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