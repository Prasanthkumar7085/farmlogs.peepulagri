import { AttachmentsForPreview } from "./scoutTypes";


export interface TaskAttachmentsType {
  name: string;
  original_name: string;
  type: string;
  size: number;
  path: string;
  url: string;
  _id: string;
}
export interface TaskResponseTypes {
  _id: string;
  farm_id: {
    title: string;
    _id: string;
  };
  title: string;
  description: string;
  categories: Array<string>;
  deadline: string;
  status: string;
  comments: any;
  created_by: {
    _id: string;
    email: string;
    full_name: string;
  };
  attchments: Array<TaskAttachmentsType>;
  createdAt: string;
  updatedAt: string;
  attachments: Array<AttachmentsForPreview>;
}

export interface FarmInTaskType {
  _id: string;
  title: string;
  slug: string;
  status: string;
  area: string;
  createdAt: string;
  updatedAt: string;
  user_id: string;
  location: string;
}