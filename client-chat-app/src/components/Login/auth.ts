import {User} from "../../types";

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        "publicRoomId": string;
        "user": User;
    }
}