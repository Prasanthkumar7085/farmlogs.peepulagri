export interface CropTypeInFarms {
  title: string;
  active: boolean,
  slug: string,
  _id: string;
}

export interface CropTypeResponse {
  createdAt: string;
  crop_area: number;
  area: number;
  title: string;
  active: boolean;
  slug: string;
  _id: string;
  created_at: string;
  updatedAt: string;
  url: string;
}