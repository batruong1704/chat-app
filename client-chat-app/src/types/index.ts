export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    avatarUrl?: string | null;
    isOnline: boolean;
    lastSeen?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    id: string;
    roomId: string;
    senderId: string;
    username: string;
    content: string;
    messageType: 'CHAT' | 'JOIN' | 'LEAVE';
    createdAt: string;
}

export interface ChatMessage {
    content: string;
    sender: string;
    timestamp: string;
    type: 'CHAT' | 'JOIN' | 'LEAVE';
}

export interface Room {
    id: string;
    name: string;
    type: RoomType;
    createdAt: string;
}

export enum RoomType {
    PUBLIC = 'PUBLIC',
    GROUP = 'GROUP',
    PRIVATE = 'PRIVATE'
}

export interface MessageDTO {
    message: Message;
    roomId: string;
}