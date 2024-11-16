import React, {useEffect, useState} from 'react'
import {BsArrowLeft, BsCheck2, BsPencil} from "react-icons/bs";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {updateUser, currentUser} from "../../Redux/Auth/Action";

const Profile = ({handleCloseOpenProfile}) => {
    const [flag, setFlag] = useState(false);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const [isUploading, setIsUploading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const { auth } = useSelector(store => store);
    const dispatch = useDispatch();

    // Đồng bộ state local với Redux store
    useEffect(() => {
        if (auth.reqData) {
            setUsername(auth.reqData.full_name || "");
        }
    }, [auth.reqData]);

    const handleFlag = () => {
        setFlag(true);
    }

    const handleChange = (e) => {
        setUsername(e.target.value);
    }

    // Xử lý cập nhật tên
    const handleUpdateName = async () => {
        if (!username.trim()) return;

        try {
            setIsUpdating(true);
            const data = {
                id: auth.reqData?.id,
                token: localStorage.getItem("token"),
                data: { full_name: username.trim() }
            };

            await dispatch(updateUser(data));
            const token = localStorage.getItem("token");
            if (token) {
                await dispatch(currentUser(token));
            }

            setFlag(false);
        } catch (error) {
            console.error("Error updating name:", error);
        } finally {
            setIsUpdating(false);
        }
    }

    const handleCheckClick = () => {
        handleUpdateName();
    }

    // Xử lý nhấn Enter khi nhập tên
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleUpdateName();
        }
    }

    // Xử lý upload ảnh
    const updateToCloudnary = async (pics) => {
        if (!pics) return;

        try {
            setIsUploading(true);
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "whatsapp");
            data.append("cloud_name", "dqnxtg2a0");

            const res = await fetch("https://api.cloudinary.com/v1_1/dqnxtg2a0/image/upload", {
                method: "post",
                body: data
            });

            const imageData = await res.json();

            if (imageData.url) {
                const dataImg = {
                    id: auth.reqData?.id,
                    token: localStorage.getItem("token"),
                    data: { profile_picture: imageData.url.toString() }
                };

                // Đợi cập nhật hoàn tất
                await dispatch(updateUser(dataImg));

                // Fetch lại thông tin user
                const token = localStorage.getItem("token");
                if (token) {
                    await dispatch(currentUser(token));
                }
            }
        } catch (err) {
            console.error("Error uploading image:", err);
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="w-full h-full">
            <div className="flex items-center space-x-10 bg-[#008069] text-white pt-16 px-10 pb-5">
                <BsArrowLeft
                    className={"cursor-pointer text-2xl font-bold"}
                    onClick={handleCloseOpenProfile}
                />
                <p className="cursor-pointer font-semibold">Profile</p>
            </div>

            <div className="flex flex-col justify-center items-center my-12">
                <label htmlFor="imgInput">
                    <div className="relative">
                        <img
                            className="rounded-full w-[15vw] h-[15vw] cursor-pointer"
                            src={auth.reqData?.profile_picture || "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"}
                            alt="avatar"
                        />
                        {isUploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                                <p className="text-white">Đang tải lên...</p>
                            </div>
                        )}
                    </div>
                </label>
                <input
                    onChange={(e) => updateToCloudnary(e.target.files[0])}
                    type="file"
                    id="imgInput"
                    accept="image/*"
                    className="hidden"
                />
            </div>

            <div className="bg-while px-3">
                <p className="py-3">Tên của bạn</p>
                {!flag && (
                    <div className="w-full flex justify-between items-center">
                        <p className="py-3">{auth.reqData?.full_name || "username"}</p>
                        <BsPencil onClick={handleFlag} className="cursor-pointer"/>
                    </div>
                )}
                {flag && (
                    <div className="w-full flex justify-between items-center py-2">
                        <input
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                            className="w-[80%] outline-none border-b-2 border-blue-700"
                            type="text"
                            placeholder="Nhập tên của bạn!"
                            value={username}
                            disabled={isUpdating}
                        />
                        <BsCheck2
                            onClick={handleCheckClick}
                            className={`cursor-pointer text-2xl ${isUpdating ? 'opacity-50' : ''}`}
                        />
                    </div>
                )}
                {isUpdating && (
                    <p className="text-sm text-gray-500 mt-1">Đang cập nhật...</p>
                )}
            </div>

            <div className="px-3 my-5">
                <p className="py-10">
                    Đây không phải là tên đăng nhập, chỉ là tên hiển thị cho người dùng liên hệ với bạn.
                </p>
            </div>
        </div>
    );
}

export default Profile