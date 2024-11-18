import React from 'react';
import { AiOutlineSearch } from "react-icons/ai";
import { motion } from 'framer-motion';

const SearchBar = ({ query, onQueryChange }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
        >
            <input
                type="text"
                className="w-full py-3 pl-12 pr-4 rounded-xl bg-white/70 backdrop-blur-sm
                         border border-gray-200/50 shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                         text-sm placeholder-gray-400 transition-all duration-200"
                placeholder="Search or start new chat..."
                value={query}
                onChange={onQueryChange}
            />
            <motion.div
                whileHover={{ scale: 1.1 }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
            >
                <AiOutlineSearch className="text-gray-400 text-lg" />
            </motion.div>
        </motion.div>
    );
};

export default SearchBar;