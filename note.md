## I. Todo List:
- [ ] Task 1: Trạng thái người dùng (Online hay Offline) 
- [ ] Task 2: Trạng thái đang gõ tin nhắn <Done>
- [ ] Task 3: Đa phương tiện, emoji
- [ ] Task 4: Tìm kiếm tin nhắn cũ
- [ ] Task 5: IndexDB, gửi tin nhắn kể cả offline. Khi online sẽ tự đồng bộ sau.
- [ ] Task 6: Đẩy người dùng có tin nhắn mới nhất lên đầu cuộc trò chuyện.

---
## II. Cấu trúc dự án:
```agsl
src
├── main
│   ├── java
│   │   └── site
│   │       └── whatsapp
│   │           ├── controllers
│   │           │   ├── AuthController.java
│   │           │   ├── ChatController.java
│   │           │   ├── MessageController.java
│   │           │   └── SocketController.java
│   │           │
│   │           ├── services
│   │           │   ├── impl
│   │           │   │   ├── ChatServiceImplementation.java
│   │           │   │   └── MessageServiceImplementation.java
│   │           │   │
│   │           │   └── inter
│   │           │       ├── ChatService.java
│   │           │       └── UserService.java
│   │           │
│   │           ├── exception
│   │           │   ├── ChatException.java
│   │           │   ├── UserException.java
│   │           │   └── MessageException.java
│   │           │
│   │           ├── models
│   │           │   ├── ChatModel.java
│   │           │   ├── UserModel.java
│   │           │   └── MessageModel.java
│   │           │
│   │           ├── repositorys
│   │           │   ├── ChatRepository.java
│   │           │   ├── UserRepository.java
│   │           │   └── MessageRepository.java
│   │           │
│   │           └── request
│   │               ├── GroupChatRequest.java
│   │               └── SendMessageRequest.java
│   │
│   └── resources
│       └── static
│           ├── css
│           │   └── main.css
│           ├── js
│           │   └── main.js
│           └── index.html
│
UI-whats-app
│
├── src
│   ├── Components
│   │   ├── ChatCard
│   │   │   └── ChatCard.jsx
│   │   ├── Content
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   └── MessageList.jsx
│   │   ├── Group
│   │   │   └── CreateGroup.jsx
│   │   ├── Profile
│   │   │   └── Profile.jsx
│   │   ├── Sidebar
│   │   │   ├── SearchBar.jsx
│   │   │   └── SidebarHeader.jsx
│   │   └── WelcomeScreen.jsx
│   │
│   ├── Redux
│   │   ├── Auth
│   │   │   ├── Action.js
│   │   │   ├── ActionType.js
│   │   │   └── Reducer.js
│   │   ├── Chat
│   │   │   ├── Action.js
│   │   │   ├── ActionType.js
│   │   │   └── Reducer.js
│   │   ├── Message
│   │   │   ├── Action.js
│   │   │   ├── ActionType.js
│   │   │   └── Reducer.js
│   │   └── Websocket
│   │       ├── Action.js
│   │       ├── ActionType.js
│   │       └── Reducer.js
│   │
│   ├── Config
│   │   └── Api.js
│   │
│   ├── App.js
│   ├── index.js
│   └── styles.css
│
├── public
│   ├── index.html
│   └── favicon.ico
│
├── package.json
├── package-lock.json
└── README.md

```
---

## II#. Socket API Documentation

### **1. Giới thiệu**
Ứng dụng nhắn tin này sử dụng **Spring WebSocket** với giao thức **STOMP** để xử lý các tin nhắn thời gian thực. Hệ thống bao gồm việc gửi tin nhắn đến các **topic chung** hoặc **các người dùng cụ thể**.

#### **2. Endpoint WebSocket**
| Chức năng                              | Endpoint                   | Ghi chú                              |
|----------------------------------------|----------------------------|--------------------------------------|
| Server                                 | `http://localhost:5000/ws` |                                      |
| Client                                 | `http://localhost:3000`    |                                      |
| Destination Prefix                     | `/app`                     |                                      |
| Message Broker Prefix                  | `/topic`                   |                                      |
| Gửi tin nhắn tới phòng chat            | `/app/chat`                |                                      |
| Địa chỉ nhận tin nhắn                  | `/topic/room/{chatId}`     |                                      |
| Người dùng đang nhập tin nhắn (typing) | `/topic/typing/{userId}`   |                                      |

