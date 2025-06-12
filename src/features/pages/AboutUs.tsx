
import type React from "react"
import { useState } from "react"
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonContent,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import {
    locate,
    logoFacebook,
    logoInstagram,
    hammerOutline,
    peopleOutline,
    ribbonOutline,
    constructOutline,
    callOutline,
    mailOutline,
    timeOutline,
    layersOutline,
    starOutline,
    sparkles,
    grid,
    cartOutline,
    arrowBackOutline,
} from "ionicons/icons"
import "../shared/theme/about-us-styles.css"
import "../shared/theme/enhanced-filters-styles.css"
import {MyModal} from "../shared/components/MyModal";
import WhatsAppButton from "../shared/components/WhatsAppButton";
const AboutUs: React.FC = () => {
    const history = useHistory()
    const [isExtrasOpen, setIsExtrasOpen] = useState(false)

    return (
        <IonPage className="about-page">
            {/* Background Elements */}
            <div className="about-background">
                <div className="background-overlay"></div>
                <div className="floating-element floating-element-1"></div>
                <div className="floating-element floating-element-2"></div>
                <div className="particle particle-1"></div>
                <div className="particle particle-2"></div>
            </div>

            <IonHeader className="modern-product-header">
                <IonToolbar className="articles-toolbar">
                    <div className="modern-toolbar-content">

                        <button className="modern-back-btn" onClick={() => history.push("/articlesClient")}>
                            <IonIcon icon={arrowBackOutline} />
                            <span>Înapoi</span>
                        </button>
                        {/* Logo */}


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

            {isExtrasOpen && (
                <>
                    {/* Background transparent overlay to close on outside click */}
                    <div className="extras-backdrop" onClick={() => setIsExtrasOpen(false)}></div>
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
                            Locație
                        </a>
                    </div>
                </>
            )}

            <IonContent className="about-content">
                <div className="about-container">


                    {/* Company Overview */}
                    <div className="about-section">
                        <div className="section-header">
                            <div className="section-icon">
                                <IonIcon icon={hammerOutline} />
                            </div>
                            <div className="section-title">
                                <h2>Despre Compania Noastră</h2>
                            </div>
                        </div>

                        <div className="section-content">
                            <p>
                                Cu o experiență de peste 18 ani în domeniul confecțiilor metalice, suntem dedicați să oferim soluții
                                personalizate și de înaltă calitate pentru clienții noștri. Fondată în 2007, compania noastră s-a
                                dezvoltat constant, investind în tehnologie modernă.
                            </p>
                            <p>
                                Specializați în producția de porți, garduri, balustrade și alte structuri metalice, ne mândrim cu
                                atenția la detalii și cu angajamentul nostru față de excelență. Fiecare proiect este tratat cu aceeași
                                dedicare, indiferent de dimensiune sau complexitate.
                            </p>
                        </div>
                    </div>



                    {/* Services */}
                    <div className="about-section">
                        <div className="section-header">
                            <div className="section-icon">
                                <IonIcon icon={constructOutline} />
                            </div>
                            <div className="section-title">
                                <h2>Serviciile Noastre</h2>
                            </div>
                        </div>

                        <div className="services-grid">
                            <IonCard className="service-card">
                                <div className="service-icon">
                                    <IonIcon icon={hammerOutline} />
                                </div>
                                <IonCardHeader>
                                    <IonCardTitle>Porți și Garduri</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    Proiectăm și fabricăm porți și garduri personalizate, atât manuale cât și automatizate, adaptate
                                    perfect nevoilor și stilului proprietății tale.
                                </IonCardContent>
                            </IonCard>

                            <IonCard className="service-card">
                                <div className="service-icon">
                                    <IonIcon icon={hammerOutline} />
                                </div>
                                <IonCardHeader>
                                    <IonCardTitle>Balustrade și Scări</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    Creăm balustrade elegante și scări funcționale pentru interior și exterior, combinând estetica cu
                                    siguranța și durabilitatea.
                                </IonCardContent>
                            </IonCard>

                            <IonCard className="service-card">
                                <div className="service-icon">
                                    <IonIcon icon={hammerOutline} />
                                </div>
                                <IonCardHeader>
                                    <IonCardTitle>Structuri Metalice</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    Realizăm structuri metalice complexe pentru diverse aplicații, de la pergole și copertine până la
                                    structuri industriale.
                                </IonCardContent>
                            </IonCard>

                            <IonCard className="service-card">
                                <div className="service-icon">
                                    <IonIcon icon={hammerOutline} />
                                </div>
                                <IonCardHeader>
                                    <IonCardTitle>Mobilier Metalic</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    Fabricăm mobilier metalic personalizat pentru interior și exterior, combinând funcționalitatea cu
                                    designul modern.
                                </IonCardContent>
                            </IonCard>
                        </div>
                    </div>


                    {/* Contact */}
                    <div className="about-section contact-section">
                        <div className="section-header">
                            <div className="section-icon">
                                <IonIcon icon={callOutline} />
                            </div>
                            <div className="section-title">
                                <h2>Contactează-ne</h2>
                                <p>Suntem Aici pentru Tine</p>
                            </div>
                        </div>

                        <div className="contact-grid">
                            <div className="contact-info">
                                <a href="tel:+40741173226" className="contact-item clickable">
                                    <IonIcon icon={callOutline} />
                                    <span>+40 741 173 226</span>
                                </a>
                                <a href="mailto:contact@confectii-metalice.ro" className="contact-item clickable">
                                    <IonIcon icon={mailOutline} />
                                    <span>contact@confectii-metalice.ro</span>
                                </a>
                                <div className="contact-item">
                                    <IonIcon icon={locate} />
                                    <span>Str. Veche 72, Lancram, Alba</span>
                                </div>
                                <div className="contact-item">
                                    <IonIcon icon={timeOutline} />
                                    <span>Luni-Vineri: 08:00-17:00</span>
                                </div>
                            </div>

                            <div className="contact-map">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11088.604874733428!2d23.547263!3d45.9882099!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474c1e0c10aa82e7%3A0x9164bafb32e2b418!2sStrada%20Veche%2072%2C%20Lancr%C4%83m%20515801!5e0!3m2!1sro!2sro!4v1748534849252!5m2!1sro!2sro"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0, borderRadius: "1rem" }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Locația noastră"
                                ></iframe>
                            </div>
                        </div>

                    </div>
                </div>
            </IonContent>
            <WhatsAppButton />
        </IonPage>
    )
}

export default AboutUs
