import React from 'react';
import MessageCard from '../MessageCard/MessageCard';
import TypingMessage from '../Content/TypingMessage';

const MessageList = ({ messages, authUserId, messagesEndRef, currentChat }) => {
    return (
        <div className="flex-1 overflow-y-auto px-10">
            <div className="space-y-1 flex flex-col justify-end min-h-full py-2">
                {messages.map((item, i) => (
                    <MessageCard
                        key={`${item.id}-${i}`}
                        isReqUserMessage={item.userModel.id !== authUserId}
                        content={item.content}
                    />
                ))}
                <TypingMessage
                    chatId={currentChat?.id}
                    users={currentChat?.users}
                />
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default MessageList;