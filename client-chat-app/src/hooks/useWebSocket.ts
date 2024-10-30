import { useState, useRef, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client, Message as StompMessage } from '@stomp/stompjs';
import { Message } from '../types';

export const useWebSocket = (username: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const client = useRef<Client | null>(null);

  useEffect(() => {
    // Create WebSocket client
    const socket = new SockJS('http://localhost:8080/ws');
    client.current = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        setConnected(true);
        
        // Subscribe to public topic
        client.current?.subscribe('/topic/public', (message: StompMessage) => {
          const receivedMessage: Message = JSON.parse(message.body);
          setMessages(prev => [...prev, receivedMessage]);
        });

        // Send JOIN message
        client.current?.publish({
          destination: '/app/chat.addUser',
          body: JSON.stringify({
            sender: username,
            type: 'JOIN'
          })
        });
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onStompError: (error) => {
        console.error('WebSocket error:', error);
        setConnected(false);
      }
    });

    // Activate connection
    client.current.activate();

    // Cleanup on unmount
    return () => {
        if (client.current?.active && client.current?.connected) {
          try {
            // Send LEAVE message before disconnecting
            client.current.publish({
              destination: '/app/chat.addUser',
              body: JSON.stringify({
                sender: username,
                type: 'LEAVE'
              })
            });
          } catch (error) {
            console.error('Error sending LEAVE message:', error);
          }
          client.current.deactivate();
        }
      };
  }, [username]);

  const sendMessage = (content: string) => {
    if (connected && content.trim()) {
      client.current?.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify({
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
    sendMessage
  };
};