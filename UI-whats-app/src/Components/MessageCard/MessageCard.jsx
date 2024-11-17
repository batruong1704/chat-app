import React from 'react'

const MessageCard = ({ isReqUserMessage, content }) => {
    return (
        <div
            className={`
        py-3 px-4 rounded-2xl max-w-[65%] shadow-sm
        ${isReqUserMessage
                ? "self-start bg-white text-gray-800"
                : "self-end bg-emerald-100 text-gray-900"}
      `}
        >
            <p className="text-sm leading-relaxed">{content}</p>
        </div>
    );
};

export default MessageCard;