export interface OnlyImagesType {
  description: string;
  name: string;
  original_name: string;
  type: string;
  size: 5068;
  path: string;
  time: string;
  tags: Array<string>;
  _id: string;
  comments: any;
  url: string;
  scout_id: string;
  src: string;
  height: number;
  width: number;
}

export interface ScoutAttachmentDetails {
  name: string;
  original_name: string;
  type: string;
  size: number;
  _id: string;
  url: string;
  tn_url: string;
  farm_id: { _id: string,location_id:string },
  crop_id: { _id: string },
  key: string;
}

export interface CreatedByDetails {
  _id: string;
  full_name: string;
  email: string;
  phone: string;
  user_type: string;
}

export interface CropType {
  title: string;
  _id: string;
}
export interface FarmInScoutsResponseType {
  _id: string;
  title: string;
  location: string;
  crops: Array<CropType>;
}
export interface SingleScoutResponse {
  suggestions: string;
  summary: string;
  _id: string;
  farm_id: FarmInScoutsResponseType;
  crop_id: string;
  description: string;
  attachments: Array<ScoutAttachmentDetails>;
  created_by: CreatedByDetails;
  comments: string;
  createdAt: string;
  updatedAt: string;
  findings: string;
}

export interface AttachmentsForPreview {
  src: string;
  width: number;
  height: number;
}
