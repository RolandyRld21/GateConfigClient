import React, { useContext, useEffect, useState } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
} from '@ionic/react';

import { getLogger } from "./index";
import { ArticleContext } from "../articles/ArticleProvider";
import { RouteComponentProps } from 'react-router';
import MyMap from './MyMap';

const log = getLogger('ResOnMap');

export interface coordinatesInterface {
    lat: number,
    long: number
}

const ResourcesOnMap: React.FC<RouteComponentProps> = ({history}) => {
    const { articles } = useContext(ArticleContext);
    const [coordinates, setCoordinates] = useState<coordinatesInterface[] | undefined>(undefined);

    useEffect(() => {
        log('useEffect', articles);

        if (articles) {
            const articlesWithCoords = articles.filter(article => article.lat && article.long);
            log('articlesWithCoords', articlesWithCoords);

            const coords = articlesWithCoords.map(article => ({
                lat: parseFloat(article.lat!),
                long: parseFloat(article.long!),
            }));

            setCoordinates(coords);
        }
    }, [articles]);

    log('render', coordinates);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>MAP</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {coordinates && <MyMap coordinatesToAdd={coordinates}/>}
            </IonContent>
        </IonPage>
    );
};

export default ResourcesOnMap;
