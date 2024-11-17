import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, Heart } from 'lucide-react';

const WelcomeScreen = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-[70%] flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-blue-50 rounded-r-2xl p-6 md:p-12"
        >
            <div className="w-full md:max-w-[70%] text-center flex flex-col items-center justify-center space-y-8">
                <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-[200px] md:w-[300px] drop-shadow-xl"
                    src="/api/placeholder/300/300"
                    alt="Welcome illustration"
                />

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4">
                    <h1 className="text-3xl md:text-5xl text-gray-800 font-bold tracking-tight">
                        Chat App
                    </h1>
                    <p className="text-base md:text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                        Nhận và gửi tin nhắn từ bạn bè và gia đình. Sử dụng thanh tìm kiếm để tìm bạn để trò chuyện.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl mt-8"
                >
                    {[
                        {
                            icon: <MessageSquare className="w-6 h-6" />,
                            title: "Trò chuyện",
                            description: "Gửi tin nhắn nhanh chóng"
                        },
                        {
                            icon: <Search className="w-6 h-6" />,
                            title: "Tìm kiếm",
                            description: "Dễ dàng tìm bạn bè"
                        },
                        {
                            icon: <Heart className="w-6 h-6" />,
                            title: "Kết nối",
                            description: "Luôn gắn kết với người thân"
                        }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="flex flex-col items-center p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="p-3 bg-blue-100 rounded-full text-blue-600 mb-3">
                                {feature.icon}
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-1">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-gray-600 text-center">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default WelcomeScreen;