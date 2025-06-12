import React, {useCallback, useContext, useEffect, useMemo, useReducer} from "react";
import PropTypes from "prop-types";
import { getLogger } from "../core";
import  { IArticleProps } from "./ArticleProps";
import {getArticles, createArticle, updateArticle, newWebSocket, getAllArticles} from './articleApi'
import { AuthContext } from '../auth';
import { setPreferences, getPreferences, removePreferences } from '../core/preferences';
import {useNetwork} from "../core/useNetwork";

const log = getLogger('ArticleProvider');

type SaveArticleFn = (article: IArticleProps) => Promise<any>;

export interface IArticlesState {
    articles?: IArticleProps[];
    fetching: boolean;
    fetchingError?: Error | null;
    saving: boolean;
    savingError?: Error | null;
    saveArticle?: SaveArticleFn;
    refetchArticles?: () => void;  // <-- Add this line

}

interface IActionProps{
    type: string;
    payload?: any;
}

const initialState: IArticlesState = {
    fetching: false,
    saving: false
};

const FETCH_ARTICLES_STARTED = 'FETCH_ARTICLES_STARTED';
const FETCH_ARTICLES_SUCCEEDED = 'FETCH_ARTICLES_SUCCEEDED';
const FETCH_ARTICLES_FAILED = 'FETCH_ARTICLES_FAILED';
const SAVE_ARTICLE_STARTED = 'SAVE_ARTICLE_STARTED';
const SAVE_ARTICLE_SUCCEEDED = 'SAVE_ARTICLE_SUCCEEDED';
const SAVE_ARTICLE_FAILED = 'SAVE_ARTICLE_FAILED';
const RESET = 'RESET';

const reducer: (state: IArticlesState, action: IActionProps) => IArticlesState =
    (state, { type, payload }) => {
    log('reducer');
    switch (type){
        case FETCH_ARTICLES_STARTED:
            return { ...state, fetching: true, fetchingError: null };
        case FETCH_ARTICLES_SUCCEEDED:
            setPreferences("offlineArticles", { articles: payload.articles });
            return { ...state,  fetching: false, articles: payload.articles };
        case FETCH_ARTICLES_FAILED:
            return { ...state, fetching: false, fetchingError: payload.error };
       case SAVE_ARTICLE_STARTED:
           return { ...state, saving: true, savingError: null };
        case SAVE_ARTICLE_SUCCEEDED:
            const articles = [ ...(state.articles || [])];
            const article = payload.article;
            if (article._id){
                log('Reducer - SAVE_ARTICLE_SUCCEEDED: Checking IDs');
                log('Incoming article._id:', article._id);
                log('Existing articles:', articles.map(it => it._id));

                const index = articles.findIndex(it => it._id === article._id);
                if(index === -1){
                    articles.splice(0, 0, article);
                }else {
                    articles[index] = article;
                }
                setPreferences("offlineArticles", { articles: articles });
                return { ...state, saving: false, articles };
            }
            return state;
        case SAVE_ARTICLE_FAILED:
            return { ...state, saving: false, savingError: payload.error };
        case RESET:
            return initialState;
        default:
            return state;
    }
}

export const ArticleContext = React.createContext<IArticlesState>(initialState);

interface IArticleProviderProps {
    children: PropTypes.ReactNodeLike
}

export const ArticleProvider: React.FC<IArticleProviderProps> = ({ children }) => {
    const { token, pendingLogout } = useContext(AuthContext);
    const { networkStatus } = useNetwork();
    const [ state, dispatch ] = useReducer(reducer, initialState);
    const { articles, fetching, fetchingError, saving, savingError } = state;
    const refetchArticles = async () => {
        if (!token) return;
        try {
            dispatch({ type: FETCH_ARTICLES_STARTED });
            let articles: IArticleProps[];

            if (networkStatus.connected) {
                articles = await getAllArticles(token);
            } else {
                const preferences = await getPreferences("offlineArticles");
                articles = preferences?.articles || [];
            }

            dispatch({ type: FETCH_ARTICLES_SUCCEEDED, payload: { articles } });
        } catch (error) {
            dispatch({ type: FETCH_ARTICLES_FAILED, payload: { error } });
        }
    };

    useEffect(getArticlesEffect, [token]);
    useEffect(wsEffect, [token]);
    useEffect(() => { log("networkStatus", networkStatus)}, [networkStatus]);
    useEffect(() => { dispatch({ type: RESET })}, [pendingLogout]);
    useEffect(networkStatusEffect, [networkStatus]);

    const saveArticle = useCallback<SaveArticleFn>(saveArticleCallback, [token, networkStatus]);

    const contextValue = useMemo(() => (
        { articles, fetching, fetchingError, saving, savingError, saveArticle, refetchArticles }
    ), [ articles, fetching, fetchingError, saving, savingError, saveArticle, refetchArticles ]);


    log('render')

    return (
        <ArticleContext.Provider value={contextValue}>
            {children}
        </ArticleContext.Provider>
    );

    function getArticlesEffect() {
        log('getArticlesEffect');

        let canceled = false;

        if(token){
            fetchArticles();
        }

        return () => {
            canceled = true;
        }


        async function fetchArticles(){
            try{
                log('fetchArticles started');

                dispatch({type: FETCH_ARTICLES_STARTED});

                let articles: IArticleProps[];

                if(networkStatus.connected){
                    articles = await getAllArticles(token);

                }else {
                    const preferences = await getPreferences("offlineArticles");

                    if(!preferences){
                        return;
                    }

                    if(!preferences.articles){
                        return;
                    }

                    articles = preferences.articles;
                }

                log('fetchArticles succeeded');
                log('Fetched articles:', articles); // Log all articles here

                if(!canceled){
                    dispatch({type: FETCH_ARTICLES_SUCCEEDED, payload: { articles }});
                }
            }catch(error){
                log('fetchArticles failed', error);

                if(!canceled){
                    dispatch({type: FETCH_ARTICLES_FAILED, payload: { error }});
                }
            }

        }
    }

    async function saveArticleCallback(article: IArticleProps) {
        log('saveArticleCallback');
        log('Article being saved:', JSON.stringify(article));

        try{
            log('saveArticle started');

            dispatch({ type: SAVE_ARTICLE_STARTED });

            let savedArticle;

            if(networkStatus.connected){
                log("saveArticle - if networkStatus is", networkStatus.connected);
                savedArticle = await ( article._id ? updateArticle(token, article) : createArticle(token, article) );
            }else {
                log("saveArticle - else if networkStatus is", networkStatus.connected);
                let offlineArticles = await getPreferences("offlineActions");

                log("1. offlineArticles", offlineArticles);

                if(!offlineArticles || !offlineArticles.articles){
                    offlineArticles = { articles: [] };
                }
                offlineArticles.articles.push(article);

                log("2. offlineArticles", offlineArticles);

                await setPreferences("offlineActions", offlineArticles);

                article._id = Math.floor(Math.random() * 1000000).toString();
                savedArticle = article;
            }

            log('saveArticle succeeded');
            log('Saved Article:', JSON.stringify(savedArticle));
            log('Comparing savedArticle._id with existing IDs...');
            log('Current state articles:', state.articles?.map(a => a._id));

            dispatch({ type: SAVE_ARTICLE_SUCCEEDED, payload: { article: savedArticle } });
        }catch(error){
            log('saveArticle failed', error);

            dispatch({ type: SAVE_ARTICLE_FAILED, payload: { error } });
        }
    }

    function wsEffect() {
        log('wsEffect');

        let canceled = false;

        log('wsEffect - connecting');

        let closeWebSocket: () => void;

        if (token?.trim()) {

            closeWebSocket = newWebSocket(token, message => {

                if (canceled) {
                    return;
                }

                const { type, payload: article } = message;

                log(`ws message, Article ${type}`);

                if (type === 'created' || type === 'updated') {
                    log('ws dispatch:', JSON.stringify(article));
                    dispatch({ type: SAVE_ARTICLE_SUCCEEDED, payload: { article } });
                }
            });
        }
        return () => {
            log('wsEffect - disconnecting');

            canceled = true;

            closeWebSocket?.();
        }
    }

    function networkStatusEffect() {
        log("networkStatusEffect", networkStatus);

        if(!networkStatus.connected){
            return;
        }

        execOfflineActions();

        async function execOfflineActions(){
            const preferences = await getPreferences("offlineActions");

            if(!preferences){
                return;
            }

            if(!preferences.articles){
                return;
            }

            for(let article of preferences.articles){
                await saveArticle(article);
            }

            removePreferences("offlineActions");

            getArticlesEffect();
        }
    }
}
