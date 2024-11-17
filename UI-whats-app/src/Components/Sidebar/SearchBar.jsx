import React from 'react';
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar = ({ query, onQueryChange }) => {
    return (
        <div className="relative">
            <input
                type="text"
                className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Search or start new chat..."
                value={query}
                onChange={onQueryChange}
            />
            <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
    );
};

export default SearchBar;