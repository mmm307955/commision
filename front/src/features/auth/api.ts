import { api } from '@/lib/api';

export interface AuthResponse {
    token: string;
    userId: number;
    email: string;
    nickname: string;
    role: string;
}

export async function register(data: {
    email: string;
    password: string;
    nickname: string;
    role?: string;
}): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/api/auth/register', data);
    return res.data;
}

export async function login(data: {
    email: string;
    password: string;
}): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/api/auth/login', data);
    return res.data;
}

// 로컬 스토리지 헬퍼
export function saveAuth(auth: AuthResponse) {
    localStorage.setItem('token', auth.token);
    localStorage.setItem('user', JSON.stringify({
        userId: auth.userId,
        email: auth.email,
        nickname: auth.nickname,
        role: auth.role,
    }));
}

export function getUser() {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    return JSON.parse(raw) as { userId: number; email: string; nickname: string; role: string };
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

export function isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
}
