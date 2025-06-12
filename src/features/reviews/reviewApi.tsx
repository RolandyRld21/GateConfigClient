import axios from 'axios';
import { authConfig, baseUrl, getLogger, withLogs } from '../core';
import { IReviewProps } from './ReviewProps';

const reviewUrl = `https://${baseUrl}/api/reviews`;

export const getReviews: (token: string) => Promise<IReviewProps[]> = (token) => {
    return withLogs(axios.get(reviewUrl, authConfig(token)), 'getReviews');
};

export const getReview: (token: string, id: number) => Promise<IReviewProps> = (token, id) => {
    return withLogs(axios.get(`${reviewUrl}/${id}`, authConfig(token)), 'getReview');
};
export const getAllReviews = async (
    offset = 0,
    limit = 2,
    sortField: 'time' | 'score' = 'time',
    sortOrder: 'asc' | 'desc' = 'desc',
    token?: string
) => {
    const res = await fetch(
        `https://gateconfigserver.onrender.com/api/reviews/all?offset=${offset}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`,
        {
            headers: token
                ? { Authorization: `Bearer ${token}` }
                : {}
        }
    );

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to load reviews');
    }

    return await res.json();
};






export const createReview: (token: string, review: {
    order_id: number;
    email: string | undefined;
    score: number;
    text: string;
    time: string
}) => Promise<IReviewProps> = (token, review) => {
    return withLogs(axios.post(reviewUrl, review, authConfig(token)), 'createReview');
};



export const updateReview: (token: string, review: IReviewProps) => Promise<IReviewProps> = (token, review) => {
    if (!review.id) {
        console.error("Missing id in review:", review);
        throw new Error("Review must have a valid id to update.");
    }

    return withLogs(
        axios.put(`${reviewUrl}/${review.id}`, review, authConfig(token)),
        'updateReview'
    );
};

export const deleteReview = async (token: string, reviewId: number) => {
     console.log("deleteReviewdinAPI:", reviewId);
    const res = await fetch(`https://gateconfigserver.onrender.com/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete review');
    }

    return true;
};

