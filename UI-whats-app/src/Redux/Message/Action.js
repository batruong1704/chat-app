import {BASE_API_URL} from "../../Config/Api";
import {CREATE_NEW_MESAGE, GET_ALL_MESSAGE} from "./ActionType";

export const createMessage = (messageData) => async(dispatch) => {
    try {
        const res = await fetch(`${BASE_API_URL}/message/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${messageData.token}`
            },
            body: JSON.stringify(messageData.data)
        });

        if (!res.ok) {
            const errorData = await res.text();
            console.error("[ACTION CREATE MESSAGE] Lỗi khi gửi tin nhắn:", errorData);
            throw new Error(errorData);
        }

        const reqData = await res.json();
        // console.log("[ACTION CREATE MESSAGE] Gửi tin nhắn", reqData);

        dispatch({
            type: CREATE_NEW_MESAGE,
            payload: reqData
        });
    } catch (error) {
        console.error("[ACTION CREATE MESSAGE] ", error);
    }
}

export const getAllMessage = (reqData) => async(dispatch) => {
    try {
        const res = await fetch(`${BASE_API_URL}/message/chat/${reqData.chatId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${reqData.token}`
            }
        })
        const data = await res.json();
        console.log("[ACTION GET ALL MESSAGE]: ", data);
        dispatch({
            type: GET_ALL_MESSAGE,
            payload: data
        })
    } catch (error) {
        console.log("[ACTION GET ALL MESSAGE]: ", error);
    }
}

