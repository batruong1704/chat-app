import React from 'react';
import MessageCard from '../MessageCard/MessageCard';

const MessageList = ({ messages, authUserId, messagesEndRef }) => {
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
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default MessageList;