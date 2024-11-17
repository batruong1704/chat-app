import React, { useState } from 'react'
import { BsArrowLeft, BsCheck2 } from "react-icons/bs";
import { Avatar, Button, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { currentUser } from "../../Redux/Auth/Action";
import { createGroupChat } from "../../Redux/Chat/Action";

const NewGroup = ({ groupMember, setIsGroup }) => {
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState(null);
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();

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
    let userIds = [];
    for (let user of groupMember) {
      userIds.push(user.id);
    }

    const group = {
      userIds,
      chat_name: groupName,
      chat_image: groupImage
    };

    const data = { group, token };
    await dispatch(createGroupChat(data));
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
                src={groupImage || "https://th.bing.com/th/id/OIP.voESzauC2ut4xs_cIFUGfQAAAA?w=474&h=474&rs=1&pid=ImgDetMain"}
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
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-6xl mx-auto flex justify-center">
            <Button
              onClick={handleCreateGroup}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-105"
            >
              <BsCheck2 className="text-3xl" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewGroup;