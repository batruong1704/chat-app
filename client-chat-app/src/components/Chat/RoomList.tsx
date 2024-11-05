import React, { useState, useEffect } from 'react';
import { Search, Plus, MessageCircle, Users, Lock } from 'lucide-react';
import axios from 'axios';

enum RoomType {
  PUBLIC = 'PUBLIC',
  GROUP = 'GROUP',
  PRIVATE = 'PRIVATE'
}

interface Room {
  id: string;
  name: string;
  type: RoomType;
  createdAt: string;
}

interface ResponseObject {
  success: boolean;
  message: string;
  data: Room[];
}

interface RoomListProps {
  currentUserId: string;
  onRoomSelect: (roomId: string) => void;
  onCreateRoom: () => void;
  username: string;
}

const RoomList: React.FC<RoomListProps> = ({ onRoomSelect, onCreateRoom, username }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to fetch rooms by username
  const fetchRoomsByUsername = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get<ResponseObject>(
        `http://localhost:8080/api/roomMember/findRoomByUsername`, {
          params: { username }
        }
      );

      if (response.data.success) {
        setRooms(response.data.data);
      } else {
        setError(response.data.message || 'Không thể tải danh sách phòng chat');
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Lỗi khi tải danh sách phòng chat');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch all rooms
  const fetchAllRooms = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get<ResponseObject>(
        'http://localhost:8080/api/room/getAll'
      );

      if (response.data.success) {
        setRooms(response.data.data);
      } else {
        setError(response.data.message || 'Không thể tải danh sách phòng chat');
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Lỗi khi tải danh sách phòng chat');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch public rooms
  const fetchPublicRooms = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get<ResponseObject>(
        'http://localhost:8080/api/room/getPublicRoom'
      );

      if (response.data.success) {
        setRooms(response.data.data);
      } else {
        setError(response.data.message || 'Không thể tải danh sách phòng công khai');
      }
    } catch (err) {
      console.error('Error fetching public rooms:', err);
      setError('Lỗi khi tải danh sách phòng công khai');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchRoomsByUsername();
    }
  }, [username]);

  const getRoomIcon = (type: RoomType) => {
    switch (type) {
      case RoomType.PUBLIC:
        return <MessageCircle className="h-5 w-5 text-white" />;
      case RoomType.GROUP:
        return <Users className="h-5 w-5 text-white" />;
      case RoomType.PRIVATE:
        return <Lock className="h-5 w-5 text-white" />;
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-72 bg-white border-r h-screen flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Phòng chat</h3>
            <p className="text-sm text-gray-500">
              {rooms.length} phòng
            </p>
          </div>
          <button
            onClick={onCreateRoom}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Plus className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm phòng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-full text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        {/* Room Type Filters */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={fetchRoomsByUsername}
            className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                     transition-colors text-sm"
          >
            My Rooms
          </button>
          <button
            onClick={fetchPublicRooms}
            className="flex-1 py-2 px-3 bg-green-500 text-white rounded-lg hover:bg-green-600
                     transition-colors text-sm"
          >
            Public
          </button>
        </div>
      </div>

      {/* Rooms List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="text-center p-4 text-gray-500">Đang tải...</div>
        ) : error ? (
          <div className="text-center p-4 text-red-500">{error}</div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center p-4 text-gray-500">Không tìm thấy phòng nào</div>
        ) : (
          <>
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => onRoomSelect(room.id)}
                className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center
                             ${room.type === RoomType.PUBLIC ? 'bg-blue-500' :
                    room.type === RoomType.GROUP ? 'bg-green-500' :
                      'bg-purple-500'}`}>
                  {getRoomIcon(room.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {room.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(room.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default RoomList;