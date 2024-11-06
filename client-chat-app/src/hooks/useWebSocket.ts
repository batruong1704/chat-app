import { useState, useRef, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client, Message as StompMessage } from '@stomp/stompjs';
import { Message, User } from '../types';

export const useWebSocket = (username: string, userId: string, roomId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const client = useRef<Client | null>(null);
  const isConnected = useRef(false);

  useEffect(() => {
    if (!isConnected.current) {
      const socket = new SockJS('http://localhost:8080/ws');
      client.current = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          username: username,
          userId: userId,
          roomId: roomId
        },
        onConnect: () => {
          isConnected.current = true;
          setConnected(true);

          // Subscribe to public topic
          client.current?.subscribe('/topic/public', (message: StompMessage) => {
            const newMessage = JSON.parse(message.body) as Message;
            newMessage.username = newMessage.username === username ? 'You' : newMessage.username;
            setMessages(prev => [...prev, newMessage]);
          });

          // Subscribe to user status updates
          client.current?.subscribe('/topic/user-status', (message: StompMessage) => {
            const userStatus = JSON.parse(message.body);
            setUsers(prevUsers => {
              const userIndex = prevUsers.findIndex(u => u.id === userStatus.id);
              if (userIndex === -1) {
                const newUser: User = {
                  id: userStatus.id,
                  username: userStatus.username,
                  isOnline: userStatus.isOnline,
                  email: '',
                  lastSeen: userStatus.lastSeen,
                  createdAt: "", password: "", updatedAt: ""

                };
                return [...prevUsers, newUser];
              }

              const updatedUsers = [...prevUsers];
              updatedUsers[userIndex] = {
                ...updatedUsers[userIndex],
                isOnline: userStatus.isOnline,
                lastSeen: userStatus.lastSeen
              };
              return updatedUsers;
            });
          });

          client.current?.subscribe('/topic/users', (message: StompMessage) => {
            const response = JSON.parse(message.body);
            if (response.success && Array.isArray(response.data)) {
              const mappedUsers: User[] = response.data.map((user: any) => ({
                userId: user.id,
                username: user.username,
                email: user.email,
                status: user.online,
                lastSeen: user.lastSeen,
              }));
              setUsers(mappedUsers);
            }
          });

          // Send JOIN message
          client.current?.publish({
            destination: '/app/chat.addUser',
            body: JSON.stringify({
              senderId: userId,
              sender: username,
              type: 'JOIN'
            })
          });
        },
        onDisconnect: () => {
          isConnected.current = false;
          setConnected(false);
        },
        onStompError: (error) => {
          console.error('WebSocket error:', error);
          setConnected(false);
        }
      });

      client.current.activate();
    }

    return () => {
      if (client.current?.active) {
        client.current.deactivate();
        isConnected.current = false;
      }
    };
  }, [username, userId]);

  const sendMessage = (content: string, roomId: string) => {
    if (connected && content.trim()) {
      client.current?.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify({
          senderId: userId,
          sender: username,
          content: content,
          type: 'CHAT',
          roomId: roomId
        })
      });
    }
  };

  return {
    messages,
    connected,
    sendMessage,
    users,
    setUsers
  };
};