
import type React from "react"
import { useCallback, useState } from "react"
import { IonContent, IonIcon, IonPage } from "@ionic/react"
import {
    mail,
    sparkles,
    shield,
    flash,
    menu,
    close,
    star,
    people,
    briefcase,
    informationCircle,
    checkmarkCircleOutline,
    arrowBackOutline,
    trophyOutline,
    timeOutline,
    heartOutline,
} from "ionicons/icons"
import { useHistory } from "react-router-dom"
import "../shared/theme/Login-page.css"
import { baseUrl } from "../core"
import WhatsAppButton from "../shared/components/WhatsAppButton";

interface IForgotPasswordState {
    email?: string
}

const ForgotPassword: React.FC = () => {
    const history = useHistory()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [resetSuccess, setResetSuccess] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const [state, setState] = useState<IForgotPasswordState>({})
    const { email } = state

    const handleEmailChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setState({
                ...state,
                email: e.target.value || "",
            })
        },
        [state],
    )

    const handleResetPassword = useCallback(async () => {
        setIsLoading(true)
        setErrorMessage("")

        try {
            const response = await fetch(`https://${baseUrl}/api/auth/forgotpassword`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })

            const result = await response.json()
            if (response.ok) {
                setResetSuccess(true)

                setTimeout(() => {
                    history.push("/login")
                }, 3000)
            } else {
                setErrorMessage(result.error || "Error sending email.")
            }
        } catch (error) {
            setErrorMessage("Network error. Please check your connection.")
        } finally {
            setIsLoading(false)
        }
    }, [email, history])

    const handleBackToLogin = useCallback(() => {
        history.push("/login")
    }, [history])

    const handleAboutUsRedirect = useCallback(() => {
        history.push("/aboutus")
    }, [history])

    const handleReviewUsRedirect = useCallback(() => {
        history.push("/reviewus")
    }, [history])

    const handleOurWorkRedirect = useCallback(() => {
        history.push("/our-work")
    }, [history])

    const handleContactRedirect = useCallback(() => {
        history.push("/contact")
    }, [history])

    return (
        <IonPage>
            <IonContent className="login-page-content">
                {/* Background */}
                <div className="background-container">
                    <div className="background-overlay"></div>
                    <div className="floating-element floating-element-1"></div>
                    <div className="floating-element floating-element-2"></div>
                    <div className="floating-element floating-element-3"></div>
                    <div className="particle particle-1"></div>
                    <div className="particle particle-2"></div>
                    <div className="particle particle-3"></div>
                    <div className="particle particle-4"></div>
                </div>

                {/* Navigation */}
                <div className="navigation-bar">
                    <div className="nav-container">
                        <div className="nav-content">
                            {/* Logo */}
                            <div className="logo-section">
                                <div className="logo-icon">
                                    <IonIcon icon={sparkles} />
                                </div>
                                <span className="logo-text">Confectii Metalice DN</span>
                            </div>

                            {/* Desktop Navigation */}
                            <div className="desktop-nav">
                                <button className="nav-button" onClick={handleAboutUsRedirect}>
                                    <IonIcon icon={informationCircle} />
                                    <span>Despre Noi</span>
                                </button>
                                <button className="nav-button" onClick={handleReviewUsRedirect}>
                                    <IonIcon icon={star} />
                                    <span>Recenzii</span>
                                </button>
                                <button className="nav-button" onClick={handleOurWorkRedirect}>
                                    <IonIcon icon={briefcase} />
                                    <span>Proiectele Noastre</span>
                                </button>
                            </div>

                            {/* Mobile menu button */}
                            <button className="mobile-menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                <IonIcon icon={isMenuOpen ? close : menu} />
                            </button>
                        </div>

                        {/* Mobile Navigation Menu */}
                        {isMenuOpen && (
                            <div className="mobile-nav-menu">
                                <button className="nav-button" onClick={handleAboutUsRedirect}>
                                    <IonIcon icon={informationCircle} />
                                    <span>Despre Noi</span>
                                </button>
                                <button className="nav-button" onClick={handleReviewUsRedirect}>
                                    <IonIcon icon={star} />
                                    <span>Recenzii</span>
                                </button>
                                <button className="nav-button" onClick={handleOurWorkRedirect}>
                                    <IonIcon icon={briefcase} />
                                    <span>Proiectele Noastre</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="main-content">
                    {/* Left side - Hero */}
                    <div className="hero-section">
                        <div className="hero-content">
                            {/* Trust badge */}
                            <div className="trust-badge">
                                <div className="status-indicator"></div>
                                <span>Secure password recovery</span>
                            </div>

                            <h1 className="hero-title">
                                RESET YOUR
                                <span className="gradient-text">PASSWORD</span>
                                <span className="hero-subtitle">SECURELY & QUICKLY</span>
                            </h1>

                            <p className="hero-description">
                                WE'LL SEND YOU A TEMPORARY PASSWORD.
                                <span className="hero-tagline">SECURE. FAST. RELIABLE.</span>
                            </p>

                            {/* Features */}
                            <div className="features-list">

                                <div className="feature-item">
                                    <div className="feature-icon feature-icon-blue">
                                        <IonIcon icon={flash} />
                                    </div>
                                    <div className="feature-content">
                                        <span className="feature-title">Instant Delivery</span>
                                        <p className="feature-description">Immediate email</p>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon feature-icon-purple">
                                        <IonIcon icon={sparkles} />
                                    </div>
                                    <div className="feature-content">
                                        <span className="feature-title">Easy Recovery</span>
                                        <p className="feature-description">Simple process</p>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>

                    {/* Right side - Reset Password */}
                    <div className="login-section">
                        <div className="login-container">
                            {/* Mobile hero */}
                            <div className="mobile-hero">
                                <h1 className="mobile-title">
                                    Reset Password
                                    <span className="mobile-brand">Confectii Metalice DN</span>
                                </h1>
                                <p className="mobile-description">Recover your account securely</p>


                            </div>

                            <div className="login-card">
                                <div className="card-glow"></div>

                                <div className="login-header">
                                    <h2 className="login-title">Reset Password</h2>
                                    <p className="login-subtitle">Enter your email to receive a temporary password</p>
                                </div>

                                <div className="login-content-area">
                                    {/* Success Message */}
                                    {resetSuccess && (
                                        <div className="success-message">
                                            <IonIcon icon={checkmarkCircleOutline} />
                                            <span>Temporary password sent! Check your email. Redirecting to login...</span>
                                        </div>
                                    )}

                                    {/* Error Message */}
                                    {errorMessage && (
                                        <div className="error-message">
                                            <IonIcon icon={informationCircle} />
                                            <span>{errorMessage}</span>
                                        </div>
                                    )}

                                    {/* Form */}
                                    <div className="form-section">
                                        {/* Email Input */}
                                        <div className="input-group">
                                            <label className="input-label">Email Address</label>
                                            <div className="input-container">
                                                <IonIcon icon={mail} className="input-icon" />
                                                <input
                                                    type="email"
                                                    placeholder="Enter your email address"
                                                    className="custom-input"
                                                    value={email || ""}
                                                    onChange={handleEmailChange}
                                                    disabled={isLoading || resetSuccess}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="buttons-section">
                                        {/* Reset Password Button */}
                                        <button
                                            className="primary-button"
                                            onClick={handleResetPassword}
                                            disabled={isLoading || !email || resetSuccess}
                                        >
                      <span className="button-content">
                        {isLoading ? "Sending..." : resetSuccess ? "Email Sent!" : "Send Temporary Password"}
                      </span>
                                            <div className="button-glow"></div>
                                        </button>

                                        {/* Divider */}
                                        <div className="divider">
                                            <span>Remember your password?</span>
                                        </div>

                                        {/* Back to Login Button */}
                                        <button className="secondary-button" onClick={handleBackToLogin} disabled={isLoading}>
                                            <IonIcon icon={arrowBackOutline} style={{ marginRight: "0.5rem" }} />
                                            <span className="button-content">Back to Login</span>
                                        </button>
                                    </div>

                                    {/* Trust indicators */}
                                    <div className="trust-indicators">
                                        <div className="trust-item">
                                            <IonIcon icon={shield} />
                                            <span>Secure</span>
                                        </div>
                                        <div className="trust-item">
                                            <IonIcon icon={flash} />
                                            <span>Fast</span>
                                        </div>
                                        <div className="trust-item">
                                            <IonIcon icon={sparkles} />
                                            <span>Reliable</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom text */}
                            <p className="bottom-text">
                                Having trouble? Contact our{" "}
                                <a href="#" className="link">
                                    Support Team
                                </a>{" "}
                                for assistance
                            </p>
                        </div>
                    </div>
                </div>
            </IonContent>
            <WhatsAppButton />
        </IonPage>
    )
}

export { ForgotPassword }
