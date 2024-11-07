// useWebSocket.ts
import { useState, useRef, useEffect, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client, Message as StompMessage } from '@stomp/stompjs';
import { Message, RoomMessages } from '../types';

// Hook để thiết lập và quản lý WebSocket trong phòng chat
export const useWebSocket = (username: string, userId: string, roomId: string) => {
    // Trạng thái dữ liệu tin nhắn trong phòng
    const [roomData, setRoomData] = useState<RoomMessages | null>(null);
    // Trạng thái kết nối WebSocket
    const [connected, setConnected] = useState<boolean>(false);
    // Tham chiếu tới WebSocket client
    const client = useRef<Client | null>(null);
    // Tham chiếu các subscription để dễ dàng huỷ khi cần
    const currentSubscription = useRef<any>(null);
    const userStatusSubscription = useRef<any>(null);
    const usersSubscription = useRef<any>(null);
    const lastRoomId = useRef<string>(roomId); // Theo dõi roomId trước đó
    const isInitialConnection = useRef<boolean>(true); // Kiểm tra kết nối đầu tiên vào phòng công khai

    // Fetch tin nhắn ban đầu từ API khi roomId thay đổi
    useEffect(() => {
        const fetchInitialMessages = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/message/getMessage/${roomId}`);
                const result = await response.json();
                console.log("From Room: ", result);

                // Nếu thành công, lưu dữ liệu tin nhắn vào roomData
                if (result.success) {
                    setRoomData(result.data);
                }
            } catch (error) {
                console.error('Error fetching initial messages:', error);
            }
        };

        fetchInitialMessages();
        // Hủy roomData khi roomId thay đổi
        return () => setRoomData(null);
    }, [roomId]);

    // Hàm để quản lý các subscriptions
    const handleSubscriptions = useCallback((stompClient: Client) => {
        // Kiểm tra kết nối, chỉ thực hiện nếu client đã kết nối
        if (!stompClient.connected) return;

        // Hủy đăng ký phòng hiện tại nếu có
        if (currentSubscription.current) {
            currentSubscription.current.unsubscribe();
            currentSubscription.current = null;
        }

        try {
            // Đăng ký nhận tin nhắn phòng
            currentSubscription.current = stompClient.subscribe(
                `/topic/room/${roomId}`,
                (message: StompMessage) => {
                    const receivedMessage = JSON.parse(message.body);
                    const normalizedMessage: Message = {
                        idMessage: receivedMessage.idMessage || Date.now().toString(),
                        type: receivedMessage.type,
                        senderId: receivedMessage.senderId,
                        senderName: receivedMessage.senderName,
                        content: receivedMessage.content,
                        createdAt: receivedMessage.createdAt || new Date().toISOString()
                    };

                    console.log('Received message:', normalizedMessage);
                    setRoomData(prevData => {
                        if (!prevData) return null;
                        return {
                            ...prevData,
                            messages: [...prevData.messages, normalizedMessage]
                        };
                    });
                }
            );

            // Đăng ký cập nhật trạng thái người dùng (chỉ 1 lần)
            if (!userStatusSubscription.current) {
                userStatusSubscription.current = stompClient.subscribe(
                    '/topic/user-status',
                    (message: StompMessage) => {
                        const userStatus = JSON.parse(message.body);
                        console.log('User status update:', userStatus);
                        // Xử lý cập nhật trạng thái người dùng tại đây
                    }
                );
            }

            // Đăng ký danh sách người dùng hoạt động (chỉ 1 lần)
            if (!usersSubscription.current) {
                usersSubscription.current = stompClient.subscribe(
                    '/topic/users',
                    (message: StompMessage) => {
                        const activeUsers = JSON.parse(message.body);
                        console.log('Active users update:', activeUsers);
                        // Xử lý cập nhật người dùng đang hoạt động tại đây
                    }
                );
            }
        } catch (error) {
            console.error('Error in subscriptions:', error);
        }
    }, [roomId]);

    // Thiết lập WebSocket connection
    useEffect(() => {
        const isPublicRoom = roomId === 'cb6e6cb1-975f-11ef-8682-0242ac140002'; // Kiểm tra xem có phải phòng công khai không
        let isComponentMounted = true; // Theo dõi trạng thái của component

        const setupWebSocket = () => {
            if (client.current?.connected) {
                handleSubscriptions(client.current); // Đăng ký nếu WebSocket đã kết nối
            } else if (!client.current) {
                // Tạo client mới nếu chưa có kết nối
                const socket = new SockJS('http://localhost:8080/ws');
                const stompClient = new Client({
                    webSocketFactory: () => socket,
                    reconnectDelay: 5000,
                    heartbeatIncoming: 4000,
                    heartbeatOutgoing: 4000,
                    onConnect: () => {
                        if (!isComponentMounted) return;

                        setConnected(true);
                        handleSubscriptions(stompClient);

                        // Gửi thông điệp "JOIN" khi người dùng tham gia phòng công khai
                        if (isPublicRoom && isInitialConnection.current) {
                            const joinMessage = {
                                type: 'JOIN',
                                senderId: userId,
                                senderName: username,
                                content: `${username} đã online!`,
                            };

                            stompClient.publish({
                                destination: '/app/chat.addUser',
                                body: JSON.stringify(joinMessage)
                            });
                            isInitialConnection.current = false;
                        }
                    },
                    onDisconnect: () => {
                        if (!isComponentMounted) return;
                        setConnected(false);
                    },
                    onStompError: (error) => {
                        console.error('STOMP error:', error);
                        if (!isComponentMounted) return;
                        setConnected(false);
                    }
                });

                client.current = stompClient;
                stompClient.activate();
            }
        };

        setupWebSocket();
        lastRoomId.current = roomId;

        // Cleanup khi component bị huỷ
        return () => {
            isComponentMounted = false;

            if (client.current?.connected) {
                // Hủy đăng ký tất cả subscription
                if (currentSubscription.current) {
                    currentSubscription.current.unsubscribe();
                }
                if (userStatusSubscription.current) {
                    userStatusSubscription.current.unsubscribe();
                }
                if (usersSubscription.current) {
                    usersSubscription.current.unsubscribe();
                }
                // Gửi thông điệp "LEAVE" khi người dùng rời phòng công khai
                if (isPublicRoom) {
                    const leaveMessage = {
                        type: 'LEAVE',
                        senderId: userId,
                        senderName: username,
                        content: `${username} đã offline`,
                    };

                    client.current.publish({
                        destination: '/app/chat.removeUser',
                        body: JSON.stringify(leaveMessage)
                    });
                }

                client.current.deactivate();
                client.current = null;
            }
        };
    }, [username, userId, roomId, handleSubscriptions]);

    // Hàm để gửi tin nhắn từ người dùng
    const sendMessage = useCallback((content: string, roomId: string) => {
        if (!content.trim()) return;

        try {
            const messageToSend = {
                idMessage: Date.now().toString(),
                type: 'CHAT',
                senderId: userId,
                senderName: username,
                content: content,
                roomId: roomId,
                createdAt: new Date().toISOString()
            };

            client.current?.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(messageToSend)
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }, [userId, username]);

    // Trả về dữ liệu phòng, trạng thái kết nối, và hàm gửi tin nhắn
    return {
        roomData,
        connected,
        sendMessage
    };
};
