import React, { useState, useEffect } from 'react';
import { User } from '../../types';

const PeopleList: React.FC<{
    users: User[];
    setUsers: (users: User[]) => void;
    onUserSelect: (userId: string) => void
}> = ({
          users, onUserSelect,
      }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    useEffect(() => {
        const newFilteredUsers = users.filter((user) =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (!showOnlineOnly || user.status === 'ONLINE')
        );
        setFilteredUsers(newFilteredUsers);
    }, [users, searchQuery, showOnlineOnly]);

    const onlineCount = users.filter((user) => user.status === 'ONLINE').length;

    return (
        <div className="w-72 bg-white border-r h-screen flex flex-col shadow-lg">
            {/* Header */}
            <div className="p-4 border-b">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Members</h3>
                        <p className="text-sm text-gray-500">{onlineCount} online</p>
                    </div>
                    <button
                        onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm"
                    >
                        {showOnlineOnly ? 'Show All' : 'Show Online'}
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-y-auto">
                {filteredUsers.map((user) => (
                    <div
                        key={user.userId}
                        className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                        onClick={() => onUserSelect(user.userId)}
                    >
                        <div className="relative">
                            <img
                                src={`/api/placeholder/40/40`}
                                alt={user.username}
                                className="w-10 h-10 rounded-full bg-gray-200"
                            />
                            <div
                                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                    user.status === 'ONLINE' ? 'bg-green-500' : 'bg-gray-400'
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
                            {user.status === 'OFFLINE' && user.lastSeen && (
                                <p className="text-xs text-gray-500 mt-0.5">Last seen {user.lastSeen}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PeopleList;