import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { getLogger } from '../core';
import { login as loginApi } from './authApi';
import { clearPreferences, getPreferences, setPreferences } from '../core/preferences';

const log = getLogger('AuthProvider');

type LoginFn = (email?: string, password?: string) => void;
type LogoutFn = () => void;

export interface IAuthState {
    authenticationError: Error | null;
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    login?: LoginFn;
    logout?: LogoutFn;
    pendingAuthentication?: boolean;
    pendingLogout?: boolean;
    email?: string;
    password?: string;
    token: string;
    role?: 'admin' | 'client';
}

const initialState: IAuthState = {
    isAuthenticated: false,
    isAuthenticating: false,
    authenticationError: null,
    pendingAuthentication: false,
    pendingLogout: false,
    token: '',
    role: undefined
};

export const AuthContext = React.createContext<IAuthState>(initialState);

interface IAuthProviderProps {
    children: PropTypes.ReactNodeLike;
}

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
    const [state, setState] = useState<IAuthState>(initialState);
    const {
        isAuthenticated,
        isAuthenticating,
        authenticationError,
        pendingAuthentication,
        pendingLogout,
        token
    } = state;

    const login = useCallback<LoginFn>(loginCallback, []);
    const logout = useCallback<LogoutFn>(logoutCallback, []);

    useEffect(authenticationEffect, [pendingAuthentication]);
    useEffect(logoutEffect, [pendingLogout]);
    useEffect(userPreferencesEffect, []);

    const contextValue = useMemo(
        () => ({
            isAuthenticated,
            login,
            logout,
            isAuthenticating,
            pendingLogout,
            authenticationError,
            token,
            email: state.email,
            role: state.role
        }),
        [isAuthenticated, login, logout, isAuthenticating, pendingLogout, authenticationError, token, state.email, state.role]
    );

    log('render');

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;

    function loginCallback(email?: string, password?: string): void {
        log('loginCallback');
        setState({
            ...state,
            pendingAuthentication: true,
            email,
            password
        });
    }

    function logoutCallback(): void {
        log('logoutCallback');
        setState({
            ...state,
            pendingLogout: true
        });
    }

    function authenticationEffect() {
        log('authenticationEffect');
        let canceled = false;
        authenticate();
        return () => {
            canceled = true;
        };

        async function authenticate() {
            if (!pendingAuthentication) return;
            try {
                log('authenticate...');
                setState({
                    ...state,
                    isAuthenticating: true
                });

                const { email, password } = state;
                const { token, role } = await loginApi(email, password); // get role directly from login response

                if (canceled) return;

                log('authenticate succeeded');
                await setPreferences('user', { token, email, role });

                setState({
                    ...state,
                    token,
                    role,
                    pendingAuthentication: false,
                    isAuthenticated: true,
                    isAuthenticating: false
                });
            } catch (error) {
                if (canceled) return;
                log('authenticate failed');
                setState({
                    ...state,
                    authenticationError: error as Error,
                    pendingAuthentication: false,
                    isAuthenticating: false
                });
            }
        }
    }

    function logoutEffect() {
        log('logoutEffect');
        let canceled = false;
        loggingout();
        return () => {
            canceled = true;
        };

        async function loggingout() {
            if (!pendingLogout) return;
            try {
                log('logging out...');
                await clearPreferences();
                log('logout succeeded');
                setState(initialState);
            } catch (error) {
                if (canceled) return;
                log('logout failed');
                setState(initialState);
            }
        }
    }

    function userPreferencesEffect() {
        log('userPreferencesEffect');
        let canceled = false;
        getUserPreferences();
        return () => {
            canceled = true;
        };

        async function getUserPreferences() {
            try {
                log('getPreferences started');
                const preferences = await getPreferences('user');
                log('getPreferences succeeded');
                if (canceled || !preferences || !preferences.token) return;

                setState({
                    ...state,
                    token: preferences.token,
                    email: preferences.email,
                    role: preferences.role,
                    isAuthenticated: true
                });
            } catch (error) {
                log('getPreferences failed');
            }
        }
    }
};
