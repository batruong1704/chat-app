import {BASE_API_URL} from "../../Config/Api";
import {CREATE_CHAT, CREATE_GROUP, GET_USER_CHAT} from "./ActionType";

export const createChat = (chatData) => async(dispatch) => {
    try {
        const res = await fetch(`${BASE_API_URL}/chat/single`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${chatData.token}`
            },
            body: JSON.stringify(chatData.data)
        });

        if (!res.ok) {
            const errorData = await res.text();
            console.error("[ACTION CREATE CHAT] Lỗi khi nhận tin nhắn:", errorData);
            throw new Error(errorData);
        }

        const reqData = await res.json();
        // console.log("[ACTION CREATE CHAT] Tạo tin nhắn", reqData);

        dispatch({
            type: CREATE_CHAT,
            payload: reqData
        });
    } catch (error) {
        console.error("[ACTION CREATE CHAT] ", error);
    }
}

export const createGroupChat = (chatData) => async(dispatch) => {
    try {
        const res = await fetch(`${BASE_API_URL}/chat/group`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${chatData.token}`
            },
            body: JSON.stringify(chatData.group)
        })
        const reqData = await res.json();
        // console.log("[ACTION CREATE GROUP CHAT]: ", reqData);
        dispatch({
            type: CREATE_GROUP,
            payload: reqData
        })
    } catch (error) {
        console.log("[ACTION CREATE GROUP CHAT]: ", error);
    }
}

export const getUserChat = (chatData) => async(dispatch) => {
    try {
        const res = await fetch(`${BASE_API_URL}/chat/user`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${chatData.token}`
            }
        })
        const reqData = await res.json();
        // console.log("[ACTION GET USER CHAT]: ", reqData);
        dispatch({
            type: GET_USER_CHAT,
            payload: reqData
        })
    } catch (error) {
        console.log("[ACTION GET USER CHAT]: ", error);
    }
}
