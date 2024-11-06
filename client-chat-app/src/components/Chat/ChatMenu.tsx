// ChatMenu.tsx
import React, { useState, useEffect } from 'react';
import { PlusIcon, UserGroupIcon, LockClosedIcon, ChatBubbleLeftIcon, MagnifyingGlassCircleIcon } from '@heroicons/react/24/solid';
import { Room, RoomType } from '../../types';
import { fetchPublicRoom, fetchRoomsByUserId } from '../../utils/api';

interface ChatMenuProps {
    onRoomSelect: (room: Room) => void;
    onCreateRoom: () => void;
    activeRoomId?: string;
}

const ChatMenu: React.FC<ChatMenuProps> = ({ onRoomSelect, onCreateRoom, activeRoomId }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        const loadRooms = async () => {
            const publicRoom = await fetchPublicRoom();
            const userRooms = await fetchRoomsByUserId('ec46e624-9735-11ef-8682-0242ac140002');
            setRooms([...(publicRoom ? [publicRoom] : []), ...userRooms]);
        };
        loadRooms();
    }, []);

    const handleRoomSelect = (room: Room) => {
        onRoomSelect(room);
    };

    const filteredRooms = rooms.filter((room) =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-4 flex-1 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h4 className="text-lg font-medium text-gray-800">Phòng chat</h4>
                    <p className="text-sm text-gray-500">Tất cả {rooms.length} phòng</p>
                </div>
                <button onClick={onCreateRoom} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200">
                    <PlusIcon className="h-5 w-5 inline-block" /> Tạo phòng
                </button>
            </div>
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm phòng..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <MagnifyingGlassCircleIcon className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <div>
                {filteredRooms.map((room) => (
                    <div
                        key={room.id}
                        onClick={() => handleRoomSelect(room)}
                        className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors group
                            ${activeRoomId === room.id ? 'bg-blue-50' : ''}`}
                    >
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                room.type === RoomType.PUBLIC
                                    ? 'bg-blue-500'
                                    : room.type === RoomType.GROUP
                                        ? 'bg-green-500'
                                        : 'bg-purple-500'
                            }`}
                        >
                            {room.type === RoomType.PUBLIC ? (
                                <ChatBubbleLeftIcon className="h-5 w-5 text-white" />
                            ) : room.type === RoomType.GROUP ? (
                                <UserGroupIcon className="h-5 w-5 text-white" />
                            ) : (
                                <LockClosedIcon className="h-5 w-5 text-white" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{room.name}</h4>
                            <p className="text-sm text-gray-500">
                                {new Date(room.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatMenu;