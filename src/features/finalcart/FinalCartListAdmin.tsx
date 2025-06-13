import type React from "react"
import { useContext, useEffect, useState } from "react"
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonContent,
    IonLoading,
    IonIcon,
    IonSelect,
    IonSelectOption,
} from "@ionic/react"
import {
    sparkles,
    grid,
    menu,
    close,
    checkmarkOutline,
    timeOutline,
    carOutline,
    checkmarkCircleOutline,
    chatbubbleOutline,
    eyeOutline,
    calendarOutline,
    cardOutline,
    statsChartOutline,
    filterOutline,
    starOutline,
    layersOutline,
    locate, arrowBackOutline,
} from "ionicons/icons"
import { AuthContext } from "../auth"
import { fetchAllFinalCartsAdmin, type FinalCart } from "../finalcart/cartApi"
import { MyModal } from "../shared/components/MyModal"
import { logoInstagram, logoFacebook } from "ionicons/icons"
import "../shared/theme/enhanced-filters-styles.css"
import {MyModalAdmin} from "../shared/components/MyModalAdmin";

const FinalCartListAdmin: React.FC<{ history: any }> = ({ history }) => {
    const { token } = useContext(AuthContext)
    const [carts, setCarts] = useState<FinalCart[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false)
    const [isExtrasOpen, setIsExtrasOpen] = useState(false)
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [sortOrder, setSortOrder] = useState<string>("newest")

    const statusOptions = [
        { value: "all", label: "Toate comenzile", icon: layersOutline, color: "#64748b" },
        { value: "Confirmată", label: "Confirmate", icon: checkmarkOutline, color: "#22c55e" },
        { value: "În producție", label: "În producție", icon: timeOutline, color: "#f59e0b" },
        { value: "În curs de livrare", label: "În livrare", icon: carOutline, color: "#3b82f6" },
        { value: "Livrată", label: "Livrate", icon: checkmarkCircleOutline, color: "#10b981" },
    ]

    const sortOptions = [
        { value: "newest", label: "Cele mai noi", icon: calendarOutline },
        { value: "oldest", label: "Cele mai vechi", icon: calendarOutline },
        { value: "price_high", label: "Preț descrescător", icon: cardOutline },
        { value: "price_low", label: "Preț crescător", icon: cardOutline },
    ]

    useEffect(() => {
        const loadCarts = async () => {
            setLoading(true)
            try {
                const data = await fetchAllFinalCartsAdmin(token)
                setCarts(data)
            } catch (err) {
                console.error("Error fetching admin final carts", err)
            }
            setLoading(false)
        }
        loadCarts()
    }, [token])

    const handleStatusChange = async (id: number, status: string) => {
        try {
            await fetch(`https://gateconfigserver.onrender.com/api/final-cart/admin/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            })
            setCarts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))
        } catch (err) {
            console.error("Failed to update status", err)
        }
    }

    const getFilteredAndSortedCarts = () => {
        let filtered = [...carts]


        if (statusFilter !== "all") {
            filtered = filtered.filter((cart) => cart.status === statusFilter)
        }


        filtered.sort((a, b) => {
            switch (sortOrder) {
                case "newest":
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                case "oldest":
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                case "price_high":
                    return (b.total_price || 0) - (a.total_price || 0)
                case "price_low":
                    return (a.total_price || 0) - (b.total_price || 0)
                default:
                    return 0
            }
        })

        return filtered
    }

    const getStatusColor = (status: string) => {
        const statusOption = statusOptions.find((opt) => opt.value === status)
        return statusOption?.color || "#64748b"
    }

    const getStatusIcon = (status: string) => {
        const statusOption = statusOptions.find((opt) => opt.value === status)
        return statusOption?.icon || checkmarkOutline
    }

    const filteredCarts = getFilteredAndSortedCarts()

    const getStats = () => {
        const total = carts.length
        const confirmed = carts.filter((c) => c.status === "Confirmată").length
        const inProduction = carts.filter((c) => c.status === "În producție").length
        const inDelivery = carts.filter((c) => c.status === "În curs de livrare").length
        const delivered = carts.filter((c) => c.status === "Livrată").length

        return { total, confirmed, inProduction, inDelivery, delivered }
    }

    const stats = getStats()

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
                        {/* Logo */}
                        <div className="toolbar-logo-admin-no-exapnd" onClick={() => history.push("/articles")}>
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
                            <span className="logo-text">Administrare Comenzi</span>
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
                            <div className="enhanced-filters-header-admin-order">
                                <div className="filters-title-section">
                                    <div className="filters-icon-wrapper">
                                        <IonIcon icon={statsChartOutline} />
                                    </div>
                                    <div className="filters-title-text">
                                        <h2>Statistici Comenzi</h2>
                                        <p>{filteredCarts.length} comenzi găsite</p>
                                    </div>
                                </div>
                            </div>



                            {/* Status Filter Section */}
                            <div className="enhanced-filter-section">
                                <div className="section-header">
                                    <h3 className="section-title">
                                        <IonIcon icon={filterOutline} />
                                        Filtrează după status
                                    </h3>
                                </div>
                                <div className="enhanced-category-grid">
                                    {statusOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            className={`enhanced-category-card ${statusFilter === option.value ? "active" : ""}`}
                                            onClick={() => setStatusFilter(option.value)}
                                        >
                                            <div className="category-card-icon" style={{ background: option.color }}>
                                                <IonIcon icon={option.icon} />
                                            </div>
                                            <div className="category-card-content">
                                                <span className="category-card-label">{option.label}</span>
                                            </div>
                                            {statusFilter === option.value && (
                                                <div className="category-card-check">
                                                    <IonIcon icon={checkmarkOutline} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort Section */}
                            <div className="enhanced-filter-section">
                                <div className="section-header">
                                    <h3 className="section-title">
                                        <IonIcon icon={layersOutline} />
                                        Sortare
                                    </h3>
                                </div>
                                <div className="enhanced-sort-options">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            className={`enhanced-sort-option ${sortOrder === option.value ? "active" : ""}`}
                                            onClick={() => setSortOrder(option.value)}
                                        >
                                            <div className="sort-option-icon">
                                                <IonIcon icon={option.icon} />
                                            </div>
                                            <span className="sort-option-label">{option.label}</span>
                                            {sortOrder === option.value && (
                                                <div className="sort-option-check">
                                                    <IonIcon icon={checkmarkOutline} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>


                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="articles-main">
                        {/* Results Header */}
                        <div className="results-header">
                            <div className="results-info">
                                <h1 className="results-title">Administrare Comenzi</h1>
                                <p className="results-subtitle">
                                    {filteredCarts.length} comenzi găsite
                                    {statusFilter !== "all" &&
                                        ` cu statusul "${statusOptions.find((s) => s.value === statusFilter)?.label}"`}
                                </p>
                            </div>
                        </div>

                        {/* Loading */}
                        <IonLoading isOpen={loading} message="Se încarcă comenzile..." />

                        {/* Orders Grid */}
                        {filteredCarts && (
                            <div className="articles-grid grid-view">
                                {filteredCarts.map((cart) => (
                                    <div key={cart.id} className="article-card-wrapper">
                                        <div className="article-card">
                                            {/* Status Badge */}
                                            <div
                                                className="article-status-badge"
                                                style={{
                                                    background: getStatusColor(cart.status || "Confirmată"),
                                                    color: "white",
                                                }}
                                            >
                                                <IonIcon icon={getStatusIcon(cart.status || "Confirmată")} />
                                                <span>{cart.status || "Confirmată"}</span>
                                            </div>

                                            <div className="article-content">
                                                {/* Order Header */}
                                                <div className="article-header">
                                                    <h3 className="article-title">Comandă #{cart.id}</h3>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                                                        <IonIcon icon={calendarOutline} style={{ color: "#606060", fontSize: "1rem" }} />
                                                        <span style={{ color: "#606060", fontSize: "0.875rem" }}>
                              {new Date(cart.created_at).toLocaleDateString("ro-RO", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                              })}
                            </span>
                                                    </div>
                                                </div>

                                                {/* Price Info */}
                                                <div style={{ margin: "1rem 0" }}>
                                                    <div className="article-price">
                                                        <IonIcon icon={cardOutline} />
                                                        <span className="price-value">{cart.total_price} RON</span>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                            <span style={{ color: "#606060", fontSize: "0.875rem" }}>
                              Livrare: {cart.delivery_fee} RON
                            </span>
                                                    </div>
                                                </div>

                                                {/* Status Select */}
                                                <div style={{ margin: "1rem 0" }}>
                                                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#000" }}>
                                                        Status comandă:
                                                    </label>
                                                    <IonSelect
                                                        value={cart.status || "Confirmată"}
                                                        onIonChange={(e) => handleStatusChange(cart.id, e.detail.value)}
                                                        style={{
                                                            background: "rgba(255, 255, 255, 0.8)",
                                                            border: "1px solid rgba(0, 0, 0, 0.1)",
                                                            borderRadius: "0.75rem",
                                                            padding: "0.5rem",
                                                        }}
                                                    >
                                                        <IonSelectOption value="Confirmată">Confirmată</IonSelectOption>
                                                        <IonSelectOption value="În producție">În producție</IonSelectOption>
                                                        <IonSelectOption value="În curs de livrare">În curs de livrare</IonSelectOption>
                                                        <IonSelectOption value="Livrată">Livrată</IonSelectOption>
                                                    </IonSelect>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="article-footer" style={{ flexDirection: "column", gap: "0.75rem" }}>
                                                    <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
                                                        <button
                                                            className="article-view-button"
                                                            onClick={() => history.push(`/messages/${cart.id}`)}
                                                            style={{
                                                                flex: 1,
                                                                background: "linear-gradient(135deg, #3b82f6, #1e40af)",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                gap: "0.5rem",
                                                            }}
                                                        >
                                                            <IonIcon icon={chatbubbleOutline} />
                                                            <span>Mesaje</span>
                                                        </button>
                                                        <button
                                                            className="article-view-button"
                                                            onClick={() => history.push(`/admin/final-cart-orders/${cart.id}`)}
                                                            style={{
                                                                flex: 1,
                                                                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                gap: "0.5rem",
                                                            }}
                                                        >
                                                            <IonIcon icon={eyeOutline} />
                                                            <span>Vezi Detalii</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && filteredCarts.length === 0 && (
                            <div className="empty-state">
                                <div className="empty-icon">
                                    <IonIcon icon={layersOutline} />
                                </div>
                                <h3>Nu am găsit comenzi</h3>
                                <p>Încearcă să modifici filtrele pentru a vedea mai multe comenzi</p>
                                <button className="reset-filters-button" onClick={() => setStatusFilter("all")}>
                                    Resetează filtrele
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

export default FinalCartListAdmin
