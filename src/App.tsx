import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import OrderList from './features/orders/OrderList';
import OrderEdit from './features/orders/OrderEdit';
import { OrderProvider } from './features/orders/OrderProvider';
import OrderCreate from "./features/orders/OrderCreate";
import ArticleShow from './features/articles/ArticleShow';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CartPage from './features/finalcart/CartPage';
import CartPageStripeWrapper from './features/finalcart/CartPageStripeWrapper';
import MessagePage from './features/messages/MessagePage';

const stripePromise = loadStripe('pk_test_51RMbDPRqZEV0vEeL4qq4EQDV14JAknf6CvAlOLYPzLOdTeKmfAsoySy2wZ9L6KGfLrgwL1vB8q8C5SXUsibCM3jU00DZivtB7v');

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import OrderCreateStripeWrapper from './features/orders/OrderCreateStripeWrapper';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './features/shared/theme/variables.css';
import React from "react";
import ArticleListClient from "./features/articles/ArticleListClient";
import { ArticleProvider } from "./features/articles/ArticleProvider"; // Replace ArticleProvider with ArticleProvider
import { AuthProvider, Login, PrivateRoute } from "./features/auth";
import ResourcesOnMap from "./features/core/ResourcesOnMap";
import { SignUp } from "./features/auth/Signup";
import { ForgotPassword } from "./features/auth/ForgotPassword";
import ChangePassword from "./features/auth/ChangePassword";
import AboutUs from './features/pages/AboutUs';
import ReviewUs from "./features/pages/ReviewUs";
import OurWork from "./features/pages/OurWork";
import OrderListClient from "./features/orders/OrderListClient";
import FinalCartListClient from "./features/finalcart/FinalCartListClient";
import {PrivateRouteAdmin} from "./features/auth/PrivateRouteAdmin";
import UserList from "./features/users/UserList";
import FinalCartListAdmin from "./features/finalcart/FinalCartListAdmin";
import OrderListAdmin from "./features/orders/OrderListAdmin";
import ArticleList from "./features/articles/ArticleList";
import ArticleEdit from "./features/articles/ArticleEdit";
import WhatsAppButton from "./features/shared/components/WhatsAppButton";
import CookieConsentBanner from "./features/core/CookieConsentBanner";
setupIonicReact();

const App: React.FC = () => (
    <IonApp>
        <IonReactRouter>
            <IonRouterOutlet>
                <AuthProvider>
                    <Route path="/login" component={Login} exact={true}/>
                    <Route path="/signup" component={SignUp} />
                    <Route path="/forgotpassword" component={ForgotPassword}/>
                    <Route path="/aboutus" component={AboutUs}/>
                    <Route path="/reviewus" component={ReviewUs}/>
                    <Route path="/our-work" component={OurWork}/>

                    <ArticleProvider>
                        <PrivateRoute path="/articlesClient" component={ArticleListClient} exact={true} />
                        <PrivateRoute path="/change-password" component={ChangePassword} exact={true} />
                        <PrivateRoute path="/messages/:id" component={MessagePage} exact={true} />
                        <PrivateRouteAdmin path="/admin-dashboard" component={ArticleList} ></PrivateRouteAdmin>
                        <PrivateRoute path="/article" component={ArticleEdit} exact={true} />
                        <PrivateRoute path="/article/:id" component={ArticleEdit} exact={true} />
                        <PrivateRoute path="/resourcesOnMap" component={ResourcesOnMap} exact={true} />
                        <PrivateRoute path="/article-show/:id" component={ArticleShow} exact={true} />
                        <PrivateRouteAdmin path="/admin-UserList" component={UserList} ></PrivateRouteAdmin>
                        <PrivateRouteAdmin path="/admin-FinalCartList" component={FinalCartListAdmin} ></PrivateRouteAdmin>
                        <PrivateRouteAdmin path="/admin/final-cart-orders/:final_cart_id" component={OrderListAdmin} exact />

                    </ArticleProvider>

                    <OrderProvider>
                        <PrivateRoute path="/orders" component={OrderList} exact={true} />
                        <PrivateRoute path="/order" component={OrderEdit} exact={true} />
                        <PrivateRoute path="/order/:id" component={OrderEdit} exact={true} />
                        <PrivateRoute path="/order-create/:id" component={OrderCreateStripeWrapper} exact={true} />
                        <PrivateRoute path="/cart" component={CartPageStripeWrapper} exact={true} />
                        <Route path="/order-history/:final_cart_id" component={OrderListClient} />
                        <PrivateRoute path="/final-carts" component={FinalCartListClient} exact={true} />

                    </OrderProvider>

                    <Route exact path="/" render={() => <Redirect to="/login" />} />
                </AuthProvider>
            </IonRouterOutlet>
        </IonReactRouter>
        <CookieConsentBanner />
    </IonApp>
);

export default App;
