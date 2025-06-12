// features/messages/api/messageApi.ts

export interface Message {
    id: number;
    final_cart_id: number;
    sender_email: string;
    sender: string;
    text: string;
    timestamp: string;
}

const baseUrl = 'https://gateconfigserver.onrender.com/api/messages';

export const getMessages = async (token: string, finalCartId: number): Promise<Message[]> => {
    const res = await fetch(`${baseUrl}/${finalCartId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server response: ${res.status} ${errorText}`);
    }

    return await res.json();
};

export const sendMessage = async (
    token: string,
    finalCartId: number,
    text: string
): Promise<Message> => {
    const res = await fetch(`${baseUrl}/${finalCartId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server response: ${res.status} ${errorText}`);
    }

    return await res.json();
};
