import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import * as types from "./ActionType";
import {SYNC_WEBSOCKET_MESSAGE} from "./ActionType";

import { CREATE_NEW_MESAGE } from "../Message/ActionType";

let stompClient = null;

export const connectWebSocket = (token) => async (dispatch) => {
    if (stompClient && stompClient.connected) {
        console.log("WebSocket đã kết nối, bỏ qua");
        return;
    }
    try {
        dispatch({ type: types.WEBSOCKET_CONNECT });

        const socket = new SockJS('http://localhost:5000/ws');
        stompClient = Stomp.over(socket);

        // Disable debug logs in production
        if (process.env.NODE_ENV === 'production') {
            stompClient.debug = null;
        }

        await new Promise((resolve, reject) => {
            stompClient.connect(
                { Authorization: `Bearer ${token}` },
                () => {
                    dispatch({ type: types.WEBSOCKET_CONNECTED });
                    resolve();
                },
                (error) => {
                    dispatch({
                        type: types.WEBSOCKET_ERROR,
                        payload: error.message
                    });
                    reject(error);
                }
            );
        });

    } catch (error) {
        dispatch({
            type: types.WEBSOCKET_ERROR,
            payload: error.message
        });
    }
};

export const subscribeToChat = (chatId) => (dispatch, getState) => {
    if (!stompClient || !stompClient.connected) {
        console.warn("WebSocket chưa kết nối, không thể subscribe");
        dispatch({
            type: types.WEBSOCKET_ERROR,
            payload: 'WebSocket not connected'
        });
        return;
    }

    const subscriptionId = `sub-${chatId}`;

    const existingSubscription = stompClient.subscriptions[subscriptionId];
    if (existingSubscription) {
        console.log(`Đã subscribe vào phòng ${chatId}`);
        return;
    }

    const messageListener = (message) => {
        try {
            console.log('[WebSocket Debug] Nhận message mới:', message);
            const receivedMessage = JSON.parse(message.body);

            // Thêm id nếu không tồn tại
            if (!receivedMessage.id) {
                receivedMessage.id = Date.now().toString();
            }

            dispatch({
                type: types.WEBSOCKET_MESSAGE_RECEIVED,
                payload: {
                    chatId,
                    message: receivedMessage
                }
            });

            dispatch({
                type: SYNC_WEBSOCKET_MESSAGE,
                payload: receivedMessage
            });

            // Dispatch để cập nhật message mới
            dispatch({
                type: CREATE_NEW_MESAGE,
                payload: receivedMessage
            });

        } catch (error) {
            console.error('[WebSocket Debug] Lỗi xử lý message:', error);
        }
    };

    stompClient.subscribe(
        `/topic/room/${chatId}`,
        messageListener,
        { id: subscriptionId }
    );
};

export const sendMessage = (message) => (dispatch) => {
    if (!stompClient?.connected) {
        console.error('WebSocket chưa kết nối, không thể gửi tin nhắn');
        dispatch({
            type: types.WEBSOCKET_ERROR,
            payload: 'WebSocket not connected'
        });
        return false;
    }

    try {
        stompClient.send(
            '/app/chat',
            {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'content-type': 'application/json'
            },
            JSON.stringify(message)
        );
        console.log("Đã gửi tin nhắn:", message);
        return true;
    } catch (error) {
        console.error('Đồ nquu, không gửi được:', error);
        dispatch({
            type: types.WEBSOCKET_ERROR,
            payload: error.message
        });
        return false;
    }
};


export const disconnectWebSocket = () => (dispatch) => {
    if (stompClient?.connected) {
        stompClient.disconnect(() => {
            dispatch({ type: types.WEBSOCKET_DISCONNECT });
        });
    }
};