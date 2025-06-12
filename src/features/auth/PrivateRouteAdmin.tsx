import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthContext, IAuthState } from './AuthProvider';
import { getLogger } from '../core';

const log = getLogger('PrivateRouteAdmin');

export interface IPrivateRouteProps {
    component: any;
    path: string;
    exact?: boolean;
}

export const PrivateRouteAdmin: React.FC<IPrivateRouteProps> = ({ component: Component, ...rest }) => {
    const { isAuthenticated, role } = useContext<IAuthState>(AuthContext);

    log('render admin route, isAuthenticated:', isAuthenticated, 'role:', role);

    return (
        <Route
            {...rest}
            render={props => {
                if (isAuthenticated && role === 'admin') {
                    return <Component {...props} />;
                }
                return <Redirect to={{ pathname: '/login' }} />;
            }}
        />
    );
};
