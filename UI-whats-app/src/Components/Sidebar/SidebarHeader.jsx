import React from 'react';
import { TbCircleDashed } from "react-icons/tb";
import { BiCommentDetail } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Menu, MenuItem, Fade } from "@mui/material";
import UserProfile from "./UserProfile";

const SidebarHeader = ({
                           user,
                           onNavigate,
                           onCreateGroup,
                           onLogout,
                           anchorEl,
                           handleClick,
                           handleClose,
                           open
                       }) => {
    return (
        <div className="flex justify-between items-center p-3">
            <UserProfile user={user} onNavigate={onNavigate} />

            <div className="flex items-center space-x-2 md:space-x-4">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                    <TbCircleDashed className="text-xl md:text-2xl text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                    <BiCommentDetail
                        onClick={handleClick}
                        className="text-xl md:text-2xl text-gray-600"
                    />
                </button>

                <Menu
                    id="fade-menu"
                    MenuListProps={{ 'aria-labelledby': 'fade-button' }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={onCreateGroup}>Create Group</MenuItem>
                    <MenuItem onClick={onLogout}>Logout</MenuItem>
                </Menu>

                <button className="p-2 hover:bg-gray-100 rounded-full" onClick={handleClick}>
                    <BsThreeDotsVertical className="text-xl md:text-2xl text-gray-600" />
                </button>
            </div>
        </div>
    );
};

export default SidebarHeader;