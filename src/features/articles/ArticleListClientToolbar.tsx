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
import {MyModal} from "../shared/components/MyModal";
interface Props {
    history: any;

}

export const ArticleListClientToolbar: React.FC<Props> = ({ history }) => {
    return (
        <IonToolbar className="login-page-custom-toolbar">
            <div className="toolbar-responsive-content">
                <div className="toolbar-responsive-left">
                    <IonButtons>
                        <IonButton onClick={() => history.push('/aboutus')}>About Us</IonButton>
                        <IonButton onClick={() => history.push('/reviewus')}>Reviews</IonButton>
                        <IonButton onClick={() => history.push('/our-work')}>Our Work</IonButton>
                    </IonButtons>
                </div>

                <div className="toolbar-responsive-right">
                    <IonButtons>
                        <IonButton onClick={() => history.push('/cart')}>🛒 Coș</IonButton>
                        <IonButton href="https://www.instagram.com" target="_blank">
                            <IonIcon icon={logoInstagram} />
                        </IonButton>
                        <IonButton href="https://ro-ro.facebook.com/confectiimetalice.nicusordavid" target="_blank">
                            <IonIcon icon={logoFacebook} />
                        </IonButton>
                        <IonButton href="https://maps.app.goo.gl/AT4vJNj38krRNNNW8" target="_blank">
                            <IonIcon icon={locate} />
                        </IonButton>
                        <MyModal />
                    </IonButtons>
                </div>
            </div>
        </IonToolbar>

    );
};
