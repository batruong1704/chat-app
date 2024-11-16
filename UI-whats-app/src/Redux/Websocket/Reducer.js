import * as types from "./ActionType";

const initialState = {
    connected: false,
    connecting: false,
    error: null,
    messages: {},
};

export const websocketReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.WEBSOCKET_CONNECT:
            return {
                ...state,
                connecting: true,
                error: null
            };
        case types.WEBSOCKET_CONNECTED:
            return {
                ...state,
                connected: true,
                connecting: false,
                error: null
            };
        case types.WEBSOCKET_DISCONNECT:
            return {
                ...state,
                connected: false,
                connecting: false
            };
        case types.WEBSOCKET_ERROR:
            return {
                ...state,
                error: action.payload,
                connecting: false
            };
        case types.WEBSOCKET_MESSAGE_RECEIVED:
            const { chatId, message } = action.payload;
            return {
                ...state,
                messages: {
                    ...state.messages,
                    [chatId]: Array.isArray(state.messages[chatId])
                        ? [...state.messages[chatId], message]
                        : [message]
                }
            };
        default:
            return state;
    }
}