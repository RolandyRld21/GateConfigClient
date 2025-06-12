import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { AuthContext, IAuthState } from './AuthProvider';
import { getLogger } from '../core';

const log = getLogger('PrivateRoute');

export interface IPrivateRouteProps {
    component: any;
    path: string;
    exact?: boolean;
}

export const PrivateRoute: React.FC<IPrivateRouteProps> = ({ component: Component, ...rest }) => {
    const { isAuthenticated } = useContext<IAuthState>(AuthContext);

    log('render, isAuthenticated', isAuthenticated);

    return (
        <Route {...rest} render={props => {
            if (isAuthenticated) {
                return <Component {...props} />;
            }
            return <Redirect to={{ pathname: '/login' }}/>
        }}/>
    );
}
