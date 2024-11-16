import React, { useEffect, useState } from 'react';
import Stomp from "stompjs";
import SockJS from "sockjs-client/dist/sockjs";

export const useWebSocket = (token) => {
    const [stompClient, setStompClient] = useState(null);
    const [isConnect, setIsConnect] = useState(false);

    const connect = () => {
        console.log("Connecting to WebSocket...", token);
        if (stompClient?.connected) return;

        const socket = new SockJS("http://localhost:5000/ws");
        const client = Stomp.over(socket);
        client.debug = (str) => console.log(str); // Debug log

        const headers = {
            Authorization: `Bearer ${token}`
        };

        client.connect(
            {
                Authorization: `Bearer ${token}`,
            },
            (frame) => {
                console.log("Connected to websocket", frame);
                setIsConnect(true);
                setStompClient(client);
            },
            (error) => {
                console.error("WebSocket connection error:", error);
            }
        );
    };


    const disconnect = () => {
        if (stompClient && stompClient.connected) {
            stompClient.disconnect(() => {
                console.log("WebSocket Disconnected");
                setIsConnect(false);
            }, {});
        }
    };


    return {
        stompClient,
        isConnect,
        connect,
        disconnect
    };
};