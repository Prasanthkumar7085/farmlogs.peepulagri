export interface CropTypeInFarms {
    title: string;
    active: boolean,
    slug: string,
    _id: string;
}

export interface CropTypeResponse {
    area: number;
    title: string;
    active: boolean;
    slug: string;
    _id: string;
    created_at: string;
    updatedAt: string;
}