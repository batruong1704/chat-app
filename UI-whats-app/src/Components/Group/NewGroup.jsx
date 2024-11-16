import React, {useState} from 'react'
import {BsArrowLeft, BsCheck2} from "react-icons/bs";
import {Avatar, Button, CircularProgress} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {currentUser, updateUser} from "../../Redux/Auth/Action";
import {createGroupChat} from "../../Redux/Chat/Action";
import createGroup from "./CreateGroup";

const NewGroup = ({ groupMember, setIsGroup}) => {
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
        let userIds = [];

        for (let user of groupMember) {
            userIds.push(user.id);
        }

        const group = {
            userIds,
            chat_name: groupName,
            chat_image: groupImage
        };

        console.log("Group: ", group);

        const data = {group, token};
        await dispatch(createGroupChat(data));
        setIsGroup(false);
    };
  return (
    <div className="w-full h-full">
      <div className="flex items-center space-x-10 bg-[#008069] text-white pt-16 px-10 pb-5">
        <BsArrowLeft className="cursor-pointer text-2xl font-bold"/>
        <p className="text-xl font-semibold">Nhóm mới</p>
      </div>
      
      <div className="flex flex-col justify-center items-center my-12">
        <label htmlFor="imgInput" className="relative">
          <Avatar
              sx={{width: '15rem', height: '15rem'}}
              alt="Group Icon"
              src = { groupImage || "https://th.bing.com/th/id/OIP.voESzauC2ut4xs_cIFUGfQAAAA?w=474&h=474&rs=1&pid=ImgDetMain" }
              />
          {isImageUploading &&
            <CircularProgress className="absolute top-[5rem] left-[6rem]"/>
          }
        </label>

        <input
            type="file"
            id="imgInput"
            className="hidden"
            onChange={(e) => updateToCloudnary(e.target.files[0])}
        />

      </div>
      <div className="w-full flex justify-between items-center py-2 px-5">
        <input
            type="text"
            className="w-full outline-none border-b-2 border-green-700 px-2 bg-transparent"
            placeholder="Tên nhóm"
            onChange={(e) => setGroupName(e.target.value)}
            value={groupName}
        />
      </div>
        {groupName && (
            <div className="py-10 bg-slate-200 flex items-center justify-center">
                <Button onClick={handleCreateGroup}>
                    <div className="bg-[#0c977d] rounded-full p-4">
                        <BsCheck2 className={"text-white font-bold text-3xl"}/>
                    </div>
                </Button>
            </div>
        )}
    </div>
  )
}

export default NewGroup