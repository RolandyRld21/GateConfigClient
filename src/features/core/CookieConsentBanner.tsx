// src/components/CookieConsentBanner.tsx
import CookieConsent from "react-cookie-consent";

const CookieConsentBanner = () => {
    return (
        <CookieConsent
            location="bottom"
            buttonText="Accept"
            cookieName="gateConfigCookiesAccepted"
            style={{ background: "#2B373B", zIndex: 1000 }}
            buttonStyle={{ color: "#fff", background: "#3880ff", borderRadius: "5px", padding: "8px 16px" }}
            expires={150}
        >
            Folosim cookies pentru a îmbunătăți experiența utilizatorului și pentru servicii externe (ex. Stripe). Continuarea implică acordul tău.
        </CookieConsent>
    );
};

export default CookieConsentBanner;
