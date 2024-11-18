import React from 'react';
import MessageCard from '../MessageCard/MessageCard';
import TypingMessage from './TypingMessage';

const MessageList = ({ messages, authUserId, messagesEndRef, currentChat }) => {
  // Group messages by date
  const groupMessagesByDate = (msgs) => {
    const groups = {};
    msgs.forEach(msg => {
      const date = new Date(msg.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
      <div className="flex-1 overflow-y-auto px-4">
        <div className="space-y-4 flex flex-col justify-end min-h-full py-4">
          {Object.entries(messageGroups).map(([date, msgs]) => (
              <div key={date} className="space-y-3">
                {/* Date separator */}
                <div className="flex items-center justify-center">
                  <div className="bg-gray-200 rounded-full px-3 py-1">
                <span className="text-xs text-gray-600">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                  </div>
                </div>

                {/* Messages for this date */}
                {msgs.map((item, i) => (
                    <MessageCard
                        key={`${item.id}-${i}`}
                        isReqUserMessage={item.userModel.id !== authUserId}
                        content={item.content}
                        timestamp={item.timestamp}
                        sender={item.userModel}
                        avatar={item.userModel.profile_picture}
                    />
                ))}
              </div>
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