import { baseUrl } from '../core';

const authUrl = `http://${baseUrl}/api/auth`;

export interface IUser {
    id: number;
    email: string;
    username: string;
    is_deleted: boolean;
}

export const getAllUsers = async (token: string): Promise<IUser[]> => {
    const res = await fetch(`${authUrl}/admin/users`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });


    if (!res.ok) {
        throw new Error('Failed to fetch users');
    }

    return await res.json();
};

export const safeDeleteUser = async (token: string, email: string): Promise<void> => {
    const res = await fetch(`${authUrl}/admin/delete-user/${email}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to delete user');
    }
};
