import React, { useEffect, useState, useRef } from 'react'
import { TbCircleDashed } from "react-icons/tb";
import { BiCommentDetail } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai"
import { BsEmojiSmile, BsMicFill, BsThreeDotsVertical } from "react-icons/bs"
import { ChatCard } from "./ChatCard/ChatCard";
import MessageCard from "./MessageCard/MessageCard";
import { ImAttachment } from "react-icons/im";
import "./HomePage.css"
import { connectWebSocket, disconnectWebSocket, subscribeToChat, sendMessage } from '../Redux/Websocket/Action';
import { useNavigate } from "react-router-dom";
import Profile from "./Profile/Profile";
import { Fade, Menu, MenuItem } from "@mui/material";
import CreateGroup from "./Group/CreateGroup";
import { FaCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { currentUser, logoutAction, searchUser } from "../Redux/Auth/Action";
import { createChat, getUserChat } from "../Redux/Chat/Action";
import { createMessage, getAllMessage } from "../Redux/Message/Action";

export const HomePage = () => {
    const [querys, setQuerys] = useState('');
    const [currentChat, setCurrentChat] = useState(null);
    const [content, setContent] = useState('');
    const [isProfile, setIsProfile] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isGroup, setIsGroup] = useState(false);

    const { auth, chat, message } = useSelector(store => store);
    const { connected, error: wsError } = useSelector(state => state.websocket);
    const websocketMessages = useSelector(state => state.websocket.messages);

    const token = localStorage.getItem('token');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (currentChat?.id) {
            const wsMessagesForChat = websocketMessages[currentChat.id] || [];
            const apiMessages = message.messages || [];
    
            // Tạo một Set để theo dõi các ID tin nhắn đã tồn tại
            const messageIds = new Set();

            // Thêm tin nhắn từ API vào danh sách
            const allMessages = [...apiMessages];

            // Thêm tin nhắn từ WebSocket nếu chưa tồn tại
            wsMessagesForChat.forEach(wsMsg => {
                const msgId = wsMsg.id || `${wsMsg.userModel.id}-${wsMsg.timestamp}-${wsMsg.content}`;
                if (!messageIds.has(msgId)) {
                    messageIds.add(msgId);
                    allMessages.push({
                        ...wsMsg,
                        timestamp: new Date(wsMsg.timestamp).getTime()
                    });
                }
            });

            // Cập nhật state với tin nhắn mới
            setMessages(allMessages);
            scrollToBottom();
        }
    }, [currentChat?.id, message.messages, websocketMessages]);

    useEffect(() => {
        if (token && !connected) {
            console.log("Đang kết nối WebSocket");
            dispatch(connectWebSocket(token));
        }

        return () => {
            if (connected) {
                console.log("Đang ngắt kết nối WebSocket");
                dispatch(disconnectWebSocket());
            }
        };
    }, [token, connected, dispatch]);

    useEffect(() => {
        let subscription;

        if (connected && currentChat?.id) {
            console.log(`Subscribing to chat room: ${currentChat.id}`);

            // Đăng ký nhận tin nhắn cho phòng chat hiện tại
            subscription = dispatch(subscribeToChat(currentChat.id));

            // Lấy lịch sử tin nhắn từ API
            dispatch(getAllMessage({ token, chatId: currentChat.id }));
        }

        return () => {
            if (subscription) {
                console.log(`Unsubscribing from chat room: ${currentChat?.id}`);
                subscription.unsubscribe();
            }
        };
    }, [currentChat?.id, connected, dispatch, token]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickOnChatCard = (userId) => {
        dispatch(createChat({ data: { userId }, token }));
    };

    const handleSearch = (key) => {
        if (key.trim()) {
            dispatch(searchUser({ key, token }));
        }
    }

    const handleCreateNewMessage = async () => {
        if (!content.trim() || !currentChat?.id) return;

        const currentTime = new Date();
        const messageData = {
            content,
            chatModel: currentChat,
            userModel: auth.reqData,
            timestamp: currentTime.toISOString() // Đảm bảo timestamp được set chính xác
        };

        try {
            const sent = dispatch(sendMessage(messageData));

            if (sent) {
                await dispatch(createMessage({
                    token,
                    data: {
                        content,
                        chatId: currentChat.id,
                        timestamp: currentTime.toISOString() // Thêm timestamp vào request
                    }
                }));

                setContent('');
                scrollToBottom();
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleCurrentChat = async (item) => {
        setCurrentChat(item);
        if (item?.id) {
            dispatch(getAllMessage({ token, chatId: item.id }));
        }
    };

    const handleNavigate = () => {
        setIsProfile(true);
    };
    const handleCloseOpenProfile = () => {
        setIsProfile(false);
    };

    const handleCreateGroup = () => {
        setIsGroup(true);
    };

    useEffect(() => {
        dispatch(getUserChat({ token }));
    }, [chat.createdChat, chat.createdGroup, dispatch, token]);

    useEffect(() => {
        dispatch(currentUser(token));
    }, [dispatch, token]);

    const handleLogout = () => {
        dispatch(logoutAction());
        navigate("/signin");
    }

    // Khi tạo tin nhắn mới
    useEffect(() => {
        if (chat.createdChat) {
            setCurrentChat(chat.createdChat);
            setQuerys('');
        }
    }, [chat.createdChat]);

    useEffect(() => {
        if (!auth.reqData) {
            navigate("/signin");
        }
    }, [auth.reqData, navigate]);

    return (
        <div className="relative bg-slate-400 pb-5 h-[100vh]">
            <div className="w-full py-14 bg-[#00a884]"></div>
            <div className="flex bg-[#f0f2f5] mx-4 mt-[-60px] rounded-2xl h-[90vh]">
                <div className=" w-[30%] bg-white h-full rounded-l-2xl overflow-hidden">
                    {/* Profile*/}
                    {isGroup && (
                        <CreateGroup setIsGroup={setIsGroup}/>)
                    }

                    {isProfile && (
                        <div className="w-full h-full">
                            <Profile handleCloseOpenProfile={handleCloseOpenProfile} />
                        </div>)
                    }

                    {/* Menu*/}
                    {!isProfile && !isGroup &&
                        <div className="w-full">
                            {/* Home*/}
                            <div className="shadow-sm">
                                <div className="flex justify-between items-center p-3">
                                    <div onClick={handleNavigate} className="flex items-center space-x-2 md:space-x-3">
                                        <img
                                            className="rounded-full w-8 md:w-10 h-8 md:h-10 cursor-pointer border-2 border-gray-200"
                                            src={auth.reqData?.profile_picture || "https://th.bing.com/th/id/OIP.7WxvjHdbCTiZTaJdLNaZzQHaJi?rs=1&pid=ImgDetMain"}
                                            alt=""
                                        />
                                        <div>
                                            <p className="text-sm md:text-base font-medium">{auth.reqData?.full_name || "Username"}</p>

                                            <div className="flex items-center text-xs text-gray-500">
                                                <FaCircle className="fill-green-500 mr-2" />
                                                <span>Active now</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 md:space-x-4">
                                        <button className="p-2 hover:bg-gray-100 rounded-full">
                                            <TbCircleDashed
                                                onClick={() => navigate("/status")}
                                                className="text-xl md:text-2xl text-gray-600"
                                            />
                                        </button>
                                        <button className="p-2 hover:bg-gray-100 rounded-full">
                                            <BiCommentDetail
                                                id="fade-button"
                                                aria-controls={open ? 'fade-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                                onClick={handleClick}
                                                className="text-xl md:text-2xl text-gray-600"
                                            />
                                        </button>

                                        <Menu
                                            id="fade-menu"
                                            MenuListProps={{ 'aria-labelledby': 'fade-button', }}
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                            TransitionComponent={Fade}>
                                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                                            <MenuItem onClick={handleCreateGroup}>Create Group</MenuItem>
                                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                        </Menu>
                                        <button
                                            className="p-2 hover:bg-gray-100 rounded-full"
                                            onClick={handleClick}
                                        >
                                            <BsThreeDotsVertical className="text-xl md:text-2xl text-gray-600" />
                                        </button>
                                    </div>
                                </div>

                                <div className="px-3 pb-3">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            placeholder="Search or start new chat..."
                                            value={querys}
                                            onChange={(e) => {
                                                setQuerys(e.target.value);
                                                if (e.target.value.trim()) {
                                                    handleSearch(e.target.value);
                                                }
                                            }}
                                        />
                                        <AiOutlineSearch
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                    </div>

                                    {/* All User*/}
                                    <div className="bg-white overflow-y-scroll h-[72.7vh] px-3">
                                        {querys && auth.searchUser?.map((item) => (
                                            <div
                                                onClick={() => {
                                                    console.log("Clicked item:", item);
                                                    handleClickOnChatCard(item.id);
                                                }}
                                            >
                                                <hr />
                                                <ChatCard
                                                    name={item.full_name}
                                                    userImg={
                                                        (() => {
                                                            return item.profile_picture || "https://th.bing.com/th/id/OIP.7WxvjHdbCTiZTaJdLNaZzQHaJi?rs=1&pid=ImgDetMain";
                                                        })()
                                                    }
                                                />
                                            </div>
                                        ))}


                                        {chat.chats.length > 0 && !querys && chat.chats?.map((item) => {
                                            // console.log("Chat item:", item);
                                            return (
                                                <div key={item.id} onClick={() => {
                                                    console.log("Clicked on chat:", item);
                                                    handleCurrentChat(item);
                                                }}>
                                                    <hr />
                                                    {item.group ? (
                                                        <ChatCard
                                                            name={item.chat_name}
                                                            userImg={item.chat_image || "https://cdn1.iconfinder.com/data/icons/mix-color-3/502/Untitled-7-1024.png"}
                                                        />
                                                    ) : (
                                                        <ChatCard
                                                            isChat={true}
                                                            name={
                                                                auth.reqData?.id !== item.users[0]?.id
                                                                    ? item.users[0]?.full_name
                                                                    : item.users[1]?.full_name
                                                            }
                                                            userImg={
                                                                auth.reqData.id !== item.users[0].id
                                                                    ? item.users[0].profile_picture || "https://cdn1.iconfinder.com/data/icons/mix-color-3/502/Untitled-7-1024.png"
                                                                    : item.users[1].profile_picture || "https://cdn1.iconfinder.com/data/icons/mix-color-3/502/Untitled-7-1024.png"
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}

                                    </div>
                                </div>
                            </div>
                        </div>}
                </div>

                <div className="w-[1px] h-full bg-gray-300 shadow-md"></div>
                {/* Chat Box*/}
                {!currentChat && (
                    // console.log("[7] Chat box: Chưa chọn cuộc trò chuyện nào"),
                    <div className="w-full md:w-[70%] flex flex-col items-center justify-center h-full bg-white rounded-r-2xl p-4 md:p-8">
                        <div className="w-full md:max-w-[70%] border-0 text-center flex flex-col items-center justify-center">
                            <img
                                className="transform origin-center w-[200px] md:w-[300px] mb-4 md:mb-6"
                                src="https://img.freepik.com/premium-vector/2d-vector-illustration-colorful-social-media-boost-influence-blogger-emarketer-via-internet-pages_918459-15946.jpg"
                                alt="Page"
                            />
                            <h1 className="text-2xl md:text-4xl text-gray-800 font-bold mb-2 md:mb-4">
                                Chat App
                            </h1>
                            <p className="text-base md:text-lg text-gray-600 w-96">
                                Nhận và gửi tin nhắn từ bạn bè và gia đình. Sử dụng thanh tìm kiếm để tìm bạn để trò
                                chuyện.
                            </p>
                        </div>

                    </div>
                )}

                {currentChat && (
                    // console.log("[8] Chat box: Đang hiển thị chat với ID:", currentChat),
                    <div className="w-[70%] relative bg-blue-200">
                        {/* {HEADER MESSAGE} */}
                        <div className="header absolute top-0 w-full bg-[#f0f2f5]">
                            <div className="flex justify-between">
                                <div className="py-3 space-x-4 flex items-center px-3">
                                    <img
                                        className="rounded-full w-10 h-10"
                                        src={
                                            auth.reqData?.id !== currentChat.users[0].id
                                                ? currentChat.users[0].profile_picture || "https://cdn1.iconfinder.com/data/icons/mix-color-3/502/Untitled-7-1024.png"
                                                : currentChat.users[1].profile_picture || "https://cdn1.iconfinder.com/data/icons/mix-color-3/502/Untitled-7-1024.png"

                                        }
                                        alt="" />
                                    <p>{currentChat && auth.reqData?.id === currentChat.users[0].id ? currentChat.users[1].full_name : currentChat.users[0].full_name}</p>
                                </div>
                                <div className="py-3 flex space-x-4 items-center px-3">
                                    <AiOutlineSearch />
                                    <BsThreeDotsVertical />
                                </div>
                            </div>
                        </div>
                        {/* { MESSAGE} */}
                        <div className="px-10 h-[85vh] overflow-y-scroll">
                            <div className="space-y-1 flex flex-col justify-center mt-20 py-2">
                                {messages.map((item, i) => (
                                    <MessageCard
                                        key={`${item.id}-${i}`}
                                        isReqUserMessage={item.userModel.id !== auth.reqData.id}
                                        content={item.content}
                                    />
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>


                        {/* MESSAGE Footer*/}
                        <div className="footer bg-[#f0f2f5] absolute bottom-0 w-full py-3 text-2xl">
                            <div className="flex justify-between items-center px-5 relative">
                                <BsEmojiSmile className="cursor-pointer"/>
                                <ImAttachment/>
                                <input
                                    className="py-2 outline-none border-none bg-white pl-4 rounded-md w-[85%]"
                                    type="text"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Type a message"
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            handleCreateNewMessage();
                                        }
                                    }}
                                />
                                <BsMicFill/>
                            </div>
                        </div>

                    </div>)}
                {/* Message Section*/}


            </div>
        </div>
    )
}