import { CREATE_NEW_MESAGE, GET_ALL_MESSAGE } from "./ActionType";
import { SYNC_WEBSOCKET_MESSAGE } from "../Websocket/ActionType";

const initialState = {
    messages: [],
    newMessage: null
}

export const messageReducer = (store = initialState, { type, payload }) => {
    switch (type) {
        case CREATE_NEW_MESAGE:
            // Kiểm tra xem tin nhắn đã tồn tại chưa
            const messageExists = store.messages.some(msg =>
                msg.id === payload.id ||
                (msg.content === payload.content &&
                    msg.userModel.id === payload.userModel.id &&
                    Math.abs(new Date(msg.timestamp) - new Date(payload.timestamp)) < 1000)
            );

            if (!messageExists) {
                return {
                    ...store,
                    newMessage: payload,
                    messages: [...store.messages, payload].sort((a, b) =>
                        new Date(a.timestamp) - new Date(b.timestamp)
                    )
                };
            }
            return store;

        case GET_ALL_MESSAGE:
            return {
                ...store,
                messages: payload
            }

        case SYNC_WEBSOCKET_MESSAGE:
            const exists = store.messages.some(msg =>
                msg.id === payload.id ||
                (msg.content === payload.content &&
                    msg.userModel.id === payload.userModel.id &&
                    Math.abs(new Date(msg.timestamp) - new Date(payload.timestamp)) < 1000)
            );

            if (!exists) {
                return {
                    ...store,
                    messages: [...store.messages, payload].sort((a, b) =>
                        new Date(a.timestamp) - new Date(b.timestamp)
                    ),
                    newMessage: payload
                };
            }
            return store;

        default:
            return store;
    }
}