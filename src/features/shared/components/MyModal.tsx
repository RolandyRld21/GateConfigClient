
import type React from "react"
import { useContext, useState } from "react"
import { createAnimation, IonModal, IonIcon, IonAlert,IonToast } from "@ionic/react"
import { AuthContext } from "../../auth"
import {
    logOutOutline,
    settingsOutline,
    lockClosedOutline,
    timeOutline,
    trashOutline,
    closeOutline,
    personOutline,
    linkOutline,
} from "ionicons/icons"
import { useHistory } from "react-router-dom"
import "../theme/my-modal.css"
export const MyModal: React.FC = () => {
    const [showModal, setShowModal] = useState(false)
    const { logout, token } = useContext(AuthContext)
    const history = useHistory()
    const [showAlert, setShowAlert] = useState(false)
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastColor, setToastColor] = useState<"success" | "danger">("success");

    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const showToastMsg = (message: string, color: "success" | "danger" = "success") => {
        setToastMessage(message);
        setToastColor(color);
        setShowToast(true);
    };

    const enterAnimation = (baseEl: any) => {
        const root = baseEl.shadowRoot
        const backdropAnimation = createAnimation()
            .addElement(root.querySelector("ion-backdrop")!)
            .fromTo("opacity", "0.01", "var(--backdrop-opacity)")

        const wrapperAnimation = createAnimation()
            .addElement(root.querySelector(".modal-wrapper")!)
            .keyframes([
                { offset: 0, opacity: "0", transform: "scale(0.8) translateY(20px)" },
                { offset: 1, opacity: "0.99", transform: "scale(1) translateY(0)" },
            ])

        return createAnimation()
            .addElement(baseEl)
            .easing("ease-out")
            .duration(300)
            .addAnimation([backdropAnimation, wrapperAnimation])
    }

    const leaveAnimation = (baseEl: any) => {
        return enterAnimation(baseEl).direction("reverse")
    }

    const handleChangePassword = () => {
        setShowModal(false)
        history.push("/change-password")
    }

    const handleOrderHistory = () => {
        setShowModal(false)
        history.push("/final-carts")
    }

    const handleDeleteAccount = async () => {
        try {
            const res = await fetch("https://gateconfigserver.onrender.com/api/auth/account", {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                showToastMsg("Contul tău a fost șters.", "success");
                setTimeout(() => logout?.(), 2000); // așteaptă toast-ul înainte de logout
            } else {
                const data = await res.json();
                showToastMsg("Eroare: " + (data.message || "Nu s-a putut șterge contul."), "danger");
            }
        } catch (err) {
            console.error("Eroare ștergere cont:", err);
            showToastMsg("Eroare de rețea.", "danger");
        }
    };


    const handleLogout = () => {
        setShowModal(false)
        logout?.()
    }

    return (
        <>
            <IonModal
                isOpen={showModal}
                enterAnimation={enterAnimation}
                leaveAnimation={leaveAnimation}
                className="enhanced-premium-modal"
            >
                <div className="enhanced-modal-content">
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
                                <button className="enhanced-modal-action-button" onClick={handleChangePassword}>
                                    <div className="enhanced-action-icon">
                                        <IonIcon icon={lockClosedOutline} />
                                    </div>
                                    <div className="enhanced-action-content">
                                        <span className="enhanced-action-title">Schimbă Parola</span>
                                        <span className="enhanced-action-description">Actualizează parola contului</span>
                                    </div>
                                </button>

                                <button className="enhanced-modal-action-button" onClick={handleOrderHistory}>
                                    <div className="enhanced-action-icon">
                                        <IonIcon icon={timeOutline} />
                                    </div>
                                    <div className="enhanced-action-content">
                                        <span className="enhanced-action-title">Istoric Comenzi</span>
                                        <span className="enhanced-action-description">Vezi comenzile anterioare</span>
                                    </div>
                                </button>

                                <button className="enhanced-modal-action-button logout-button" onClick={handleLogout}>
                                    <div className="enhanced-action-icon">
                                        <IonIcon icon={logOutOutline} />
                                    </div>
                                    <div className="enhanced-action-content">
                                        <span className="enhanced-action-title">Deconectare</span>
                                        <span className="enhanced-action-description">Ieși din cont</span>
                                    </div>
                                </button>

                                <button className="enhanced-modal-action-button danger-button" onClick={() => setShowDeleteAlert(true)}>
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
                    isOpen={showDeleteAlert}
                    onDidDismiss={() => setShowDeleteAlert(false)}
                    header="Confirmare"
                    message="Ești sigur că vrei să-ți ștergi contul?"
                    buttons={[
                        {
                            text: "Anulează",
                            role: "cancel",
                        },
                        {
                            text: "Șterge",
                            handler: handleDeleteAccount,
                        },
                    ]}
                />

                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={2000}
                    color={toastColor}
                />

            </IonModal>

            {/* Enhanced Trigger Button */}
            <button className="enhanced-settings-button" onClick={() => setShowModal(true)}>
                <IonIcon icon={settingsOutline} />
            </button>
        </>
    );
};
