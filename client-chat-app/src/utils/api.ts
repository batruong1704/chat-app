import {Message, Room, User} from "../types";

export const fetchUsernameById = async (userId: string): Promise<string | null> => {
    try {
        const response = await fetch(`http://localhost:8080/api/user/getUsernameById/${userId}`);
        const data = await response.json();
        if (data.success) {
            return data.data;
        } else {
            console.error('Failed to fetch username:', data.message);
            return null;
        }
    } catch (error) {
        console.error('Error fetching username:', error);
        return null;
    }
};

export const fetchUsers = async (): Promise<User[]> => {
    try {
        const response = await fetch('http://localhost:8080/api/user/getAll');
        const data = await response.json();
        if (data.success) {
            return data.data.map((user: any) => ({
                ...user,
                isOnline: user.online,
            }));
        } else {
            console.error('Failed to fetch users:', data.message);
            return [];
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};

export const fetchPublicRoom = async (): Promise<Room | null> => {
    try {
        const response = await fetch('http://localhost:8080/api/room/getPublicRoom');
        const data = await response.json();
        if (data.success) {
            return data.data;
        } else {
            console.error('Failed to fetch public room:', data.message);
            return null;
        }
    } catch (error) {
        console.error('Error fetching public room:', error);
        return null;
    }
};

export const fetchRoomsByUserId = async (userId: string): Promise<Room[]> => {
    try {
        const response = await fetch(`http://localhost:8080/api/roomMember/findRoomIdByUserId/${userId}`);
        const data = await response.json();
        if (data.success) {
            return data.data;
        } else {
            console.error('Failed to fetch rooms by userId:', data.message);
            return [];
        }
    } catch (error) {
        console.error('Error fetching rooms by userId:', error);
        return [];
    }
};

export const fetchMessagesByRoomId = async (roomId: string): Promise<Message[]> => {
    try {
        const response = await fetch(`http://localhost:8080/api/message/getMessage/${roomId}`);
        const data = await response.json();
        if (data.success) {
            return data.data;
        } else {
            console.error('Failed to fetch messages:', data.message);
            return [];
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
};