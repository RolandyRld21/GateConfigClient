import React, { useContext, useState } from 'react';
import { createAnimation, IonModal, IonButton, IonIcon, IonFabButton } from '@ionic/react';
import { AuthContext } from "../../auth";
import {
    closeOutline,
    lockClosedOutline,
    logOutOutline,
    settingsOutline,
    timeOutline,
    trashOutline
} from "ionicons/icons";
import { useHistory } from 'react-router-dom';
import "../theme/my-modal.css";
import { IonAlert } from '@ionic/react';

export const MyModalAdmin: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const { logout } = useContext(AuthContext);
    const history = useHistory();
    const { token } = useContext(AuthContext);
    const [showAlert, setShowAlert] = useState(false);

    const enterAnimation = (baseEl: any) => {
        const root = baseEl.shadowRoot;
        const backdropAnimation = createAnimation()
            .addElement(root.querySelector('ion-backdrop')!)
            .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

        const wrapperAnimation = createAnimation()
            .addElement(root.querySelector('.modal-wrapper')!)
            .keyframes([
                { offset: 0, opacity: '0', transform: 'scale(0)' },
                { offset: 1, opacity: '0.99', transform: 'scale(1)' }
            ]);

        return createAnimation()
            .addElement(baseEl)
            .easing('ease-out')
            .duration(500)
            .addAnimation([backdropAnimation, wrapperAnimation]);
    };

    const leaveAnimation = (baseEl: any) => {
        return enterAnimation(baseEl).direction('reverse');
    };



    const handleOrderHistoryAdmin = () => {
        history.push('/admin-FinalCartList');
    };
    const handleAllUsersAdmin = ()=>{
        history.push('/admin-UserList');
    }
    const handleDeleteAccount = async () => {
        try {
            const res = await fetch('https://gateconfigserver.onrender.com/api/auth/account', {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });


            if (res.ok) {
                alert('Contul tău a fost șters.');
                logout?.();
            } else {
                const data = await res.json();
                alert('Eroare: ' + (data.message || 'Nu s-a putut șterge contul.'));
            }
        } catch (err) {
            console.error('Eroare ștergere cont:', err);
            alert('Eroare de rețea.');
        }
    };

    return (
        <>
            <IonModal
                isOpen={showModal}
                enterAnimation={enterAnimation}
                leaveAnimation={leaveAnimation}
                className="enhanced-premium-modal-admin"
            >
                <div className="enhanced-modal-content-admin">
                    {/* Modal Header */}
                    <div className="enhanced-modal-header">
                        <div className="enhanced-modal-title">
                            <div className="enhanced-modal-icon-wrapper">
                                <IonIcon icon={settingsOutline} />
                            </div>
                            <div className="enhanced-modal-title-text">
                                <h2>Setări Cont</h2>
                                <p>Gestionează-ți contul și preferințele</p>
                            </div>
                        </div>
                        <button className="enhanced-modal-close-button" onClick={() => setShowModal(false)}>
                            <IonIcon icon={closeOutline} />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="enhanced-modal-body">


                        {/* Account Actions Section */}
                        <div className="enhanced-modal-section">

                            <div className="enhanced-modal-actions">


                                <button className="enhanced-modal-action-button" onClick={handleOrderHistoryAdmin}>
                                    <div className="enhanced-action-icon">
                                        <IonIcon icon={timeOutline} />
                                    </div>
                                    <div className="enhanced-action-content">
                                        <span className="enhanced-action-title">Istoric Comenzi</span>
                                        <span className="enhanced-action-description">Vezi comenzile anterioare</span>
                                    </div>
                                </button>
                                <button className="enhanced-modal-action-button" onClick={handleAllUsersAdmin}>
                                    <div className="enhanced-action-icon">
                                        <IonIcon icon={trashOutline} />
                                    </div>
                                    <div className="enhanced-action-content">
                                        <span className="enhanced-action-title">Gestionează utilizatorii</span>
                                        <span className="enhanced-action-description">Elimina conturile utilizatorilor</span>
                                    </div>
                                </button>
                                <button className="enhanced-modal-action-button logout-button" onClick={logout}>
                                    <div className="enhanced-action-icon">
                                        <IonIcon icon={logOutOutline} />
                                    </div>
                                    <div className="enhanced-action-content">
                                        <span className="enhanced-action-title">Deconectare</span>
                                        <span className="enhanced-action-description">Ieși din cont</span>
                                    </div>
                                </button>

                                <button className="enhanced-modal-action-button danger-button" onClick={() => setShowAlert(true)}>
                                    <div className="enhanced-action-icon">
                                        <IonIcon icon={trashOutline} />
                                    </div>
                                    <div className="enhanced-action-content">
                                        <span className="enhanced-action-title">Șterge Contul</span>
                                        <span className="enhanced-action-description">Elimină permanent contul</span>
                                    </div>
                                </button>

                            </div>
                        </div>
                    </div>
                </div>

                <IonAlert
                    isOpen={showAlert}
                    header="Ești sigur?"
                    message="Această acțiune este ireversibilă. Comenzile tale vor fi păstrate, dar contul va fi șters."
                    buttons={[
                        {
                            text: "Anulează",
                            role: "cancel",
                            handler: () => setShowAlert(false),
                        },
                        {
                            text: "Șterge",
                            role: "destructive",
                            handler: handleDeleteAccount,
                        },
                    ]}
                    onDidDismiss={() => setShowAlert(false)}
                />
            </IonModal>

            {/* Enhanced Trigger Button */}
            <button className="enhanced-settings-button" onClick={() => setShowModal(true)}>
                <IonIcon icon={settingsOutline} />
            </button>
        </>
    );
};
