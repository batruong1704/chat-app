import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DropdownMenu = ({ isOpen, onClose, onProfile, onCreateGroup, onLogout, onSettings }) => {
    const menuItems = [
        { label: 'Profile', onClick: onProfile, color: 'text-blue-600' },
        { label: 'Create Group', onClick: onCreateGroup, color: 'text-green-600' },
        { label: 'Settings', onClick: onSettings, color: 'text-purple-600' }, // Nút Settings mới
        { label: 'Logout', onClick: onLogout, color: 'text-red-600' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        className="absolute top-16 right-4 bg-white rounded-xl shadow-lg py-2 z-50 min-w-[180px]"
                    >
                        {menuItems.map((item, index) => (
                            <motion.button
                                key={item.label}
                                className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-2 ${
                                    index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                                }`}
                                onClick={() => {
                                    item.onClick();
                                    onClose();
                                }}
                                whileHover={{ x: 4 }}
                            >
                                <span className={`font-medium ${item.color}`}>{item.label}</span>
                            </motion.button>
                        ))}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default DropdownMenu;
