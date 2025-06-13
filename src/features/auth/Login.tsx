
import React, { useCallback, useContext, useEffect } from "react"
import { useState } from "react"
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
    briefcase,
    informationCircle,
    eyeOutline,
    eyeOffOutline,
} from "ionicons/icons"
import { useHistory } from "react-router-dom"
import "../shared/theme/Login-page.css"
import { getLogger } from "../core"
import { AuthContext } from "./AuthProvider"
import WhatsAppButton from "../shared/components/WhatsAppButton";

const log = getLogger("Login")

interface ILoginState {
    email?: string
    password?: string
}

export const Login: React.FC = React.memo(() => {
    const history = useHistory()
    const { isAuthenticated, isAuthenticating, login, authenticationError, role } = useContext(AuthContext)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const [state, setState] = useState<ILoginState>({})

    const { email, password } = state


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

    const handleLogin = useCallback(() => {
        log("handleLogin...")
        login?.(email, password)
    }, [email, password, login])


    const handleSignUpRedirect = useCallback(() => {
        log("Redirecting to SignUp...")
        history.push("/signup")
    }, [history])

    const handleForgotPasswordRedirect = useCallback(() => {
        log("Redirecting to ForgotPassword")
        history.push("/forgotpassword")
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


    useEffect(() => {
        if (isAuthenticated) {
            log(`User is authenticated with role: ${role}`)
            if (role === "admin") {
                history.push("/admin-dashboard")
            } else {
                history.push("/articlesClient")
            }
        }
    }, [isAuthenticated, role, history])

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
                </div>F

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
                                <span>Trusted by 10,000+ customers</span>
                            </div>

                            <h1 className="hero-title">
                                WE CREATE THE
                                <span className="gradient-text">FUTURE</span>
                                <span className="hero-subtitle">OF YOUR HOME</span>
                            </h1>

                            <p className="hero-description">
                                WITH DURABLE AND STYLISH METAL GATES.
                                <span className="hero-tagline">SECURE. ELEGANT. TIMELESS.</span>
                            </p>

                            {/* Features */}
                            <div className="features-list">

                                <div className="feature-item">
                                    <div className="feature-icon feature-icon-blue">
                                        <IonIcon icon={flash} />
                                    </div>
                                    <div className="feature-content">
                                        <span className="feature-title">Quick Installation</span>
                                        <p className="feature-description">Professional setup</p>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon feature-icon-purple">
                                        <IonIcon icon={sparkles} />
                                    </div>
                                    <div className="feature-content">
                                        <span className="feature-title">Custom Design</span>
                                        <p className="feature-description">Tailored to your style</p>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>

                    {/* Right side - Login */}
                    <div className="login-section">
                        <div className="login-container">
                            {/* Mobile hero */}
                            <div className="mobile-hero">
                                <h1 className="mobile-title">
                                    Welcome to
                                    <span className="mobile-brand">Confectii Metalice DN</span>
                                </h1>
                                <p className="mobile-description">Premium metal gates for your home</p>


                            </div>

                            <div className="login-card">

                                <div className="login-header">
                                    <h2 className="login-title">Welcome Back</h2>
                                    <p className="login-subtitle">Sign in to continue your journey</p>
                                </div>

                                <div className="login-content-area">
                                    {/* Error Message */}
                                    {authenticationError && (
                                        <div className="error-message">
                                            <IonIcon icon={informationCircle} />
                                            <span>{authenticationError.message || "Authentication failed"}</span>
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
                                                    placeholder="Enter your email"
                                                    className="custom-input"
                                                    value={email || ""}
                                                    onChange={handleEmailChange}
                                                    disabled={isAuthenticating}
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
                                                    placeholder="Enter your password"
                                                    className="custom-input"
                                                    value={password || ""}
                                                    onChange={handlePasswordChange}
                                                    disabled={isAuthenticating}
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    disabled={isAuthenticating}
                                                >
                                                    <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="buttons-section">
                                        {/* Login Button */}
                                        <button
                                            className="primary-button"
                                            onClick={handleLogin}
                                            disabled={isAuthenticating || !email || !password}
                                        >
                                            <span className="button-content">{isAuthenticating ? "Signing In..." : "Sign In"}</span>
                                            <div className="button-glow"></div>
                                        </button>

                                        {/* Divider */}
                                        <div className="divider">
                                            <span>Or</span>
                                        </div>

                                        {/* Sign Up Button */}
                                        <button className="secondary-button" onClick={handleSignUpRedirect} disabled={isAuthenticating}>
                                            <span className="button-content">Create Account</span>
                                        </button>

                                        {/* Forgot Password Button */}
                                        <button className="ghost-button" onClick={handleForgotPasswordRedirect} disabled={isAuthenticating}>
                                            <span className="button-content">Forgot Password?</span>
                                        </button>
                                    </div>

                                    {/* Trust indicators */}
                                    <div className="trust-indicators">
                                        <div className="trust-item">
                                            <IonIcon icon={shield} />
                                            <span>SSL</span>
                                        </div>
                                        <div className="trust-item">
                                            <IonIcon icon={flash} />
                                            <span>Fast</span>
                                        </div>
                                        <div className="trust-item">
                                            <IonIcon icon={sparkles} />
                                            <span>Secure</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom text */}
                            <p className="bottom-text">
                                By signing in, you agree to our{" "}
                                <a href="#" className="link">
                                    Terms
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
})

export default Login
