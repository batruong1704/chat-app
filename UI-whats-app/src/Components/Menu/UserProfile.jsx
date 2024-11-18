import React from 'react';
import { FaCircle } from "react-icons/fa";
import { motion } from 'framer-motion';

const UserProfile = ({ user, onNavigate }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={onNavigate}
            className="flex items-center space-x-3 p-2 rounded-xl cursor-pointer
                     transition-all duration-200 hover:bg-white/50"
        >
            <div className="relative">
                <motion.img
                    whileHover={{ scale: 1.1 }}
                    className="rounded-full w-12 h-12 object-cover
                             border-2 border-blue-400 p-0.5
                             shadow-lg"
                    src={user?.profile_picture || "https://cdn0.iconfinder.com/data/icons/seo-web-4-1/128/Vigor_User-Avatar-Profile-Photo-01-256.png"}
                    alt={user?.full_name || "User"}
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-0 right-0 bg-white rounded-full p-1"
                >
                    <FaCircle className="w-2 h-2 fill-green-500" />
                </motion.div>
            </div>

            <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">
                    {user?.full_name || "Username"}
                </span>
                <div className="flex items-center text-xs text-gray-500">
                    <span>Active now</span>
                </div>
            </div>
        </motion.div>
    );
};

export default UserProfile;