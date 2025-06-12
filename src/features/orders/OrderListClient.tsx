"use client"

import React, {useCallback} from "react"
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
    IonModal,
    IonItem,
    IonLabel,
    IonTextarea,
    IonFab,
    IonFabButton,
    IonInput,
    IonTitle,
} from "@ionic/react"
import type { RouteComponentProps } from "react-router"
import {
    receiptOutline,
    starOutline,
    star,
    trashOutline,
    addOutline,
    arrowBackOutline,
    sparkles,
    layersOutline,
    grid,
    cartOutline,
    pricetagOutline,
    constructOutline, logoInstagram, logoFacebook, locate, closeOutline,
} from "ionicons/icons"
import { getLogger } from "../core"
import type { IOrderProps } from "./OrderProps"
import { AuthContext } from "../auth"
import { createReview, deleteReview } from "../reviews/reviewApi"
import "../shared/theme/order-list-client-styles.css"
import "../shared/theme/enhanced-filters-styles.css"
import {MyModal} from "../shared/components/MyModal";
import WhatsAppButton from "../shared/components/WhatsAppButton";
const log = getLogger("OrderListClient")

const OrderListClient: React.FC<RouteComponentProps<{ final_cart_id?: string }>> = ({ history, match }) => {
    const { isAuthenticated, email, token } = useContext(AuthContext)
    const [clientOrders, setClientOrders] = useState<IOrderProps[]>([])
    const [showReviewModal, setShowReviewModal] = useState<boolean>(false)
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
    const [score, setScore] = useState<number>(0)
    const [text, setText] = useState<string>("")
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [fetching, setFetching] = useState<boolean>(false)
    const [fetchingError, setFetchingError] = useState<any>(null)
    const [reviewedOrders, setReviewedOrders] = useState<Record<number, { id: number; score: number; text: string }>>({})
    const [isExtrasOpen, setIsExtrasOpen] = useState(false)

    useEffect(() => {
        if (!isAuthenticated) {
            history.push("/")
        }
    }, [isAuthenticated, history])


    const fetchClientOrders = useCallback(async () => {
        if (!email || !token) return
        setFetching(true)
        setFetchingError(null)
        try {
            let url = `http://192.168.1.149:3000/api/orders?email=${email}`
            const finalCartId = match.params.final_cart_id
            if (finalCartId) {
                url += `&final_cart_id=${finalCartId}`
            }

            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (!response.ok) throw new Error("Failed to fetch orders")
            const data = await response.json()
            setClientOrders(data)

            const reviewed: Record<number, { id: number; score: number; text: string }> = {}
            for (const order of data) {
                const reviewRes = await fetch(`http://192.168.1.149:3000/api/reviews?order_id=${order.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const reviews = await reviewRes.json()
                if (Array.isArray(reviews) && reviews.length > 0) {
                    reviewed[order.id] = {
                        id: reviews[0].id,
                        score: reviews[0].score,
                        text: reviews[0].text,
                    }
                }
            }
            setReviewedOrders(reviewed)
        } catch (error) {
            console.error("Error fetching orders:", error)
            setFetchingError(error)
        } finally {
            setFetching(false)
        }
    }, [email, token, match.params.final_cart_id])

    useEffect(() => {
        if (isAuthenticated && email && token) {
            fetchClientOrders()
        }
    }, [isAuthenticated, email, token, match.params.final_cart_id, fetchClientOrders])


        const handleReviewButtonClick = (orderId: number | undefined) => {
        setSelectedOrderId(orderId || null)
        setScore(0)
        setText("")
        setShowReviewModal(true)
    }

    const handleReviewSubmit = async () => {
        if (!selectedOrderId || score < 1 || score > 5 || !text.trim()) return;
        setSubmitting(true);
        const reviewData = {
            order_id: selectedOrderId,
            email: email,
            score,
            text,
            time: new Date().toISOString(),
        };

        try {
            await createReview(token, reviewData);
            setShowReviewModal(false);
            setScore(0);
            setText('');
            // În loc de history.push, refaci fetch-ul:
            await fetchClientOrders();
        } catch (error) {
            console.error('Failed to submit review', error);
        }
        setSubmitting(false);
    };


    const handleDeleteReview = async (reviewId: number) => {
        if (!token) return
        const confirm = window.confirm("Ești sigur că vrei să ștergi această recenzie?")
        if (!confirm) return

        try {
            await deleteReview(token, reviewId)
            setReviewedOrders((prev) => {
                const updated = { ...prev }
                Object.keys(updated).forEach((key) => {
                    if (updated[Number.parseInt(key)].id === reviewId) {
                        delete updated[Number.parseInt(key)]
                    }
                })
                return updated
            })
        } catch (err) {
            console.error("Failed to delete review:", err)
            alert("Nu s-a putut șterge recenzia.")
        }
    }

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <IonIcon key={i} icon={i < rating ? star : starOutline} className={i < rating ? "star-filled" : "star-empty"} />
        ))
    }

    return (
        <IonPage className="order-list-page">
            {/* Background Elements */}
            <div className="order-list-background">
                <div className="background-overlay"></div>
                <div className="floating-element floating-element-1"></div>
                <div className="floating-element floating-element-2"></div>
                <div className="particle particle-1"></div>
                <div className="particle particle-2"></div>
            </div>

            <IonHeader className="modern-product-header">
                <IonToolbar className="articles-toolbar">
                    <div className="modern-toolbar-content">

                        <button className="modern-back-btn" onClick={() => history.goBack()}>
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

            <IonContent className="order-list-content">
                <IonLoading isOpen={fetching} message="Se încarcă comenzile..." />

                <div className="order-list-container">
                    {/* Page Header */}
                    <div className="order-list-page-header">
                        <div className="page-header-content">
                            <div className="header-icon">
                                <IonIcon icon={receiptOutline} />
                            </div>
                            <div className="header-info">
                                <h1 className="page-title">Istoric Articole</h1>
                                <p className="page-subtitle">Vizualizează și evaluează articolele din comanda actuală</p>
                            </div>
                        </div>
                        <div className="orders-stats">
                            <div className="stat-item">
                                <span className="stat-number">{clientOrders.length}</span>
                                <span className="stat-label">Comenzi</span>
                            </div>
                        </div>
                    </div>

                    {/* Orders List */}
                    {fetchingError && (
                        <div className="error-state">
                            <div className="error-icon">
                                <IonIcon icon={receiptOutline} />
                            </div>
                            <h3>Eroare la încărcare</h3>
                            <p>{fetchingError.message || "Nu s-au putut încărca comenzile"}</p>
                        </div>
                    )}

                    {!fetching && !fetchingError && clientOrders.length === 0 ? (
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
                            {clientOrders.map((order: IOrderProps) => {
                                const orderId = order.id as number
                                const hasReview = reviewedOrders[orderId]
                                return (
                                    <IonCard key={orderId} className="order-card">
                                        <IonCardHeader className="order-card-header">
                                            <div className="order-header-content">
                                                <div className="order-id-section">
                                                    <IonIcon icon={receiptOutline} className="order-icon" />
                                                    <div className="order-id-info">
                                                        <IonCardTitle className="order-title">{order?.gates?.text || `ID: ${order?.gate_id}`}</IonCardTitle>
                                                        <div className="order-details-header">
                                                            <span className="gate-id"> Articol #{orderId}   </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="order-price">
                                                    <IonIcon icon={pricetagOutline} />
                                                    <span className="price-value">{order.total_price} RON</span>
                                                </div>
                                            </div>
                                        </IonCardHeader>

                                        <IonCardContent className="order-card-content">
                                            {/* Order Details */}
                                            <div className="order-details">
                                                <div className="detail-item">
                                                    <IonIcon icon={constructOutline} />
                                                    <span className="detail-label">Dimensiuni:</span>
                                                    <span className="detail-value">
                            {order.width} × {order.height} m
                          </span>
                                                </div>
                                                {order.color && (
                                                    <div className="detail-item">
                                                        <div className="color-preview" style={{ backgroundColor: order.color }}></div>
                                                        <span className="detail-label">Culoare:</span>
                                                        <span className="detail-value">{order.color}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Review Section */}
                                            {hasReview ? (
                                                <div className="review-section">
                                                    <div className="review-header">
                                                        <div className="review-stars">{renderStars(hasReview.score)}</div>
                                                        <span className="review-score">{hasReview.score}/5</span>
                                                    </div>
                                                    <p className="review-text">"{hasReview.text}"</p>
                                                    <IonButton
                                                        fill="outline"
                                                        color="danger"
                                                        className="delete-review-btn"
                                                        onClick={() => handleDeleteReview(hasReview.id)}
                                                    >
                                                        <IonIcon icon={trashOutline} slot="start" />
                                                        Șterge Recenzia
                                                    </IonButton>
                                                </div>
                                            ) : (
                                                <IonButton onClick={() => handleReviewButtonClick(orderId)}>Leave Review</IonButton>
                                            )}
                                        </IonCardContent>
                                    </IonCard>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* FAB Button */}
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton className="create-order-fab" onClick={() => history.push("/order-create")}>
                        <IonIcon icon={addOutline} />
                    </IonFabButton>
                </IonFab>

                {/* Review Modal */}
                <IonModal isOpen={showReviewModal} onDidDismiss={() => setShowReviewModal(false)}>
                    <IonHeader>
                        <IonToolbar style={{ "--background": "linear-gradient(135deg, #000000, #1e40af)", "--color": "white" }}>
                            <IonTitle>Lasă o Recenzie</IonTitle>
                            <IonButton
                                fill="clear"
                                slot="end"
                                onClick={() => setShowReviewModal(false)}
                                style={{ "--color": "white" }}
                            >
                                <IonIcon icon={closeOutline} />
                            </IonButton>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <div style={{ padding: "2rem" }}>
                            <div style={{ marginBottom: "2rem" }}>
                                <h3 style={{ color: "#000000", fontSize: "1.125rem", fontWeight: "600", margin: "0 0 1rem 0" }}>
                                    Evaluează experiența
                                </h3>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        background: "white",
                                        padding: "1rem",
                                        borderRadius: "1rem",
                                        border: "1px solid rgba(0, 0, 0, 0.1)",
                                    }}
                                >
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                            key={rating}
                                            onClick={() => setScore(rating)}
                                            type="button"
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                padding: "0.25rem",
                                                borderRadius: "0.375rem",
                                                transition: "all 0.2s ease",
                                            }}
                                        >
                                            <IonIcon
                                                icon={score >= rating ? star : starOutline}
                                                style={{
                                                    fontSize: "1.5rem",
                                                    color: score >= rating ? "#fbbf24" : "#d1d5db",
                                                }}
                                            />
                                        </button>
                                    ))}
                                    <span
                                        style={{
                                            marginLeft: "auto",
                                            color: "#64748b",
                                            fontSize: "0.875rem",
                                            fontWeight: "500",
                                        }}
                                    >
                    {score === 0 && "Selectează o evaluare"}
                                        {score === 1 && "Foarte rău"}
                                        {score === 2 && "Rău"}
                                        {score === 3 && "Acceptabil"}
                                        {score === 4 && "Bun"}
                                        {score === 5 && "Excelent"}
                  </span>
                                </div>
                            </div>

                            <div style={{ marginBottom: "2rem" }}>
                                <h3 style={{ color: "#000000", fontSize: "1.125rem", fontWeight: "600", margin: "0 0 1rem 0" }}>
                                    Spune-ne mai multe
                                </h3>
                                <IonItem
                                    style={{
                                        "--background": "white",
                                        "--border-color": "rgba(0, 0, 0, 0.1)",
                                        "--border-radius": "1rem",
                                        border: "1px solid rgba(0, 0, 0, 0.1)",
                                        borderRadius: "1rem",
                                    }}
                                >
                                    <IonLabel position="stacked">Comentariul tău</IonLabel>
                                    <IonTextarea
                                        value={text}
                                        onIonChange={(e) => setText(e.detail.value!)}
                                        placeholder="Descrie experiența ta cu produsul..."
                                        rows={4}
                                        style={{ "--color": "#000000", "--placeholder-color": "#64748b" }}
                                    />
                                </IonItem>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <IonButton
                                    expand="block"
                                    onClick={handleReviewSubmit}
                                    disabled={submitting || score < 1 || !text.trim()}
                                    style={{
                                        "--background": "linear-gradient(135deg, #000000, #1e40af)",
                                        "--color": "white",
                                        "--border-radius": "1rem",
                                        "--padding-top": "1rem",
                                        "--padding-bottom": "1rem",
                                        fontSize: "1rem",
                                        fontWeight: "600",
                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                    }}
                                >
                                    <IonIcon icon={starOutline} slot="start" />
                                    {submitting ? "Se trimite..." : "Trimite Recenzia"}
                                </IonButton>
                                <IonButton
                                    expand="block"
                                    fill="outline"
                                    onClick={() => setShowReviewModal(false)}
                                    disabled={submitting}
                                    style={{
                                        "--color": "#64748b",
                                        "--border-color": "rgba(0, 0, 0, 0.1)",
                                        "--border-radius": "1rem",
                                        "--padding-top": "1rem",
                                        "--padding-bottom": "1rem",
                                        fontSize: "1rem",
                                        fontWeight: "600",
                                    }}
                                >
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

export default OrderListClient
