import React, { useState, useRef, useEffect } from 'react';
import MessageItem from './MessageItem';
import { useWebSocket } from '../../hooks/useWebSocket';

interface ChatContainerProps {
  username: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ username }) => {
  const [message, setMessage] = useState('');
  const messageAreaRef = useRef<HTMLUListElement>(null);
  const { messages, connected, sendMessage } = useWebSocket(username);

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(message);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="chat-container max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="chat-header bg-blue-500 text-white p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold">Spring WebSocket Chat Demo</h2>
        </div>
        
        {!connected && (
          <div className="p-4 text-gray-600 text-center">
            Đang kết nối...
          </div>
        )}

        <ul
          ref={messageAreaRef}
          className="p-6 space-y-4 h-[500px] overflow-y-auto"
        >
          {messages.map((msg, index) => (
            <MessageItem key={index} message={msg} />
          ))}
        </ul>

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Gửi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatContainer;