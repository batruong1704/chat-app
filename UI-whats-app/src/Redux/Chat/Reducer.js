import {CREATE_CHAT, CREATE_GROUP, GET_USER_CHAT} from "./ActionType";

const initialState = {
    chats: [],
    createdGroup: null,
    createdChat: null
}

export const chatReducer = (store = initialState, {type, payload}) => {
    if (type === CREATE_CHAT) {
        // console.log("[CHAT REDUCER - CREATE CHAT] ", payload);
        return {
            ...store,
            createdChat: payload,
        }
    } else if (type === CREATE_GROUP) {
        // console.log("[CHAT REDUCER - CREATE GROUP] ", payload);
        return {
            ...store,
            createdGroup: payload
        }
    } else if (type === GET_USER_CHAT) {
        // console.log("[CHAT REDUCER - GET USER CHAT] ", payload);
        return {
            ...store,
            chats: payload
        }
    }

    return store;
}