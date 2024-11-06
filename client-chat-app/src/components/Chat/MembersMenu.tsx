import React, { useState, useEffect } from 'react';
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/solid";
import { User } from '../../types';
import { fetchUsers } from '../../utils/api';

interface MembersMenuProps {
    onUserSelect: (userId: string) => void;
}

const MembersMenu: React.FC<MembersMenuProps> = ({ onUserSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const loadUsers = async () => {
            const fetchedUsers = await fetchUsers();
            setUsers(fetchedUsers);
        };
        loadUsers();
    }, []);

    const handleUserSelect = (userId: string) => {
        onUserSelect(userId);
    };

    // Sắp xếp người dùng, ưu tiên người dùng trực tuyến
    const sortedUsers = users.sort((a, b) => (a.isOnline === b.isOnline) ? 0 : a.isOnline ? -1 : 1);

    const filteredUsers = sortedUsers.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!showOnlineOnly || user.isOnline)
    );

    const onlineCount = users.filter((user) => user.isOnline).length;

    return (
        <div className="p-4 flex-1 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h4 className="text-lg font-medium text-gray-800">Thành viên</h4>
                    <p className="text-sm text-gray-500">{onlineCount} trực tuyến</p>
                </div>
                <button
                    onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                    className={`bg-gray-50 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm ${
                        showOnlineOnly ? 'bg-blue-500 text-black !important' : 'bg-blue-500 text-black !important'
                    }`}
                >
                    {showOnlineOnly ? 'Hiện tất cả' : 'Chỉ hiện online'}
                </button>
            </div>
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm thành viên..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <MagnifyingGlassCircleIcon className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <div>
                {filteredUsers.map((user) => (
                    <div
                        key={user.id}
                        onClick={() => handleUserSelect(user.id)}
                        className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                        <div className="relative">
                            <img
                                src={`/api/placeholder/40/40`}
                                alt={user.username}
                                className="w-10 h-10 rounded-full bg-gray-200"
                            />
                            <div
                                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                    user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                                }`}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-medium text-gray-900 truncate">{user.username}</h4>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                            </div>
                            {!user.isOnline && user.lastSeen && (
                                <p className="text-xs text-gray-500 mt-0.5">Trạng thái: {user.lastSeen}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MembersMenu;