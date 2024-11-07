// ChatBox.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import MessageItem from './MessageItem';

interface ChatBoxProps {
    roomId: string;
    roomName: string;
    username: string;
    currentUserId: string;
    isRoomLoaded: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({ roomId, roomName, username, currentUserId }) => {
    const [newMessage, setNewMessage] = useState('');
    const messageAreaRef = useRef<HTMLDivElement>(null);
    const { roomData, connected, sendMessage } = useWebSocket(username, currentUserId, roomId);

    useEffect(() => {
        if (messageAreaRef.current) {
            messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
        }
    }, [roomData?.messages]);

    const handleMessageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            sendMessage(newMessage, roomId);
            setNewMessage('');
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full">
            <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">{roomData?.roomName || roomName}</h2>
                {!connected && <span className="text-sm bg-red-600 px-2 py-1 rounded">Disconnected</span>}
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                <div ref={messageAreaRef} className="flex-1 p-6 space-y-4 overflow-y-auto">
                    {roomData?.messages.map((msg) => (
                        <MessageItem
                            key={`${msg.idMessage}-${msg.createdAt}`}
                            message={msg}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
                <form onSubmit={handleMessageSubmit} className="p-4 border-t bg-white flex-shrink-0">
                    <div className="flex gap-2 items-center">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-lg transition duration-200 bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Gửi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatBox;