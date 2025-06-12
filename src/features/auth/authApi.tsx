import { baseUrl, config, withLogs } from '../core';

const authUrl = `https://${baseUrl}/api/auth/login`;

export interface AuthProps {
    token: string;
}

export const login = async (email?: string, password?: string) => {
    const res = await fetch('https://gateconfigserver.onrender.com/api/auth/login', {
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
