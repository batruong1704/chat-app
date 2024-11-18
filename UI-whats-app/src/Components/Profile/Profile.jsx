import React, { useEffect, useState } from 'react';
import { BsArrowLeft, BsCheck2, BsPencil, BsCamera } from "react-icons/bs";
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from "react-redux";
import { updateUser, currentUser } from "../../Redux/Auth/Action";

const Profile = ({ handleCloseOpenProfile }) => {
    const [flag, setFlag] = useState(false);
    const [username, setUsername] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const { auth } = useSelector(store => store);
    const dispatch = useDispatch();

    useEffect(() => {
        if (auth.reqData) {
            setUsername(auth.reqData.full_name || "");
        }
    }, [auth.reqData]);

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
                await dispatch(updateUser(dataImg));
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
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full h-full bg-gray-50"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-6 px-6">
                <div className="flex items-center space-x-4 mb-8">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        onClick={handleCloseOpenProfile}
                    >
                        <BsArrowLeft className="text-2xl" />
                    </motion.button>
                    <h1 className="text-xl font-semibold">Profile</h1>
                </div>

                {/* Profile Picture Section */}
                <div className="flex justify-center -mb-16">
                    <motion.div
                        className="relative"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <label htmlFor="imgInput" className="cursor-pointer">
                            <div className="relative group">
                                <motion.img
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                    src={auth.reqData?.profile_picture || "https://cdn0.iconfinder.com/data/icons/seo-web-4-1/128/Vigor_User-Avatar-Profile-Photo-01-256.png"}
                                    alt="profile"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <BsCamera className="text-white text-2xl" />
                                </div>
                                {isUploading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                        <div className="loading-spinner border-4 border-blue-400 border-t-transparent w-8 h-8 rounded-full animate-spin" />
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
                    </motion.div>
                </div>
            </div>

            {/* Profile Content */}
            <div className="pt-20 px-6">
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                    <div>
                        <label className="text-sm font-medium text-gray-500">Tên của bạn</label>
                        <AnimatePresence mode="wait">
                            {!flag ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex justify-between items-center mt-2"
                                >
                                    <p className="text-lg font-medium text-gray-800">
                                        {auth.reqData?.full_name || "Username"}
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setFlag(true)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <BsPencil className="text-blue-500" />
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center space-x-4 mt-2"
                                >
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && handleUpdateName()}
                                        className="flex-1 px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                                        placeholder="Nhập tên của bạn"
                                        disabled={isUpdating}
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleUpdateName}
                                        disabled={isUpdating}
                                        className="p-2 bg-blue-500 text-white rounded-full disabled:opacity-50"
                                    >
                                        <BsCheck2 className="text-xl" />
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {isUpdating && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm text-blue-500 mt-2"
                            >
                                Đang cập nhật...
                            </motion.p>
                        )}
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Đây không phải là tên đăng nhập, chỉ là tên hiển thị cho người dùng liên hệ với bạn.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;