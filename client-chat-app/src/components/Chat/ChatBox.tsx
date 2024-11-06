import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { Message } from '../../types';
import MessageItem from './MessageItem';
import { PaperClipIcon, VideoCameraIcon } from '@heroicons/react/24/solid';

interface ChatBoxProps {
    roomId: string;
    roomName: string;
    username: string;
    currentUserId: string;
    messages: Message[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ roomId, roomName, username, currentUserId, messages: initialMessages }) => {
    const [newMessage, setNewMessage] = useState('');
    const messageAreaRef = useRef<HTMLDivElement>(null);
    const { messages, connected, sendMessage } = useWebSocket(username, currentUserId, roomId);
    const [allMessages, setAllMessages] = useState<Message[]>(initialMessages);

    useEffect(() => {
        setAllMessages(initialMessages);
    }, [initialMessages, roomId]);

    useEffect(() => {
        if (messageAreaRef.current) {
            messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
        }
    }, [allMessages]);

    const handleMessageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            sendMessage(newMessage, roomId);
            setNewMessage('');
            console.log('Message sent:', newMessage, roomId);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full">
            <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">{roomName}</h2>
                <button
                    onClick={() => console.log('Profile settings')}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                >
                    Profile
                </button>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                {!connected && (
                    <div className="p-4 text-gray-600 text-center">Đang kết nối...</div>
                )}
                <div ref={messageAreaRef} className="flex-1 p-6 space-y-4 overflow-y-auto">
                    {allMessages.map((msg: Message) => (
                        <MessageItem
                            key={msg.id}
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
                        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200">
                            Gửi
                        </button>
                        <button className="text-gray-500 hover:text-gray-600 transition duration-200">
                            <VideoCameraIcon className="h-6 w-6" />
                        </button>
                        <button className="text-gray-500 hover:text-gray-600 transition duration-200">
                            <PaperClipIcon className="h-6 w-6" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatBox;