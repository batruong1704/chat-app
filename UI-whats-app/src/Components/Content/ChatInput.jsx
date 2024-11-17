import React, { useState } from 'react';
import { BsEmojiSmile, BsMicFill } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { IoSend } from "react-icons/io5";

const ChatInput = ({ content, setContent, onSendMessage }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
        }
    };

    return (
        <div className="footer bg-white border-t border-gray-200 px-4 py-3">
            <div className="flex items-center space-x-4">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <BsEmojiSmile className="w-6 h-6 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ImAttachment className="w-6 h-6 text-gray-600" />
                </button>

                <div className={`flex-1 relative ${isFocused ? 'ring-2 ring-green-500' : ''}`}>
                    <input
                        className="w-full py-2 px-4 bg-gray-100 rounded-lg outline-none transition-all duration-200 placeholder-gray-500"
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message"
                    />
                </div>

                {content.trim() ? (
                    <button
                        onClick={onSendMessage}
                        className="p-2 bg-green-500 hover:bg-green-600 rounded-full transition-colors"
                    >
                        <IoSend className="w-6 h-6 text-white" />
                    </button>
                ) : (
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <BsMicFill className="w-6 h-6 text-gray-600" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ChatInput;