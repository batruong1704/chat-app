// SidebarHeader.jsx
import React, { useState } from 'react';
import { TbCircleDashed } from "react-icons/tb";
import { BiCommentDetail } from "react-icons/bi";
import UserProfile from "../UserProfile";
import { useNavigate } from "react-router-dom";
import ActionButton from './ActionButton';
import DropdownMenu from './DropdownMenu';

const SidebarHeader = ({ user, onNavigate, onCreateGroup, onLogout }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleSettings = () => {
        console.log("Navigating to Settings...");
        navigate('/');
    };

    return (
        <div className="relative flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-blue-400">
            {/* Hiển thị UserProfile trên màn hình lớn, ẩn trên thiết bị di động và tablet */}
            <div className="hidden md:block">
                <UserProfile user={user} onNavigate={onNavigate} />
            </div>

            {/* Hiển thị nút Menu trên iPad và smartphone */}
            <div className="flex md:hidden items-center">
                <ActionButton
                    icon={BiCommentDetail}
                    onClick={() => setIsMenuOpen(true)}
                    label="Menu"
                />
            </div>

            <div className="hidden md:flex items-center space-x-2 ml-auto">
                <ActionButton
                    icon={TbCircleDashed}
                    onClick={() => navigate("/status")}
                    label="Status"
                />
                <ActionButton
                    icon={BiCommentDetail}
                    onClick={() => setIsMenuOpen(true)}
                    label="Menu"
                />
            </div>

            {/* Dropdown Menu */}
            <DropdownMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                onProfile={onNavigate}
                onSettings={handleSettings}
                onCreateGroup={onCreateGroup}
                onLogout={onLogout}
            />
        </div>
    );
};

export default SidebarHeader;
