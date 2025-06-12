import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CartPage from './CartPage';

const stripePromise = loadStripe('pk_test_51RMbDPRqZEV0vEeL4qq4EQDV14JAknf6CvAlOLYPzLOdTeKmfAsoySy2wZ9L6KGfLrgwL1vB8q8C5SXUsibCM3jU00DZivtB7v');

const CartPageStripeWrapper: React.FC = () => {
    return (
        <Elements stripe={stripePromise}>
            <CartPage />
        </Elements>
    );
};

export default CartPageStripeWrapper;
