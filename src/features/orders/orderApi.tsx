import axios from 'axios';
import { authConfig, baseUrl, getLogger, withLogs } from '../core';
import { IOrderProps } from './OrderProps';

const orderUrl = `https://${baseUrl}/api/orders`;

export const getOrders: (token: string) => Promise<IOrderProps[]> = (token) => {
    return withLogs(axios.get(orderUrl, authConfig(token)), 'getOrders');
};

export const getOrder: (token: string, id: number) => Promise<IOrderProps> = (token, id) => {
    return withLogs(axios.get(`${orderUrl}/${id}`, authConfig(token)), 'getOrder');
};

export const createOrder: (token: string, order: IOrderProps) => Promise<IOrderProps> = (token, order) => {
    console.log("Sending order to backend:", order); // DEBUG
    return withLogs(axios.post(orderUrl, order, authConfig(token)), 'createOrder');
};

export const updateOrder: (token: string, order: IOrderProps) => Promise<IOrderProps> = (token, order) => {
    if (!order.id) {
        console.error("Missing id in order:", order);
        throw new Error("Order must have a valid id to update.");
    }

    return withLogs(
        axios.put(`${orderUrl}/${order.id}`, order, authConfig(token)),
        'updateOrder'
    );
};

export const deleteOrder = (token: string, id: number): Promise<void> => {
    return withLogs(
        axios.delete(`${orderUrl}/${id}`, authConfig(token)),
        'deleteOrder'
    );
};
interface IOrderMessage {
    type: string; // e.g., 'created', 'updated', 'deleted'
    payload: IOrderProps;
}

const log = getLogger('order-ws');

export const newOrderWebSocket = (token: string, onMessage: (msg: IOrderMessage) => void) => {
    const ws = new WebSocket(`wss://${baseUrl}`);

    ws.onopen = () => {
        log('WebSocket connected');
        ws.send(JSON.stringify({ type: 'authorization', payload: { token } }));
    };

    ws.onclose = () => {
        log('WebSocket closed');
    };

    ws.onerror = error => {
        log('WebSocket error', error);
    };

    ws.onmessage = messageEvent => {
        log('WebSocket message received');
        const data: IOrderMessage = JSON.parse(messageEvent.data);
        onMessage(data);
    };

    return () => {
        ws.close();
    };
};

