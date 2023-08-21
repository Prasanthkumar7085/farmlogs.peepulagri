export interface FarmCardTypes {
    id: number,
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