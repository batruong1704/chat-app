import React, { useState, useEffect } from 'react';
import { Check, CheckCheck, Users, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const ChatCard = ({
                           userImg,
                           name,
                           group,
                           members = [],
                           lastMessage,
                           timestamp,
                           unreadCount = 0,
                           isOnline = false,
                           isTyping = false,
                           messageStatus = 'read',
                           isNewRoom = false // New prop to indicate a newly created room
                         }) => {
  const [isHighlighted, setIsHighlighted] = useState(isNewRoom);

  useEffect(() => {
    if (isNewRoom) {
      const timer = setTimeout(() => {
        setIsHighlighted(false);
      }, 5000); // Extended highlight duration to 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isNewRoom]);

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get message status icon
  const getMessageStatus = () => {
    switch (messageStatus) {
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const getMemberCount = () => {
    if (!members.length) return '';
    return `${members.length} members`;
  };

  return (
      <motion.div
          initial={{scale: 1, boxShadow: 'none'}}
          animate={{
              scale: isHighlighted ? [1, 1.05, 1] : 1,
              boxShadow: isHighlighted
                  ? '0 0 15px rgba(16, 185, 129, 0.5)'
                  : 'none',
              backgroundColor: isHighlighted ? '#f0fdf4' : 'transparent'
          }}
          transition={{
              duration: 0.5,
              repeat: isHighlighted ? 3 : 0
          }}
          className={`flex items-center p-3 hover:bg-gray-50/80 transition-all duration-200 cursor-pointer border-b border-gray-100 last:border-none group mx-1 rounded-lg ${
              isHighlighted ? 'ring-2 ring-emerald-300' : ''
          }`}
      >
          {/* Avatar Section */}
          <div className="relative flex-shrink-0">
              {group ? (
                  <div className="relative h-12 w-12">
                      <img
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100 transition-transform group-hover:ring-emerald-100"
                          alt={`${name}'s avatar`}
                          src={userImg || "/api/placeholder/48/48"}
                      />
                      <div className="absolute -bottom-1 -right-1 bg-gray-100 rounded-full p-1">
                          <Users className="h-4 w-4 text-emerald-600"/>
                      </div>
                  </div>
              ) : (
                  <div className="relative">
                      <img
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100 transition-transform group-hover:ring-emerald-100"
                          alt={`${name}'s avatar`}
                          src={userImg || "/api/placeholder/48/48"}
                      />
                      {isOnline && (
                          <span
                              className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white"/>
                      )}
                  </div>
              )}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0 ml-4">
              <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                      <h3 className={`text-sm font-semibold text-gray-900 truncate group-hover:text-emerald-600 ${
                          isHighlighted ? 'text-emerald-700' : ''
                      }`}>
                          {name}
                      </h3>
                      {group && (
                          <span className="text-xs text-gray-500">{getMemberCount()}</span>
                      )}
                  </div>
                  <span className="text-xs text-gray-500 flex items-center gap-1 whitespace-nowrap">
            {getMessageStatus()}
                      {formatTime(timestamp)}
          </span>
              </div>

              <div className="flex justify-between items-center mt-1">
                  {isTyping ? (
                      <p className="text-sm text-emerald-500 font-medium flex items-center gap-1">
                          <span className="animate-pulse">•</span>
                          <span>typing...</span>
                      </p>
                  ) : (
                      <p className={`text-sm truncate ${
                          isHighlighted ? 'text-emerald-600 font-semibold' : 'text-gray-600'
                      }`}>
                          {lastMessage || 'Start a conversation...'}
                      </p>
                  )}

                  {unreadCount > 0 && (
                      <div className="flex items-center ml-2">
              <span
                  className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 text-xs font-medium text-white bg-emerald-500 rounded-full">
                {unreadCount}
              </span>
                      </div>
                  )}
              </div>
          </div>
      </motion.div>
  );
};

export default ChatCard;