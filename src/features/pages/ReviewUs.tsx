
import type React from "react"
import { useEffect, useState, useContext } from "react"
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonContent,
    IonButton,
    IonButtons,
    IonIcon,
    IonSearchbar,
    IonLabel,
    IonSelect,
    IonSelectOption,
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import {
    locate,
    logoFacebook,
    logoInstagram,
    starOutline,
    star,
    timeOutline,
    trendingUpOutline,
    trendingDownOutline,
    chevronBackOutline,
    chevronForwardOutline,
    searchOutline,
    filterOutline,
    peopleOutline, arrowBackOutline, sparkles, layersOutline, grid, cartOutline,
} from "ionicons/icons"
import { AuthContext } from "../auth"
import { getAllReviews } from "../reviews/reviewApi"
import "../shared/theme/review-us-styles.css"
import "../shared/theme/enhanced-filters-styles.css"
import {MyModal} from "../shared/components/MyModal";
import WhatsAppButton from "../shared/components/WhatsAppButton";
const ReviewUs: React.FC = () => {
    const history = useHistory()
    const { token } = useContext(AuthContext)

    const [reviews, setReviews] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [limit, setLimit] = useState(5)
    const [sortField, setSortField] = useState<"date" | "score">("date")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false)
    const [isExtrasOpen, setIsExtrasOpen] = useState(false);

    const fetchPage = async (pageNumber: number) => {
        setLoading(true)
        const offset = (pageNumber - 1) * limit

        try {
            const apiSortField = sortField === "date" ? "time" : sortField
            const data = await getAllReviews(offset, limit, apiSortField, sortOrder, token)
            setReviews(data)
            setPage(pageNumber)


            const totalReviews = 25
            setTotalPages(Math.ceil(totalReviews / limit))
        } catch (err) {
            console.error("Eroare la încărcare pagină:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPage(1)
    }, [sortField, sortOrder, limit])

    const renderStars = (score: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <IonIcon key={i} icon={i < score ? star : starOutline} className={i < score ? "star-filled" : "star-empty"} />
        ))
    }

    const getScoreColor = (score: number) => {
        if (score >= 4) return "excellent"
        if (score >= 3) return "good"
        if (score >= 2) return "average"
        return "poor"
    }

    const filteredReviews = reviews.filter((review) => review.text.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <IonPage className="reviews-page">
            {/* Background Elements */}
            <div className="reviews-background">
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

            <IonContent className="reviews-content">
                <div className="reviews-container">
                    {/* Page Header */}
                    <div className="reviews-page-header">
                        <div className="page-header-content">
                            <div className="header-icon">
                                <IonIcon icon={peopleOutline} />
                            </div>
                            <div className="header-info">
                                <h1 className="page-title">Recenziile Clienților</h1>
                                <p className="page-subtitle">Descoperă experiențele clienților noștri mulțumiți</p>
                            </div>
                        </div>
                        <div className="reviews-stats">
                            <div className="stat-item">
                                <span className="stat-number">{reviews.length}</span>
                                <span className="stat-label">Recenzii</span>
                            </div>
                        </div>
                    </div>

                    {/* Controls Section */}
                    <div className="reviews-controls">
                        {/* Search Bar */}
                        <div className="search-section">
                            <div className="search-wrapper">
                                <IonIcon icon={searchOutline} className="search-icon" />
                                <IonSearchbar
                                    value={searchTerm}
                                    onIonInput={(e) => setSearchTerm(e.detail.value!)}
                                    placeholder="Caută în recenzii..."
                                    className="modern-searchbar"
                                    debounce={300}
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="filters-section">
                            <div className="filter-group">
                                <div className="filter-item">
                                    <IonIcon icon={filterOutline} className="filter-icon" />
                                    <IonLabel className="filter-label">Sortează după:</IonLabel>
                                    <IonSelect
                                        value={`${sortField}-${sortOrder}`}
                                        onIonChange={(e) => {
                                            const [field, order] = e.target.value.split("-")
                                            setSortField(field as "date" | "score")
                                            setSortOrder(order as "asc" | "desc")
                                        }}
                                        className="modern-select"
                                    >
                                        <IonSelectOption value="date-desc">
                                            <IonIcon icon={timeOutline} /> Dată descrescător
                                        </IonSelectOption>
                                        <IonSelectOption value="date-asc">
                                            <IonIcon icon={timeOutline} /> Dată crescător
                                        </IonSelectOption>
                                        <IonSelectOption value="score-desc">
                                            <IonIcon icon={trendingDownOutline} /> Scor descrescător
                                        </IonSelectOption>
                                        <IonSelectOption value="score-asc">
                                            <IonIcon icon={trendingUpOutline} /> Scor crescător
                                        </IonSelectOption>
                                    </IonSelect>
                                </div>

                                <div className="filter-item">
                                    <IonLabel className="filter-label">Recenzii pe pagină:</IonLabel>
                                    <IonSelect
                                        value={limit}
                                        onIonChange={(e) => setLimit(Number.parseInt(e.detail.value))}
                                        className="modern-select"
                                    >
                                        <IonSelectOption value={5}>5 recenzii</IonSelectOption>
                                        <IonSelectOption value={10}>10 recenzii</IonSelectOption>
                                        <IonSelectOption value={20}>20 recenzii</IonSelectOption>
                                    </IonSelect>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Grid */}
                    <div className="reviews-grid">
                        {loading ? (
                            <div className="loading-state">
                                <div className="loading-spinner"></div>
                                <p>Se încarcă recenziile...</p>
                            </div>
                        ) : filteredReviews.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">
                                    <IonIcon icon={peopleOutline} />
                                </div>
                                <h3>Nu s-au găsit recenzii</h3>
                                <p>Încearcă să modifici criteriile de căutare</p>
                            </div>
                        ) : (
                            filteredReviews.map((review) => (
                                <div key={`${review.id}-${review.time}`} className="review-card">
                                    <div className="review-header">
                                        <div className="review-score">
                                            <div className={`score-badge ${getScoreColor(review.score)}`}>
                                                <span className="score-number">{review.score}</span>
                                                <span className="score-max">/5</span>
                                            </div>
                                            <div className="stars-container">{renderStars(review.score)}</div>
                                        </div>
                                        <div className="review-date">
                                            <IonIcon icon={timeOutline} />
                                            <span>{new Date(review.time).toLocaleDateString("ro-RO")}</span>
                                        </div>
                                    </div>

                                    <div className="review-content">
                                        <p className="review-text">{review.text}</p>
                                    </div>

                                    <div className="review-footer">
                                        <div className="review-meta">
                                            <span className="review-time">{new Date(review.time).toLocaleTimeString("ro-RO")}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination-section">
                            <div className="pagination-info">
                <span>
                  Pagina {page} din {totalPages}
                </span>
                            </div>

                            <div className="pagination-controls">
                                <IonButton
                                    className="pagination-btn"
                                    disabled={page === 1}
                                    onClick={() => fetchPage(page - 1)}
                                    fill="outline"
                                >
                                    <IonIcon icon={chevronBackOutline} slot="start" />

                                </IonButton>

                                <div className="page-numbers">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        let pageNum: number
                                        if (totalPages <= 5) {
                                            pageNum = i + 1
                                        } else if (page <= 3) {
                                            pageNum = i + 1
                                        } else if (page >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i
                                        } else {
                                            pageNum = page - 2 + i
                                        }

                                        return (
                                            <IonButton
                                                key={pageNum}
                                                className={`page-number ${page === pageNum ? "active" : ""}`}
                                                onClick={() => fetchPage(pageNum)}
                                                fill={page === pageNum ? "solid" : "outline"}
                                            >
                                                {pageNum}
                                            </IonButton>
                                        )
                                    })}
                                </div>

                                <IonButton
                                    className="pagination-btn"
                                    disabled={page === totalPages}
                                    onClick={() => fetchPage(page + 1)}
                                    fill="outline"
                                >

                                    <IonIcon icon={chevronForwardOutline} slot="end" />
                                </IonButton>
                            </div>
                        </div>
                    )}
                </div>
            </IonContent>
            <WhatsAppButton />
        </IonPage>
    )
}

export default ReviewUs
