import React, { useState } from 'react';
import { format } from 'date-fns';

const MessageCard = ({ isReqUserMessage, content, timestamp, sender, avatar }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
      <div className={`flex gap-3 ${isReqUserMessage ? "self-start" : "self-end flex-row-reverse"}`}>
        {/* Avatar column - only show for received messages */}
        {isReqUserMessage && (
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                    src={avatar || "/api/placeholder/40/40"}
                    alt={sender?.full_name || "User"}
                    className="w-full h-full object-cover"
                />
              </div>
            </div>
        )}

        {/* Message content and metadata */}
        <div className="flex flex-col max-w-[65%]">
          {/* Sender name - only show for received messages */}
          {isReqUserMessage && (
              <span className="text-xs text-gray-600 mb-1 ml-1">
            {sender?.full_name}
          </span>
          )}

          {/* Message bubble with integrated timestamp */}
          <div
              className="group relative cursor-pointer"
              onClick={() => setShowDetails(!showDetails)}
          >
            <div className={`
            relative p-3 rounded-2xl
            ${isReqUserMessage
                ? "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                : "bg-emerald-100 text-gray-900 rounded-tr-none"}
          `}>
              <p className="text-sm leading-relaxed mb-1">{content}</p>

              {/* Timestamp at bottom-right/left of message */}
              <div className={`
              text-[11px] text-gray-400 mt-1
              ${isReqUserMessage ? "text-left" : "text-right"}
            `}>
                {timestamp ? format(new Date(timestamp), 'HH:mm') : ''}
              </div>
            </div>

            {/* Details popup */}
            {showDetails && (
                <div className={`
              absolute bottom-full mb-2 p-3 bg-white rounded-lg shadow-lg z-10 w-64
              ${isReqUserMessage ? "left-0" : "right-0"}
            `}>
                  <div className="flex items-center gap-2 mb-2">
                    <img
                        src={avatar || "/api/placeholder/32/32"}
                        alt={sender?.full_name}
                        className="w-8 h-8 rounded-full"
                    />
                    <span className="font-medium">{sender?.full_name}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Sent at: {timestamp ? format(new Date(timestamp), 'PPpp') : ''}
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default MessageCard;