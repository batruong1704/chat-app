import React from 'react';
import { X } from 'lucide-react';
import {AiOutlineClose} from "react-icons/ai";

const SelectedMember = ({ handleRemoveMember, member }) => {
    return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors group">
            <div className="flex items-center gap-2">
                <img
                    className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
                    src={
                        member.profile_picture || "https://th.bing.com/th/id/OIP.voESzauC2ut4xs_cIFUGfQAAAA?w=474&h=474&rs=1&pid=ImgDetMain"
                    }
                    alt="User avatar"
                />
                <span className="text-sm font-medium text-gray-700">{member.full_name}</span>
            </div>

            <AiOutlineClose
                onClick={handleRemoveMember}
                className="pr-1 cursor-pointer"
            />
        </div>
    );
};

export default SelectedMember;