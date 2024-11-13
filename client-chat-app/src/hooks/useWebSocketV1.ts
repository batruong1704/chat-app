import { useState, useRef, useEffect, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client, Message as StompMessage } from '@stomp/stompjs';
import { Message, RoomMessages } from '../types';

export const useWebSocket = (username: string, userId: string, roomId: string, publicRoomId: string) => {
  const [roomData, setRoomData] = useState<RoomMessages | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const client = useRef<Client | null>(null);
  const currentSubscription = useRef<any>(null);
  const userStatusSubscription = useRef<any>(null);
  const usersSubscription = useRef<any>(null);
  const publicRoomSubscription = useRef<any>(null);

  const isValidSystemMessage = (message: any) => {
    return message && message.type && message.senderId && message.senderName;
  };

  // Utility function to add system message
  const addSystemMessage = (message: Message) => {
    setRoomData(prevData => {
      if (!prevData) return null;
      return {
        ...prevData,
        messages: [...prevData.messages, {
          ...message,
          idMessage: Date.now().toString(),
          createdAt: new Date().toISOString()
        }]
      };
    });
  };

  const usernameRef = useRef(username);
  useEffect(() => {
    usernameRef.current = username;
  }, [username]);

  // Fetch initial messages from API when roomId changes
  useEffect(() => {
    const fetchInitialMessages = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/message/getMessage/${roomId}`);
        const result = await response.json();
        console.log("From Room: ", result);

        if (result.success) {
          setRoomData(result.data);
        }
      } catch (error) {
        console.error('Error fetching initial messages:', error);
      }
    };

    fetchInitialMessages();
    return () => setRoomData(null);
  }, [roomId]);

  // Manage subscriptions
  const handleSubscriptions = useCallback((stompClient: Client) => {
    if (!stompClient.connected) return;

    // Hủy subscription cũ của phòng nếu có
    if (currentSubscription.current) {
      currentSubscription.current.unsubscribe();
      currentSubscription.current = null;
    }

    try {
      // Subscribe to room messages
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

            setRoomData(prevData => {
              if (!prevData) return null;
              return {
                ...prevData,
                messages: [...prevData.messages, normalizedMessage]
              };
            });
          }
      );

      // Subscribe to user status updates (chỉ subscribe 1 lần)
      if (!userStatusSubscription.current) {
        userStatusSubscription.current = stompClient.subscribe(
            '/topic/user-status',
            (message: StompMessage) => {
              const statusMessage = JSON.parse(message.body);
              if (statusMessage.type === 'JOIN' || statusMessage.type === 'LEAVE') {
                addSystemMessage({
                  type: statusMessage.type,
                  senderId: statusMessage.senderId,
                  senderName: statusMessage.senderName,
                  content: statusMessage.content,
                  idMessage: '',
                  createdAt: ''
                });
              }
            }
        );
      }

      // Subscribe to active users list (chỉ subscribe 1 lần)
      if (!usersSubscription.current) {
        usersSubscription.current = stompClient.subscribe(
            '/topic/users',
            (message: StompMessage) => {
              const activeUsers = JSON.parse(message.body);
              console.log('Active users update:', activeUsers);
            }
        );
      }

      // Subscribe to public room messages (chỉ subscribe 1 lần)
      if (!publicRoomSubscription.current) {
        publicRoomSubscription.current = stompClient.subscribe(
            '/topic/room/${publicRoomId}',
            (message: StompMessage) => {
              const publicMessage = JSON.parse(message.body);
              if ((publicMessage.type === 'JOIN' || publicMessage.type === 'LEAVE')
                  && isValidSystemMessage(publicMessage)) {
                console.log("Processing valid system message:", publicMessage);
                addSystemMessage({
                  type: publicMessage.type,
                  senderId: publicMessage.senderId,
                  senderName: publicMessage.senderName,
                  content: publicMessage.content,
                  idMessage: publicMessage.idMessage || Date.now().toString(),
                  createdAt: publicMessage.createdAt || new Date().toISOString()
                });
              } else {
                console.debug("Ignored invalid system message:", publicMessage);
              }
            }
        );
      }
    } catch (error) {
      console.error('Error in subscriptions:', error);
    }
  }, [roomId]);

  // Setup WebSocket connection
  useEffect(() => {
    let isComponentMounted = true;

    const setupWebSocket = () => {
      if (!client.current || !client.current.connected) {
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
          webSocketFactory: () => socket,
          connectHeaders: {
            userId: userId
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          onConnect: () => {
            if (!isComponentMounted) return;

            console.log('WebSocket connected successfully');
            setConnected(true);
            handleSubscriptions(stompClient);
          },
          onDisconnect: () => {
            if (!isComponentMounted) return;
            console.log('WebSocket disconnected');
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
      } else {
        // Nếu client đã tồn tại và đã kết nối, chỉ cần cập nhật subscriptions
        handleSubscriptions(client.current);
      }
    };

    setupWebSocket();

    // Cleanup function chỉ chạy khi component unmount
    return () => {
      isComponentMounted = false;
    };
  }, [username, userId, roomId, publicRoomId, handleSubscriptions]);

  // Send message function
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

  return {
    roomData,
    connected,
    sendMessage
  };
};