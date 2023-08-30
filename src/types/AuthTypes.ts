

export interface UserData {
    createdAt: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    updatedAt: string;
    user_name: string;
    user_type: string;
    __v: number;
    _id: string;

}

export interface UserDetails {
    access_token: string;
    refresh_token: string;
    userData: UserData
}

export interface AuthResponseDataType {
    data: UserDetails;
    message: string;
    status: number;
    success: boolean
}

interface ErrorData {
    email: string;
    password: string;
}


export interface AuthResponseErrorDataType {
    errors: Partial<ErrorData>;
    message: string;
    status: number;
    success: boolean;
}


