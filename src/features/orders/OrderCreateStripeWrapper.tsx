import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderCreate from './OrderCreate';
import { RouteComponentProps } from 'react-router';

const stripePromise = loadStripe('pk_test_51RMbDPRqZEV0vEeL4qq4EQDV14JAknf6CvAlOLYPzLOdTeKmfAsoySy2wZ9L6KGfLrgwL1vB8q8C5SXUsibCM3jU00DZivtB7v');

const OrderCreateStripeWrapper: React.FC<RouteComponentProps<{ id: string }>> = (props) => (
    <Elements stripe={stripePromise}>
        <OrderCreate {...props} />
    </Elements>
);

export default OrderCreateStripeWrapper;
