import React, { useState, useRef, useEffect } from 'react';
import MessageItem from './MessageItem';
import { useWebSocket } from '../../hooks/useWebSocket';
import RoomList from './RoomList';
import PeopleList from './PeopleList';

interface ChatContainerProps {
  username: string;
  userId: string;
  onLogout: () => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ username, userId, onLogout }) => {
  const [message, setMessage] = useState('');
  const messageAreaRef = useRef<HTMLUListElement>(null);
  const { messages, connected, sendMessage, users, setUsers } = useWebSocket(username, userId);

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleUserSelect = (userId: string) => {
    console.log(`Selected user ID: ${userId}`);
  };

  const usersWithCorrectType: {
    password: string;
    userId: string;
    username: string;
    status: "ONLINE" | "OFFLINE"
  }[] = users.map((user) => ({
    username: user.username,
    password: user.password,
    userId: user.userId, // Thêm thuộc tính userId
    status: user.status,
  }));

  return (
    <div className="flex h-screen bg-white">
      <RoomList
        currentUserId={userId}
        username={username}  // Thêm prop username
        onRoomSelect={(roomId) => console.log(`Selected room ID: ${roomId}`)}
        onCreateRoom={() => console.log('Create room')}
      />
      <PeopleList users={usersWithCorrectType} setUsers={(newUsers: any) => setUsers(newUsers)} onUserSelect={handleUserSelect} />

      <div className="flex-1 flex flex-col">
        <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Chat App</h2>
          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
          >
            Đăng xuất
          </button>
        </div>

        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            {!connected && (
              <div className="p-4 text-gray-600 text-center">
                Đang kết nối...
              </div>
            )}

            <ul ref={messageAreaRef} className="flex-1 p-6 space-y-4 overflow-y-auto">
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
      </div>
    </div>
  );
};

export default ChatContainer;
