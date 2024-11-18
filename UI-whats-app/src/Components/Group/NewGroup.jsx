import React, { useState } from 'react'
import { BsArrowLeft, BsCheck2 } from "react-icons/bs";
import { Avatar, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { currentUser } from "../../Redux/Auth/Action";
import {createChat, createGroupChat} from "../../Redux/Chat/Action";
import {sendNotificationCreateRoom} from "../../Redux/Websocket/Action";
import { motion } from 'framer-motion';


const NewGroup = ({ groupMember, setIsGroup }) => {
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState(null);
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const updateToCloudnary = async (pics) => {
    if (!pics) return;

    try {
      setIsImageUploading(true);
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "whatsapp");
      data.append("cloud_name", "dqnxtg2a0");

      const res = await fetch("https://api.cloudinary.com/v1_1/dqnxtg2a0/image/upload", {
        method: "post",
        body: data
      }).then((res) => res.json())
        .then((data) => {
          setGroupImage(data.url.toString());
        });

      const token = localStorage.getItem("token");
      if (token) {
        await dispatch(currentUser(token));
      }
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setIsImageUploading(false);
    }
  }

  const handleCreateGroup = async () => {
    const creatorId = auth.reqData.id;
    let userIds = [creatorId];
    for (let user of groupMember) {
      userIds.push(user.id);
    }

    const group = {
      userIds,
      chat_name: groupName,
      chat_image: groupImage
    };

    const data = { group, token };
    let newChat;

    if (userIds.length === 2) {
      const chatData = {
        data: { userId: userIds[1] },
        token
      };
      newChat = await dispatch(createChat(chatData));
    } else {
      newChat = await dispatch(createGroupChat(data));
    }

    if (newChat) {
      dispatch(sendNotificationCreateRoom(newChat));
      console.log("[NewGroup] Sent notification for new group:", newChat);
    } else {
      console.error("[NewGroup] Failed to create group");
    }

    setIsGroup(false);
  };

  return (
    <div className="w-full h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg">
        <div className="flex items-center space-x-4 px-6 py-4 max-w-6xl mx-auto">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <BsArrowLeft className="text-2xl" />
          </button>
          <h1 className="text-xl font-medium">Nhóm mới</h1>
        </div>
      </div>

      {/* Group Image Upload */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col items-center">
          <label
            htmlFor="imgInput"
            className="relative cursor-pointer group"
          >
            <div className="relative">
              <Avatar
                sx={{
                  width: '12rem',
                  height: '12rem',
                  fontSize: '3rem',
                  backgroundColor: '#e2e8f0',
                  color: '#64748b',
                  border: '4px solid white',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                alt="Group Icon"
                src={groupImage || "https://cdn2.iconfinder.com/data/icons/unigrid-phantom-multimedia-vol-1/60/020_046_add_image_painting_photo_picture_gallery_album-128.png"}
              />
              {isImageUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                  <CircularProgress size={48} sx={{ color: 'white' }} />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">Thay đổi ảnh nhóm</span>
              </div>
            </div>
          </label>

        <input
            type="file"
            id="imgInput"
            className="hidden"
            onChange={(e) => updateToCloudnary(e.target.files[0])}
          />
        </div>

        {/* Group Name Input */}
        <div className="mt-8">
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            placeholder="Tên nhóm"
            onChange={(e) => setGroupName(e.target.value)}
            value={groupName}
          />
        </div>
      </div>

      {/* Create Button */}
      {groupName && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateGroup}
          className="fixed bottom-8 right-8 bg-emerald-600 hover:bg-emerald-700 text-white
            p-4 rounded-full shadow-2xl transition-all transform
            flex items-center justify-center z-50
            hover:shadow-emerald-500/50"
        >
          <BsCheck2 className="text-3xl" />
        </motion.button>
      )}
    </div>
  );
};

export default NewGroup;