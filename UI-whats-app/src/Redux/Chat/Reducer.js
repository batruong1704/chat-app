import {ADD_NEW_CHAT, CREATE_CHAT, CREATE_GROUP, GET_ROOM_CHAT} from "./ActionType";

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
    } else if (type === GET_ROOM_CHAT) {
        // console.log("[CHAT REDUCER - GET USER CHAT] ", payload);
        return {
            ...store,
            chats: payload
        }
    } else if (type === ADD_NEW_CHAT) {
        const chatExists = store.chats.some(chat => chat.id === payload.id);
        if (chatExists) {
            return store;
        }
        return {
            ...store,
            chats: [payload, ...store.chats]
        };
    }

    return store;
}