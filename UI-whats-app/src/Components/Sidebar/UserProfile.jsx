import React from 'react';
import { FaCircle } from "react-icons/fa";

const UserProfile = ({ user, onNavigate }) => {
    return (
        <div onClick={onNavigate} className="flex items-center space-x-2 md:space-x-3">
            <img
                className="rounded-full w-8 md:w-10 h-8 md:h-10 cursor-pointer border-2 border-gray-200"
                src={user?.profile_picture || "https://th.bing.com/th/id/OIP.7WxvjHdbCTiZTaJdLNaZzQHaJi?rs=1&pid=ImgDetMain"}
                alt=""
            />
            <div>
                <p className="text-sm md:text-base font-medium">{user?.full_name || "Username"}</p>
                <div className="flex items-center text-xs text-gray-500">
                    <FaCircle className="fill-green-500 mr-2" />
                    <span>Active now</span>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;