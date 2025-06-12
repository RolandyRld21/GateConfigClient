import { baseUrl, config, withLogs } from '../core';

const authUrl = `http://${baseUrl}/api/auth/login`;

export interface AuthProps {
    token: string;
}

export const login = async (email?: string, password?: string) => {
    const res = await fetch('http://192.168.1.149:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
        throw new Error('Login failed');
    }
    const { token, role } = await res.json();
    return { token, role };
};
