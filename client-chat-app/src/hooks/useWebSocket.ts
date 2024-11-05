import { useState, useRef, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client, Message as StompMessage } from '@stomp/stompjs';
import { Message, User } from '../types';

export const useWebSocket = (username: string, userId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
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
          userId: userId
        },
        onConnect: () => {
          isConnected.current = true;
          setConnected(true);

          // Subscribe to public topic
          client.current?.subscribe('/topic/public', (message: StompMessage) => {
            const newMessage = JSON.parse(message.body) as Message;
            setMessages(prev => [...prev, newMessage]);
          });

          // Subscribe to user status updates
          client.current?.subscribe('/topic/user-status', (message: StompMessage) => {
            const userStatus = JSON.parse(message.body);
            setUsers(prevUsers => {
              const userIndex = prevUsers.findIndex(u => u.userId === userStatus.id);
              if (userIndex === -1) {
                const newUser: User = {
                  userId: userStatus.id,
                  username: userStatus.username,
                  status: userStatus.isOnline ? 'ONLINE' : 'OFFLINE',
                  email: '',
                  lastSeen: userStatus.lastSeen
                };
                return [...prevUsers, newUser];
              }

              const updatedUsers = [...prevUsers];
              updatedUsers[userIndex] = {
                ...updatedUsers[userIndex],
                status: userStatus.isOnline ? 'ONLINE' : 'OFFLINE',
                lastSeen: userStatus.lastSeen
              };
              return updatedUsers;
            });
          });

          client.current?.subscribe('/topic/users', (message: StompMessage) => {
            const response = JSON.parse(message.body);
            if (response.success && Array.isArray(response.data)) {
              console.log('Users: ', response.data);
              const mappedUsers: User[] = response.data.map((user: any) => ({
                userId: user.id,
                username: user.username,
                email: user.email,
                status: user.online ? 'ONLINE' : 'OFFLINE',
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

  const sendMessage = (content: string) => {
    if (connected && content.trim()) {
      client.current?.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify({
          senderId: userId,
          sender: username,
          content: content,
          type: 'CHAT'
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