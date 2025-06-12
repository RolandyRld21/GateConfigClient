
import type React from "react"
import { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import {
    IonPage,
    IonHeader,
    IonContent,
    IonItem,
    IonLabel,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonLoading,
    IonModal,
    IonInput,
    IonIcon,
    IonToolbar,
    IonTitle,
} from "@ionic/react"
import { AuthContext } from "../auth"
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import {
    fetchCartOrders,
    fetchAddresses,
    addAddress,
    deleteOrder,
    calculateDistance,
    finalizeCart as finalizeCartRequest,
    createPaymentIntent,
    type Order,
    type Address,
} from "../finalcart/cartApi"
import "../shared/theme/cart-page-styles.css"

import {
    cartOutline,
    locationOutline,
    cardOutline,
    checkmarkCircleOutline,
    trashOutline,
    addOutline,
    closeOutline,
    resizeOutline,
    pricetagOutline,
    homeOutline,
    callOutline,
    sparkles,
    starOutline,
    layersOutline,
    grid,
    logoInstagram,
    logoFacebook,
    locate, arrowBackOutline,
} from "ionicons/icons"
import { MyModal } from "../shared/components/MyModal"
import "../shared/theme/enhanced-filters-styles.css"
import WhatsAppButton from "../shared/components/WhatsAppButton";

const COST_PER_KM = 2
const SEBES_COORDS = { lat: 45.9595, lon: 23.5733 }

const CartPage: React.FC = () => {
    const { token } = useContext(AuthContext)
    const history = useHistory() // Adăugat useHistory hook
    const [orders, setOrders] = useState<Order[]>([])
    const [addresses, setAddresses] = useState<Address[]>([])
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
    const [deliveryFee, setDeliveryFee] = useState<number>(0)
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const [loading, setLoading] = useState(false)
    const [showCardModal, setShowCardModal] = useState(false)
    const [paymentConfirmed, setPaymentConfirmed] = useState(false)
    const [showAddressModal, setShowAddressModal] = useState(false)
    const [newAddress, setNewAddress] = useState({
        street: "",
        number: "",
        city: "",
        county: "",
        postal_code: "",
        label: "",
        floor: "",
        stair: "",
        phone: "",
    })

    const stripe = useStripe()
    const elements = useElements()
    const [isExtrasOpen, setIsExtrasOpen] = useState(false)

    useEffect(() => {
        if (token) {
            fetchCartOrders(token).then(setOrders)
            fetchAddresses(token).then(setAddresses)
        }
    }, [token])

    useEffect(() => {
        const sum = orders.reduce((acc, curr) => acc + (curr.total_price || 0), 0)
        setTotalPrice(sum + deliveryFee)
    }, [orders, deliveryFee])

    useEffect(() => {
        if (!selectedAddressId) return
        const addr = addresses.find((a) => a.id === selectedAddressId)
        if (addr?.lat && addr?.lng) {
            const end = `${addr.lng},${addr.lat}`
            const start = `${SEBES_COORDS.lon},${SEBES_COORDS.lat}`
            calculateDistance(start, end).then((km) => {
                const fee = Math.round(km * COST_PER_KM * 100) / 100
                setDeliveryFee(fee)
            })
        }
    }, [selectedAddressId, addresses])

    const handleAddAddress = async () => {
        if (!token) return

        try {
            setLoading(true)
            const created = await addAddress(token, newAddress)
            if (!created.id) throw new Error("Nu s-a putut crea adresa")

            setShowAddressModal(false)
            setNewAddress({
                street: "",
                number: "",
                city: "",
                county: "",
                postal_code: "",
                label: "",
                floor: "",
                stair: "",
                phone: "",
            })

            const updated = await fetchAddresses(token)
            setAddresses(updated)
            setSelectedAddressId(created.id)

            alert("Adresa a fost adăugată cu succes!")
        } catch (error) {
            console.error("Eroare la salvarea adresei:", error)
            alert("Eroare la salvarea adresei. Verificați datele și încercați din nou.")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteOrder = async (orderId: number) => {
        try {
            await deleteOrder(token, orderId)
            const updated = await fetchCartOrders(token)
            setOrders(updated)
        } catch (err) {
            console.error("Failed to delete order", err)
        }
    }

    const handlePayment = async () => {
        if (!stripe || !elements) {
            alert("Se încarcă componentele de plată. Vă rugăm așteptați.")
            return
        }

        try {
            setLoading(true)
            const { clientSecret } = await createPaymentIntent(Math.round(totalPrice * 100))

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: elements.getElement(CardElement)! },
            })

            if (result.error) {
                throw new Error(result.error.message || "Eroare la procesarea plății")
            }

            if (result.paymentIntent.status === "succeeded") {
                setPaymentConfirmed(true)
                setShowCardModal(false)
                alert("Plata a fost procesată cu succes!")
            }
        } catch (error: any) {
            console.error("Eroare la procesarea plății:", error)
            alert(`Plata a eșuat: ${error.message || "Verificați datele cardului și încercați din nou."}`)
        } finally {
            setLoading(false)
        }
    }

    const finalizeCart = async () => {
        try {
            const data = await finalizeCartRequest(token, selectedAddressId!, deliveryFee)
            alert(data.message)
            const updated = await fetchCartOrders(token)
            setOrders(updated)
        } catch (err) {
            console.error("Eroare la finalizarea comenzii:", err)
        }
    }

    const subtotal = orders.reduce((acc, curr) => acc + (curr.total_price || 0), 0)

    return (
        <IonPage className="cart-page">
            {/* Background Elements */}
            <div className="cart-background">
                <div className="background-overlay"></div>
                <div className="floating-element floating-element-1"></div>
                <div className="floating-element floating-element-2"></div>
                <div className="particle particle-1"></div>
                <div className="particle particle-2"></div>
            </div>

            <IonHeader className="modern-product-header">
                <IonToolbar className="articles-toolbar">
                    <div className="modern-toolbar-content">
                        {/* Logo */}
                        <button className="modern-back-btn" onClick={() => history.goBack()}>
                            <IonIcon icon={arrowBackOutline} />
                            <span>Înapoi</span>
                        </button>
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

                            {/* Settings Modal */}
                            <MyModal />
                        </div>
                    </div>
                </IonToolbar>
            </IonHeader>
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
                            Locatie
                        </a>
                    </div>
                </>
            )}

            <IonContent className="cart-content">
                <IonLoading isOpen={loading} message="Se încarcă..." />

                <div className="cart-container">
                    {/* Page Header */}
                    <div className="cart-page-header">
                        <div className="page-header-content">
                            <div className="header-icon">
                                <IonIcon icon={cartOutline} />
                            </div>
                            <div className="header-info">
                                <h1 className="page-title">Coșul Tău</h1>
                                <p className="page-subtitle">
                                    {orders.length === 0 ? "Coșul este gol" : `${orders.length} produse în coș`}
                                </p>
                            </div>
                        </div>
                        <div className="header-badge">
                            <span className="badge-count">{orders.length}</span>
                        </div>
                    </div>

                    {orders.length === 0 ? (
                        /* Empty Cart State */
                        <div className="empty-cart-state">
                            <div className="empty-cart-icon">
                                <IonIcon icon={cartOutline} />
                            </div>
                            <h3>Coșul tău este gol</h3>
                            <p>Adaugă produse pentru a continua cumpărăturile</p>
                            <IonButton className="browse-products-btn" routerLink="/articlesClient">
                                Explorează Produsele
                            </IonButton>
                        </div>
                    ) : (
                        <div className="cart-sections">
                            {/* Orders Section */}
                            <div className="cart-section">
                                <div className="section-header">
                                    <div className="section-icon">
                                        <IonIcon icon={cartOutline} />
                                    </div>
                                    <div className="section-title">
                                        <h3>Produsele Tale</h3>
                                        <p>Revizuiește și modifică comenzile</p>
                                    </div>
                                </div>

                                <div className="orders-grid">
                                    {orders.map((order) => (
                                        <div key={order.id} className="order-card">
                                            <div className="order-header">
                                                <div className="order-id">
                                                    <span className="order-label">Comandă</span>
                                                    <span className="order-number">#{order.id}</span>
                                                </div>
                                                <IonButton
                                                    fill="clear"
                                                    color="danger"
                                                    className="delete-order-btn"
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                >
                                                    <IonIcon icon={trashOutline} />
                                                </IonButton>
                                            </div>

                                            <div className="order-details">
                                                <div className="order-dimensions">
                                                    <IonIcon icon={resizeOutline} />
                                                    <span>
                            {order.width} × {order.height} cm
                          </span>
                                                    <span className="area-info">({((order.width * order.height)/10000).toFixed(2)} m²)</span>
                                                </div>

                                                {order.color && (
                                                    <div className="order-color">
                                                        <div className="color-preview" style={{ backgroundColor: order.color }}></div>
                                                        <span>Culoare: {order.color}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="order-footer">
                                                <div className="order-price">
                                                    <IonIcon icon={pricetagOutline} />
                                                    <span className="price-value">{order.total_price} RON</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="cart-section">
                                <div className="section-header">
                                    <div className="section-icon">
                                        <IonIcon icon={locationOutline} />
                                    </div>
                                    <div className="section-title">
                                        <h3>Adresa de Livrare</h3>
                                        <p>Selectează sau adaugă o adresă</p>
                                    </div>
                                </div>

                                <div className="address-selector">
                                    <IonItem className="address-select-item">
                                        <IonLabel>Selectează adresa</IonLabel>
                                        <IonSelect
                                            placeholder="Alege o adresă"
                                            value={selectedAddressId}
                                            onIonChange={(e) => {
                                                const val = Number.parseInt(e.detail.value)
                                                if (val === -1) setShowAddressModal(true)
                                                else setSelectedAddressId(val)
                                            }}
                                        >
                                            {addresses.map((addr) => (
                                                <IonSelectOption key={addr.id} value={addr.id}>
                                                    {addr.label ? `${addr.label} - ${addr.city}` : `${addr.street}, ${addr.city}`}
                                                </IonSelectOption>
                                            ))}
                                            <IonSelectOption value={-1}>➕ Adaugă adresă nouă</IonSelectOption>
                                        </IonSelect>
                                    </IonItem>

                                    {selectedAddressId && (
                                        <div className="selected-address-info">
                                            {(() => {
                                                const addr = addresses.find((a) => a.id === selectedAddressId)
                                                return addr ? (
                                                    <div className="address-details">
                                                        <div className="address-main">
                                                            <IonIcon icon={homeOutline} />
                                                            <span>
                                {addr.street} {addr.number}, {addr.city}
                              </span>
                                                        </div>
                                                        {addr.phone && (
                                                            <div className="address-phone">
                                                                <IonIcon icon={callOutline} />
                                                                <span>{addr.phone}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : null
                                            })()}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Summary Section */}
                            <div className="cart-section cart-summary">
                                <div className="section-header">
                                    <div className="section-icon">
                                        <IonIcon icon={pricetagOutline} />
                                    </div>
                                    <div className="section-title">
                                        <h3>Rezumat Comandă</h3>
                                        <p>Verifică totalurile înainte de plată</p>
                                    </div>
                                </div>

                                <div className="summary-details">
                                    <div className="summary-row">
                                        <span className="summary-label">Subtotal ({orders.length} produse)</span>
                                        <span className="summary-value">{subtotal.toFixed(2)} RON</span>
                                    </div>

                                    <div className="summary-row">
                                        <span className="summary-label">Taxă de livrare</span>
                                        <span className="summary-value">{deliveryFee.toFixed(2)} RON</span>
                                    </div>

                                    <div className="summary-divider"></div>

                                    <div className="summary-row summary-total">
                                        <span className="summary-label">Total</span>
                                        <span className="summary-value">{totalPrice.toFixed(2)} RON</span>
                                    </div>
                                </div>

                                <div className="payment-actions">
                                    <IonButton
                                        expand="block"
                                        className={`payment-btn ${paymentConfirmed ? "confirmed" : ""}`}
                                        onClick={() => setShowCardModal(true)}
                                        disabled={paymentConfirmed}
                                    >
                                        <IonIcon icon={paymentConfirmed ? checkmarkCircleOutline : cardOutline} slot="start" />
                                        {paymentConfirmed ? "Plata Confirmată" : "Introdu Cardul"}
                                    </IonButton>

                                    <IonButton
                                        expand="block"
                                        className="finalize-btn"
                                        disabled={!selectedAddressId || !paymentConfirmed || orders.length === 0}
                                        onClick={finalizeCart}
                                    >
                                        <IonIcon icon={checkmarkCircleOutline} slot="start" />
                                        Finalizează Comanda
                                    </IonButton>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Address Modal */}
                <IonModal isOpen={showAddressModal} onDidDismiss={() => setShowAddressModal(false)}>
                    <IonHeader>
                        <IonToolbar className="modal-toolbar">
                            <IonTitle>Adresă Nouă</IonTitle>
                            <IonButton slot="end" onClick={() => setShowAddressModal(false)}>
                                <IonIcon icon={closeOutline} />
                            </IonButton>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <div className="address-form">
                            <div className="form-grid">
                                <IonItem>
                                    <IonLabel position="stacked">Etichetă (ex: Acasă, Birou)</IonLabel>
                                    <IonInput
                                        value={newAddress.label}
                                        onIonChange={(e) => setNewAddress({ ...newAddress, label: e.detail.value! })}
                                    />
                                </IonItem>

                                <IonItem>
                                    <IonLabel position="stacked">Strada</IonLabel>
                                    <IonInput
                                        value={newAddress.street}
                                        onIonChange={(e) => setNewAddress({ ...newAddress, street: e.detail.value! })}
                                    />
                                </IonItem>

                                <IonItem>
                                    <IonLabel position="stacked">Numărul</IonLabel>
                                    <IonInput
                                        value={newAddress.number}
                                        onIonChange={(e) => setNewAddress({ ...newAddress, number: e.detail.value! })}
                                    />
                                </IonItem>

                                <IonItem>
                                    <IonLabel position="stacked">Orașul</IonLabel>
                                    <IonInput
                                        value={newAddress.city}
                                        onIonChange={(e) => setNewAddress({ ...newAddress, city: e.detail.value! })}
                                    />
                                </IonItem>

                                <IonItem>
                                    <IonLabel position="stacked">Județul</IonLabel>
                                    <IonInput
                                        value={newAddress.county}
                                        onIonChange={(e) => setNewAddress({ ...newAddress, county: e.detail.value! })}
                                    />
                                </IonItem>

                                <IonItem>
                                    <IonLabel position="stacked">Cod Poștal</IonLabel>
                                    <IonInput
                                        value={newAddress.postal_code}
                                        onIonChange={(e) => setNewAddress({ ...newAddress, postal_code: e.detail.value! })}
                                    />
                                </IonItem>

                                <IonItem>
                                    <IonLabel position="stacked">Etajul</IonLabel>
                                    <IonInput
                                        value={newAddress.floor}
                                        onIonChange={(e) => setNewAddress({ ...newAddress, floor: e.detail.value! })}
                                    />
                                </IonItem>

                                <IonItem>
                                    <IonLabel position="stacked">Scara</IonLabel>
                                    <IonInput
                                        value={newAddress.stair}
                                        onIonChange={(e) => setNewAddress({ ...newAddress, stair: e.detail.value! })}
                                    />
                                </IonItem>

                                <IonItem>
                                    <IonLabel position="stacked">Telefon</IonLabel>
                                    <IonInput
                                        value={newAddress.phone}
                                        onIonChange={(e) => setNewAddress({ ...newAddress, phone: e.detail.value! })}
                                    />
                                </IonItem>
                            </div>

                            <div className="form-actions">
                                <IonButton expand="block" onClick={handleAddAddress} className="save-address-btn">
                                    <IonIcon icon={addOutline} slot="start" />
                                    Salvează Adresa
                                </IonButton>
                            </div>
                        </div>
                    </IonContent>
                </IonModal>

                {/* Payment Modal */}
                <IonModal isOpen={showCardModal} onDidDismiss={() => setShowCardModal(false)}>
                    <IonHeader>
                        <IonToolbar className="modal-toolbar">
                            <IonTitle>Plată cu Cardul</IonTitle>
                            <IonButton slot="end" onClick={() => setShowCardModal(false)}>
                                <IonIcon icon={closeOutline} />
                            </IonButton>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <div className="payment-form">
                            <div className="payment-summary">
                                <h4>Rezumat Plată</h4>
                                <div className="payment-amount">
                                    <span className="amount-label">Total de plată:</span>
                                    <span className="amount-value">{totalPrice.toFixed(2)} RON</span>
                                </div>
                            </div>

                            <div className="card-element-container">
                                <h4>Detalii Card</h4>
                                <div className="card-element-wrapper">
                                    <CardElement />
                                </div>
                            </div>

                            <div className="payment-actions">
                                <IonButton expand="block" onClick={handlePayment} className="confirm-payment-btn">
                                    <IonIcon icon={cardOutline} slot="start" />
                                    Confirmă Plata
                                </IonButton>
                                <IonButton expand="block" onClick={() => setShowCardModal(false)}>
                                    Anulează
                                </IonButton>
                            </div>
                        </div>
                    </IonContent>
                </IonModal>
            </IonContent>
            <WhatsAppButton />
        </IonPage>
    )
}

export default CartPage
