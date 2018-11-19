export interface LoginResponse {
    token: string;
    user: User;
}

export interface User {
    fullName: string;
    username: string;
}
