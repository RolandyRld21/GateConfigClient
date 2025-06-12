// src/utilities/MainToolbar.tsx
import React from 'react';
import {
    IonToolbar,
    IonButtons,
    IonButton,
    IonSearchbar,
    IonIcon
} from '@ionic/react';
import { locate, logoFacebook, logoInstagram } from 'ionicons/icons';
import '../theme/Login-page.css'
export const MainToolbar: React.FC<{ history: any }> = ({ history }) => {
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
                <IonButton onClick={() => history.push('/login')}>Login</IonButton>
            </IonButtons>

            <div className="search-bar-container">
                <IonSearchbar
                    color="white"
                    className="search-bar-container"
                    debounce={0}
                    placeholder="Search gates..."
                />
                <IonButton color="white" className="search-bar-button">Search</IonButton>
            </div>
        </IonToolbar>
    );
};
