import React from 'react';
import {
    IonToolbar,
    IonButtons,
    IonButton,
    IonSearchbar,
    IonIcon
} from '@ionic/react';
import { locate, logoFacebook, logoInstagram } from 'ionicons/icons';
import '../shared/theme/Login-page.css'
import {MyModalAdmin} from "../shared/components/MyModalAdmin";

interface Props {
    history: any;
    searchArticle: string;
    setSearchArticle: (value: string) => void;
}

export const ArticleListAdminToolbar: React.FC<Props> = ({ history, searchArticle, setSearchArticle }) => {
    return (
        <IonToolbar className="login-page-custom-toolbar">
            <IonButtons slot="start">
                <IonButton onClick={() => history.push('/aboutus')}>About Us</IonButton>
                <IonButton onClick={() => history.push('/reviewus')}>Reviews</IonButton>
                <IonButton onClick={() => history.push('/our-work')}>Our Work</IonButton>
            </IonButtons>

            <IonButtons slot="end">

                <IonButton href="https://www.instagram.com" target="_blank">
                    <IonIcon icon={logoInstagram} />
                </IonButton>
                <IonButton href="https://ro-ro.facebook.com/confectiimetalice.nicusordavid" target="_blank">
                    <IonIcon icon={logoFacebook} />
                </IonButton>
                <IonButton href="https://maps.app.goo.gl/AT4vJNj38krRNNNW8" target="_blank">
                    <IonIcon icon={locate} />
                </IonButton>

                <MyModalAdmin />
            </IonButtons>




        </IonToolbar>
    );
};
