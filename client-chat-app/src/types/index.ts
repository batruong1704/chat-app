// src/types/index.ts
export interface User {
    username: string;
    password: string;
  }
  
  export interface Message {
    sender: string;
    content?: string;
    type: 'CHAT' | 'JOIN' | 'LEAVE';
  }