export interface User {
    id?: string;
    userId: string;
    username: string;
    email?: string;
    password?: string;
    avatarUrl?: string | null;
    lastSeen?: string | null;
    createdAt?: string;
    updatedAt?: string;
    online?: boolean;
    status: 'ONLINE' | 'OFFLINE';
}

export interface Message {
    id?: string;
    senderId: string;
    sender: string;
    content: string;
    type: 'CHAT' | 'JOIN' | 'LEAVE';
    timestamp?: string;
}

export interface ChatMessage {
    content: string;
    sender: string;
    timestamp: string;
    type: 'CHAT' | 'JOIN' | 'LEAVE';
}