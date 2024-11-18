import React from 'react';
import { motion } from 'framer-motion';

const ActionButton = ({ icon: Icon, onClick, label }) => (
    <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative p-2 hover:bg-white/10 rounded-full transition-colors group"
        onClick={onClick}
    >
        <Icon className="text-2xl text-white" />
        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {label}
        </span>
    </motion.button>
);

export default ActionButton;
