export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    username?: string;
    isAdmin: boolean;
    created_at?: string;
}

export interface AuthFormData {
    fullName: string;
    email: string;
    password: string;
    username: string;
    selectedAvatar: string;
}
