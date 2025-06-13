export interface Address {
    id: number;
    label: string;
    street: string;
    city: string;
    lat: number;
    lng: number;
    [key: string]: any;
}

export interface Order {
    gates?: { text: string };
    id: number;
    gate_id: number;
    total_price: number;
    color: string;
    width: number;
    height: number;
    final_cart_id?: number;
    option1?:boolean;
    option2?:boolean;
    option3?:boolean;
    option4?:boolean;
    option5?:boolean;
}

export interface FinalCart {
    id: number;
    total_price: number;
    delivery_fee: number;
    created_at: string;
    status: string;
}

const API_BASE = 'https://gateconfigserver.onrender.com/api';

export const fetchCartOrders = async (token: string): Promise<Order[]> => {
    const res = await fetch(`${API_BASE}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    return data.filter((order: any) => order.final_cart_id === null);
};

export const fetchAddresses = async (token: string): Promise<Address[]> => {
    const res = await fetch(`${API_BASE}/addresses`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return await res.json();
};

export const addAddress = async (token: string, address: any): Promise<Address> => {
    const res = await fetch(`${API_BASE}/addresses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(address)
    });
    return await res.json();
};

export const deleteOrder = async (token: string, orderId: number) => {
    await fetch(`${API_BASE}/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const calculateDistance = async (start: string, end: string): Promise<number> => {
    const res = await fetch(`${API_BASE}/route?start=${start}&end=${end}`);
    const data = await res.json();
    const meters = data.features?.[0]?.properties?.segments?.[0]?.distance;
    return meters ? meters / 1000 : 0;
};

export const finalizeCart = async (
    token: string,
    addressId: number,
    deliveryFee: number
) => {
    const res = await fetch(`${API_BASE}/final-cart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ address_id: addressId, delivery_fee: deliveryFee })
    });
    return await res.json();
};

export const createPaymentIntent = async (amount: number): Promise<{ clientSecret: string }> => {
    const res = await fetch(`${API_BASE}/payment/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
    });
    return await res.json();
};

export const fetchFinalCarts = async (token: string): Promise<FinalCart[]> => {
    const res = await fetch(`${API_BASE}/final-cart`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    return data;
};
export const fetchAllFinalCartsAdmin = async (token: string): Promise<FinalCart[]> => {
    const res = await fetch(`${API_BASE}/final-cart/admin`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return await res.json();
};
