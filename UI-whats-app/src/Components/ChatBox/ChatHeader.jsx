import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsThreeDotsVertical } from "react-icons/bs";

const ChatHeader = ({ currentChat, authUser }) => {
    const chatUser = currentChat?.users?.find(user => user.id !== authUser?.id);

    return (
        <div className="header w-full bg-white border-b border-gray-200">
            <div className="flex justify-between items-center px-4 py-2">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <img
                            className="rounded-full w-10 h-10 object-cover border-2 border-gray-100"
                            src={chatUser?.profile_picture || "/api/placeholder/40/40"}
                            alt={chatUser?.full_name}
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="font-semibold text-gray-800">{chatUser?.full_name}</h2>
                        <span className="text-xs text-green-500">Online</span>
                    </div>
                </div>
                <div className="flex items-center space-x-6">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <AiOutlineSearch className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <BsThreeDotsVertical className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;