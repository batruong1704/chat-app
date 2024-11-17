import React from 'react';
import { useSelector } from 'react-redux';

const TypingMessage = ({ chatId, users }) => {
    const { auth, websocket } = useSelector(store => store);
    const typingStatus = websocket.typingStatus;

    const isTypingInThisChat = typingStatus?.chatId === chatId &&
        typingStatus?.userId !== auth.reqData?.id &&
        typingStatus?.booleanTyping;

    if (!isTypingInThisChat) return null;

    const typingUser = users?.find(user => user.id === typingStatus.userId);

    if (!typingUser) return null;

    return (
        <div className="px-4 py-1 text-sm text-gray-500 italic animate-pulse">
            <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                         style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                         style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                         style={{ animationDelay: '300ms' }} />
                </div>
                <span>
                    {`${typingUser.full_name} đang nhập...`}
                </span>
            </div>
        </div>
    );
};

export default TypingMessage;