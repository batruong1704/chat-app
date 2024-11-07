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
    idMessage: string;
    type: string;
    senderId: string;
    senderName: string;
    content: string;
    createdAt: string;
}

export interface RoomMessages {
    idRoom: string;
    roomName: string;
    messages: Message[];
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

export enum MessageType {
    JOIN = 'JOIN',
    LEAVE = 'LEAVE',
    CHAT = 'CHAT'
}

export interface MessageDTO {
    message: Message;
    roomId: string;
}