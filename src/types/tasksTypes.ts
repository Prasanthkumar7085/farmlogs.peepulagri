export interface userTaskType {
  _id: string;
  user_type: string;
  phone: string;
  phone_verified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: 0;
}

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
  assign_to: Array<{ _id: string; name: string }>;
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
  createdAt: string;
  updatedAt: string;
  attachments: Array<TaskAttachmentsType>;
  assigned_to: {
    _id: string;
    full_name: string;
    email: string;
  };
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


export interface TasksLogsResponseType {
  _id: string;
  task_id: {
    _id: string;
    title: string;
  };
  message: string;
  type: string;
  user_id: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}