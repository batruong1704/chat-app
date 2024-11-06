import React, { useState, useEffect } from 'react';
import ChatMenu from './ChatMenu';
import MembersMenu from './MembersMenu';
import ChatBox from './ChatBox';
import { Room, Message } from '../../types';
import { fetchPublicRoom, fetchMessagesByRoomId } from '../../utils/api';

interface ChatAppProps {
    username: string;
    currentUserId: string;
    onLogout: () => void;
}

const ChatApp: React.FC<ChatAppProps> = ({ username, currentUserId }) => {
    const [activeTab, setActiveTab] = useState<'chat' | 'members'>('chat');
    const [activeRoom, setActiveRoom] = useState<Room | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const initializeDefaultRoom = async () => {
            try {
                const publicRoom = await fetchPublicRoom();
                if (publicRoom) {
                    setActiveRoom(publicRoom);
                    const messages = await fetchMessagesByRoomId(publicRoom.id);
                    setMessages(messages);
                }
            } catch (error) {
                console.error('Failed to fetch public room:', error);
            }
        };

        initializeDefaultRoom();
    }, []);


    const handleRoomSelect = async (room: Room) => {
        setActiveRoom(room);
        try {
            const messages = await fetchMessagesByRoomId(room.id);
            setMessages(messages);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };
    const handleCreateRoom = () => {
        // handle creating a new room
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Menu */}
            <div className="bg-white border-r w-72 flex flex-col">
                <div className="p-4 border-b">
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`flex-1 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors text-sm ${activeTab === 'chat' ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-600'}`}
                        >
                            Hộp thoại
                        </button>
                        <button
                            onClick={() => setActiveTab('members')}
                            className={`flex-1 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors text-sm ${activeTab === 'members' ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-600'}`}
                        >
                            Thành viên
                        </button>
                    </div>
                </div>

                {activeTab === 'chat' && (
                    <ChatMenu
                        onRoomSelect={handleRoomSelect}
                        onCreateRoom={handleCreateRoom}
                        activeRoomId={activeRoom?.id}
                    />
                )}
                {activeTab === 'members' && (
                    <MembersMenu
                        onRoomSelect={handleRoomSelect}
                        activeRoomId={activeRoom?.id}
                    />
                )}
            </div>

            {/* Chat Box */}
            {activeRoom && (
                <ChatBox
                    roomId={activeRoom.id}
                    roomName={activeRoom.name}
                    username={username}
                    currentUserId={currentUserId}
                    messages={messages}
                />
            )}
        </div>
    );
};

export default ChatApp;