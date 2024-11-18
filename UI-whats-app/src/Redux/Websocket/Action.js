import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import * as types from "./ActionType";
import {WEBSOCKET_TYPING_STATUS} from "./ActionType";

import {ADD_NEW_CHAT} from "../Chat/ActionType";

let stompClient = null;

export const connectWebSocket = (token, userId) => async (dispatch) => {
    if (stompClient && stompClient.connected) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        try {
            const socket = new SockJS('http://localhost:5000/ws');
            stompClient = Stomp.over(socket);

            const connectionTimeout = setTimeout(() => {
                reject(new Error('WebSocket connection timeout'));
            }, 10000);

            stompClient.connect(
                {Authorization: `Bearer ${token}`},
                () => {
                    clearTimeout(connectionTimeout);
                    dispatch({type: types.WEBSOCKET_CONNECTED});

                    setTimeout(() => {
                        stompClient.subscribe(`/topic/notification/${userId}`, (message) => {
                            const newChat = JSON.parse(message.body);
                            dispatch({
                                type: ADD_NEW_CHAT,
                                payload: newChat
                            });
                        });
                        resolve();
                    }, 500);
                },
                (error) => {
                    clearTimeout(connectionTimeout);
                    dispatch({
                        type: types.WEBSOCKET_ERROR,
                        payload: error.message
                    });
                    reject(error);
                }
            );
        } catch (error) {
            dispatch({
                type: types.WEBSOCKET_ERROR,
                payload: error.message
            });
            reject(error);
        }
    });
};

export const subscribeToChat = (chatId) => async (dispatch, getState) => {
    try {
        await new Promise(resolve => {
            const checkConnection = () => {
                if (stompClient && stompClient.connected) {
                    resolve();
                } else {
                    setTimeout(checkConnection, 100);
                }
            };
            checkConnection();
        });

        if (!stompClient || !stompClient.connected) {
            throw new Error('WebSocket connection failed');
        }

        // Proceed with subscription logic
        const subscriptionId = `sub-${chatId}`;

        const existingSubscription = stompClient.subscriptions[subscriptionId];
        if (existingSubscription) {
            console.log(`Already subscribed to chat ${chatId}`);
            return { unsubscribe: () => existingSubscription.unsubscribe() };
        }

        const messageListener = (message) => {
            try {
                console.log('[WebSocket Debug] Received new message:', message);
                const receivedMessage = JSON.parse(message.body);

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

            } catch (error) {
                console.error('[WebSocket Debug] Error processing message:', error);
            }
        };

        const messageSubscription = stompClient.subscribe(
            `/topic/room/${chatId}`,
            messageListener,
            { id: subscriptionId }
        );

        const typingSubscription = stompClient.subscribe(
            `/topic/room/${chatId}/typing`,
            (message) => {
                const typingStatus = JSON.parse(message.body);
                console.log('[WebSocket Debug] Received typing status:', typingStatus);
                dispatch({
                    type: WEBSOCKET_TYPING_STATUS,
                    payload: {
                        chatId,
                        userId: typingStatus.userId,
                        booleanTyping: typingStatus.booleanTyping
                    }
                });
            }
        );

        // Return an object with an unsubscribe method
        return {
            unsubscribe: () => {
                messageSubscription.unsubscribe();
                typingSubscription.unsubscribe();
            }
        };

    } catch (error) {
        console.error('Failed to subscribe to chat:', error);
        dispatch({
            type: types.WEBSOCKET_ERROR,
            payload: error.message
        });
        return { unsubscribe: () => {} }; // Return a no-op unsubscribe method
    }
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

export const sendTypingStatus = (chatId, userId, booleanTyping) => (dispatch) => {
    if (!stompClient || !stompClient.connected) {
        console.error('[SendTypingStatus] WebSocket chưa kết nối!');
        return;
    }

    console.log('[SendTypingStatus] Gửi trạng thái typing:', chatId, userId, booleanTyping);

    stompClient.send("/app/typing", {}, JSON.stringify({
        chatId,
        userId,
        booleanTyping
    }));
};

export const sendNotificationCreateRoom = (chatModel) => (dispatch) => {
    if (!stompClient || !stompClient.connected) {
        console.error('[SendNotification] WebSocket chưa kết nối!');
        return;
    }

    console.log('[SendNotification] Gửi thông báo tạo room:', chatModel);

    stompClient.send("/app/notification", {}, JSON.stringify(chatModel));
};

export const disconnectWebSocket = () => (dispatch) => {
    if (stompClient?.connected) {
        stompClient.disconnect(() => {
            dispatch({type: types.WEBSOCKET_DISCONNECT});
        });
    }
};