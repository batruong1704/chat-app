import React from 'react';
import { Message } from '../../types';

interface MessageItemProps {
    message: Message;  // Chỉ nhận một message đơn lẻ
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
    const getAvatarColor = (sender: string) => {
        let hash = 0;
        for (let i = 0; i < sender.length; i++) {
            hash = 31 * hash + sender.charCodeAt(i);
        }
        const colors = [
            '#2196F3', '#32c787', '#00BCD4', '#ff5652',
            '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
        ];
        return colors[Math.abs(hash % colors.length)];
    };

    if (message.type === 'JOIN' || message.type === 'LEAVE') {
        return (
            <li className="text-center text-gray-500">
                {message.content}
            </li>
        );
    }

    return (
        <li className="flex items-start space-x-3">
            <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: getAvatarColor(message.sender) }}
            >
                {message.sender[0]}
            </div>
            <div>
                <span className="font-semibold">{message.sender}</span>
                <p className="mt-1">{message.content}</p>
            </div>
        </li>
    );
};

export default MessageItem;