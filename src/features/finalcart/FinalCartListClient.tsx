import type React from "react"
import { useContext, useEffect, useState } from "react"
import {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonLoading,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import {
    receiptOutline,
    timeOutline,
    pricetagOutline,
    carOutline,
    chatbubbleOutline,
    eyeOutline,
    arrowBackOutline,
    sparkles,
    starOutline,
    layersOutline,
    grid,
    cartOutline,
    checkmarkCircleOutline,
    ellipseOutline,
    playCircleOutline,
    stopCircleOutline, close, menu, logoInstagram, logoFacebook, locate,
} from "ionicons/icons"
import { AuthContext } from "../auth"
import { fetchFinalCarts, type FinalCart } from "./cartApi"
import "../shared/theme/final-cart-list-client-styles.css"
import "../shared/theme/enhanced-filters-styles.css"
import {MyModal} from "../shared/components/MyModal";
import WhatsAppButton from "../shared/components/WhatsAppButton";
const FinalCartListClient: React.FC = () => {
    const history = useHistory()
    const { token } = useContext(AuthContext)
    const [carts, setCarts] = useState<FinalCart[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [isExtrasOpen, setIsExtrasOpen] = useState(false)

    useEffect(() => {
        const loadCarts = async () => {
            setLoading(true)
            try {
                const data = await fetchFinalCarts(token)
                setCarts(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
            } catch (err) {
                console.error("Failed to load final carts", err)
            }
            setLoading(false)
        }
        loadCarts()
    }, [token])

    function getStatusColor(status: string): string {
        switch (status) {
            case "Confirmată":
                return "#3b82f6"
            case "În producție":
                return "#f59e0b"
            case "În curs de livrare":
                return "#8b5cf6"
            case "Livrată":
                return "#22c55e"
            default:
                return "#64748b"
        }
    }

    function getStatusIcon(status: string) {
        switch (status) {
            case "Confirmată":
                return checkmarkCircleOutline
            case "În producție":
                return playCircleOutline
            case "În curs de livrare":
                return carOutline
            case "Livrată":
                return stopCircleOutline
            default:
                return ellipseOutline
        }
    }

    return (
        <IonPage className="final-cart-list-page">
            {/* Background Elements */}
            <div className="final-cart-list-background">
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

            <IonContent className="final-cart-list-content">
                <IonLoading isOpen={loading} message="Se încarcă..." />

                <div className="final-cart-list-container">
                    {/* Page Header */}
                    <div className="final-cart-list-page-header">
                        <div className="page-header-content">
                            <div className="header-icon">
                                <IonIcon icon={receiptOutline} />
                            </div>
                            <div className="header-info">
                                <h1 className="page-title">Comenzile Mele</h1>
                                <p className="page-subtitle">Urmărește statusul și istoricul comenzilor tale</p>
                            </div>
                        </div>
                        <div className="orders-stats">
                            <div className="stat-item">
                                <span className="stat-number">{carts.length}</span>
                                <span className="stat-label">Comenzi</span>
                            </div>
                        </div>
                    </div>

                    {/* Orders List */}
                    {carts.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <IonIcon icon={receiptOutline} />
                            </div>
                            <h3>Nu ai comenzi încă</h3>
                            <p>Explorează produsele noastre și plasează prima comandă</p>
                            <IonButton className="browse-products-btn" onClick={() => history.push("/articlesClient")}>
                                Explorează Produsele
                            </IonButton>
                        </div>
                    ) : (
                        <div className="orders-grid">
                            {carts.map((cart) => (
                                <IonCard key={cart.id} className="order-card">
                                    <IonCardHeader className="order-card-header">
                                        <div className="order-header-content">
                                            <div className="order-id-section">
                                                <IonIcon icon={receiptOutline} className="order-icon" />
                                                <div className="order-id-info">
                                                    <IonCardTitle className="order-title">Comandă #{cart.id}</IonCardTitle>
                                                    <div className="order-date">
                                                        <IonIcon icon={timeOutline} />
                                                        <span>{new Date(cart.created_at).toLocaleString("ro-RO")}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="order-status">
                                                <div
                                                    className="status-badge"
                                                    style={{
                                                        backgroundColor: getStatusColor(cart.status),
                                                    }}
                                                >
                                                    <IonIcon icon={getStatusIcon(cart.status)} />
                                                    <span>{cart.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </IonCardHeader>

                                    <IonCardContent className="order-card-content">
                                        <div className="order-details">
                                            <div className="detail-row">
                                                <div className="detail-item">
                                                    <IonIcon icon={pricetagOutline} />
                                                    <span className="detail-label">Total:</span>
                                                    <span className="detail-value">{cart.total_price} RON</span>
                                                </div>
                                                <div className="detail-item">
                                                    <IonIcon icon={carOutline} />
                                                    <span className="detail-label">Livrare:</span>
                                                    <span className="detail-value">{cart.delivery_fee} RON</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="order-actions">
                                            <IonButton
                                                expand="block"
                                                className="primary-action-btn"
                                                onClick={() => history.push(`/order-history/${cart.id}`)}
                                            >
                                                <IonIcon icon={eyeOutline} slot="start" />
                                                Vezi Detalii
                                            </IonButton>
                                            <IonButton
                                                expand="block"
                                                fill="outline"
                                                className="secondary-action-btn"
                                                onClick={() => history.push(`/messages/${cart.id}`)}
                                            >
                                                <IonIcon icon={chatbubbleOutline} slot="start" />
                                                Mesagerie
                                            </IonButton>
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            ))}
                        </div>
                    )}
                </div>
            </IonContent>
            <WhatsAppButton />
        </IonPage>
    )
}

export default FinalCartListClient
