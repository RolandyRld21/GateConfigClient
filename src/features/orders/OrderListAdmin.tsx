"use client"

import type React from "react"
import { useEffect, useState, useContext } from "react"
import { IonPage, IonHeader, IonToolbar, IonContent, IonLoading, IonIcon } from "@ionic/react"
import type { RouteComponentProps } from "react-router"
import {
    sparkles,
    grid,
    menu,
    close,
    arrowBackOutline,
    resizeOutline,
    colorPaletteOutline,
    pricetagOutline,
    cubeOutline,
    starOutline,
    layersOutline,
    locate,
    statsChartOutline,
    cardOutline,
    checkmarkCircleOutline,
} from "ionicons/icons"
import { AuthContext } from "../auth"
import type { Order } from "../finalcart/cartApi"
import { MyModal } from "../shared/components/MyModal"
import { logoInstagram, logoFacebook } from "ionicons/icons"
import "../shared/theme/enhanced-filters-styles.css"
import { checkmarkOutline } from "ionicons/icons"
import {MyModalAdmin} from "../shared/components/MyModalAdmin";

const OrderListAdmin: React.FC<RouteComponentProps<{ final_cart_id: string }>> = ({ match, history }) => {
    const { token } = useContext(AuthContext)
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false)
    const [isExtrasOpen, setIsExtrasOpen] = useState(false)

    useEffect(() => {
        const fetchOrdersByCart = async () => {
            setLoading(true)
            try {
                const res = await fetch(`https://gateconfigserver.onrender.com/api/orders/admin/final-cart/${match.params.final_cart_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })

                const data = await res.json()
                setOrders(data)
            } catch (err) {
                console.error("Failed to fetch orders", err)
            }
            setLoading(false)
        }

        fetchOrdersByCart()
    }, [match.params.final_cart_id, token])

    const getOrderStats = () => {
        const totalOrders = orders.length
        const totalValue = orders.reduce((sum, order) => sum + (order.total_price || 0), 0)
        const avgOrderValue = totalOrders > 0 ? totalValue / totalOrders : 0
        const uniqueProducts = new Set(orders.map((order) => order.gate_id)).size

        return { totalOrders, totalValue, avgOrderValue, uniqueProducts }
    }

    const stats = getOrderStats()

    return (
        <IonPage className="articles-page">
            {/* Background */}
            <div className="articles-background">
                <div className="background-overlay"></div>
                <div className="floating-element floating-element-1"></div>
                <div className="floating-element floating-element-2"></div>
                <div className="particle particle-1"></div>
                <div className="particle particle-2"></div>
            </div>

            {/* Header */}
            <IonHeader className="articles-header">
                <IonToolbar className="articles-toolbar">
                    <div className="modern-toolbar-content">
                        {/* Logo with Back Button */}
                        <div className="toolbar-logo-admin-no-exapnd">
                            <button
                                className="action-button"
                                onClick={() => history.goBack()}
                                style={{
                                    background: "rgba(255, 255, 255, 0.2)",
                                    color: "white",
                                    marginRight: "1rem",
                                }}
                            >
                                <IonIcon icon={arrowBackOutline} />
                            </button>
                            <div className="logo-icon">
                                <IonIcon icon={sparkles} />
                            </div>
                            <span className="logo-text">Comenzi Final Cart #{match.params.final_cart_id}</span>
                        </div>

                        {/* Right Actions */}
                        <div className="toolbar-actions">

                            {/* Settings Modal */}
                            <MyModalAdmin />
                            <button className="mobile-menu-button" onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
                                <IonIcon icon={isFiltersOpen ? close : menu} />
                            </button>
                        </div>
                    </div>
                </IonToolbar>
            </IonHeader>

            {isExtrasOpen && (
                <>
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

            <IonContent className="articles-content">
                <div className="articles-layout">
                    {/* Enhanced Filters Sidebar */}
                    <div className={`enhanced-filters-sidebar ${isFiltersOpen ? "filters-open show" : ""}`}>
                        <div className="enhanced-filters-content">
                            {/* Filters Header */}
                            <div className="enhanced-filters-header">
                                <div className="filters-title-section">
                                    <div className="filters-icon-wrapper">
                                        <IonIcon icon={statsChartOutline} />
                                    </div>
                                    <div className="filters-title-text">
                                        <h2>Statistici Comandă</h2>
                                        <p>Final Cart #{match.params.final_cart_id}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Section - Condensed */}
                            <div className="enhanced-filter-section">
                                <div className="section-header">
                                    <h3 className="section-title">
                                        <IonIcon icon={statsChartOutline} />
                                        Rezumat
                                    </h3>
                                </div>
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(2, 1fr)",
                                        gap: "0.75rem",
                                        padding: "0.5rem 0",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            padding: "1rem 0.5rem",
                                            background: "rgba(255, 255, 255, 0.8)",
                                            borderRadius: "1rem",
                                            border: "1px solid rgba(0, 0, 0, 0.1)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "2rem",
                                                height: "2rem",
                                                background: "#3b82f6",
                                                borderRadius: "0.75rem",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "white",
                                            }}
                                        >
                                            <IonIcon icon={cubeOutline} style={{ fontSize: "1rem" }} />
                                        </div>
                                        <span
                                            style={{
                                                fontSize: "1.25rem",
                                                fontWeight: "700",
                                                color: "#000",
                                                lineHeight: "1",
                                            }}
                                        >
                      {stats.totalOrders}
                    </span>
                                        <span
                                            style={{
                                                fontSize: "0.75rem",
                                                color: "#606060",
                                                textAlign: "center",
                                                lineHeight: "1.2",
                                            }}
                                        >
                      Comenzi
                    </span>
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            padding: "1rem 0.5rem",
                                            background: "rgba(255, 255, 255, 0.8)",
                                            borderRadius: "1rem",
                                            border: "1px solid rgba(0, 0, 0, 0.1)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "2rem",
                                                height: "2rem",
                                                background: "#22c55e",
                                                borderRadius: "0.75rem",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "white",
                                            }}
                                        >
                                            <IonIcon icon={cardOutline} style={{ fontSize: "1rem" }} />
                                        </div>
                                        <span
                                            style={{
                                                fontSize: "1.25rem",
                                                fontWeight: "700",
                                                color: "#000",
                                                lineHeight: "1",
                                            }}
                                        >
                      {stats.totalValue.toFixed(0)}
                    </span>
                                        <span
                                            style={{
                                                fontSize: "0.75rem",
                                                color: "#606060",
                                                textAlign: "center",
                                                lineHeight: "1.2",
                                            }}
                                        >
                      RON Total
                    </span>
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            padding: "1rem 0.5rem",
                                            background: "rgba(255, 255, 255, 0.8)",
                                            borderRadius: "1rem",
                                            border: "1px solid rgba(0, 0, 0, 0.1)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "2rem",
                                                height: "2rem",
                                                background: "#f59e0b",
                                                borderRadius: "0.75rem",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "white",
                                            }}
                                        >
                                            <IonIcon icon={pricetagOutline} style={{ fontSize: "1rem" }} />
                                        </div>
                                        <span
                                            style={{
                                                fontSize: "1.25rem",
                                                fontWeight: "700",
                                                color: "#000",
                                                lineHeight: "1",
                                            }}
                                        >
                      {stats.avgOrderValue.toFixed(0)}
                    </span>
                                        <span
                                            style={{
                                                fontSize: "0.75rem",
                                                color: "#606060",
                                                textAlign: "center",
                                                lineHeight: "1.2",
                                            }}
                                        >
                      RON Mediu
                    </span>
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            padding: "1rem 0.5rem",
                                            background: "rgba(255, 255, 255, 0.8)",
                                            borderRadius: "1rem",
                                            border: "1px solid rgba(0, 0, 0, 0.1)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "2rem",
                                                height: "2rem",
                                                background: "#8b5cf6",
                                                borderRadius: "0.75rem",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "white",
                                            }}
                                        >
                                            <IonIcon icon={layersOutline} style={{ fontSize: "1rem" }} />
                                        </div>
                                        <span
                                            style={{
                                                fontSize: "1.25rem",
                                                fontWeight: "700",
                                                color: "#000",
                                                lineHeight: "1",
                                            }}
                                        >
                      {stats.uniqueProducts}
                    </span>
                                        <span
                                            style={{
                                                fontSize: "0.75rem",
                                                color: "#606060",
                                                textAlign: "center",
                                                lineHeight: "1.2",
                                            }}
                                        >
                      Produse
                    </span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="enhanced-filter-section">
                                <div className="section-header">
                                    <h3 className="section-title">
                                        <IonIcon icon={checkmarkCircleOutline} />
                                        Acțiuni Rapide
                                    </h3>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    <button
                                        className="apply-filters-btn"
                                        onClick={() => history.goBack()}
                                        style={{
                                            background: "linear-gradient(135deg, #64748b, #475569)",
                                        }}
                                    >
                                        <IonIcon icon={arrowBackOutline} />
                                        <span>Înapoi la Comenzi</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="articles-main">
                        {/* Results Header */}
                        <div className="results-header">
                            <div className="results-info">
                                <h1 className="results-title">Detalii Comandă Final Cart #{match.params.final_cart_id}</h1>
                                <p className="results-subtitle">{orders.length} produse comandate</p>
                            </div>
                        </div>

                        {/* Loading */}
                        <IonLoading isOpen={loading} message="Se încarcă comenzile..." />

                        {/* Orders Grid */}
                        {orders.length > 0 ? (
                            <div className="articles-grid grid-view">
                                {orders.map((order) => (
                                    <div key={order.id} className="article-card-wrapper">
                                        <div className="article-card">
                                            {/* Order Badge */}
                                            <div
                                                className="article-status-badge"
                                                style={{
                                                    background: "linear-gradient(135deg, #3b82f6, #1e40af)",
                                                    color: "white",
                                                }}
                                            >
                                                <IonIcon icon={cubeOutline} />
                                                <span>Comandă #{order.id}</span>
                                            </div>

                                            <div className="article-content">
                                                {/* Product Header */}
                                                <div className="article-header">
                                                    <h3 className="article-title"> {order?.gates?.text }</h3>
                                                </div>

                                                {/* Product Details */}
                                                <div style={{ margin: "1rem 0", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                                    {/* Dimensions */}
                                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                        <div
                                                            style={{
                                                                width: "2rem",
                                                                height: "2rem",
                                                                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                                                                borderRadius: "0.5rem",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                color: "white",
                                                            }}
                                                        >
                                                            <IonIcon icon={resizeOutline} style={{ fontSize: "1rem" }} />
                                                        </div>
                                                        <div>
                                                            <span style={{ fontWeight: "600", color: "#000" }}>Dimensiuni:</span>
                                                            <span style={{ marginLeft: "0.5rem", color: "#606060" }}>
                                {order.width} x {order.height} m
                              </span>
                                                        </div>
                                                    </div>

                                                    {/* Color - Enhanced */}
                                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                        <div
                                                            style={{
                                                                width: "2rem",
                                                                height: "2rem",
                                                                background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                                                                borderRadius: "0.5rem",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                color: "white",
                                                            }}
                                                        >
                                                            <IonIcon icon={colorPaletteOutline} style={{ fontSize: "1rem" }} />
                                                        </div>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                            <div>
                                                                <span style={{ fontWeight: "600", color: "#000" }}>Culoare:</span>
                                                                <span style={{ marginLeft: "0.5rem", color: "#606060", fontFamily: "monospace" }}>
                                  {order.color}
                                </span>
                                                            </div>
                                                            <div
                                                                style={{
                                                                    width: "2rem",
                                                                    height: "2rem",
                                                                    backgroundColor: order.color,
                                                                    borderRadius: "0.5rem",
                                                                    border: "2px solid rgba(0, 0, 0, 0.1)",
                                                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                                                }}
                                                                title={`Culoare: ${order.color}`}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    {/* Options */}
                                                    <div style={{ margin: "1rem 0" }}>
                                                        <div
                                                            style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}
                                                        >
                                                            <div
                                                                style={{
                                                                    width: "2rem",
                                                                    height: "2rem",
                                                                    background: "linear-gradient(135deg, #10b981, #059669)",
                                                                    borderRadius: "0.5rem",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    color: "white",
                                                                }}
                                                            >
                                                                <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: "1rem" }} />
                                                            </div>
                                                            <div>
                                                                <span style={{ fontWeight: "600", color: "#000" }}>Opțiuni selectate:</span>
                                                            </div>
                                                        </div>

                                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginLeft: "2.75rem" }}>
                                                            {order.option1 && (
                                                                <div
                                                                    style={{
                                                                        background: "linear-gradient(135deg, #22c55e, #16a34a)",
                                                                        color: "white",
                                                                        padding: "0.25rem 0.75rem",
                                                                        borderRadius: "1rem",
                                                                        fontSize: "0.75rem",
                                                                        fontWeight: "600",
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: "0.25rem",
                                                                    }}
                                                                >
                                                                    <IonIcon icon={checkmarkOutline} style={{ fontSize: "0.75rem" }} />
                                                                    Opțiunea 1
                                                                </div>
                                                            )}
                                                            {order.option2 && (
                                                                <div
                                                                    style={{
                                                                        background: "linear-gradient(135deg, #22c55e, #16a34a)",
                                                                        color: "white",
                                                                        padding: "0.25rem 0.75rem",
                                                                        borderRadius: "1rem",
                                                                        fontSize: "0.75rem",
                                                                        fontWeight: "600",
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: "0.25rem",
                                                                    }}
                                                                >
                                                                    <IonIcon icon={checkmarkOutline} style={{ fontSize: "0.75rem" }} />
                                                                    Opțiunea 2
                                                                </div>
                                                            )}
                                                            {order.option3 && (
                                                                <div
                                                                    style={{
                                                                        background: "linear-gradient(135deg, #22c55e, #16a34a)",
                                                                        color: "white",
                                                                        padding: "0.25rem 0.75rem",
                                                                        borderRadius: "1rem",
                                                                        fontSize: "0.75rem",
                                                                        fontWeight: "600",
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: "0.25rem",
                                                                    }}
                                                                >
                                                                    <IonIcon icon={checkmarkOutline} style={{ fontSize: "0.75rem" }} />
                                                                    Opțiunea 3
                                                                </div>
                                                            )}
                                                            {order.option4 && (
                                                                <div
                                                                    style={{
                                                                        background: "linear-gradient(135deg, #22c55e, #16a34a)",
                                                                        color: "white",
                                                                        padding: "0.25rem 0.75rem",
                                                                        borderRadius: "1rem",
                                                                        fontSize: "0.75rem",
                                                                        fontWeight: "600",
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: "0.25rem",
                                                                    }}
                                                                >
                                                                    <IonIcon icon={checkmarkOutline} style={{ fontSize: "0.75rem" }} />
                                                                    Opțiunea 4
                                                                </div>
                                                            )}
                                                            {order.option5 && (
                                                                <div
                                                                    style={{
                                                                        background: "linear-gradient(135deg, #22c55e, #16a34a)",
                                                                        color: "white",
                                                                        padding: "0.25rem 0.75rem",
                                                                        borderRadius: "1rem",
                                                                        fontSize: "0.75rem",
                                                                        fontWeight: "600",
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: "0.25rem",
                                                                    }}
                                                                >
                                                                    <IonIcon icon={checkmarkOutline} style={{ fontSize: "0.75rem" }} />
                                                                    Opțiunea 5
                                                                </div>
                                                            )}

                                                            {/* Dacă nu sunt opțiuni selectate */}
                                                            {!order.option1 &&
                                                                !order.option2 &&
                                                                !order.option3 &&
                                                                !order.option4 &&
                                                                !order.option5 && (
                                                                    <div
                                                                        style={{
                                                                            background: "rgba(100, 116, 139, 0.1)",
                                                                            color: "#64748b",
                                                                            padding: "0.25rem 0.75rem",
                                                                            borderRadius: "1rem",
                                                                            fontSize: "0.75rem",
                                                                            fontWeight: "600",
                                                                        }}
                                                                    >
                                                                        Fără opțiuni suplimentare
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Price */}
                                                <div className="article-footer">
                                                    <div className="article-price">
                                                        <IonIcon icon={pricetagOutline} />
                                                        <span className="price-value">{order.total_price} RON</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="empty-state">
                                <div className="empty-icon">
                                    <IonIcon icon={cubeOutline} />
                                </div>
                                <h3>Nu există comenzi</h3>
                                <p>Nu există comenzi în acest final cart.</p>
                                <button className="reset-filters-button" onClick={() => history.goBack()}>
                                    Înapoi la Comenzi
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </IonContent>

            {/* Filters Overlay */}
            {isFiltersOpen && (
                <div className={`filters-overlay ${isFiltersOpen ? "show" : ""}`} onClick={() => setIsFiltersOpen(false)}></div>
            )}
        </IonPage>
    )
}

export default OrderListAdmin
