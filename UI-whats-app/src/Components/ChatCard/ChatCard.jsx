import React from 'react';

export const ChatCard = ( {userImg, name} ) => {
    return (
        <div className="flex items-center p-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-none">
            <div className="flex-shrink-0">
                <img
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100"
                    alt="User avatar"
                    src={ userImg || "https://cdn1.iconfinder.com/data/icons/mix-color-3/502/Untitled-7-1024.png"}
                />
            </div>

            <div className="flex-1 min-w-0 ml-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{name}</h3>
                    <span className="text-xs text-gray-500">timestamp</span>
                </div>

                <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-gray-600 truncate">message...</p>

                    <div className="flex items-center ml-2">
            <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 text-xs font-medium text-white bg-emerald-500 rounded-full">
              4
            </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatCard;