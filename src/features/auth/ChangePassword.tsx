"use client"

import type React from "react"
import { useState, useCallback, useContext } from "react"
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonContent,
    IonInput,
    IonButton,
    IonLabel,
    IonItem,
    IonIcon,
    IonLoading,
    IonAlert,
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import {
    lockClosedOutline,
    eyeOutline,
    eyeOffOutline,
    checkmarkCircleOutline,
    alertCircleOutline,
    arrowBackOutline,
    sparkles,
    starOutline,
    layersOutline,
    grid,
    cartOutline,
    shieldCheckmarkOutline, close, menu, logoInstagram, logoFacebook, locate,
} from "ionicons/icons"
import { baseUrl } from "../core"
import { AuthContext } from "../auth"
import "../shared/theme/change-password-styles.css"
import {MyModal} from "../shared/components/MyModal";
import "../shared/theme/enhanced-filters-styles.css"
import WhatsAppButton from "../shared/components/WhatsAppButton";
const ChangePassword: React.FC = () => {
    const history = useHistory()
    const [newPassword, setNewPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [currentPassword, setCurrentPassword] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false)
    const [showAlert, setShowAlert] = useState<boolean>(false)
    const [isExtrasOpen, setIsExtrasOpen] = useState(false)

    const { email, token } = useContext(AuthContext)

    // Password validation
    const validatePassword = (password: string): string[] => {
        const errors: string[] = []
        if (password.length < 8) errors.push("Parola trebuie să aibă cel puțin 8 caractere")
        return errors
    }




    // Handle password change
    const handleChangePassword = useCallback(async () => {
        setError(null)
        setSuccess(null)

        // Validation
        if (!currentPassword) {
            setError("Parola curentă este obligatorie")
            return
        }

        if (!newPassword) {
            setError("Parola nouă este obligatorie")
            return
        }

        if (newPassword !== confirmPassword) {
            setError("Parolele nu se potrivesc")
            return
        }

        if (!email || !token) {
            setError("Utilizatorul nu este autentificat")
            return
        }

        if (currentPassword === newPassword) {
            setError("Parola nouă trebuie să fie diferită de cea curentă")
            return
        }

        setLoading(true)

        try {
            const response = await fetch(`http://${baseUrl}/api/auth/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                    email,
                }),
            })

            const data = await response.json()

            if (data.success) {
                setSuccess("Parola a fost schimbată cu succes!")
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
                setShowAlert(true)
            } else {
                setError(data.message || "Eroare la schimbarea parolei")
            }
        } catch (error) {
            console.error("Password change error: ", error)
            setError("A apărut o eroare la schimbarea parolei")
        } finally {
            setLoading(false)
        }
    }, [newPassword, confirmPassword, currentPassword, email, token])


    return (
        <IonPage className="change-password-page">
            {/* Background Elements */}
            <div className="change-password-background">
                <div className="background-overlay"></div>
                <div className="floating-element floating-element-1"></div>
                <div className="floating-element floating-element-2"></div>
                <div className="particle particle-1"></div>
                <div className="particle particle-2"></div>
            </div>

            <IonHeader className="articles-header">
                <IonToolbar className="articles-toolbar">
                    <div className="modern-toolbar-content">
                        {/* Logo */}
                        <div className="toolbar-logo" onClick={() => history.push("/articlesClient")}>
                            <div className="logo-icon">
                                <IonIcon icon={sparkles} />
                            </div>
                            <span className="logo-text">Confectii Metalice DN</span>
                        </div>

                        {/* Right Actions */}
                        <div className="toolbar-actions">

                            <div className="desktop-toolbar-extras-items" onClick={() => history.push("/aboutus")}>
                                <IonIcon icon={sparkles} />
                                <span>Despre Noi</span>
                            </div>
                            <div className="desktop-toolbar-extras-items" onClick={() => history.push("/reviewus")}>
                                <IonIcon icon={starOutline} />
                                <span>Recenzii</span>
                            </div>
                            <div className="desktop-toolbar-extras-items" onClick={() => history.push("/our-work")}>
                                <IonIcon icon={layersOutline} />
                                <span>Proiectele Noastre</span>
                            </div>

                            {/* Settings Modal */}
                            <button className="action-button" onClick={() => setIsExtrasOpen(!isExtrasOpen)}>
                                <IonIcon icon={grid} />
                            </button>
                            {/* Cart Button */}
                            <button className="action-button" onClick={() => history.push("/cart")}>
                                <IonIcon icon={cartOutline}/>
                            </button>

                            {/* Settings Modal */}
                            <MyModal />

                        </div>

                    </div>
                </IonToolbar>
            </IonHeader>
            {isExtrasOpen && (
                <>
                    {/* Background transparent overlay to close on outside click */}
                    <div
                        className="extras-backdrop"
                        onClick={() => setIsExtrasOpen(false)}
                    ></div>
                    <div className="extras-overlay">
                        <div className="extras-item" onClick={() => history.push("/aboutus")}>
                            <IonIcon icon={sparkles} />
                            <span>Despre Noi</span>
                        </div>
                        <div className="extras-item" onClick={() => history.push("/reviewus")}>
                            <IonIcon icon={starOutline} />
                            <span>Recenzii</span>
                        </div>
                        <div className="extras-item" onClick={() => history.push("/our-work")}>
                            <IonIcon icon={layersOutline} />
                            <span>Proiectele Noastre</span>
                        </div>
                        <a className="extras-item" href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <IonIcon icon={logoInstagram} />
                            <span>Instagram</span>
                        </a>
                        <a className="extras-item" href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <IonIcon icon={logoFacebook} />
                            <span>Facebook</span>
                        </a>
                        <a
                            href="https://maps.app.goo.gl/AT4vJNj38krRNNNW8"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="extras-item"
                        >
                            <IonIcon icon={locate} />
                            Locatie
                        </a>
                    </div>
                </>
            )}

            <IonContent className="change-password-content">
                <IonLoading isOpen={loading} message="Se schimbă parola..." />

                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => {
                        setShowAlert(false)
                        history.goBack()
                    }}
                    header="Succes!"
                    message="Parola a fost schimbată cu succes. Vei fi redirectat înapoi."
                    buttons={["OK"]}
                />

                <div className="change-password-container">
                    {/* Page Header */}
                    <div className="change-password-page-header">
                        <div className="page-header-content">
                            <div className="header-icon">
                                <IonIcon icon={shieldCheckmarkOutline} />
                            </div>
                            <div className="header-info">
                                <h1 className="page-title">Schimbă Parola</h1>
                                <p className="page-subtitle">Actualizează-ți parola pentru o securitate sporită</p>
                            </div>
                        </div>
                    </div>

                    {/* Security Tips */}
                    <div className="security-tips">
                        <div className="tips-header">
                            <IonIcon icon={lockClosedOutline} />
                            <h3>Sfaturi pentru o parolă sigură</h3>
                        </div>
                        <ul className="tips-list">
                            <li>Folosește cel puțin 8 caractere</li>
                            <li>Combină litere mari și mici</li>
                            <li>Adaugă cifre și caractere speciale</li>
                            <li>Evită informații personale</li>
                            <li>Nu reutiliza parole vechi</li>
                        </ul>
                    </div>

                    {/* Password Change Form */}
                    <div className="password-form">
                        <div className="form-section">
                            <div className="section-header">
                                <div className="section-icon">
                                    <IonIcon icon={lockClosedOutline} />
                                </div>
                                <div className="section-title">
                                    <h3>Schimbă Parola</h3>
                                    <p>Introdu parola curentă și cea nouă</p>
                                </div>
                            </div>

                            <div className="form-fields">
                                {/* Current Password */}
                                <div className="password-field">
                                    <IonItem className="password-item">
                                        <IonLabel position="stacked">Parola Curentă</IonLabel>
                                        <IonInput
                                            type={showCurrentPassword ? "text" : "password"}
                                            value={currentPassword}
                                            onIonChange={(e) => setCurrentPassword(e.detail.value!)}
                                            placeholder="Introdu parola curentă"
                                            className="password-input"
                                        />
                                        <button
                                            className="password-toggle"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            type="button"
                                        >
                                            <IonIcon icon={showCurrentPassword ? eyeOffOutline : eyeOutline} />
                                        </button>
                                    </IonItem>
                                </div>

                                {/* New Password */}
                                <div className="password-field">
                                    <IonItem className="password-item">
                                        <IonLabel position="stacked">Parola Nouă</IonLabel>
                                        <IonInput
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onIonChange={(e) => setNewPassword(e.detail.value!)}
                                            placeholder="Introdu parola nouă"
                                            className="password-input"
                                        />
                                        <button
                                            className="password-toggle"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            type="button"
                                        >
                                            <IonIcon icon={showNewPassword ? eyeOffOutline : eyeOutline} />
                                        </button>
                                    </IonItem>


                                </div>

                                {/* Confirm Password */}
                                <div className="password-field">
                                    <IonItem className="password-item">
                                        <IonLabel position="stacked">Confirmă Parola Nouă</IonLabel>
                                        <IonInput
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                                            placeholder="Confirmă parola nouă"
                                            className="password-input"
                                        />
                                        <button
                                            className="password-toggle"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            type="button"
                                        >
                                            <IonIcon icon={showConfirmPassword ? eyeOffOutline : eyeOutline} />
                                        </button>
                                    </IonItem>

                                    {/* Password Match Indicator */}
                                    {confirmPassword && (
                                        <div className="password-match">
                                            {newPassword === confirmPassword ? (
                                                <div className="match-success">
                                                    <IonIcon icon={checkmarkCircleOutline} />
                                                    <span>Parolele se potrivesc</span>
                                                </div>
                                            ) : (
                                                <div className="match-error">
                                                    <IonIcon icon={alertCircleOutline} />
                                                    <span>Parolele nu se potrivesc</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Error/Success Messages */}
                            {error && (
                                <div className="message error-message">
                                    <IonIcon icon={alertCircleOutline} />
                                    <span>{error}</span>
                                </div>
                            )}

                            {success && (
                                <div className="message success-message">
                                    <IonIcon icon={checkmarkCircleOutline} />
                                    <span>{success}</span>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="form-actions">
                                <IonButton
                                    expand="block"
                                    className="change-password-btn"
                                    onClick={handleChangePassword}
                                    disabled={
                                        loading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword
                                    }
                                >
                                    <IonIcon icon={shieldCheckmarkOutline} slot="start" />
                                    {loading ? "Se schimbă..." : "Schimbă Parola"}
                                </IonButton>

                                <IonButton
                                    expand="block"
                                    fill="outline"
                                    className="cancel-btn"
                                    onClick={() => history.goBack()}
                                    disabled={loading}
                                >
                                    Anulează
                                </IonButton>
                            </div>
                        </div>
                    </div>
                </div>
            </IonContent>
            <WhatsAppButton />
        </IonPage>
    )
}

export default ChangePassword
