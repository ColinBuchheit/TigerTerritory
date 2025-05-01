export interface AuthModel {
    email: string;
    username: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
    };
    timestamp: string;
}