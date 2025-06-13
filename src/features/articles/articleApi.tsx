import axios from 'axios';
import {authConfig, baseUrl, getLogger, withLogs} from '../core';
import { IArticleProps} from "./ArticleProps";

const articleUrl = `https://${baseUrl}/api/article`;

export const getArticles: (token : string) => Promise<IArticleProps[]> = (token) => {
    return withLogs(axios.get(articleUrl, authConfig(token)), 'getArticles');
}

export const createArticle: (token: string, article: IArticleProps) => Promise<IArticleProps[]> = (token, article) => {
    console.log("Sending article to backend:", article); // DEBUG LOG
    return withLogs(axios.post(articleUrl, article, authConfig(token)), 'createArticle');
}

export const updateArticle = (token: string, article: IArticleProps): Promise<IArticleProps[]> => {
    if (!article._id) {
        console.error("Missing _id in article:", article);
        throw new Error("Article must have a valid _id to update.");
    }

    console.log("Updating article in backend:", article); // DEBUG LOG

    return withLogs(
        axios.put(`${articleUrl}/${String(article._id)}`, article, authConfig(token)),
        'updateArticle'
    );
};
export const deleteArticle = (token: string, articleId: string): Promise<void> => {
    console.log("Deleting article with ID:", articleId); // DEBUG LOG
    return withLogs(
        axios.delete(`${articleUrl}/${String(articleId)}`, authConfig(token)),
        'deleteArticle'

    );
};
export const getGateById = (token: string, id: number): Promise<IArticleProps> => {
    return withLogs(
        axios.get(`https://${baseUrl}/api/article/${id}`, authConfig(token)),
        'getGateById'
    );
};


export const getAllArticles: (token: string) => Promise<IArticleProps[]> = (token) => {
    return withLogs(axios.get(`${articleUrl}/all`, authConfig(token)), 'getAllArticles');
}

interface IMessageData {
    type: string;
    payload: IArticleProps;
}

const log = getLogger('ws');

export const newWebSocket = (token: string, onMessage: (data: IMessageData) => void) => {
    const ws = new WebSocket(`wss://${baseUrl}`);

    ws.onopen = () => {
        log('web socket onopen');
        ws.send(JSON.stringify({ type: 'authorization', payload: { token } }));
    }

    ws.onclose = () => {
        log('web socket onclose');
    }

    ws.onerror = error => {
        log('web socket onerror', error);
    }

    ws.onmessage = messageEvent => {
        log('web socket onmessage');
        onMessage(JSON.parse(messageEvent.data));
    }

    return () => {
        ws.close();
    };
}
