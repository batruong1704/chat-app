-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: db:3306
-- Thời gian đã tạo: Th10 31, 2024 lúc 09:06 AM
-- Phiên bản máy phục vụ: 8.0.38
-- Phiên bản PHP: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `chat_app`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chat_rooms`
--

CREATE TABLE `chat_rooms` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('PUBLIC','GROUP','PRIVATE') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `chat_rooms`
--

INSERT INTO `chat_rooms` (`id`, `name`, `type`, `created_at`) VALUES
('cb6e6cb1-975f-11ef-8682-0242ac140002', 'Chat Tổng', 'PUBLIC', '2024-10-31 08:11:56');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `messages`
--

CREATE TABLE `messages` (
  `id` char(36) NOT NULL,
  `room_id` char(36) NOT NULL,
  `sender_id` char(36) NOT NULL,
  `content` text NOT NULL,
  `message_type` enum('CHAT','JOIN','LEAVE') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `messages`
--

INSERT INTO `messages` (`id`, `room_id`, `sender_id`, `content`, `message_type`, `created_at`) VALUES
('04536c20-4fee-4c07-a8de-f4367b45f413', 'cb6e6cb1-975f-11ef-8682-0242ac140002', '65633435-6266-3165-2d39-3733352d3131', 'hello', 'CHAT', '2024-10-31 15:35:06'),
('2daee537-849f-49e3-93c5-0be197b68026', 'cb6e6cb1-975f-11ef-8682-0242ac140002', 'ec46e624-9735-11ef-8682-0242ac140002', 'hi', 'CHAT', '2024-10-31 15:35:08'),
('312b25b0-48e6-4f04-939a-f23412ca5052', 'cb6e6cb1-975f-11ef-8682-0242ac140002', '65633435-6266-3165-2d39-3733352d3131', 'hello', 'CHAT', '2024-10-31 15:35:17'),
('60b9f75b-b7cb-4fa8-a5f2-4795129fd22a', 'cb6e6cb1-975f-11ef-8682-0242ac140002', 'ec46e624-9735-11ef-8682-0242ac140002', 'hi', 'CHAT', '2024-10-31 15:35:15'),
('749ea380-4813-46c4-972a-52e7e3bdc718', 'cb6e6cb1-975f-11ef-8682-0242ac140002', 'ec46e624-9735-11ef-8682-0242ac140002', '', 'LEAVE', '2024-10-31 16:05:25'),
('b5f3ea58-6b0a-4094-8fdd-da97d7c45146', 'cb6e6cb1-975f-11ef-8682-0242ac140002', 'ec46e624-9735-11ef-8682-0242ac140002', 'hi', 'CHAT', '2024-10-31 15:57:31');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `room_members`
--

CREATE TABLE `room_members` (
  `id` char(36) NOT NULL,
  `room_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `is_online` tinyint(1) DEFAULT '0',
  `last_seen` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `avatar_url`, `is_online`, `last_seen`, `created_at`, `updated_at`) VALUES
('65633435-6266-3165-2d39-3733352d3131', 'user1', 'user1@example.com', 'user1', NULL, 1, NULL, '2024-10-31 03:12:12', '2024-10-31 07:43:53'),
('ec46d79f-9735-11ef-8682-0242ac140002', 'user2', 'user2@example.com', 'user2', NULL, 0, NULL, '2024-10-31 03:12:12', '2024-10-31 03:12:12'),
('ec46df77-9735-11ef-8682-0242ac140002', 'user3', 'user3@example.com', 'user3', NULL, 0, NULL, '2024-10-31 03:12:12', '2024-10-31 03:12:12'),
('ec46e34b-9735-11ef-8682-0242ac140002', 'user4', 'user4@example.com', 'user4', NULL, 0, NULL, '2024-10-31 03:12:12', '2024-10-31 03:12:12'),
('ec46e41d-9735-11ef-8682-0242ac140002', 'user5', 'user5@example.com', 'user5', NULL, 0, NULL, '2024-10-31 03:12:12', '2024-10-31 03:12:12'),
('ec46e495-9735-11ef-8682-0242ac140002', 'user6', 'user6@example.com', 'user6', NULL, 0, NULL, '2024-10-31 03:12:12', '2024-10-31 03:12:12'),
('ec46e4fd-9735-11ef-8682-0242ac140002', 'user7', 'user7@example.com', 'user7', NULL, 0, NULL, '2024-10-31 03:12:12', '2024-10-31 03:12:12'),
('ec46e55b-9735-11ef-8682-0242ac140002', 'user8', 'user8@example.com', 'user8', NULL, 0, NULL, '2024-10-31 03:12:12', '2024-10-31 03:12:12'),
('ec46e5c5-9735-11ef-8682-0242ac140002', 'user9', 'user9@example.com', 'user9', NULL, 0, NULL, '2024-10-31 03:12:12', '2024-10-31 03:12:12'),
('ec46e624-9735-11ef-8682-0242ac140002', 'admin', 'user10@example.com', 'admin', NULL, 0, NULL, '2024-10-31 03:12:12', '2024-10-31 08:31:24');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `chat_rooms`
--
ALTER TABLE `chat_rooms`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Chỉ mục cho bảng `room_members`
--
ALTER TABLE `room_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_room_member` (`room_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`id`),
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `room_members`
--
ALTER TABLE `room_members`
  ADD CONSTRAINT `room_members_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`id`),
  ADD CONSTRAINT `room_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
