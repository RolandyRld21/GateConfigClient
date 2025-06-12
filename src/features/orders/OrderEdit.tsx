import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonInput, IonItem, IonLabel, IonButton, IonCheckbox, IonLoading, IonList, IonText, IonImg
} from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { AuthContext } from '../auth';
import { IOrderProps } from './OrderProps';
import { createOrder } from './orderApi';
import { getGateById } from '../articles/articleApi';
import { IArticleProps } from '../articles/ArticleProps';

interface OrderEditProps extends RouteComponentProps<{ gateId: string }> {}

const OrderEdit: React.FC<OrderEditProps> = ({ match, history }) => {
    const { token } = useContext(AuthContext);
    const gateId = parseInt(match.params.gateId);
    const [gate, setGate] = useState<IArticleProps | null>(null);

    const [width, setWidth] = useState<number>(1);
    const [height, setHeight] = useState<number>(1);
    const [color, setColor] = useState<string>('#000000');
    const [options, setOptions] = useState<boolean[]>([false, false, false, false, false]);
    const [loading, setLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    useEffect(() => {
        const loadGate = async () => {
            if (!token) return;
            const data = await getGateById(token, gateId);
            setGate(data);
        };
        loadGate();
    }, [gateId, token]);

    useEffect(() => {
        if (!gate) return;

        const base = (gate.price || 0) * width * height;

        const extras = options.reduce((sum, selected, index) => {
            const optValue = gate[`option${index + 1}` as keyof IArticleProps] as number || 0;
            return selected ? sum + optValue : sum;
        }, 0);

        setTotalPrice(base + extras);
    }, [gate, width, height, options]);


    const handleSubmit = useCallback(async () => {
        if (!token || !gate) return;
        setLoading(true);
        const order: IOrderProps = {
            gate_id: Number(gate._id),
            width,
            height,
            color,
            option1: options[0],
            option2: options[1],
            option3: options[2],
            option4: options[3],
            option5: options[4],
            total_price: totalPrice
        };
        try {
            await createOrder(token, order);
            history.replace('/orders');
        } catch (e) {
            console.error('Failed to create order', e);
        } finally {
            setLoading(false);
        }
    }, [token, gate, width, height, color, options, totalPrice, history]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Place Order</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading isOpen={loading || !gate} message="Loading..." />

                {gate && (
                    <IonList>
                        <IonItem lines="full">
                            <IonLabel>Selected Gate: <strong>{gate.text}</strong></IonLabel>
                        </IonItem>
                        {gate.image && (
                            <IonImg src={gate.image} style={{ maxHeight: '200px', objectFit: 'cover' }} />
                        )}

                        <IonItem>
                            <IonLabel position="stacked">Width (m)</IonLabel>
                            <IonInput type="number" value={width} onIonChange={e => setWidth(parseFloat(e.detail.value!))} />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Height (m)</IonLabel>
                            <IonInput type="number" value={height} onIonChange={e => setHeight(parseFloat(e.detail.value!))} />
                        </IonItem>

                        {[1, 2, 3, 4, 5].map(i => (
                            <IonItem key={i}>
                                <IonLabel>
                                    Option {i} ({String(gate[`option${i}` as keyof IArticleProps] ?? 0)} RON)
                                </IonLabel>

                                {[1, 2, 3, 4, 5].map(i => (
                                    <IonItem key={i}>
                                        <IonLabel>
                                            Option {i} ({String(gate[`option${i}` as keyof IArticleProps] ?? 0)} RON)
                                        </IonLabel>
                                        <IonCheckbox
                                            checked={options[i - 1]}
                                            onIonChange={e => {
                                                const newOptions = [...options];
                                                newOptions[i - 1] = e.detail.checked;
                                                setOptions(newOptions);
                                            }}
                                        />
                                    </IonItem>
                                ))}

                            </IonItem>
                        ))}

                        <IonItem>
                            <IonLabel position="stacked">Color (HEX)</IonLabel>
                            <IonInput type="text" value={color} onIonChange={e => setColor(e.detail.value!)} />
                        </IonItem>

                        <IonItem>
                            <IonLabel>Total Price</IonLabel>
                            <IonText><strong>{totalPrice.toFixed(2)} RON</strong></IonText>
                        </IonItem>

                        <IonButton expand="block" onClick={handleSubmit} disabled={loading}>Place Order</IonButton>
                    </IonList>
                )}
            </IonContent>
        </IonPage>
    );
};

export default OrderEdit;
