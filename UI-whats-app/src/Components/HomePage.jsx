import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    connectWebSocket,
    disconnectWebSocket,
    subscribeToChat,
    sendMessage,
    sendNotificationCreateRoom
} from '../Redux/Websocket/Action';
import { currentUser, logoutAction, searchUser } from "../Redux/Auth/Action";
import { createChat, getUserChat } from "../Redux/Chat/Action";
import { getAllMessage } from "../Redux/Message/Action";

// Import components
import SidebarHeader from './Menu/Sidebar/SidebarHeader';
import SearchBar from './Menu/SearchBar';
import ChatHeader from './ChatBox/ChatHeader';
import ChatInput from './ChatBox/ChatInput';
import MessageList from './ChatBox/MessageList';
import WelcomeScreen from './ChatBox/WelcomeScreen';
import CreateGroup from "./Group/CreateGroup";
import Profile from "./Profile/Profile";
import { ChatCard } from "./ChatCard/ChatCard";
import { motion } from 'framer-motion';

export const HomePage = () => {
    // States
    const [querys, setQuerys] = useState('');
    const [currentChat, setCurrentChat] = useState(null);
    const [content, setContent] = useState('');
    const [isProfile, setIsProfile] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isGroup, setIsGroup] = useState(false);
    const messagesEndRef = useRef(null);

    // Redux and Router
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { auth, chat, message } = useSelector(store => store);
    const { connected } = useSelector(state => state.websocket);
    const websocketMessages = useSelector(state => state.websocket.messages);
    const token = localStorage.getItem('token');
    const open = Boolean(anchorEl);

    // Functions
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleClickOnChatCard = async (userId) => {
        const newChat = await dispatch(createChat({ data: { userId }, token }));
        if (newChat) {
            dispatch(sendNotificationCreateRoom(newChat));
            console.log("[handleClickOnChatCard] Sent notification for new chat:", newChat);
        } else {
            console.error("[handleClickOnChatCard] Failed to create chat");
        }
    };
    const handleNavigate = () => setIsProfile(true);
    const handleCloseOpenProfile = () => setIsProfile(false);
    const handleCreateGroup = () => setIsGroup(true);

    const handleSearch = (key) => {
        if (key.trim()) {
            dispatch(searchUser({ key, token }));
        }
    };

    const handleCreateNewMessage = async () => {
        if (!content.trim() || !currentChat?.id) return;

        const currentTime = new Date();
        const messageData = {
            content,
            chatModel: currentChat,
            userModel: auth.reqData,
            timestamp: currentTime.toISOString()
        };

        try {
            await dispatch(sendMessage(messageData));
            setContent('');
            setTimeout(scrollToBottom, 100);
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

    const handleLogout = () => {
        dispatch(logoutAction());
        navigate("/authform");
    };

    const handleQueryChange = (e) => {
        const value = e.target.value;
        setQuerys(value);
        if (value.trim()) {
            handleSearch(value);
        }
    };

    useEffect(() => {
        if (currentChat?.id) {
            const wsMessagesForChat = websocketMessages[currentChat.id] || [];
            const apiMessages = Array.isArray(message.messages) ? message.messages : [];
            const messageIds = new Set();
            const allMessages = [...apiMessages];

            // Nếu có tin nhắn từ websocket, thêm vào cuối mảng
            wsMessagesForChat.forEach(wsMsg => {
                const msgId = wsMsg.id || `${wsMsg.userModel.id}-${wsMsg.timestamp}-${wsMsg.content}`;
                if (!messageIds.has(msgId)) {
                    messageIds.add(msgId);
                    allMessages.push(wsMsg);
                }
            });

            setMessages(allMessages);
            scrollToBottom();
        }
    }, [currentChat?.id, message.messages, websocketMessages]);

    useEffect(() => {
        if (token && !connected) {
            dispatch(connectWebSocket(token, auth.reqData?.id));
        }
        return () => {
            if (connected) {
                dispatch(disconnectWebSocket());
            }
        };
    }, [token, connected, dispatch]);

    useEffect(() => {
        let subscription;
        const setupSubscription = async () => {
            if (connected && currentChat?.id) {
                subscription = await dispatch(subscribeToChat(currentChat.id));
                dispatch(getAllMessage({ token, chatId: currentChat.id }));
            }
        };

        setupSubscription();

        return () => {
            if (subscription && subscription.unsubscribe) {
                subscription.unsubscribe();
            }
        };
    }, [currentChat?.id, connected, dispatch, token]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        dispatch(getUserChat({ token }));
    }, [chat.createdChat, chat.createdGroup, dispatch, token]);

    useEffect(() => {
        dispatch(currentUser(token));
    }, [dispatch, token]);

    useEffect(() => {
        if (chat.createdChat) {
            setCurrentChat(chat.createdChat);
            setQuerys('');
        }
    }, [chat.createdChat]);

    useEffect(() => {
        if (!auth.reqData) {
            navigate("/authform");
        }
    }, [auth.reqData, navigate]);

    return (
        <div className="relative h-screen bg-gradient-to-b from-[#00a884] to-slate-100 overflow-hidden">
            {/* Top banner */}
            <div className="w-full h-20 bg-[#00a884]"/>

            {/* Main container */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex mx-auto mt-[-10px] h-[95vh] w-[98%] shadow-2xl overflow-hidden rounded-xl bg-white"
            >
                {/* Sidebar - điều chỉnh width */}
                <div className="w-[25%] h-full border-r border-gray-200">
                    {isGroup && <CreateGroup setIsGroup={setIsGroup} />}
                    {isProfile && (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="w-full h-full"
                        >
                            <Profile handleCloseOpenProfile={handleCloseOpenProfile} />
                        </motion.div>
                    )}

                    {!isProfile && !isGroup && (
                        <div className="w-full flex flex-col h-full">
                            {/* Header */}
                            <div className="flex-none">
                                <SidebarHeader
                                    user={auth.reqData}
                                    onNavigate={handleNavigate}
                                    onCreateGroup={handleCreateGroup}
                                    onLogout={handleLogout}
                                    anchorEl={anchorEl}
                                    handleClick={handleClick}
                                    handleClose={handleClose}
                                    open={open}
                                />
                            </div>

                            {/* Search section với padding tối ưu */}
                            <div className="flex-none px-2 py-2">
                                <SearchBar
                                    query={querys}
                                    onQueryChange={handleQueryChange}
                                />
                            </div>

                            {/* Chat List  */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="divide-y divide-gray-100">
                                    {querys && auth.searchUser?.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => handleClickOnChatCard(item.id)}
                                            className="cursor-pointer p-2 hover:bg-gray-50"
                                        >
                                            <ChatCard
                                                name={item.full_name}
                                                userImg={item.profile_picture || "https://favpng.com/png_view/user-profile-icon-design-png/d7Kr4Rdm"}
                                                lastMessage={item.lastMessage?.content}
                                                timestamp={item.lastMessage?.timestamp}
                                                unreadCount={item.unreadCount}
                                                isOnline={item.isOnline}
                                                isTyping={item.isTyping}
                                                messageStatus={item.lastMessage?.status}
                                                group = {item.group}
                                                members={item.users}
                                                isNewRoom={item.id === chat.chatId}
                                            />
                                        </motion.div>
                                    ))}

                                    {chat.chats.length > 0 && !querys && chat.chats?.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => handleCurrentChat(item)}
                                            className="cursor-pointer p-2 hover:bg-gray-50"
                                        >
                                            {item.group ? (
                                                <ChatCard
                                                    name={item.chat_name}
                                                    userImg={item.chat_image || "https://favpng.com/png_view/user-profile-icon-design-png/d7Kr4Rdm"}
                                                    lastMessage={item.lastMessage?.content}
                                                    timestamp={item.lastMessage?.timestamp}
                                                    unreadCount={item.unreadCount}
                                                    isOnline={item.isOnline}
                                                    isTyping={item.isTyping}
                                                    messageStatus={item.lastMessage?.status}
                                                    group = {item.group}
                                                    members={item.users}
                                                />
                                            ) : (
                                                <ChatCard
                                                    isChat={true}
                                                    name={auth.reqData?.id !== item.users[0]?.id
                                                        ? item.users[0]?.full_name
                                                        : item.users[1]?.full_name}
                                                    userImg={auth.reqData.id !== item.users[0].id
                                                        ? item.users[0].profile_picture || "/api/placeholder/40/40"
                                                        : item.users[1].profile_picture || "/api/placeholder/40/40"}
                                                />
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Chat Section */}
                {!currentChat ? (
                    <WelcomeScreen />
                ) : (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        className="w-[75%] flex flex-col bg-gray-50"
                    >
                        {/* Chat Header */}
                        <div className="flex-none">
                            <ChatHeader
                                currentChat={currentChat}
                                authUser={auth.reqData}
                            />
                        </div>

                        {/* Message List */}
                        <MessageList
                            messages={messages}
                            authUserId={auth.reqData?.id}
                            messagesEndRef={messagesEndRef}
                            currentChat={currentChat}
                        />

                        {/* Chat Input */}
                        <div className="flex-none">
                            <ChatInput
                                content={content}
                                setContent={setContent}
                                onSendMessage={handleCreateNewMessage}
                                currentChat={currentChat}
                            />
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default HomePage;