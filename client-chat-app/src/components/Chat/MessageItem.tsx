import React from 'react';
import { Message } from '../../types';
import { UserPlusIcon, UserMinusIcon } from '@heroicons/react/24/solid';

interface MessageItemProps {
    message: Message;
    currentUserId: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, currentUserId }) => {
    const username = message?.senderName || 'Someone';

    const getAvatarColor = (username: string) => {
        if (!username) return '#2196F3';

        let hash = 0;
        for (let i = 0; i < username.length; i++) {
            hash = 31 * hash + username.charCodeAt(i);
        }
        const colors = [
            '#2196F3', '#32c787', '#00BCD4', '#ff5652',
            '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
        ];
        return colors[Math.abs(hash % colors.length)];
    };

    // Log the message object to check its properties
    console.log('Message object:', message);

    // Handle system messages (JOIN/LEAVE)
    if (message?.type === 'JOIN' || message?.type === 'LEAVE') {
        return (
            <div className="flex items-center justify-center my-4">
                <div className="bg-gray-50 rounded-full px-4 py-2 flex items-center space-x-2 shadow-sm">
                    {message.type === 'JOIN' ? (
                        <UserPlusIcon className="h-4 w-4 text-green-500" />
                    ) : (
                        <UserMinusIcon className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${
                        message.type === 'JOIN' ? 'text-green-600' : 'text-red-600'
                    }`}>
                        <span className="font-medium">{username}</span>
                        {message.type === 'JOIN' ? ' đã tham gia cuộc trò chuyện' : ' đã rời khỏi cuộc trò chuyện'}
                    </span>
                </div>
            </div>
        );
    }

    // Return null if no content or message is undefined
    if (!message?.content || !message.content.trim()) {
        return null;
    }

    const isCurrentUser = message.senderId === currentUserId;
    const firstLetter = username.charAt(0).toUpperCase();

    return (
        <li className="flex items-start space-x-3 mb-4">
            <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: getAvatarColor(username) }}
            >
                {firstLetter || '?'}
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="flex items-baseline space-x-2">
                    <span className="font-semibold text-gray-900">
                        {isCurrentUser ? 'You' : username}
                    </span>
                    <span className="text-xs text-gray-500">
                        {new Date(message.createdAt || Date.now()).toLocaleTimeString()}
                    </span>
                </div>
                <p className="mt-1 text-gray-800 break-words">{message.content}</p>
            </div>
        </li>
    );
};

export default MessageItem;