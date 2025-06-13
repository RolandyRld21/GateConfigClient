
import type React from "react"
import { useCallback, useState } from "react"
import { IonContent, IonIcon, IonPage } from "@ionic/react"
import {
    mail,
    lockClosed,
    sparkles,
    shield,
    flash,
    menu,
    close,
    star,
    people,
    briefcase,
    informationCircle,
    eyeOutline,
    eyeOffOutline,
    trophyOutline,
    timeOutline,
    heartOutline,
    personOutline,
    checkmarkCircleOutline,
} from "ionicons/icons"
import { useHistory } from "react-router-dom"
import "../shared/theme/Login-page.css"
import { getLogger, baseUrl } from "../core"
import "../shared/theme/signup-additions.css"
import WhatsAppButton from "../shared/components/WhatsAppButton";

const log = getLogger("SignUp")

interface ISignUpState {
    username?: string
    password?: string
    email?: string
}


const SignUp: React.FC = () => {
    const history = useHistory()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [signUpSuccess, setSignUpSuccess] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const [state, setState] = useState<ISignUpState>({})

    const { username, password, email } = state


    const handleUsernameChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setState({
                ...state,
                username: e.target.value || "",
            })
        },
        [state],
    )

    const handlePasswordChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setState({
                ...state,
                password: e.target.value || "",
            })
        },
        [state],
    )

    const handleEmailChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setState({
                ...state,
                email: e.target.value || "",
            })
        },
        [state],
    )

    const handleSignUp = useCallback(async () => {
        log("handleSignUp...")
        setIsLoading(true)
        setErrorMessage("")

        try {
            const response = await fetch(`https://${baseUrl}/api/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password, email }),
            })

            const data = await response.json()
            if (data.success) {
                log("Sign up successful")
                setSignUpSuccess(true)

                setTimeout(() => {
                    history.push("/login")
                }, 2000)
            } else {
                log("Sign up failed")
                setErrorMessage(data.message || "Sign up failed. Please try again.")
            }
        } catch (error) {
            log("Sign up error: ", error)
            setErrorMessage("Network error. Please check your connection.")
        } finally {
            setIsLoading(false)
        }
    }, [username, password, email, history])

    const handleLoginRedirect = useCallback(() => {
        log("Redirecting to Login...")
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

    log("render")

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
                                <span>Join 10,000+ satisfied customers</span>
                            </div>

                            <h1 className="hero-title">
                                CREATE YOUR
                                <span className="gradient-text">ACCOUNT</span>
                                <span className="hero-subtitle">AND START YOUR JOURNEY</span>
                            </h1>

                            <p className="hero-description">
                                GET ACCESS TO PREMIUM METAL GATES.
                                <span className="hero-tagline">SECURE. ELEGANT. TIMELESS.</span>
                            </p>

                            {/* Features */}
                            <div className="features-list">

                                <div className="feature-item">
                                    <div className="feature-icon feature-icon-blue">
                                        <IonIcon icon={flash} />
                                    </div>
                                    <div className="feature-content">
                                        <span className="feature-title">Quick Setup</span>
                                        <p className="feature-description">Get started in minutes</p>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon feature-icon-purple">
                                        <IonIcon icon={sparkles} />
                                    </div>
                                    <div className="feature-content">
                                        <span className="feature-title">Premium Access</span>
                                        <p className="feature-description">Exclusive designs</p>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>

                    {/* Right side - Sign Up */}
                    <div className="login-section">
                        <div className="login-container">
                            {/* Mobile hero */}
                            <div className="mobile-hero">
                                <h1 className="mobile-title">
                                    Join
                                    <span className="mobile-brand">Confectii Metalice DN</span>
                                </h1>
                                <p className="mobile-description">Create your account today</p>


                            </div>

                            <div className="login-card">
                                <div className="card-glow"></div>

                                <div className="login-header">
                                    <h2 className="login-title">Create Account</h2>
                                    <p className="login-subtitle">Join our community of satisfied customers</p>
                                </div>

                                <div className="login-content-area">
                                    {/* Success Message */}
                                    {signUpSuccess && (
                                        <div className="success-message">
                                            <IonIcon icon={checkmarkCircleOutline} />
                                            <span>Account created successfully! Redirecting to login...</span>
                                        </div>
                                    )}

                                    {/* Error Message */}
                                    {errorMessage && (
                                        <div className="error-message" style={{ color: "#1976d2" }}>
                                            <IonIcon icon={informationCircle} style={{ color: "#1976d2", marginRight: "0.5rem" }} />
                                            <span>{errorMessage}</span>
                                        </div>
                                    )}

                                    {/* Form */}
                                    <div className="form-section">
                                        {/* Username Input */}
                                        <div className="input-group">
                                            <label className="input-label">Username</label>
                                            <div className="input-container">
                                                <IonIcon icon={personOutline} className="input-icon" />
                                                <input
                                                    type="text"
                                                    placeholder="Choose a username"
                                                    className="custom-input"
                                                    value={username || ""}
                                                    onChange={handleUsernameChange}
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>

                                        {/* Email Input */}
                                        <div className="input-group">
                                            <label className="input-label">Email Address</label>
                                            <div className="input-container">
                                                <IonIcon icon={mail} className="input-icon" />
                                                <input
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    className="custom-input"
                                                    value={email || ""}
                                                    onChange={handleEmailChange}
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>

                                        {/* Password Input */}
                                        <div className="input-group">
                                            <label className="input-label">Password</label>
                                            <div className="input-container">
                                                <IonIcon icon={lockClosed} className="input-icon" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Create a password"
                                                    className="custom-input"
                                                    value={password || ""}
                                                    onChange={handlePasswordChange}
                                                    disabled={isLoading}
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    disabled={isLoading}
                                                >
                                                    <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="buttons-section">
                                        {/* Sign Up Button */}
                                        <button
                                            className="primary-button"
                                            onClick={handleSignUp}
                                            disabled={isLoading || !username || !email || !password || signUpSuccess}
                                        >
                                            <span className="button-content">{isLoading ? "Creating Account..." : "Create Account"}</span>
                                            <div className="button-glow"></div>
                                        </button>


                                        {/* Login Button */}
                                        <button className="secondary-button" onClick={handleLoginRedirect} disabled={isLoading}>
                                            <span className="button-content">Sign In</span>
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
                                            <span>Premium</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom text */}
                            <p className="bottom-text">
                                By creating an account, you agree to our{" "}
                                <a href="#" className="link">
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a href="#" className="link">
                                    Privacy Policy
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </IonContent>
            <WhatsAppButton />
        </IonPage>
    )
}

export { SignUp }
