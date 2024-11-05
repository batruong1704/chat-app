export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
      id: string;
      username: string;
      email: string;
      password: string;
      avatarUrl: string | null;
      lastSeen: string | null;
      createdAt: string;
      updatedAt: string;
      online: boolean;
    }
  }