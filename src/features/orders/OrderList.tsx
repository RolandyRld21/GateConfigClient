import React, { useContext, useEffect, useState } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonLoading,
    IonFab,
    IonFabButton,
    IonIcon
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { getLogger } from '../core';
import { OrderContext } from './OrderProvider';
import { IOrderProps } from './OrderProps';
import { AuthContext } from '../auth';

const log = getLogger('OrderList');

const OrderList: React.FC = ({ history }: any) => {
    const { orders, fetching, fetchingError } = useContext(OrderContext);
    const { isAuthenticated } = useContext(AuthContext);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            history.push('/');
        }
    }, [isAuthenticated]);

    log('render');

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Order History</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonLoading isOpen={fetching} message="Fetching orders..." />
                <IonList>
                    {orders?.map((order: IOrderProps) => (
                        <IonItem key={order.id} button onClick={() => history.push(`/order/${order.id}`)}>
                            <IonLabel>
                                <h2>{`Order #${order.id}`}</h2>
                                <p>{`Gate ID: ${order.gate_id}, Total: ${order.total_price} RON`}</p>
                            </IonLabel>
                        </IonItem>
                    ))}
                </IonList>

                {fetchingError && <div>{fetchingError.message || 'Failed to fetch orders'}</div>}

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => history.push('/order')}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default OrderList;
