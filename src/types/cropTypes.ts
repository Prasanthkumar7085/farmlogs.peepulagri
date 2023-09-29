export interface CropTypeInFarms{
    title: string;
    active: boolean,
    slug: string,
    _id: string;
}

export interface CropTypeResponse{
    crop_area: number;
    title:string;
    active:boolean;
    slug:string;
    _id:string;
    createdAt:string;
    updatedAt:string;
}