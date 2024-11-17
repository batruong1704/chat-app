import React from 'react';
import { AiOutlineClose } from "react-icons/ai";

const SelectedMember = ({ handleRemoveMember, member }) => {
    return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-emerald-200 rounded-full shadow-sm hover:bg-emerald-50 transition-all group">
            <div className="flex items-center gap-2">
                <img
                    className="w-6 h-6 rounded-full object-cover ring-2 ring-emerald-100"
                    src={member.profile_picture || "https://th.bing.com/th/id/OIP.voESzauC2ut4xs_cIFUGfQAAAA?w=474&h=474&rs=1&pid=ImgDetMain"}
                    alt={`${member.full_name}'s avatar`}
                />
                <span className="text-sm font-medium text-gray-700">{member.full_name}</span>
            </div>
            <button
                onClick={handleRemoveMember}
                className="p-1 hover:bg-emerald-100 rounded-full transition-colors"
            >
                <AiOutlineClose className="w-3 h-3 text-gray-500" />
            </button>
        </div>
    );
};

export default SelectedMember;