import React, { useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';
import { getLogger } from '../core';
import { IOrderProps } from './OrderProps';
import { getOrders, createOrder, newOrderWebSocket } from './orderApi';
import { AuthContext } from '../auth';

const log = getLogger('OrderProvider');

type SaveOrderFn = (order: IOrderProps) => Promise<any>;

export interface IOrdersState {
    orders?: IOrderProps[];
    fetching: boolean;
    fetchingError?: Error | null;
    saving: boolean;
    savingError?: Error | null;
    saveOrder?: SaveOrderFn;
}

interface IActionProps {
    type: string;
    payload?: any;
}

const initialState: IOrdersState = {
    fetching: false,
    saving: false
};

const FETCH_ORDERS_STARTED = 'FETCH_ORDERS_STARTED';
const FETCH_ORDERS_SUCCEEDED = 'FETCH_ORDERS_SUCCEEDED';
const FETCH_ORDERS_FAILED = 'FETCH_ORDERS_FAILED';
const SAVE_ORDER_STARTED = 'SAVE_ORDER_STARTED';
const SAVE_ORDER_SUCCEEDED = 'SAVE_ORDER_SUCCEEDED';
const SAVE_ORDER_FAILED = 'SAVE_ORDER_FAILED';
const RESET = 'RESET';

const reducer: (state: IOrdersState, action: IActionProps) => IOrdersState = (state, { type, payload }) => {
    log('reducer', type);
    switch (type) {
        case FETCH_ORDERS_STARTED:
            return { ...state, fetching: true, fetchingError: null };
        case FETCH_ORDERS_SUCCEEDED:
            return { ...state, fetching: false, orders: payload.orders };
        case FETCH_ORDERS_FAILED:
            return { ...state, fetching: false, fetchingError: payload.error };
        case SAVE_ORDER_STARTED:
            return { ...state, saving: true, savingError: null };
        case SAVE_ORDER_SUCCEEDED:
            const orders = [...(state.orders || [])];
            const order = payload.order;
            orders.push(order);
            return { ...state, saving: false, orders };
        case SAVE_ORDER_FAILED:
            return { ...state, saving: false, savingError: payload.error };
        case RESET:
            return initialState;
        default:
            return state;
    }
};

export const OrderContext = React.createContext<IOrdersState>(initialState);

interface IOrderProviderProps {
    children: PropTypes.ReactNodeLike;
}

export const OrderProvider: React.FC<IOrderProviderProps> = ({ children }) => {
    const { token, pendingLogout } = useContext(AuthContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    const { orders, fetching, fetchingError, saving, savingError } = state;

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    useEffect(() => {
        if (pendingLogout) {
            dispatch({ type: RESET });
        }
    }, [pendingLogout]);

    useEffect(() => {
        if (token?.trim()) {
            const closeWebSocket = newOrderWebSocket(token, message => {
                const { type, payload: order } = message;
                if (type === 'created') {
                    dispatch({ type: SAVE_ORDER_SUCCEEDED, payload: { order } });
                }
            });
            return () => closeWebSocket();
        }
    }, [token]);

    const fetchOrders = async () => {
        try {
            dispatch({ type: FETCH_ORDERS_STARTED });
            const orders = await getOrders(token);
            dispatch({ type: FETCH_ORDERS_SUCCEEDED, payload: { orders } });
        } catch (error) {
            dispatch({ type: FETCH_ORDERS_FAILED, payload: { error } });
        }
    };

    const saveOrder = useCallback<SaveOrderFn>(async (order: IOrderProps) => {
        try {
            dispatch({ type: SAVE_ORDER_STARTED });
            const savedOrder = await createOrder(token, order);
            dispatch({ type: SAVE_ORDER_SUCCEEDED, payload: { order: savedOrder } });
        } catch (error) {
            dispatch({ type: SAVE_ORDER_FAILED, payload: { error } });
        }
    }, [token]);

    const contextValue = useMemo(() => (
        { orders, fetching, fetchingError, saving, savingError, saveOrder }
    ), [orders, fetching, fetchingError, saving, savingError, saveOrder]);

    return (
        <OrderContext.Provider value={contextValue}>
            {children}
        </OrderContext.Provider>
    );
};
